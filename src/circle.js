/*
	@title circle.js
	@author Zack0Wack0/zack0wack0.com
	@package wamt.js
*/
wamt.Circle = function(style,radius,x,y,angle)
{
	this.events = [];
	this.collideable = true;
	this.x = typeof(x) == "undefined" ? 0 : x;
	this.y = typeof(y) == "undefined" ? 0 : y;
	this.velocity = [0,0];
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
	if(typeof(this.behaviour) != "undefined")
		this.behaviour.pretick(this);
	if(this.velocity[0] != 0 || this.velocity[1] != 0)
		this.translate(this.velocity[0],this.velocity[1]);
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
	if(typeof(this.behaviour) != "undefined")
		this.behaviour.tick(this);
	this.processEvent("tick",{object: this, scene: scene, layer: layer, view: view});
};
wamt.Circle.prototype.render = function(view)
{
	if(typeof(this.behaviour) != "undefined")
		this.behaviour.prerender(this);
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
	if(typeof(this.behaviour) != "undefined")
		this.behaviour.render(this);
	this.processEvent("render",{object: this,view: view});
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
wamt.Circle.prototype.snap = function(x,y)
{
	this.translate(-(this.x % x),-(this.y % y));
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
wamt.Circle.prototype.setVelocity = function(x,y)
{
	this.velocity = [x,y];
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
wamt.Circle.prototype.setBehaviour = function(behaviour)
{
	this.behaviour = behaviour;
	this.scene.updated = true;
};
wamt.Circle.prototype.addEventListener = function(type,bind)
{
	var e = this.events[type];
	if(typeof(e) == "undefined")
		this.events[type] = [];
	this.events[type].push(bind);
};
wamt.Circle.prototype.processEvent = function(type,holder)
{
	var e = this.events[type];
	if(typeof(e) != "undefined")
	{
		for(var i=0;i<e.length;i++)
		{
			e[i](holder);
		}
	}
};
wamt.Circle.prototype.destroy = function()
{
	this.scene.removeObject(this);
};