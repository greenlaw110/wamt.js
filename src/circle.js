/*
	wamt.js/circle.js
	@author Zack0Wack0/http://zack0wack0.com
*/
/*
	@class The Circle is a renderable object that renders a full arc.
	@param {String} style The colour style.
	@param {Number} radius The radius of the object.
	@param {Number} x The x-position of the object.
	@param {Number} y The y-position of the object.
	@param {Number} angle The angle of the object.
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
/*
	@function
	@description Compute the bounds of the object, based on the radius.
*/
wamt.Circle.prototype.computeBounds = function()
{
	this.bounds = [this.radius * 2,this.radius * 2];
};
/*
	@function
	@description Set whether the object is colliding.
	@param {Bool} colliding Is the object colliding?
*/
wamt.Circle.prototype.setColliding = function(colliding)
{
	this.collideable = colliding;
};
/*
	@function
	@description Set whether the object is visible.
	@param {Bool} visible Is the object visible?
*/
wamt.Circle.prototype.setVisible = function(visible)
{
	this.visible = visible;
	this.scene.updated = true;
};
/*
	@function
	@description Set whether the object is hollow.
	@param {Bool} hollow Is the object hollow?
*/
wamt.Circle.prototype.setHollow = function(hollow)
{
	this.hollow = hollow;
	this.scene.updated = true;
};
/*
	@function
	@description Process the object's logic. (handles velocity, behaviours, etc)
	@param {Scene} scene The parent scene processing logic.
*/
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
/*
	@function
	@description Process the object's screen position and other misc. stuff (behaviours)
	@param {Scene} scene The parent scene.
	@param {Layer} layer The parent layer.
	@param {View} view The parent view.
*/
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
/*
	@function
	@description Render the object to the screen.
	@param {View} view The view to render the object into.
*/
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
/*
	@function
	@description Set the circle's radius.
	@param {Number} radius The radius.
*/
wamt.Circle.prototype.setRadius = function(radius)
{
	if(radius < 1)
		radius = 1;
	this.radius = radius;
	this.computeBounds();
	this.scene.updated = true;
};
/*
	@function
	@description Increase the circle's radius.
	@param {Number} radius The amount to increase the radius by.
*/
wamt.Circle.prototype.stretch = function(radius)
{
	this.radius += radius;
	if(this.radius < 1)
		this.radius = 1;
	this.computeBounds();
	this.scene.updated = true;
};
/*
	@function
	@description Set the colour style of the object.
	@param {String} style The colour style.
*/
wamt.Circle.prototype.setStyle = function(style)
{
	this.style = style;
	this.scene.updated = true;
};
/*
	@function
	@description Set the shadow of the object.
	@param {Number} offsetx The x-offset of the shadow.
	@param {Number} offsety The y-offset of the shadow.
	@param {Number} blur The blur radius of the shadow.
	@param {String} color The colour of the shadow.
*/
wamt.Circle.prototype.setShadow = function(offsetx,offsety,blur,color)
{
	this.shadow = [offsetx,offsety,blur,color];
	this.scene.updated = true;
};
/*
	@function
	@description Set whether the object is shadowcasting.
	@param {Bool} shadowcast Is the object shadowcasting?
*/
wamt.Circle.prototype.setShadowCasting = function(shadowcast)
{
	this.shadowcast = shadowcast;
	this.scene.updated = true;
};
/*
	@function
	@description Set the opacity of the object.
	@param {Number} opacity The new opacity of the object.
*/
wamt.Circle.prototype.setOpacity = function(opacity)
{
	this.opacity = opacity;
	this.scene.updated = true;
};
/*
	@function
	@description Set the x-position of the object.
	@param {Number} x The x-position.
*/
wamt.Circle.prototype.setX = function(x)
{
	this.x = x;
	this.scene.updated = true;
};
/*
	@function
	@description Set the y-position of the object.
	@param {Number} y The y-position.
*/
wamt.Circle.prototype.setY = function(y)
{
	this.y = y;
	this.scene.updated = true;
};
/*
	@function
	@description Set the position of the object.
	@param {Number} x The x-position.
	@param {Number} y The y-position.
*/
wamt.Circle.prototype.setPosition = function(x,y)
{
	this.x = x;
	this.y = y;
	this.scene.updated = true;
};
/*
	@function
	@description Snap the object to a grid.
	@param {Number} x The width of the grid blocks.
	@param {Number} y The height of the grid blocks.
*/
wamt.Circle.prototype.snap = function(x,y)
{
	this.translate(-(this.x % x),-(this.y % y));
};
/*
	@function
	@description Translate the object (move) on the x-axis.
	@param {Number} x The x-offset.
*/
wamt.Circle.prototype.translateX = function(x)
{
	this.x += x;
	this.scene.updated = true;
};
/*
	@function
	@description Translate the object (move) on the y-axis.
	@param {Number} y The y-offset.
*/
wamt.Circle.prototype.translateY = function(y)
{
	this.y += y;
	this.scene.updated = true;
};
/*
	@function
	@description Translate the object (move).
	@param {Number} x The x-offset.
	@param {Number} y The y-offset.
*/
wamt.Circle.prototype.translate = function(x,y)
{
	this.x += x;
	this.y += y;
	this.scene.updated = true;
};
/*
	@function
	@description Set the velocity of the object.
	@param {Number} x The x-axis pixels per logic speed.
	@param {Number} y The y-axis pixels per logic speed.
*/
wamt.Circle.prototype.setVelocity = function(x,y)
{
	this.velocity = [x,y];
	this.scene.updated = true;
};
/*
	@function
	@description Stop the object's velocity.
*/
wamt.Circle.prototype.stop = function()
{
	this.velocity = [0,0];
	this.scene.updated = true;
};
/*
	@function
	@description Set the object's rotation.
	@param {Number} angle The new rotation/angle. (degrees)
*/
wamt.Circle.prototype.setAngle = function(angle)
{
	this.angle = angle % 360;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.scene.updated = true;
};
/*
	@function
	@description Rotate the object.
	@param {Number} angle The angle offset to rotate by. (degrees)
*/
wamt.Circle.prototype.rotate = function(angle)
{
	this.angle += angle;
	this.angle %= 360;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.scene.updated = true;
};
/*
	@function
	@description Set the object's behaviour.
	@param {Object} The behaviour manager. (eg. wamt.behaviours.projectile)
*/
wamt.Circle.prototype.setBehaviour = function(behaviour)
{
	this.behaviour = behaviour;
	if(typeof(behaviour) != "undefined")
		behaviour.init(this);
	this.scene.updated = true;
};
/*
	@function
	@description Add an event listener to the object.
	@param {String} type The type of event.
	@param {Function} bind The callback for the event.
*/
wamt.Circle.prototype.addEventListener = function(type,bind)
{
	var e = this.events[type];
	if(typeof(e) == "undefined")
		this.events[type] = [];
	this.events[type].push(bind);
};
/*
	@function
	@description Process an event listener on the object.
	@param {String} type The type of event.
	@param {Object} holder The holder object to be sent along to the event callback.
*/
wamt.Circle.prototype.processEvent = function(type,holder)
{
	var e = this.events[type];
	if(typeof(e) != "undefined")
	{
		for(var i=0;i<e.length;i++)
			e[i](holder);
	}
};
/*
	@function
	@description Destroy the object & remove it from the scene.
*/
wamt.Circle.prototype.destroy = function()
{
	this.scene.removeObject(this);
};
