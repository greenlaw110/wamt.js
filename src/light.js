/*
	@title light.js
	@author Zack0Wack0/zack0wack0.com
	@package wamt.js
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
wamt.Light.prototype.computeBounds = function()
{
	this.bounds = [this.intensity * 2,this.intensity * 2];
};
wamt.Light.prototype.setVisible = function(visible)
{
	this.visible = visible;
	this.scene.updated = true;
};
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
wamt.Light.prototype.setColor = function(red,green,blue,alpha)
{
	this.color = [red,green,blue,alpha];
	this.scene.updated = true;
};
wamt.Light.prototype.setIntensity = function(intensity)
{
	this.intensity = intensity;
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Light.prototype.intensify = function(intensity)
{
	this.intensity += intensity;
	if(this.intensity < 1)
		this.intensity = 1;
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Light.prototype.setOpacity = function(opacity)
{
	this.opacity = opacity;
	this.scene.updated = true;
};
wamt.Light.prototype.setX = function(x)
{
	this.x = x;
	this.scene.updated = true;
};
wamt.Light.prototype.setY = function(y)
{
	this.y = y;
	this.scene.updated = true;
};
wamt.Light.prototype.setPosition = function(x,y)
{
	this.x = x;
	this.y = y;
	this.scene.updated = true;
};
wamt.Light.prototype.snap = function(x,y)
{
	this.translate(-(this.x % x),-(this.y % y));
};
wamt.Light.prototype.translateX = function(x)
{
	this.x += x;
	this.scene.updated = true;
};
wamt.Light.prototype.translateY = function(y)
{
	this.y += y;
	this.scene.updated = true;
};
wamt.Light.prototype.translate = function(x,y)
{
	this.x += x;
	this.y += y;
	this.scene.updated = true;
};
wamt.Light.prototype.setVelocity = function(x,y)
{
	this.velocity = [x,y];
	this.scene.updated = true;
};
wamt.Light.prototype.setBehaviour = function(behaviour)
{
	this.behaviour = behaviour;
	behaviour.init(this);
	this.scene.updated = true;
};
wamt.Light.prototype.addEventListener = function(type,bind)
{
	var e = this.events[type];
	if(typeof(e) == "undefined")
		this.events[type] = [];
	this.events[type].push(bind);
};
wamt.Light.prototype.processEvent = function(type,holder)
{
	var e = this.events[type];
	if(typeof(e) != "undefined")
	{
		for(var i=0;i<e.length;i++)
			e[i](holder);
	}
};
wamt.Light.prototype.destroy = function()
{
	this.scene.removeObject(this);
};