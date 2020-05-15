let express = require('express');
let app = express();
let mongoose = require('mongoose');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let port = 8080;
let book = require('./app/routes/book');
let config = require('config');
let connectionURI = '';

//don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
    connectionURI = require('./config/default').DBHost;
}else{
    connectionURI = require('./config/default').testDBHost;
}

//db options
let options = {
    keepAlive: 1, connectTimeoutMS: 30000 , useNewUrlParser: true, useUnifiedTopology: true
};


//db connection      
mongoose.connect(connectionURI, options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


//parse application/json and look for raw text                                        
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

app.get("/", (req, res) => res.json({ message: "Welcome to our Bookstore!" }));

app.route("/book")
    .get(book.getBooks)
    .post(book.postBook);
app.route("/book/:id")
    .get(book.getBook)
    .delete(book.deleteBook)
    .put(book.updateBook);


app.listen(port);
console.log("Listening on port " + port);

module.exports = app; // for testing