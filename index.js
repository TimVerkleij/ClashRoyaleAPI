const Express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = Express()

const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser())
app.use(require('./routes/api'))
app.use(Express.static('public/'));

app.use(cors({
    origin: "*",
    credentials: true
}))

process.on('uncaughtException', (err) => {
    console.error(err);
});

console.log("listening on port: " + process.env.PORT)
app.listen(process.env.PORT, '0.0.0.0');

