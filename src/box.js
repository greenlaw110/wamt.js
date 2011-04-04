/*
	@title box.js
	@author Zack0Wack0/zack0wack0.com
	@package wamt.js
*/
wamt.Box = function(style,width,height,x,y,angle)
{
	this.collideable = true;
	this.x = typeof(x) == "undefined" ? 0 : x;
	this.y = typeof(y) == "undefined" ? 0 : y;
	this.screenX = this.x;
	this.screenY = this.y;
	this.angle = typeof(angle) == "undefined" ? 0 : angle;
	this.radians = typeof(angle) == "undefined" ? 0 : Math.radians(angle);
	this.width = width;
	this.height = height;
	this.style = style;
	this.shadow = [0,0,0,"rgba(0,0,0,0)"];
	this.hollow = false;
	this.computeBounds();
};
wamt.Box.prototype.constructor = wamt.Box;
wamt.Box.prototype.computeBounds = function()
{
	if(this.angle == 0 || this.angle == 180)
		this.bounds = [this.width,this.height];
	else if(this.angle == 90 || this.angle == 270)
		this.bounds = [this.height,this.width];
	else
		this.bounds = [Math.abs(Math.cos(this.angle) * this.width),Math.abs(Math.sin(this.angle) * this.height)];
};
wamt.Box.prototype.setColliding = function(colliding)
{
	this.collideable = colliding;
};
wamt.Box.prototype.setHollow = function(hollow)
{
	this.hollow = hollow;
	this.scene.updated = true;
};
wamt.Box.prototype.tick = function(scene,layer,view)
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
wamt.Box.prototype.render = function(view)
{
	var radians = this.radians;
	view.context.strokeStyle = this.style;
	view.context.fillStyle = this.style;
	view.context.shadowOffsetX = this.shadow[0];
	view.context.shadowOffsetY = this.shadow[1];
	view.context.shadowBlur = this.shadow[2];
	view.context.shadowColor = this.shadow[3];
	if(radians == 0)
	{
		if(this.hollow)
			view.context.strokeRect(this.screenX,this.screenY,this.width,this.height);
		else
			view.context.fillRect(this.screenX,this.screenY,this.width,this.height);
	}
	else
	{
		var transx = (this.width / 2) + this.screenX;
		var transy = (this.height / 2) + this.screenY;
		view.context.save();
		view.context.translate(transx,transy);
		view.context.rotate(radians);
		view.context.translate(-transx,-transy);
		if(this.hollow)
			view.context.strokeRect(this.screenX,this.screenY,this.width,this.height);
		else
			view.context.fillRect(this.screenX,this.screenY,this.width,this.height);
		view.context.restore();
	}
	view.context.strokeStyle = "";
	view.context.fillStyle = "";
	view.context.shadowOffsetX = "";
	view.context.shadowOffsetY = "";
	view.context.shadowBlur = "";
	view.context.shadowColor = "";
};
wamt.Box.prototype.setStyle = function(style)
{
	this.style = style;
	this.scene.updated = true;
};
wamt.Box.prototype.setShadow = function(offsetx,offsety,blur,color)
{
	this.shadow = [offsetx,offsety,blur,color];
	this.scene.updated = true;
};
wamt.Box.prototype.setShadowCasting = function(shadowcast)
{
	this.shadowcast = shadowcast;
	this.scene.updated = true;
};
wamt.Box.prototype.setX = function(x)
{
	this.x = x;
	this.scene.updated = true;
};
wamt.Box.prototype.setY = function(y)
{
	this.y = y;
	this.scene.updated = true;
};
wamt.Box.prototype.setPosition = function(x,y)
{
	this.x = x;
	this.y = y;
	this.scene.updated = true;
};
wamt.Box.prototype.translateX = function(x)
{
	if(wamt.settings.smoothing)
		x *= wamt.delta * 0.1;
	this.x += x;
	this.scene.updated = true;
};
wamt.Box.prototype.translateY = function(y)
{
	if(wamt.settings.smoothing)
		y *= wamt.delta * 0.1;
	this.y += y;
	this.scene.updated = true;
};
wamt.Box.prototype.translate = function(x,y)
{
	if(wamt.settings.smoothing)
		x *= wamt.delta * 0.1;
	if(wamt.settings.smoothing)
		y *= wamt.delta * 0.1;
	this.x += x;
	this.y += y;
	this.scene.updated = true;
};
wamt.Box.prototype.setWidth = function(width)
{
	this.width = width;
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Box.prototype.setHeight = function(height)
{
	this.height = height;
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Box.prototype.setSize = function(width,height)
{
	this.width = width;
	this.height = height;
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Box.prototype.stretchX = function(width)
{
	if(wamt.settings.smoothing)
		width *= wamt.delta * 0.1;
	this.width += width;
	if(this.width < 1)
		this.width = 1;
	this.computeBounds();
	this.scene.updated = true;
}
wamt.Box.prototype.stretchY = function(height)
{
	if(wamt.settings.smoothing)
		height *= wamt.delta * 0.1;
	this.height += height;
	if(this.height < 1)
		this.height = 1;
	this.computeBounds();
	this.scene.updated = true;
}
wamt.Box.prototype.stretch = function(width,height)
{
	if(wamt.settings.smoothing)
		width *= wamt.delta * 0.1;
	if(wamt.settings.smoothing)
		height *= wamt.delta * 0.1;
	this.width += width;
	if(this.width < 1)
		this.width = 1;
	this.height += height;
	if(this.height < 1)
		this.height = 1;
	this.computeBounds();
	this.scene.updated = true;
}
wamt.Box.prototype.setAngle = function(angle)
{
	this.angle = angle;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Box.prototype.rotate = function(angle)
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