import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	UniqueIdentifier,
	useDraggable,
	useDroppable,
} from '@dnd-kit/core';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import { Button, Group, Paper, Stack } from '@mantine/core';
import { createElement, createPanel, getElements, getPanels, Panel, PanelElement, updateElement } from '../api';

const layoutAtom = atomWithStorage<{ lg: Layout[] }>('layouts', {
	lg: [],
});

function Draggable({ id, children }: { id: UniqueIdentifier; children: React.ReactNode }) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id,
	});

	const style = {
		transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
	};

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

export default function Griddle() {
	const [layouts, setLayouts] = useAtom(layoutAtom);
	const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
	const [elements, setElements] = useState<PanelElement[]>(getElements());
	const ResponsiveReactGridLayout = useMemo(() => WidthProvider(Responsive), []);
	const [dragging, setDragging] = useState(false);

	const [mounted, setMounted] = useState(false);

	const createLayout = () => {
		const newPanel: Panel = createPanel();
		const newLayout = {
			i: newPanel.id,
			x: 0,
			y: 0,
			w: 1,
			h: 1,
		};
		setLayouts((prevLayouts) => ({
			...prevLayouts,
			lg: [...prevLayouts.lg, newLayout],
		}));
	};

	const createPanelElement = () => {
		const firstPanel: Panel = getPanels()[0];
		if (!firstPanel) {
			alert('Please create a panel first');
			return;
		}
		const title = prompt('Type here')!;
		const newElement: PanelElement = createElement(firstPanel.id, title);
		setElements((prevElements) => [...prevElements, newElement]);
	};

	const handleDragStart = (event: DragStartEvent) => {
		setDragging(true);
		setActiveId(event.active.id);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { over, active } = event;
		updateElement(active.id as string, over?.id as string);
		setElements(getElements());
		setDragging(false);
		setActiveId(null);
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	const generateDOM = useCallback(() => {
		return layouts.lg.map((layout) => {
			const panelElements = elements.filter((element) => element.panelId === layout.i);
			return (
				<Paper withBorder key={layout.i}>
					<Droppable id={layout.i}>
						{panelElements && panelElements.length > 0
							? panelElements.map((panelElement) => (
									<Draggable key={panelElement.id} id={panelElement.id}>
										{panelElement.title || panelElement.id}
									</Draggable>
								))
							: 'Drop here'}
					</Droppable>
				</Paper>
			);
		});
	}, [layouts, elements]);

	return (
		<Stack>
			<Group>
				<Button onClick={() => createLayout()}>Create Panel</Button>
				<Button onClick={() => createPanelElement()}>Create Element</Button>
			</Group>
			<DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
				<ResponsiveReactGridLayout
					cols={{ lg: 8, md: 8, sm: 4, xs: 2, xxs: 2 }}
					rowHeight={240}
					className='layout'
					onLayoutChange={(newLayout) => {
						setLayouts({ lg: newLayout });
					}}
					layouts={layouts}
					measureBeforeMount={false}
					isDraggable={!dragging}
					isResizable={!dragging}
					useCSSTransforms={mounted}
					compactType={'vertical'}
					preventCollision={true}
				>
					{generateDOM()}
				</ResponsiveReactGridLayout>
				<DragOverlay>
					{elements.map((element) =>
						element.id === activeId ? (
							<div key={element.id}>
								<Draggable id={element.id}>{element.title || element.id}</Draggable>
							</div>
						) : null
					)}
				</DragOverlay>
			</DndContext>
		</Stack>
	);
}
