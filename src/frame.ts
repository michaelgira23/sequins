import * as easings from './easings';

export class Frame {

	constructor(public values: FrameValues, public easeNext: (x: number) => number = easings.none) {

	}

}

export interface FrameValues {
	[name: string]: number;
}
