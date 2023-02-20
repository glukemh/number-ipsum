import styles from "./styles.module.css";

type CarouselGridProps = {
	children: React.ReactNode | React.ReactNode[];
};

const CarouselGrid = ({ children }: CarouselGridProps) => {
	const childrenArray = Array.isArray(children) ? children : [children];
	const sqrt = Math.sqrt(childrenArray.length);
	const sqrtFloor = Math.floor(sqrt);
	const sqrtCeil = Math.ceil(sqrt);
	const [length, width] =
		sqrtFloor * sqrtCeil >= childrenArray.length
			? [sqrtFloor, sqrtCeil]
			: [sqrtCeil, sqrtCeil];
	const style = {
		"--repeat-row": length,
		"--repeat-col": width,
	} as React.CSSProperties;
	return (
		<ul className={styles.grid} style={style}>
			{childrenArray.map((child, index) => (
				<li key={index}>{child}</li>
			))}
		</ul>
	);
};

export default CarouselGrid;
