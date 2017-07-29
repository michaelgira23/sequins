export interface Frame {
	time: number;
	variables: FrameVariables;
}

export interface FrameVariables {
	[name: string]: FrameVariable;
}

export interface FrameVariable {
	value: number;
	easeNext: string | ((x: number) => number);
}
