/*
	wamt.js/box.js
	@author Zack0Wack0/http://zack0wack0.com
*/
/*
	@class The Box is a renderable object that renders a rectangle.
	@param {String} style The style of the object.
	@param {Number} width The width of the object.
	@param {Number} height The height of the object.
	@param {Number} x The x-position of the object.
	@param {Number} y The y-position of the object.
	@param {Number} angle The angle of the object.
*/
wamt.Box = function(style,width,height,x,y,angle)
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
	this.width = width;
	this.height = height;
	this.style = style;
	this.shadow = [0,0,0,"rgba(0,0,0,0)"];
	this.hollow = false;
	this.visible = true;
	this.opacity = 1;
	this.computeBounds();
};
wamt.Box.prototype.constructor = wamt.Box;
/*
	@function
	@description Compute the bounds of the object, by rotating the width and height based on angle.
*/
wamt.Box.prototype.computeBounds = function()
{
	if(this.angle == 0 || this.angle == 180)
		this.bounds = [this.width,this.height];
	else if(this.angle == 90 || this.angle == 270)
		this.bounds = [this.height,this.width];
	else
		this.bounds = [Math.abs(Math.cos(this.angle) * this.width),Math.abs(Math.sin(this.angle) * this.height)];
};
/*
	@function
	@description Set whether the object is colliding.
	@param {Bool} colliding Is the object colliding?
*/
wamt.Box.prototype.setColliding = function(colliding)
{
	this.collideable = colliding;
};
/*
	@function
	@description Set whether the object is visible.
	@param {Bool} visible Is the object visible?
*/
wamt.Box.prototype.setVisible = function(visible)
{
	this.visible = visible;
	this.scene.updated = true;
};
/*
	@function
	@description Set whether the object is hollow.
	@param {Bool} hollow Is the object hollow?
*/
wamt.Box.prototype.setHollow = function(hollow)
{
	this.hollow = hollow;
	this.scene.updated = true;
};
/*
	@function
	@description Process the object's logic. (handles velocity, behaviours, etc)
	@param {Scene} scene The parent scene processing logic.
*/
wamt.Box.prototype.logic = function(scene)
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
wamt.Box.prototype.tick = function(scene,layer,view)
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
wamt.Box.prototype.render = function(view)
{
	var hasBehaviour = typeof(this.behaviour) != "undefined";
	if(hasBehaviour)
		this.behaviour.prerender(this);
	var radians = this.radians;
	var context = view.context;
	context.strokeStyle = this.style;
	context.fillStyle = this.style;
	context.shadowOffsetX = this.shadow[0];
	context.shadowOffsetY = this.shadow[1];
	context.shadowBlur = this.shadow[2];
	context.shadowColor = this.shadow[3];
	if(radians == 0)
	{
		if(this.hollow)
			context.strokeRect(this.screenX,this.screenY,this.width,this.height);
		else
			context.fillRect(this.screenX,this.screenY,this.width,this.height);
	}
	else
	{
		var transx = (this.width / 2) + this.screenX;
		var transy = (this.height / 2) + this.screenY;
		context.save();
		context.translate(transx,transy);
		context.rotate(radians);
		context.translate(-transx,-transy);
		if(this.hollow)
			context.strokeRect(this.screenX,this.screenY,this.width,this.height);
		else
			context.fillRect(this.screenX,this.screenY,this.width,this.height);
		context.restore();
	}
	view.context.strokeStyle = "";
	view.context.fillStyle = "";
	view.context.shadowOffsetX = "";
	view.context.shadowOffsetY = "";
	view.context.shadowBlur = "";
	view.context.shadowColor = "";
	if(hasBehaviour)
		this.behaviour.render(this);
	this.processEvent("render",{object: this,view: view});
};
/*
	@function
	@description Set the object's width.
	@param {Number} width The new width.
*/
wamt.Box.prototype.setWidth = function(width)
{
	if(width < 1)
		width = 1;
	this.width = width;
	this.computeBounds();
	this.scene.updated = true;
};
/*
	@function
	@description Set the object's height.
	@param {Number} height The new height.
*/
wamt.Box.prototype.setHeight = function(height)
{
	if(height < 1)
		height = 1;
	this.height = height;
	this.computeBounds();
	this.scene.updated = true;
};
/*
	@function
	@description Set the object's width and height.
	@param {Number} width The new width.
	@param {Number} height The new height.
*/
wamt.Box.prototype.setSize = function(width,height)
{
	if(width < 1)
		width = 1;
	if(height < 1)
		height = 1;
	this.width = width;
	this.height = height;
	this.computeBounds();
	this.scene.updated = true;
};
/*
	@function
	@description Stretch the object on the x-axis.
	@param {Number} width The amount to stretch on the x-axis.
*/
wamt.Box.prototype.stretchX = function(width)
{
	this.width += width;
	if(this.width < 1)
		this.width = 1;
	this.computeBounds();
	this.scene.updated = true;
};
/*
	@function
	@description Stretch the object on the y-axis.
	@param {Number} height The amount to stretch on the y-axis.
*/
wamt.Box.prototype.stretchY = function(height)
{
	this.height += height;
	if(this.height < 1)
		this.height = 1;
	this.computeBounds();
	this.scene.updated = true;
};
/*
	@function
	@description Stretch the object on both axi.
	@param {Number} width The amount to stretch on the x-axis.
	@param {Number} height The amount to stretch on the y-axis.
*/
wamt.Box.prototype.stretch = function(width,height)
{
	this.width += width;
	if(this.width < 1)
		this.width = 1;
	this.height += height;
	if(this.height < 1)
		this.height = 1;
	this.computeBounds();
	this.scene.updated = true;
};
/*
	@function
	@description Set the colour style of the object.
	@param {String} style The colour style.
*/
wamt.Box.prototype.setStyle = function(style)
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
wamt.Box.prototype.setShadow = function(offsetx,offsety,blur,color)
{
	this.shadow = [offsetx,offsety,blur,color];
	this.scene.updated = true;
};
/*
	@function
	@description Set whether the object is shadowcasting.
	@param {Bool} shadowcast Is the object shadowcasting?
*/
wamt.Box.prototype.setShadowCasting = function(shadowcast)
{
	this.shadowcast = shadowcast;
	this.scene.updated = true;
};
/*
	@function
	@description Set the opacity of the object.
	@param {Number} opacity The new opacity of the object.
*/
wamt.Box.prototype.setOpacity = function(opacity)
{
	this.opacity = opacity;
	this.scene.updated = true;
};
/*
	@function
	@description Set the x-position of the object.
	@param {Number} x The x-position.
*/
wamt.Box.prototype.setX = function(x)
{
	this.x = x;
	this.scene.updated = true;
};
/*
	@function
	@description Set the y-position of the object.
	@param {Number} y The y-position.
*/
wamt.Box.prototype.setY = function(y)
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
wamt.Box.prototype.setPosition = function(x,y)
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
wamt.Box.prototype.snap = function(x,y)
{
	this.translate(-(this.x % x),-(this.y % y));
};
/*
	@function
	@description Translate the object (move) on the x-axis.
	@param {Number} x The x-offset.
*/
wamt.Box.prototype.translateX = function(x)
{
	this.x += x;
	this.scene.updated = true;
};
/*
	@function
	@description Translate the object (move) on the y-axis.
	@param {Number} y The y-offset.
*/
wamt.Box.prototype.translateY = function(y)
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
wamt.Box.prototype.translate = function(x,y)
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
wamt.Box.prototype.setVelocity = function(x,y)
{
	this.velocity = [x,y];
	this.scene.updated = true;
};
/*
	@function
	@description Stop the object's velocity.
*/
wamt.Box.prototype.stop = function()
{
	this.velocity = [0,0];
	this.scene.updated = true;
};
/*
	@function
	@description Set the object's rotation.
	@param {Number} angle The new rotation/angle. (degrees)
*/
wamt.Box.prototype.setAngle = function(angle)
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
wamt.Box.prototype.rotate = function(angle)
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
wamt.Box.prototype.setBehaviour = function(behaviour)
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
wamt.Box.prototype.addEventListener = function(type,bind)
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
wamt.Box.prototype.processEvent = function(type,holder)
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
wamt.Box.prototype.destroy = function()
{
	this.scene.removeObject(this);
};
