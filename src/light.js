/*
	@title light.js
	@author Zack0Wack0/zack0wack0.com
	@package wamt.js
*/
wamt.Light = function(color,intensity,x,y)
{
	this.collideable = false;
	this.x = typeof(x) == "undefined" ? 0 : x;
	this.y = typeof(y) == "undefined" ? 0 : y;
	this.screenX = this.x;
	this.screenY = this.y;
	this.intensity = intensity;
	this.color = color;
	this.computeBounds();
};
wamt.Light.prototype.constructor = wamt.Light;
wamt.Light.prototype.computeBounds = function()
{
	this.bounds = [this.intensity * 2,this.intensity * 2];
};
wamt.Light.prototype.tick = function(scene,layer,view)
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
		for(var i=0;i<layer.objects.length;i++)
		{
			var object = layer.objects[i];
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
};
wamt.Light.prototype.render = function(view)
{
	var gradient = view.context.createRadialGradient(this.screenX,this.screenY,0,this.screenX,this.screenY,this.intensity);
	gradient.addColorStop(0,this.color);
	gradient.addColorStop(1,"rgba(0,0,0,0)");
	view.context.fillStyle = gradient;
	view.context.beginPath();
	view.context.arc(this.screenX,this.screenY,this.intensity,0,Math.PI * 2,false);
	view.context.fill();
	view.context.fillStyle = "";
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
	if(wamt.settings.smoothing)
		intensity *= wamt.delta * 0.1;
	this.intensity += intensity;
	if(this.intensity < 1)
		this.intensity = 1;
	this.computeBounds();
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
wamt.Light.prototype.translateX = function(x)
{
	if(wamt.settings.smoothing)
		x *= wamt.delta * 0.1;
	this.x += x;
	this.scene.updated = true;
};
wamt.Light.prototype.translateY = function(y)
{
	if(wamt.settings.smoothing)
		y *= wamt.delta * 0.1;
	this.y += y;
	this.scene.updated = true;
};
wamt.Light.prototype.translate = function(x,y)
{
	if(wamt.settings.smoothing)
		x *= wamt.delta * 0.1;
	if(wamt.settings.smoothing)
		y *= wamt.delta * 0.1;
	this.x += x;
	this.y += y;
	this.scene.updated = true;
};