var path = require("path"),
    fs = require("fs");

var load_static_file = function(uri, res) {

  var filename = path.join(process.cwd(), uri);  
	path.exists(filename, function(exists) {
		if(!exists) {
			res.writeHead(404, {"Content-Type": "text/plain"});
			res.write("404 Not Found\n");
			res.end();
			return;
		}

		fs.readFile(filename, "binary", function(err, file) {
			if(err) {
				res.writeHead(500, {"Content-Type": "text/plain"});
				res.write(err + "\n");
				res.end();
				return;
			}

			res.writeHead(200);
			res.write(file, "binary");
			res.end();
		});
	});
};

exports.load_static_file = load_static_file;