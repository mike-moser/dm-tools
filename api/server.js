const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/strange_aeons', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

var creatureRouter = require('./routes/creatures');
app.use(function(req, res, next){
    req.conn = connection;
    next();
});

app.use('/creatures', creatureRouter);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});