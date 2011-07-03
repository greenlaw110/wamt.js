/*
	wamt.js/image.js
	@author Zack0Wack0/http://zack0wack0.com
	@since 0.43
*/
/*
	@class The Image class is a manipulatable raster image. It can be used for a Sprite's texture.
	@description Create a new Image object.
	@param {Number} width The initial width of the image.
	@param {Number} height The initial height of the image.
	@param {Image} src The image to reference from, if undefined an empty image will be created.
*/
wamt.Image = function(width,height,src)
{
	var canvas = document.createElement("canvas");
	canvas.setAttribute("width",width);
	canvas.setAttribute("height",height);
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.width = width;
	this.height = height;
	if(typeof(src) != "undefined")
	{
		if(src instanceof Image)
			this.load(src,width,height);
		else
		{
			var image = new Image();
			image.src = src;
			var rthis = this;
			image.onload = function()
			{
				rthis.load(this,width,height);
			};
		}
	}
	else
		this.empty(width,height);
};
wamt.Image.prototype.constructor = wamt.Image;
/*
	@description Set a pixel's colour value.
	@param {Number} x The x-position of the pixel.
	@param {Number} x The y-position of the pixel.
	@param {Number} r The red colour value.
	@param {Number} g The green colour value.
	@param {Number} b The blue colour value.
	@param {Number} a The alpha colour value.
*/
wamt.Image.prototype.setPixel = function(x,y,r,g,b,a)
{
	var data = this.data;
	var i = (x + y * this.width) * 4;
	if(r instanceof Array)
	{
		var or = r;
		r = or[0];
		g = or[1];
		b = or[2];
		a = or[3];
	}
	data.data[i + 0] = r;
	data.data[i + 1] = g;
	data.data[i + 2] = b;
	data.data[i + 3] = a;
};
/*
	@description Fill a rectangle on the image.
	@param {Number} style The colour style.
	@param {Number} x The x-position.
	@param {Number} x The y-position.
	@param {Number} width The width of the rectangle.
	@param {Number} height The height of the rectangle.
*/
wamt.Image.prototype.fillRect = function(style,x,y,width,height)
{
	var context = this.context;
	context.fillStyle = style;
	context.fillRect(x,y,width,height);
	this.update();
};
/*
	@description Stroke a rectangle on the image.
	@param {Number} style The colour style.
	@param {Number} x The x-position.
	@param {Number} x The y-position.
	@param {Number} width The width of the rectangle.
	@param {Number} height The height of the rectangle.
*/
wamt.Image.prototype.strokeRect = function(style,x,y,width,height)
{
	var context = this.context;
	context.strokeStyle = style;
	context.strokeRect(x,y,width,height);
	this.update();
};
/*
	@description Fill text onto the image.
	@param {Number} style The colour style.
	@param {Number} x The x-position.
	@param {Number} x The y-position.
	@param {String} text The text to draw.
*/
wamt.Image.prototype.fillText = function(style,x,y,text)
{
	var context = this.context;
	context.fillStyle = style;
	context.fillText(text,x,y);
	this.update();
};
/*
	@description Stroke text onto the image.
	@param {Number} style The colour style.
	@param {Number} x The x-position.
	@param {Number} x The y-position.
	@param {String} text The text to draw.
*/
wamt.Image.prototype.strokeText = function(style,x,y,text)
{
	var context = this.context;
	context.strokeStyle = style;
	context.strokeText(text,x,y);
	this.update();
};
/*
	@description Fill a circle onto the image.
	@param {Number} style The colour style.
	@param {Number} x The x-position.
	@param {Number} x The y-position.
	@param {Number} radius The radius of the circle.
*/
wamt.Image.prototype.fillCircle = function(style,x,y,radius)
{
	var context = this.context;
	context.fillStyle = style;
	context.beginPath();
	context.arc(x,y,radius,0,Math.PI * 2,false);
	context.fill();
	this.render();
	this.update();
};
/*
	@description Stroke a circle onto the image.
	@param {Number} style The colour style.
	@param {Number} x The x-position.
	@param {Number} x The y-position.
	@param {Number} radius The radius of the circle.
*/
wamt.Image.prototype.strokeCircle = function(style,x,y,radius)
{
	var context = this.context;
	context.strokeStyle = style;
	context.beginPath();
	context.arc(x,y,radius,0,Math.PI * 2,false);
	context.stroke();
	this.update();
};
/*
	@description Fill a polygon onto the image.
	@param {Number} style The colour style.
	@param {Number} x The x-position.
	@param {Number} x The y-position.
	@param {Array} vertices The array of vertices, which are tuples of x and y positions for each vertex.
*/
wamt.Image.prototype.fillPolygon = function(style,x,y,vertices)
{
	var context = this.context;
	context.fillStyle = style;
	context.beginPath();
	for(var i=0;i<vertices.length;i++)
	{
		var vertice = vertices[i];
		context.lineTo(x + vertice[0],y + vertice[1]);
	}
	context.fill();
	this.update();
};
/*
	@description Stroke a polygon onto the image.
	@param {Number} style The colour style.
	@param {Number} x The x-position.
	@param {Number} x The y-position.
	@param {Array} vertices The array of vertices, which are tuples of x and y positions for each vertex.
*/
wamt.Image.prototype.strokePolygon = function(style,x,y,vertices)
{
	var context = this.context;
	context.strokeStyle = style;
	context.beginPath();
	for(var i=0;i<vertices.length;i++)
	{
		var vertice = vertices[i];
		context.lineTo(x + vertice[0],y + vertice[1]);
	}
	context.stroke();
	this.update();
};
/*
	@description Fill a line onto the image.
	@param {Number} style The colour style.
	@param {Number} x The x-position.
	@param {Number} x The y-position.
	@param {Number} ex The end x-position.
	@param {Number} ey The end y-position.
*/
wamt.Image.prototype.fillLine = function(style,x,y,ex,ey)
{
	var context = this.context;
	context.fillStyle = style;
	context.beginPath();
	context.save();
	context.translate(x,y);
	context.lineTo(ex,ey);
	context.fill();
	context.restore();
	this.render();
	this.update();
};
/*
	@description Stroke a line onto the image.
	@param {Number} style The colour style.
	@param {Number} x The x-position.
	@param {Number} x The y-position.
	@param {Number} ex The end x-position.
	@param {Number} ey The end y-position.
*/
wamt.Image.prototype.strokeLine = function(style,x,y,ex,ey)
{
	var context = this.context;
	context.strokeStyle = style;
	context.beginPath();
	context.save();
	context.translate(x,y);
	context.lineTo(ex,ey);
	context.stroke();
	context.restore();
	this.render();
	this.update();
};
/*
	@description Get the colour value of a pixel.
	@param {Number} x The x-position of the pixel.
	@param {Number} x The y-position of the pixel.
*/
wamt.Image.prototype.getPixel = function(x,y)
{
	var data = this.data;
	var i = (x + y * this.width) * 4;
	return [data.data[i + 0],data.data[i + 1],data.data[i + 2],data[i + 3]];
};
wamt.Image.prototype.getPixels = function(x,y,ex,ey)
{
	var data = this.data;
	var si = (x + y * this.width) * 4;
	var ei = (ex + ey * this.width) * 4;
	var pixel = [];
	var d = [];
	for(var i=si;i<ei;i++)
	{
		var m = i % 4;
		if(m == 0)
		{
			d.push(pixel);
			pixel = [];
		}
		else
			pixel.push(data.data[i]);
	}
	return d;
};
/*
	@description Store the context's pixels into the image's data.
*/
wamt.Image.prototype.update = function()
{
	this.data = this.context.getImageData(0,0,0,0,this.width,this.height);
};
/*
	@description Render the stored image data into the context.
*/
wamt.Image.prototype.render = function()
{
	var context = this.context;
	var canvas = this.canvas;
	canvas.width = this.width;
	canvas.height = this.height;
	this.context.putImageData(this.data,0,0);
	return this.canvas;
};
/*
	@description Render the stored image data into the context.
	@param {Number} width The width of the new image.
	@param {Number} height The height of the new image.
*/
wamt.Image.prototype.empty = function(width,height)
{
	var canvas = this.canvas;
	var context = this.context;
	canvas.width = width;
	canvas.height = height;
	this.width = width;
	this.height = height;
	this.data = context.createImageData(width,height);
	this.render();
};
/*
	@description Load a DOM Image into the image.
	@param {Number} image The DOM Image.
	@param {Number} width The width of the new image.
	@param {Number} height The height of the new image.
*/
wamt.Image.prototype.load = function(image,width,height)
{
	var canvas = this.canvas;
	var context = this.context;
	if(typeof(width) == "undefined")
		width = image.width;
	if(typeof(height) == "undefined")
		height = image.height;
	this.width = width;
	this.height = height;
	canvas.width = width;
	canvas.height = height;
	context.drawImage(image,0,0,width,height);
	this.data = context.getImageData(0,0,width,height);
};
