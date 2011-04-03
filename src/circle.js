/*
	@title circle.js
	@author Zack0Wack0/zack0wack0.com
	@package wamt.js
*/
wamt.Circle = function(style,radius,x,y,angle)
{
	this.collideable = true;
	this.x = typeof(x) == "undefined" ? 0 : x;
	this.y = typeof(y) == "undefined" ? 0 : y;
	this.screenX = this.x;
	this.screenY = this.y;
	this.angle = typeof(angle) == "undefined" ? 0 : angle;
	this.radians = typeof(angle) == "undefined" ? 0 : Math.radians(angle);
	this.radius = radius;
	this.style = style;
	this.shadow = [0,0,0,"rgba(0,0,0,0)"];
	this.shadowcast = false;
	this.hollow = false;
	this.computeBounds();
};
wamt.Circle.prototype.constructor = wamt.Circle;
wamt.Circle.prototype.computeBounds = function()
{
	this.bounds = [this.radius * 2,this.radius * 2];
};
wamt.Circle.prototype.setColliding = function(colliding)
{
	this.collideable = colliding;
};
wamt.Circle.prototype.setHollow = function(hollow)
{
	this.hollow = hollow;
	this.scene.updated = true;
};
wamt.Circle.prototype.tick = function(scene,layer,view)
{
	if(scene.updated)
	{
		this.screenX = -view.x + this.x + (view.canvas.width / 2);
		this.screenY = -view.y + this.y + (view.canvas.height / 2);
	}
};
wamt.Circle.prototype.render = function(view)
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
		view.context.arc(this.screenX,this.screenY,this.radius,0,Math.PI * 2,false);
		if(this.hollow)
			view.context.stroke();
		else
			view.context.fill();
	}
	else
	{
		var transx = this.screenX;
		var transy = this.screenY;
		view.context.save();
		view.context.translate(transx,transy);
		view.context.rotate(radians);
		view.context.translate(-transx,-transy);
		view.context.beginPath();
		view.context.arc(this.screenX,this.screenY,this.radius,0,Math.PI * 2,false);
		if(this.hollow)
			view.context.stroke();
		else
			view.context.fill();
		view.context.restore();
	}
	view.context.shadowOffsetX = "";
	view.context.shadowOffsetY = "";
	view.context.shadowBlur = "";
	view.context.shadowColor = "";
	view.context.fillStyle = "";
	view.context.strokeStyle = "";
};
wamt.Circle.prototype.setStyle = function(style)
{
	this.style = style;
	this.scene.updated = true;
};
wamt.Circle.prototype.setShadow = function(offsetx,offsety,blur,color)
{
	this.shadow = [offsetx,offsety,blur,color];
	this.scene.updated = true;
};
wamt.Circle.prototype.setShadowCasting = function(shadowcast)
{
	this.shadowcast = shadowcast;
	this.scene.updated = true;
};
wamt.Circle.prototype.setX = function(x)
{
	this.x = x;
	this.scene.updated = true;
};
wamt.Circle.prototype.setY = function(y)
{
	this.y = y;
	this.scene.updated = true;
};
wamt.Circle.prototype.setPosition = function(x,y)
{
	this.x = x;
	this.y = y;
	this.scene.updated = true;
};
wamt.Circle.prototype.translateX = function(x)
{
	this.x += x;
	this.scene.updated = true;
};
wamt.Circle.prototype.translateY = function(y)
{
	this.y += y;
	this.scene.updated = true;
};
wamt.Circle.prototype.translate = function(x,y)
{
	this.x += x;
	this.y += y;
	this.scene.updated = true;
};
wamt.Circle.prototype.setRadius = function(radius)
{
	this.radius = radius;
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Circle.prototype.stretch = function(radius)
{
	this.radius += radius;
	if(this.radius < 1)
		this.radius = 1;
	this.computeBounds();
	this.scene.updated = true;
}
wamt.Circle.prototype.setAngle = function(angle)
{
	this.angle = angle;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Circle.prototype.rotate = function(angle)
{
	this.angle += angle;
	if(this.angle > 360)
		this.angle = this.angle - 360;
	else if(this.angle < 0)
		this.angle = 360 - this.angle;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.scene.updated = true;
};