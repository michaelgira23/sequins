const port = 4200;
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

const { Sequence } = require('../dist/index');

app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.post('/sequence', (req, res) => {
	const sequence = new Sequence(req.body);
	res.json({
		unique: sequence.getUniqueVariables(),
		array: sequence.exportArray(1)
	});
});

app.listen(port, () => console.log(`Sequence inspector running on *:${port}`));
