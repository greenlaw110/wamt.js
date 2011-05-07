/*
	@title image.js
	@author Zack0Wack0/zack0wack0.com
	@package wamt.js
*/
wamt.Image = function(src,width,height)
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
	this.render();
};
wamt.Image.prototype.fillObject = function(obj)
{
	obj.render({context:this.context});
	this.update();
	this.render();
};
wamt.Image.prototype.getPixel = function(x,y)
{
	var data = this.data;
	var i = (x + y * this.width) * 4;
	return [data.data[i + 0],data.data[i + 1],data.data[i + 2],data[i + 3]];s
};
wamt.Image.prototype.update = function()
{
	this.data = this.context.getImageData(0,0,0,0,this.width,this.height);
};
wamt.Image.prototype.render = function()
{
	var context = this.context;
	var canvas = this.canvas;
	canvas.width = this.width;
	canvas.height = this.height;
	this.context.putImageData(this.data,0,0);
	return this.canvas;
};
wamt.Image.prototype.empty = function(width,height)
{
	var canvas = this.canvas;
	var context = this.context;
	canvas.width = width;
	canvas.height = height;
	this.width = width;
	this.height = height;
	this.data = context.createImageData(width,height);
};
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