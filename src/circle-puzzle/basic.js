/**
 * Created by vadasz on 2015.07.23..
 */

var baseCanvas = document.querySelector('#canvas-1'),
	baseCtx = baseCanvas.getContext('2d'),

	canvas = document.querySelector('#canvas-2'),
	ctx = canvas.getContext('2d'),

	image = new Image();

function mapImageData (imageData, fn){
	var data = imageData.data;
	for (var x = 0, w = imageData.width; x < w; x++){
		for(var y = 0, h = imageData.height; y < h; y++ ){
			var idx = (y * w + x) * 4;
			data.set(fn(x, y, data[idx], data[idx + 1], data[idx + 2], data[idx + 3], imageData), idx);
		}
	}
}

function clampImage(imageData, fn){
	mapImageData(imageData, (x, y, r, g, b, a) => [r, g, b, fn(x, y, r, g, b, a, imageData) ? a : 0])
}

function putPixel(imageData, x, y, r, g, b, a){
	var i = (imageData.width * y + x) * 4;
	imageData.data[i    ] = r;
	imageData.data[i + 1] = g;
	imageData.data[i + 2] = b;
	imageData.data[i + 3] = a;
}

function rand(min, max){
	return Math.floor(Math.random() * max) - min;
}

image.addEventListener('load', function () {
	baseCanvas.width = canvas.width  = image.width;
	baseCanvas.height= canvas.height = image.height;

	baseCtx.drawImage(image, 0, 0, image.width, image.height);

	var imageData = baseCtx.getImageData(0, 0, image.width, image.height);

//    mapImageData(imageData, (x, y, r, g, b, a) => [r, g, b*2, a] );
	var {sin, cos, round} = Math,
		cx = imageData.width / 2 | 0,
		cy = imageData.height / 2 | 0,
		r1 = cy * cy,
		r2 = r1 / 2,
		a1 = cos(0),
		a2 = cos(Math.PI / 4);

	clampImage(imageData, (x, y) => {
		x -= cx;
		y -= cy;
		var d = x * x + y * y,
			a =  (x * x) / d;
		return  d < r1 && d > r2 && a < a1 && a > a2;
	});

	ctx.putImageData(imageData, 0, 0, 0, 0, image.width, image.height);
});



image.src = '/assets/sample-small.png';

