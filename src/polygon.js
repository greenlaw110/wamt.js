/*
	@title polygon.js
	@author Zack0Wack0/zack0wack0.com
	@package wamt.js
*/
wamt.Polygon = function(style,vertices,x,y,angle)
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
	this.vertices = vertices;
	this.style = style;
	this.shadow = [0,0,0,"rgba(0,0,0,0)"];
	this.shadowcast = false;
	this.visible = true;
	this.opacity = 1;
	this.computeBounds();
};
wamt.Polygon.prototype.constructor = wamt.Polygon;
wamt.Polygon.prototype.computeBounds = function()
{
	var minx = 0;
	var miny = 0;
	var maxx = 0;
	var maxy = 0;
	for(var i=0;i<this.vertices.length;i++)
	{
		var vertice = this.vertices[i];
		var tminx = Math.min(minx,vertice[0]);
		var tminy = Math.min(miny,vertice[0]);
		var tmaxx = Math.max(maxx,vertice[1]);
		var tmaxy = Math.max(maxy,vertice[1]);
		minx = tminx < minx ? tminx : minx;
		miny = tminy < miny ? tminy : miny;
		maxx = tmaxx > maxx ? tmaxx : maxx;
		maxy = tmaxy > maxy ? tmaxy : maxy;
	}
	if(this.angle)
		this.bounds = [Math.abs(Math.cos(this.angle) * (maxx - minx)),Math.abs(Math.sin(this.angle) * (maxy - miny))];
	else
		this.bounds = [maxx - minx,maxy - miny];
};
wamt.Polygon.prototype.setColliding = function(colliding)
{
	this.collideable = colliding;
	this.scene.updated = true;
};
wamt.Polygon.prototype.setVisible = function(visible)
{
	this.visible = visible;
	this.scene.updated = true;
};
wamt.Polygon.prototype.setHollow = function(hollow)
{
	this.hollow = hollow;
	this.scene.updated = true;
};
wamt.Polygon.prototype.logic = function(scene)
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
wamt.Polygon.prototype.tick = function(scene,layer,view)
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
wamt.Polygon.prototype.render = function(view)
{
	var hasBehaviour = typeof(this.behaviour) != "undefined";
	if(hasBehaviour)
		this.behaviour.prerender(this);
	var radians = this.radians;
	var context = view.context;
	context.fillStyle = this.style;
	context.strokeStyle = this.style;
	context.shadowOffsetX = this.shadow[0];
	context.shadowOffsetY = this.shadow[1];
	context.shadowBlur = this.shadow[2];
	context.shadowColor = this.shadow[3];
	var vertices = this.vertices;
	if(radians == 0)
	{
		context.beginPath();
		for(var i=0;i<vertices.length;i++)
		{
			var vertice = vertices[i];
			context.lineTo(this.screenX + vertice[0],this.screenY + vertice[1]);
		}
		if(this.hollow)
			context.stroke();
		else
			context.fill();
	}
	else
	{
		var transx = (this.width / 2) + this.screenX;
		var transy = (this.height / 2) + this.screenY;
		context.save();
		context.translate(transx,transy);
		context.rotate(radians);
		context.translate(-transx,-transy);
		context.beginPath();
		for(var i=0;i<vertices.length;i++)
		{
			var vertice = vertices[i];
			context.lineTo(this.screenX + vertice[0],this.screenY + vertice[1]);
		}
		if(this.hollow)
			context.stroke();
		else
			context.fill();
		context.restore();
	}
	context.fillStyle = "";
	context.strokeStyle = "";
	context.shadowOffsetX = "";
	context.shadowOffsetY = "";
	context.shadowBlur = "";
	context.shadowColor = "";
	if(hasBehaviour)
		this.behaviour.render(this);
	this.processEvent("render",{object: this,view: view});
};
wamt.Polygon.prototype.setStyle = function(style)
{
	this.style = style;
	this.scene.updated = true;
};
wamt.Polygon.prototype.setShadow = function(offsetx,offsety,blur,color)
{
	this.shadow = [offsetx,offsety,blur,color];
	this.scene.updated = true;
};
wamt.Polygon.prototype.setShadowCasting = function(shadowcast)
{
	this.shadowcast = shadowcast;
	this.scene.updated = true;
};
wamt.Polygon.prototype.setOpacity = function(opacity)
{
	this.opacity = opacity;
	this.scene.updated = true;
};
wamt.Polygon.prototype.setX = function(x)
{
	this.x = x;
	this.scene.updated = true;
};
wamt.Polygon.prototype.setY = function(y)
{
	this.y = y;
	this.scene.updated = true;
};
wamt.Polygon.prototype.setPosition = function(x,y)
{
	this.x = x;
	this.y = y;
	this.scene.updated = true;
};
wamt.Polygon.prototype.snap = function(x,y)
{
	this.translate(-(this.x % x),-(this.y % y));
};
wamt.Polygon.prototype.translateX = function(x)
{
	this.x += x;
	this.scene.updated = true;
};
wamt.Polygon.prototype.translateY = function(y)
{
	this.y += y;
	this.scene.updated = true;
};
wamt.Polygon.prototype.translate = function(x,y)
{
	this.x += x;
	this.y += y;
	this.scene.updated = true;
};
wamt.Polygon.prototype.setVelocity = function(x,y)
{
	this.velocity = [x,y];
	this.scene.updated = true;
};
wamt.Polygon.prototype.stop = function()
{
	this.velocity = [0,0];
	this.scene.updated = true;
};
wamt.Polygon.prototype.setVertices = function(vertices)
{
	this.vertices = vertices;
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Polygon.prototype.stretchX = function(x)
{
	var vertices = this.vertices;
	for(var i=0;i<vertices.length;i++)
	{
		vertice = vertices[i];
		vertice[0] += x;
	}
	this.computeBounds();
	this.scene.updated = true;
}
wamt.Polygon.prototype.stretchY = function(y)
{
	var vertices = this.vertices;
	for(var i=0;i<vertices.length;i++)
	{
		vertice = vertices[i];
		vertice[1] += y;
	}
	this.computeBounds();
	this.scene.updated = true;
}
wamt.Polygon.prototype.stretch = function(x,y)
{
	var vertices = this.vertices;
	for(var i=0;i<vertices.length;i++)
	{
		vertice = vertices[i];
		vertice[0] += x;
		vertice[1] += y;
	}
	this.computeBounds();
	this.scene.updated = true;
}
wamt.Polygon.prototype.setAngle = function(angle)
{
	this.angle = angle % 360;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Polygon.prototype.rotate = function(angle)
{
	this.angle += angle;
	this.angle %= 360;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Polygon.prototype.setBehaviour = function(behaviour)
{
	this.behaviour = behaviour;
	if(typeof(behaviour.init) != "undefined")
		behaviour.init(this);
	this.scene.updated = true;
};
wamt.Polygon.prototype.addEventListener = function(type,bind)
{
	var e = this.events[type];
	if(typeof(e) == "undefined")
		this.events[type] = [];
	this.events[type].push(bind);
};
wamt.Polygon.prototype.processEvent = function(type,holder)
{
	var e = this.events[type];
	if(typeof(e) != "undefined")
	{
		for(var i=0;i<e.length;i++)
			e[i](holder);
	}
};
wamt.Polygon.prototype.destroy = function()
{
	this.scene.removeObject(this);
};