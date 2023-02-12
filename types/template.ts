export type Shift<T extends unknown[]> = T extends [any, ...infer U]
	? U
	: never;

export type MapArray = ({ toString: () => string } | (() => string))[];

export type EventHandler = (e: Event, ...args: any) => any;
