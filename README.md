# sequins

A library for adding sequences of values and smoothly transitioning between them

# Installation

```
$ npm install sequins
```

# Example

```javascript
const { Sequence } = require('sequins');

const sequence = new Sequence([
	{
		time: 0,
		variables: {
			x: {
				value: 0,
				easeNext: 'easeInOutCirc'
			}
		}
	},
	{
		time: 100,
		variables: {
			x: {
				value: 80
			}
		}
	}
]);

console.log(sequence.exportArray(5));
// [ { time: 0, values: { x: 0 } },
//  { time: 10, values: { x: 0.8081641154691521 } },
//  { time: 20, values: { x: 3.3393944403532805 } },
//  { time: 30, values: { x: 7.999999999999998 } },
//  ...
//  { time: 90, values: { x: 79.19183588453085 } },
//  { time: 100, values: { x: 80 } } ]

```

# Exporting Sequences

The main functionality of this library is creating sequences and exporting them. You can export sequences in a number of different ways.

## Export as Array

```javascript
Sequence.exportArray(interval[, startTime[, endTime]]);
```

### Parameters

#### interval
`number` - How much time in between each instance of the exported sequence.

#### startTime
`number` - Optional. At what time to start exporting values. Defaults to `0`.

#### endTime
`number` - Optional. At what time to stop exporting values. Defaults to `Sequence.length`.

### Return value
`Instance[]` - Array of instance values.

## Export as Generator Function

```javascript
Sequence.exportGenerator(interval[, startTime[, endTime]]);
```

### Parameters

#### interval
`number` - How much time in between each instance of the exported sequence.

#### startTime
`number` - Optional. At what time to start exporting values. Defaults to `0`.

#### endTime
`number` - Optional. At what time to stop exporting values. Defaults to `Sequence.length`.

### Return value
`IterableIterator<Instance>` - A generator function which `yields` the next value in the exported sequence.


## Export as Interval

```javascript
Sequence.exportInterval(delay, interval, callback[, startTime[, endTime]]);
```

### Parameters

#### delay
`number` - How much time in between each invocation of callback (in milliseconds).

#### interval
`number` - How much time in between each instance of the exported sequence.

#### callback
`(instance: Instance, index: number) => void` - Callback invoked every `delay`. First parameter is the instance object (contains `time` and `values`). Second parameter is the current instance's index in the exported sequence.

#### startTime
`number` - Optional. At what time to start exporting values. Defaults to `0`.

#### endTime
`number` - Optional. At what time to stop exporting values. Defaults to `Sequence.length`.

### Return value
Nothing is returned.

# Types



## Instance

An instance object represents one point on a sequence. It contains a `time` property which, as the same suggests, the point of time in the sequence. It also contains a `values` property, which is an object of all the current variables and their number value.

```javascript
Instance {
	time: number;
	values: {
		[name: string]: number;
	};
}
```
