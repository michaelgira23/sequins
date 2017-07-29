import * as easings from './easings';
import { Frame, FrameVariable, FrameVariables } from './frame';

export class Sequence {

	constructor(public frames: Frame[]) {

	}

	/**
	 * Get all values at a specific time
	 */

	getValuesAtTime(time: number) {
		const variables = this.getUniqueVariables();

		const values: InstanceValues = {};

		for (const variable of variables) {
			values[variable] = this.getValueAtTime(time, variable);
		}
		return values;
	}

	/**
	 * Calculates a variable's value at a specific time among a sequence's frames
	 */

	getValueAtTime(targetTime: number, variableName: string) {
		let previous: PreviousValue;

		for (const frame of this.frames) {
			const variable = frame.variables[variableName];
			if (!variable) {
				continue;
			}

			if (frame.time < targetTime) {
				previous = {
					lastUpdated: frame.time,
					value: variable.value,
					easeNext: variable.easeNext
				};
			}

			if (frame.time === targetTime) {
				return variable.value;
			}

			if (targetTime < frame.time) {

				// If target time is before any frames, return undefined
				if (!previous) {
					return;
				}

				const timeDiff = frame.time - targetTime;
				const valueDiff = variable.value - previous.value;
				return (previous.easeNext(targetTime / timeDiff) * valueDiff) + previous.value;
			}
		}
	}

	/**
	 * Get all the unique values among all the frames
	 */

	getUniqueVariables() {
		const uniqueNames: string[] = [];
		for (const frame of this.frames) {
			for (const variableName of Object.keys(frame.variables)) {
				if (!uniqueNames.includes(variableName)) {
					uniqueNames.push(variableName);
				}
			}
		}
		return uniqueNames;
	}

}

export interface Instance {
	time: number;
	values: InstanceValues;
}

export interface InstanceValues {
	[name: string]: number;
}

interface PreviousValue extends FrameVariable {
	lastUpdated: number;
}
