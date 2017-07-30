import * as easings from './easings';
import { Frame, FrameVariable } from './frame';

export class Sequence {

	get length() {
		return this.frames[this.frames.length - 1].time;
	}

	constructor(private frames: Frame[]) {
		this.sortFrames();
	}

	/**
	 * Invoke a callback every so often with the next frame in a sequence
	 */

	exportInterval(
		millisecondDelay: number,
		sequenceInterval: number,
		callback: (instance: Instance, index: number) => void,
		startTime?: number,
		endTime?: number
	) {
		const gen = this.exportGenerator(sequenceInterval, startTime, endTime);

		const iteration = (i: number) => {
			const value = gen.next();
			if (!value.done) {
				callback(value.value, i);
				setTimeout(() => {
					iteration(++i);
				}, millisecondDelay);
			}
		};
		iteration(0);
	}

	/**
	 * Export sequence as a generator function
	 */

	*exportGenerator(interval: number, startTime?: number, endTime?: number) {
		const values = this.exportArray(interval, startTime, endTime);
		for (const value of values) {
			yield value;
		}
	}

	/**
	 * Get an array of values of the sequence
	 */

	exportArray(interval: number, startTime = 0, endTime = this.length) {
		startTime = this.getActualTime(startTime);
		endTime = this.getActualTime(endTime);

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

				const easePercentage = (targetTime - previous.lastUpdated) / (frame.time - previous.lastUpdated);
				const valueDiff = frameVariable.value - previous.value;

				let easeFunction: (x: number) => number = easings.none;

				if (typeof previous.easeNext === 'string' && (easings as any)[previous.easeNext])  {
					easeFunction = (easings as any)[previous.easeNext];
				}
				if (typeof previous.easeNext === 'function') {
					easeFunction = previous.easeNext;
				}

				return (easeFunction(easePercentage) * valueDiff) + previous.value;
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

	private getActualTime(time: number) {
		if (time < 0) {
			time = this.length + time;
		}
		return time;
	}

	/**
	 * Add a frame to the sequence
	 */

	addFrame(frame: Frame) {
		this.frames.push(frame);
		this.sortFrames();
	}

	/**
	 * Deletes a frame at a specific index
	 */

	deleteNthFrame(index: number) {
		this.frames.splice(index, 0);
	}

	/**
	 * Delete frame at a specific time
	 */

	deleteFrameAtTime(time: number) {
		for (let i = 0; i < this.frames.length; i++) {
			if (this.frames[i].time === time) {
				this.frames.splice(i--, 0);
			}
		}
	}

	/**
	 * Returns an array of all the frames
	 */

	getFrames() {
		return this.frames;
	}

	/**
	 * Make sure frames are chronologically ordered
	 */

	private sortFrames() {
		this.frames.sort((a, b) => a.time - b.time);
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
