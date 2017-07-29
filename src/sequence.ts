import * as easings from './easings';
import { Frame, FrameVariable, FrameVariables } from './frame';

export class Sequence {

	get length() {
		return this.frames[this.frames.length - 1].time;
	}

	constructor(public frames: Frame[]) {

	}

	/**
	 * Get an array of values of the sequence
	 */

	getArrayOfValues(interval: number, startTime = 0, endTime = -1) {
		startTime = this.getActualTime(startTime);
		endTime = this.getActualTime(endTime);

		console.log('times', interval, startTime, endTime);

		const values: Instance[] = [];
		for (let time = startTime; time <= endTime; time += interval) {
			values.push({
				time,
				values: this.getValuesAtTime(time)
			});
		}
		return values;
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
			const frameVariable = frame.variables[variableName];
			if (!frameVariable) {
				continue;
			}

			if (frame.time < targetTime) {
				previous = {
					lastUpdated: frame.time,
					value: frameVariable.value,
					easeNext: frameVariable.easeNext
				};
			}

			if (frame.time === targetTime) {
				return frameVariable.value;
			}

			if (targetTime < frame.time) {

				// If target time is before any frames, return undefined
				if (!previous) {
					return;
				}

				const timeDiff = frame.time - targetTime;
				const valueDiff = frameVariable.value - previous.value;

				let easeFunction: (x: number) => number = easings.none;

				if (typeof previous.easeNext === 'string' && (easings as any)[previous.easeNext])  {
					easeFunction = (easings as any)[previous.easeNext];
				}
				if (typeof previous.easeNext === 'function') {
					easeFunction = previous.easeNext;
				}

				return (easeFunction(targetTime / timeDiff) * valueDiff) + previous.value;
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

	/**
	 * Normalize time of frame. If number is negative, it is time from the end.
	 */

	getActualTime(time: number) {
		if (time < 0) {
			time = this.length - 1 - time;
		}
		return time;
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
