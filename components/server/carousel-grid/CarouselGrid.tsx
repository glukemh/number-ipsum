type CarouselGridProps = {
	children: React.ReactNode[];
};

const CarouselGrid = ({ children }: CarouselGridProps) => {
	return (
		<ul>
			{children.map((child, index) => (
				<li key={index}>{child}</li>
			))}
		</ul>
	);
};

export default CarouselGrid;
