const express = require('express');
const path = require('path')
const { PORT = 3001 } = process.env;
const app = express();
const { spawn } = require('child_process');

app.use(express.json());
// app.use(express.static(path.resolve(__dirname, '../client/build')));

// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });

app.post('/predict', (req, res) => {
    const data = req.body;
    console.log(data);

    const args = [
        // './backend/predict.py',
        `${__dirname}/predict.py`,
        data.age,
        data.sex,
        data.attacked,
        data.fighting,
        data.lonely,
        data.friends,
        data.absence,
        data.student_compassion,
        data.parent_compassion,
        data.underweight,
        data.overweight,
        data.obese
    ];

    const pyScript = spawn('python', args);

    pyScript.stdout.on('data', data => {
        const predictions = JSON.parse(data);
        res.json(predictions);
    });

    pyScript.stderr.on('data', err => {
        console.error(err.toString());
        res.status(500).send('Error');
    });
});


app.listen(PORT, () => {
    console.log(`Server on ${PORT}`)
});