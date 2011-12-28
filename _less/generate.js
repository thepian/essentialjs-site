var fs = require('fs');
var path = require("path");
var less = require('less');

var paths = [__dirname];
paths.push(path.join(__dirname,"..","dev-time"));

function generateCss(from_dir,to_dir,filename) {
	
	var prefix = fs.readFileSync(path.join(from_dir,filename+".prefix"),"utf8");
	var basic_less = fs.readFileSync(path.join(from_dir,filename+".less"),"utf8");
	var basic_out = path.join(to_dir,filename+".css");

	var parser = new less.Parser({
	    paths: paths, // Specify search paths for @import directives
	    filename: filename // Specify a filename, for better error messages
	});

	parser.parse(basic_less, function (e, tree) {
	    var css = tree.toCSS({ compress: true }); // Minify CSS output
		fs.writeFile(basic_out , prefix+css, function(err){
		});
	});
}

generateCss(__dirname, path.join(__dirname,"..","css"), "basic");
generateCss(__dirname, path.join(__dirname,"..","css"), "enhanced");
