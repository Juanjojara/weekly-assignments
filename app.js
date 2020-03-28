const express = require('express')
const app = express()
const PORT = process.env.PORT || 80;

//app.get('/', (req, res) => res.send('Hello World!'))
app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));