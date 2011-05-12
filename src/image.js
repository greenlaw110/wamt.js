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
wamt.Image.prototype.drawObject = function(obj)
{
	obj.render({context:this.context});
	this.render();
	this.update();
};
wamt.Image.prototype.fillRect = function(style,x,y,width,height)
{
	var context = this.context;
	context.fillStyle = style;
	context.fillRect(x,y,width,height);
	this.render();
	this.update();
};
wamt.Image.prototype.strokeRect = function(style,x,y,width,height)
{
	var context = this.context;
	context.strokeStyle = style;
	context.strokeRect(x,y,width,height);
	this.render();
	this.update();
};
wamt.Image.prototype.fillText = function(style,x,y,text)
{
	var context = this.context;
	context.fillStyle = style;
	context.fillText(text,x,y);
	this.render();
	this.update();
};
wamt.Image.prototype.strokeText = function(style,x,y,text)
{
	var context = this.context;
	context.strokeStyle = style;
	context.strokeText(text,x,y);
	this.render();
	this.update();
};
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
wamt.Image.prototype.strokeCircle = function(style,x,y,radius)
{
	var context = this.context;
	context.strokeStyle = style;
	context.beginPath();
	context.arc(x,y,radius,0,Math.PI * 2,false);
	context.stroke();
	this.render();
	this.update();
};
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
	this.render();
	this.update();
};
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
	this.render();
	this.update();
};
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
