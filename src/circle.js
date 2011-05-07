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
	this.visible = true;
	this.opacity = 1;
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
wamt.Circle.prototype.setVisible = function(visible)
{
	this.visible = visible;
	this.scene.updated = true;
};
wamt.Circle.prototype.setHollow = function(hollow)
{
	this.hollow = hollow;
	this.scene.updated = true;
};
wamt.Circle.prototype.logic = function(scene)
{
	var hasBehaviour = typeof(this.behaviour) != "undefined";
	if(hasBehaviour)
		this.behaviour.prelogic(this);
	if(this.velocity[0] != 0 || this.velocity[1] != 0)
	{
		if(hasBehaviour)
			this.behaviour.velocity(this);
		else
			this.translate(this.velocity[0],this.velocity[1]);
	}
	if(hasBehaviour)
		this.behaviour.logic(this);
	this.processEvent("logic",{object:this,scene:scene});
};
wamt.Circle.prototype.tick = function(scene,layer,view)
{
	var hasBehaviour = typeof(this.behaviour) != "undefined";
	if(hasBehaviour)
		this.behaviour.pretick(this);
	var canvas = view.canvas;
	if(scene.updated)
	{
		if(layer.locked)
		{
			this.screenX = this.x;
			this.screenY = this.y;
		}
		else
		{
			this.screenX = -view.x + this.x + (canvas.width / 2);
			this.screenY = -view.y + this.y + (canvas.height / 2);
		}
	}
	if(hasBehaviour)
		this.behaviour.tick(this);
	this.processEvent("tick",{object:this,scene:scene,layer:layer,view:view});
};
wamt.Circle.prototype.render = function(view)
{
	var hasBehaviour = typeof(this.behaviour) != "undefined";
	if(hasBehaviour)
		this.behaviour.prerender(this);
	var context = view.context;
	var radians = this.radians;
	context.fillStyle = this.style;
	context.strokeStyle = this.style;
	context.shadowOffsetX = this.shadow[0];
	context.shadowOffsetY = this.shadow[1];
	context.shadowBlur = this.shadow[2];
	context.shadowColor = this.shadow[3];
	if(radians == 0)
	{
		context.beginPath();
		context.arc(this.screenX,this.screenY,this.radius,0,Math.PI * 2,false);
		if(this.hollow)
			context.stroke();
		else
			context.fill();
	}
	else
	{
		var transx = this.screenX;
		var transy = this.screenY;
		context.save();
		context.translate(transx,transy);
		context.rotate(radians);
		context.translate(-transx,-transy);
		context.beginPath();
		context.arc(this.screenX,this.screenY,this.radius,0,Math.PI * 2,false);
		if(this.hollow)
			context.stroke();
		else
			context.fill();
		context.restore();
	}
	context.shadowOffsetX = "";
	context.shadowOffsetY = "";
	context.shadowBlur = "";
	context.shadowColor = "";
	context.fillStyle = "";
	context.strokeStyle = "";
	if(hasBehaviour)
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
wamt.Circle.prototype.setOpacity = function(opacity)
{
	this.opacity = opacity;
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
	this.angle = angle % 360;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Circle.prototype.rotate = function(angle)
{
	this.angle += angle;
	this.angle %= 360;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Circle.prototype.setBehaviour = function(behaviour)
{
	this.behaviour = behaviour;
	if(typeof(behaviour.init) != "undefined")
		behaviour.init(this);
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
			e[i](holder);
	}
};
wamt.Circle.prototype.destroy = function()
{
	this.scene.removeObject(this);
};