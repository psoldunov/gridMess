import { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { Layouts, Responsive, ResponsiveProps, WidthProvider } from 'react-grid-layout';

type LayoutItem = {
	i: string;
	x: number;
	y: number;
	w: number;
	h: number;
	static: boolean;
};

const ResponsiveReactGridLayout = WidthProvider(Responsive);

function generateLayout(): LayoutItem[] {
	return _.map(_.range(0, 25), (item, i) => {
		console.log(item);
		const y = Math.ceil(Math.random() * 4) + 1;
		return {
			x: (_.random(0, 5) * 2) % 12,
			y: Math.floor(i / 6) * y,
			w: 2,
			h: y,
			i: i.toString(),
			static: Math.random() < 0.05,
		};
	});
}

interface GriddleProps extends ResponsiveProps {
	onLayoutChange: (layout: LayoutItem[], allLayouts?: Layouts) => void;
	cols: Record<string, number>;
	initialLayout?: LayoutItem[];
}

const ShowcaseLayout = ({ onLayoutChange, ...props }: GriddleProps) => {
	const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
	const [compactType, setCompactType] = useState<'horizontal' | 'vertical' | null>(null);
	const [layouts, setLayouts] = useState({ lg: props.initialLayout || generateLayout() });
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const onBreakpointChange = useCallback((breakpoint: string) => {
		setCurrentBreakpoint(breakpoint);
	}, []);

	const onCompactTypeChange = useCallback(() => {
		setCompactType((prevCompactType) =>
			prevCompactType === 'horizontal' ? 'vertical' : prevCompactType === 'vertical' ? null : 'horizontal'
		);
	}, []);

	const onNewLayout = useCallback(() => {
		setLayouts({ lg: generateLayout() });
	}, []);

	const generateDOM = useCallback(() => {
		return _.map(layouts.lg, (l, i) => (
			<div key={i} className={l.static ? 'static' : ''}>
				{l.static ? (
					<span className='text' title='This item is static and cannot be removed or resized.'>
						Static - {i}
					</span>
				) : (
					<span className='text'>{i}</span>
				)}
			</div>
		));
	}, [layouts]);

	return (
		<div>
			<div>
				Current Breakpoint: {currentBreakpoint} ({props.cols[currentBreakpoint]} columns)
			</div>
			<div>Compaction type: {compactType?.toUpperCase() || 'No Compaction'}</div>
			<button onClick={onNewLayout}>Generate New Layout</button>
			<button onClick={onCompactTypeChange}>Change Compaction Type</button>
			<ResponsiveReactGridLayout
				{...props}
				layouts={layouts}
				onBreakpointChange={onBreakpointChange}
				onLayoutChange={onLayoutChange}
				measureBeforeMount={false}
				useCSSTransforms={mounted}
				compactType={compactType}
				preventCollision={!compactType}
			>
				{generateDOM()}
			</ResponsiveReactGridLayout>
		</div>
	);
};

ShowcaseLayout.defaultProps = {
	className: 'layout',
	rowHeight: 30,
	onLayoutChange: () => {},
	cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
};

export default ShowcaseLayout;
