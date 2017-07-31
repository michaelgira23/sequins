const should = require('should');

const { Sequence } = require('../dist/index');

describe('Sequence', () => {

	it('should organize initial frames by time', () => {
		const sequence = new Sequence([
			{
				time: 0,
				variables: {
					x: 0
				}
			},
			{
				time: 100,
				variables: {
					x: 100
				}
			},
			{
				time: 50,
				variables: {
					x: 50
				}
			}
		]);

		const frames = sequence.getFrames();
		for (let i = 0; i < frames.length - 1; i++) {
			(frames[i].time).should.be.below(frames[i + 1].time);
		}
	});

	it('should combine frames of the same time', () => {
		const sequence = new Sequence([
			{
				time: 0,
				variables: {
					x: 0
				}
			},
			{
				time: 100,
				variables: {
					x: 50
				}
			},
			{
				time: 100,
				variables: {
					x: 100
				}
			}
		]);

		const frames = sequence.getFrames();
		const existingTimes = [];
		for (const frame of frames) {
			existingTimes.should.not.containEql(frame.time);
			existingTimes.push(frame.time);
		}
	});

	it('should treat invalid array as empty array', () => {
		const sequences = [
			new Sequence(),
			new Sequence(undefined),
			new Sequence(null),
			new Sequence({}),
			new Sequence('hi'),
			new Sequence(true)
		];

		sequences.forEach(sequence => sequence.should.be.eql([]));
	});

	it('should ignore frames that aren\'t valid', () => {
		const sequence = new Sequence([
			{
				time: 0,
				variables: {
					x: 0
				}
			},
			{
				hello: 'world'
			},
			undefined,
			null,
			true,
			false,
			{},
			[]
		]);

		sequence.getFrames().should.eql([
			{
				time: 0,
				variables: {
					x: 0
				}
			}
		]);
	});
});
