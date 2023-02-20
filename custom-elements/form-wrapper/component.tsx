"use client";
import "./definition";

type Props = FormWrapperAttributes & {
	children: JSX.Element | JSX.Element[];
};

const FormWrapper = ({ children, ...attributes }: Props) => {
	return <form-wrapper {...attributes}>{children}</form-wrapper>;
};

export default FormWrapper;
