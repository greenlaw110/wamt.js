/*
	@title box.js
	@author Zack0Wack0/zack0wack0.com
	@package wamt.js
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
wamt.Box.prototype.logic = function(scene)
{
	if(typeof(this.behaviour) != "undefined")
		this.behaviour.prelogic(this);
	if(this.velocity[0] != 0 || this.velocity[1] != 0)
	{
		if(typeof(this.behaviour) != "undefined")
			this.behaviour.velocity(this);
		else
			this.translate(this.velocity[0],this.velocity[1]);
	}
	if(typeof(this.behaviour) != "undefined")
		this.behaviour.logic(this);
	this.processEvent("logic",{object:this,scene:scene});
};
wamt.Box.prototype.tick = function(scene,layer,view)
{
	if(typeof(this.behaviour) != "undefined")
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
	}
	if(typeof(this.behaviour) != "undefined")
		this.behaviour.tick(this);
	this.processEvent("tick",{object:this,scene:scene,layer:layer,view:view});
};
wamt.Box.prototype.render = function(view)
{
	if(typeof(this.behaviour) != "undefined")
		this.behaviour.prerender(this);
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
	if(typeof(this.behaviour) != "undefined")
		this.behaviour.render(this);
	this.processEvent("render",{object: this,view: view});
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
wamt.Box.prototype.snap = function(x,y)
{
	this.translate(-(this.x % x),-(this.y % y));
};
wamt.Box.prototype.translateX = function(x)
{
	this.x += x;
	this.scene.updated = true;
};
wamt.Box.prototype.translateY = function(y)
{
	this.y += y;
	this.scene.updated = true;
};
wamt.Box.prototype.translate = function(x,y)
{
	this.x += x;
	this.y += y;
	this.scene.updated = true;
};
wamt.Box.prototype.setVelocity = function(x,y)
{
	this.velocity = [x,y];
	this.scene.updated = true;
};
wamt.Box.prototype.stop = function()
{
	this.velocity = [0,0];
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
	this.width += width;
	if(this.width < 1)
		this.width = 1;
	this.computeBounds();
	this.scene.updated = true;
}
wamt.Box.prototype.stretchY = function(height)
{
	this.height += height;
	if(this.height < 1)
		this.height = 1;
	this.computeBounds();
	this.scene.updated = true;
}
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
}
wamt.Box.prototype.setAngle = function(angle)
{
	this.angle = angle % 360;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Box.prototype.rotate = function(angle)
{
	this.angle += angle;
	this.angle %= 360;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Box.prototype.setBehaviour = function(behaviour)
{
	this.behaviour = behaviour;
	behaviour.init(this);
	this.scene.updated = true;
};
wamt.Box.prototype.addEventListener = function(type,bind)
{
	var e = this.events[type];
	if(typeof(e) == "undefined")
		this.events[type] = [];
	this.events[type].push(bind);
};
wamt.Box.prototype.processEvent = function(type,holder)
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
wamt.Box.prototype.destroy = function()
{
	this.scene.removeObject(this);
};