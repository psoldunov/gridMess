import { useEffect, useMemo, useState } from 'react';
import { DndContext, DragEndEvent, UniqueIdentifier, useDraggable, useDroppable } from '@dnd-kit/core';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Paper } from '@mantine/core';

const defaultLayout: LayoutItem[] = [
	{
		x: 0,
		y: 0,
		w: 4,
		h: 1,
		i: '1',
		static: false,
	},
	{
		x: 4,
		y: 0,
		w: 4,
		h: 1,
		i: '2',
		static: false,
	},
	{
		x: 0,
		y: 1,
		w: 4,
		h: 1,
		i: '3',
		static: false,
	},
	{
		x: 4,
		y: 1,
		w: 4,
		h: 1,
		i: '4',
		static: false,
	},
];

type LayoutItem = {
	i: string;
	x: number;
	y: number;
	w: number;
	h: number;
	static: boolean;
};

function Draggable({ id, children }: { id: UniqueIdentifier; children: React.ReactNode }) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id,
	});
	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: undefined;

	return (
		<button ref={setNodeRef} style={style} {...listeners} {...attributes}>
			{children}
		</button>
	);
}

function Droppable({ id, children }: { id: UniqueIdentifier; children: React.ReactNode }) {
	const { isOver, setNodeRef } = useDroppable({
		id,
	});
	const style = {
		color: isOver ? 'green' : undefined,
	};

	return (
		<div ref={setNodeRef} style={{ width: '100%', height: '100%', ...style }}>
			{children}
		</div>
	);
}

export default function Griddle({ initialLayout = defaultLayout }: { initialLayout?: LayoutItem[] }) {
	const [parent, setParent] = useState<UniqueIdentifier | null>(null);
	const ResponsiveReactGridLayout = useMemo(() => WidthProvider(Responsive), []);
	const draggableMarkup = useMemo(() => <Draggable id='draggable'>Drag me</Draggable>, []);
	const [dragging, setDragging] = useState(false);

	const [layouts, setLayouts] = useState({
		lg: initialLayout || defaultLayout,
	});
	const [mounted, setMounted] = useState(false);

	const handleDragStart = () => {
		setDragging(true);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { over } = event;
		setParent(over ? over.id : null);
		setDragging(false);
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
			{parent === null ? draggableMarkup : null}
			<ResponsiveReactGridLayout
				cols={{ lg: 8, md: 8, sm: 4, xs: 2, xxs: 2 }}
				rowHeight={240}
				className='layout'
				onLayoutChange={(newLayout) => {
					const modifiedLayout = newLayout.map((item) => ({
						...item,
						static: item.static ?? false,
					}));
					setLayouts({ lg: modifiedLayout });
				}}
				layouts={layouts}
				measureBeforeMount={false}
				isDraggable={!dragging}
				isResizable={!dragging}
				useCSSTransforms={mounted}
				compactType={null}
				preventCollision={true}
			>
				{layouts.lg.map((layout) => (
					<Paper withBorder key={layout.i}>
						<Droppable id={layout.i}>{parent === layout.i ? draggableMarkup : 'Drop here'}</Droppable>
					</Paper>
				))}
			</ResponsiveReactGridLayout>
		</DndContext>
	);
}
