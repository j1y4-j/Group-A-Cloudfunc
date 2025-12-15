const express = require('express');
const app = express();

app.use(express.json());

app.post('/', (req, res) => {
    const input = req.body;

    console.log('Input received:', input);

    res.json({
        result: `Function executed with input ${JSON.stringify(input)}`
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Function Runner running on port ${PORT}`);
});
