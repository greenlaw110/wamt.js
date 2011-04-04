/*
	@title polygon.js
	@author Zack0Wack0/zack0wack0.com
	@package wamt.js
*/
wamt.Polygon = function(style,vertices,x,y,angle)
{
	this.collideable = true;
	this.x = typeof(x) == "undefined" ? 0 : x;
	this.y = typeof(y) == "undefined" ? 0 : y;
	this.screenX = this.x;
	this.screenY = this.y;
	this.angle = typeof(angle) == "undefined" ? 0 : angle;
	this.radians = typeof(angle) == "undefined" ? 0 : Math.radians(angle);
	this.vertices = vertices;
	this.style = style;
	this.shadow = [0,0,0,"rgba(0,0,0,0)"];
	this.shadowcast = false;
	this.computeBounds();
};
wamt.Polygon.prototype.constructor = wamt.Polygon;
wamt.Polygon.prototype.computeBounds = function()
{
	var minx = 0;
	var miny = 0;
	var maxx = 0;
	var maxy = 0;
	for(var i=0;i<this.vertices.length;i++)
	{
		var vertice = this.vertices[i];
		var tminx = Math.min(minx,vertice[0]);
		var tminy = Math.min(miny,vertice[0]);
		var tmaxx = Math.max(maxx,vertice[1]);
		var tmaxy = Math.max(maxy,vertice[1]);
		minx = tminx < minx ? tminx : minx;
		miny = tminy < miny ? tminy : miny;
		maxx = tmaxx > maxx ? tmaxx : maxx;
		maxy = tmaxy > maxy ? tmaxy : maxy;
	}
	if(this.angle)
		this.bounds = [Math.abs(Math.cos(this.angle) * (maxx - minx)),Math.abs(Math.sin(this.angle) * (maxy - miny))];
	else
		this.bounds = [maxx - minx,maxy - miny];
};
wamt.Polygon.prototype.setColliding = function(colliding)
{
	this.collideable = colliding;
	this.scene.updated = true;
};
wamt.Polygon.prototype.setHollow = function(hollow)
{
	this.hollow = hollow;
	this.scene.updated = true;
};
wamt.Polygon.prototype.tick = function(scene,layer,view)
{
	if(scene.updated)
	{
		if(layer.locked)
		{
			this.screenX = this.x;
			this.screenY = this.y;
		}
		else
		{
			this.screenX = -view.x + this.x + (view.canvas.width / 2);
			this.screenY = -view.y + this.y + (view.canvas.height / 2);
		}
	}
};
wamt.Polygon.prototype.render = function(view)
{
	var radians = this.radians;
	view.context.fillStyle = this.style;
	view.context.strokeStyle = this.style;
	view.context.shadowOffsetX = this.shadow[0];
	view.context.shadowOffsetY = this.shadow[1];
	view.context.shadowBlur = this.shadow[2];
	view.context.shadowColor = this.shadow[3];
	if(radians == 0)
	{
		view.context.beginPath();
		for(var i=0;i<this.vertices.length;i++)
		{
			var vertice = this.vertices[i];
			view.context.lineTo(this.screenX + vertice[0],this.screenY + vertice[1]);
		}
		if(this.hollow)
			view.context.stroke();
		else
			view.context.fill();
	}
	else
	{
		var transx = (this.width / 2) + this.screenX;
		var transy = (this.height / 2) + this.screenY;
		view.context.save();
		view.context.translate(transx,transy);
		view.context.rotate(radians);
		view.context.translate(-transx,-transy);
		view.context.beginPath();
		for(var i=0;i<this.vertices.length;i++)
		{
			var vertice = this.vertices[i];
			view.context.lineTo(this.screenX + vertice[0],this.screenY + vertice[1]);
		}
		if(this.hollow)
			view.context.stroke();
		else
			view.context.fill();
		view.context.restore();
	}
	view.context.fillStyle = "";
	view.context.strokeStyle = "";
	view.context.shadowOffsetX = "";
	view.context.shadowOffsetY = "";
	view.context.shadowBlur = "";
	view.context.shadowColor = "";
};
wamt.Polygon.prototype.setStyle = function(style)
{
	this.style = style;
	this.scene.updated = true;
};
wamt.Polygon.prototype.setShadow = function(offsetx,offsety,blur,color)
{
	this.shadow = [offsetx,offsety,blur,color];
	this.scene.updated = true;
};
wamt.Polygon.prototype.setShadowCasting = function(shadowcast)
{
	this.shadowcast = shadowcast;
	this.scene.updated = true;
};
wamt.Polygon.prototype.setX = function(x)
{
	this.x = x;
	this.scene.updated = true;
};
wamt.Polygon.prototype.setY = function(y)
{
	this.y = y;
	this.scene.updated = true;
};
wamt.Polygon.prototype.setPosition = function(x,y)
{
	this.x = x;
	this.y = y;
	this.scene.updated = true;
};
wamt.Polygon.prototype.translateX = function(x)
{
	if(wamt.settings.smoothing)
		x *= wamt.delta * 0.1;
	this.x += x;
	this.scene.updated = true;
};
wamt.Polygon.prototype.translateY = function(y)
{
	if(wamt.settings.smoothing)
		y *= wamt.delta * 0.1;
	this.y += y;
	this.scene.updated = true;
};
wamt.Polygon.prototype.translate = function(x,y)
{
	if(wamt.settings.smoothing)
		x *= wamt.delta * 0.1;
	if(wamt.settings.smoothing)
		y *= wamt.delta * 0.1;
	this.x += x;
	this.y += y;
	this.scene.updated = true;
};
wamt.Polygon.prototype.setVertices = function(vertices)
{
	this.vertices = vertices;
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Polygon.prototype.stretchX = function(x)
{
	if(wamt.settings.smoothing)
		x *= wamt.delta * 0.1;
	for(var i=0;i<this.vertices.length;i++)
	{
		vertice = this.vertices[i];
		vertice[0] += x;
	}
	this.computeBounds();
	this.scene.updated = true;
}
wamt.Polygon.prototype.stretchY = function(y)
{
	if(wamt.settings.smoothing)
		y *= wamt.delta * 0.1;
	for(var i=0;i<this.vertices.length;i++)
	{
		vertice = this.vertices[i];
		vertice[1] += y;
	}
	this.computeBounds();
	this.scene.updated = true;
}
wamt.Polygon.prototype.stretch = function(x,y)
{
	if(wamt.settings.smoothing)
		x *= wamt.delta * 0.1;
	if(wamt.settings.smoothing)
		y *= wamt.delta * 0.1;
	for(var i=0;i<this.vertices.length;i++)
	{
		vertice = this.vertices[i];
		vertice[0] += x;
		vertice[1] += y;
	}
	this.computeBounds();
	this.scene.updated = true;
}
wamt.Polygon.prototype.setAngle = function(angle)
{
	this.angle = angle;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Polygon.prototype.rotate = function(angle)
{
	if(wamt.settings.smoothing)
		angle *= wamt.delta * 0.1;
	this.angle += angle;
	if(this.angle > 360)
		this.angle = this.angle - 360;
	else if(this.angle < 0)
		this.angle = 360 - this.angle;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.scene.updated = true;
};