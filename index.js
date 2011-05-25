var formidable = require('formidable'), 
    http = require('http'), 
    sys = require('sys'),    
    url = require("url"),
    spage = require("./simplypage"),
    config = require("./config"),
    percent = 0;    
  
var server = http.createServer(function(req, res) {
  var uri = url.parse(req.url).pathname;

  if (uri === '/upload' && req.method.toLowerCase() == 'post') {

    //Parse Upload
    var form = new formidable.IncomingForm();    
    form.uploadDir = config.files.upload_dir;
    form.maxFieldsSize = config.files.max_fields_size;
    form.keepExtensions = true;
    
    //Process listener
    form.addListener("progress", function(bytesReceived, bytesExpected) {
      //progress as percentage
      progress = (bytesReceived / bytesExpected * 100).toFixed(2);
      mb = (bytesExpected / 1024 / 1024).toFixed(1);
      percent = progress;      
      process.stdout.write("Uploading "+mb+"mb ("+progress+"%)\015");
    });
    
    // Check FileSize, Type, etc
    /*
    form.addListener("fileBegin", function(name, file){      
      sys.debug("File: size: " + file.size);
      sys.debug("File: name: " + file.name );
    });

    // Check FileSize, Type, etc
    form.addListener("file", function(name, file){
      sys.debug("Parameter name: " + name );
      sys.debug("Parameter value: " + file.size );
    });    
    */
    
    //Resume Upload
    form.addListener("error", function(err){
      sys.debug(err);
      request.resume();
    });
    
    //Complete  
    form.parse(req, function(err, fields, file) {
      sys.debug("Upload Complete");
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end();
      percent = 0;
    });
    
    //First call
    form.onPart = function(part) {      
      sys.debug(sys.inspect(part));      
      if (part.filename) {
        form.handlePart(part);
      }
    }
    /*    
    req.on('response', function(res) {
      var filesize = res.headers['content-length'];
      sys.debug("File size " + filename + ": " + filesize + " bytes.");
    });
    */
    
    return;
  }
  else{
    if (uri === '/update') {
      //res.writeHead(200, {'content-type': 'text/plain'});
      var output = { percent: percent };
      var body = JSON.stringify(output);
      res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length': body.length});
      res.end(body);
    }else{
      spage.load_static_file(uri, res);    
    }
  }
  
});

server.listen(config.port);
