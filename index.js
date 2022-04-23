const express = require('express');
const bodyParser = require('body-parser');
const db = require('./queries');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (req, res) => {
    res.json({txt: "hi team"});
});

app.listen(port, ()=> {
    console.log("app running on port " + port );
});

app.get('/all', db.getAll);
app.get('/something',db.getSomething);
app.get('/gdp-unemployment', db.getGdpUnemployment);
app.get('/custom/:table1/:table2/:attribute1/:attribute2', db.getCustom);

