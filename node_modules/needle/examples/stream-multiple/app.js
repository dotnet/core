const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { stream_multiple } = require('./stream-multiple')
const env = require('./env')

app.use(
    bodyParser.urlencoded({ extended: false }),
    bodyParser.json(),
    express.static(__dirname + '/public'),
);

app.get('/', (req, res) => res.send(`
    <h1>Thanks Tomás Pollak</h1>
    <a href="/stream_files">Stream Multiple Files</a>
`));

app.get('/stream_multiple_files', (req, res) => stream_multiple(req, res, env._urls, env.stream_dir));

let PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Main Server: ${PORT}`));