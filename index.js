var express = require('express');
var app = express();
var path = require('path');
var cors = require('cors');
var formidable = require('formidable');
var fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/', function(req, res){
  res.set('Access-Control-Allow-Origin', '*');
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', function(req, res){
  res.set('Access-Control-Allow-Origin', '*');
  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
      console.log(field, file);
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end(JSON.stringify('success'));
  });

  // parse the incoming request containing the form data
  form.parse(req);
});

var server = app.listen(8888, function(){
  console.log('Server listening on port 8888');
});