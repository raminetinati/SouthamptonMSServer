var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
//var config = require('./config');
var fs = require('fs');
var mongoose = require('mongoose');

//set the http
app.listen(3002);


mongoose.connect('mongodb://woUser:webobservatory@localhost/twitter_soton');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("connected to database");
});



var tweetDoc = new mongoose.Schema({
  source: String,
  status: String,
});



var Message = mongoose.model('Message', tweetDoc); 



io.on('connection', function (socket) {

     socket.on('load_data', function (data) {
        console.log("Loading New Application User");
        //console.log("emitting filter:", filter); 
        loadDatabaseData(socket);        
    });


});



function loadDatabaseData(socket){
    var response = [];
    Message.find(function (err, responses) {
    if (err) return console.error(err);
     //console.log(responses);
     try{
     socket.emit("historic_data", responses.slice((responses.length-5000), (responses.length-1)));
        }catch(e){

     	socket.emit("historic_data", responses);


        }
    })

}



function showErr (e) {
    console.error(e, e.stack);
}

function handler (req, res) {
    res.writeHead(200);
    res.end("");
}
