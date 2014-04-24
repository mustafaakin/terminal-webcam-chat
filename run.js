var cv = require("opencv");
var nc = require("ncurses");

var win = new nc.Window();

var camera = new cv.VideoCapture(0);
var TOTAL_WIDTH = 80;
var palette = [' ', '.', '.', '/', 'c', '(', '@', '#', '8'];

function readImage() {
	camera.read(function(err, image) {
		// console.log("image read");
		printImage(image);
		readImage();
	});
}

function printImage(image) {
	var h = image.size()[0],
		w = image.size()[1];
	var h = (TOTAL_WIDTH / w) * h;
	var w = TOTAL_WIDTH;
	image.resize(TOTAL_WIDTH, h);
	for (var i = 0; i < h; i++) {
		var a = "";
		for (var j = 0; j < w; j++) {
			var pix = image.pixel(i, j);
			var r = pix[0];
			var g = pix[1];
			var b = pix[2];
			var luminance = 0.1145 * b + g * 0.5866 + r * 0.2989;
			index = parseInt(Math.floor(luminance / (256.0 / (palette.length))))
			r = parseInt(r / 100);
			g = parseInt(g / 100);
			b = parseInt(b / 100);
			// var color = 16 + (6 * 6 * r + 6 * g + b);
			win.cursor(i, j);
			win.addstr(palette[index]);
		}
	}
	win.refresh();
}

function setColors() {
	var pair = 1;
	var depth = 6;
	var splitby = (depth - 1) / 1000.0;
	for (var R = 0; R < depth; R++){
		for (var G = 0; R < depth; G++){
			for (var B = 0; B < depth; B++) {
				nc.colorPair(pair, nc.colors.BLACK, pair);
				curses.init_color(pair, int(R / splitby), int(G / splitby), int(B / splitby))
				curses.init_pair(pair, pair, 0)
				pair = pair + 1
			}
		}
	}	
}


readImage();

process.on('SIGINT', function() {
	console.log("Caught interrupt signal");
	win.close();
	process.exit();
});