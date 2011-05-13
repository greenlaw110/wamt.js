/*
	wamt.js/light.js
	@author Zack0Wack0/http://zack0wack0.com
*/
/*
	@class The Light is a renderable object that renders a radial gradient filled circle and optionally causes other renderables to shadow-cast.
	@param {Array} color An RGBA array of colours to use for the light's center.
	@param {Number} intensity The intensity (radius) of the object.
	@param {Number} x The x-position of the object.
	@param {Number} y The y-position of the object.
*/
wamt.Light = function(color,intensity,x,y)
{
	this.events = [];
	this.collideable = false;
	this.x = typeof(x) == "undefined" ? 0 : x;
	this.y = typeof(y) == "undefined" ? 0 : y;
	this.velocity = [0,0];
	this.screenX = this.x;
	this.screenY = this.y;
	this.intensity = intensity;
	this.color = color;
	this.visible = true;
	this.opacity = 1;
	this.computeBounds();
};
wamt.Light.prototype.constructor = wamt.Light;
/*
	@function
	@description Compute the bounds of the object, from the intensity (radius).
*/
wamt.Light.prototype.computeBounds = function()
{
	this.bounds = [this.intensity * 2,this.intensity * 2];
};
/*
	@function
	@description Set whether the object is visible.
	@param {Bool} visible Is the object visible?
*/
wamt.Light.prototype.setVisible = function(visible)
{
	this.visible = visible;
	this.scene.updated = true;
};
/*
	@function
	@description Process the object's logic. (handles velocity, behaviours, etc)
	@param {Scene} scene The parent scene processing logic.
*/
wamt.Light.prototype.logic = function(scene,layer,view)
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
wamt.Light.prototype.tick = function(scene,layer,view)
{
	var hasBehaviour = typeof(this.behaviour) != "undefined";
	if(hasBehaviour)
		this.behaviour.pretick(this);
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
		var objects = layer.objects;
		for(var i=0;i<objects.length;i++)
		{
			var object = objects[i];
			if(!object.shadowcast)
				continue;
			var distx = object.x - this.x;
			var disty = object.y - this.y;
			if(Math.abs(distx) > this.intensity * 1.5 || Math.abs(disty) > this.intensity * 1.5)
			{
				object.setShadow(0,0,0,"rgba(0,0,0,0");
				continue;
			}
			var mult = 0.3 / this.intensity;
			var offx = distx * mult * object.bounds[0];
			var offy = disty * mult * object.bounds[1];
			object.setShadow(offx,offy,this.intensity * mult,"rgba(0,0,0,0.35)");
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
wamt.Light.prototype.render = function(view)
{
	var hasBehaviour = typeof(this.behaviour) != "undefined";
	if(hasBehaviour)
		this.behaviour.prerender(this);
	var context = view.context;
	var gradient = context.createRadialGradient(this.screenX,this.screenY,0,this.screenX,this.screenY,this.intensity);
	gradient.addColorStop(0,this.color);
	gradient.addColorStop(1,"rgba(0,0,0,0)");
	context.fillStyle = gradient;
	context.beginPath();
	context.arc(this.screenX,this.screenY,this.intensity,0,Math.PI * 2,false);
	context.fill();
	context.fillStyle = "";
	if(hasBehaviour)
		this.behaviour.render(this);
	this.processEvent("render",{object: this,view: view});
};
/*
	@function
	@description Set the light's center colour.
	@param {Number} r The red colour value.
	@param {Number} g The green colour value.
	@param {Number} b The blue colour value.
	@param {Number} a The alpha colour value.
*/
wamt.Light.prototype.setColor = function(r,g,b,a)
{
	if(r instanceof Array)
		this.color = r;
	else
		this.color = [r,g,b,a];
	this.scene.updated = true;
};
/*
	@function
	@description Set the light's intensity (radius).
	@param {Number} intensity The intensity.
*/
wamt.Light.prototype.setIntensity = function(intensity)
{
	if(intensity < 1)
		intensity = 1;
	this.intensity = intensity;
	this.computeBounds();
	this.scene.updated = true;
};
/*
	@function
	@description Intensify the light. (enlarge radius)
	@param {Number} intensity The amount to intensify by.
*/
wamt.Light.prototype.intensify = function(intensity)
{
	this.intensity += intensity;
	if(this.intensity < 1)
		this.intensity = 1;
	this.computeBounds();
	this.scene.updated = true;
};
/*
	@function
	@description Set the opacity of the object.
	@param {Number} opacity The new opacity of the object.
*/
wamt.Light.prototype.setOpacity = function(opacity)
{
	this.opacity = opacity;
	this.scene.updated = true;
};
/*
	@function
	@description Set the x-position of the object.
	@param {Number} x The x-position.
*/
wamt.Light.prototype.setX = function(x)
{
	this.x = x;
	this.scene.updated = true;
};
/*
	@function
	@description Set the y-position of the object.
	@param {Number} y The y-position.
*/
wamt.Light.prototype.setY = function(y)
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
wamt.Light.prototype.setPosition = function(x,y)
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
wamt.Light.prototype.snap = function(x,y)
{
	this.translate(-(this.x % x),-(this.y % y));
};
/*
	@function
	@description Translate the object (move) on the x-axis.
	@param {Number} x The x-offset.
*/
wamt.Light.prototype.translateX = function(x)
{
	this.x += x;
	this.scene.updated = true;
};
/*
	@function
	@description Translate the object (move) on the y-axis.
	@param {Number} y The y-offset.
*/
wamt.Light.prototype.translateY = function(y)
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
wamt.Light.prototype.translate = function(x,y)
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
wamt.Light.prototype.setVelocity = function(x,y)
{
	this.velocity = [x,y];
	this.scene.updated = true;
};
/*
	@function
	@description Stop the object's velocity.
*/
wamt.Light.prototype.stop = function()
{
	this.velocity = [0,0];
	this.scene.updated = true;
};
/*
	@function
	@description Set the object's behaviour.
	@param {Object} The behaviour manager. (eg. wamt.behaviours.projectile)
*/
wamt.Light.prototype.setBehaviour = function(behaviour)
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
wamt.Light.prototype.addEventListener = function(type,bind)
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
wamt.Light.prototype.processEvent = function(type,holder)
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
wamt.Light.prototype.destroy = function()
{
	this.scene.removeObject(this);
};
