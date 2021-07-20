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

console.log("listening on port: " + process.env.PORT)
app.listen(process.env.PORT);