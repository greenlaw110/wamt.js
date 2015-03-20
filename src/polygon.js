/*
	wamt.js/polygon.js
	@author Zack0Wack0/http://zack0wack0.com
*/
/*
	@class The Polygon is a renderable object that renders an array of vertices.
	@param {String} style The colour style.
	@param {Array} vertices An array of 2-tuple vertices.
	@param {Number} x The x-position of the object.
	@param {Number} y The y-position of the object.
	@param {Number} angle The angle of the object.
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
/*
	@function
	@description Compute the bounds of the object, by rotating the vertices based on angle.
*/
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
wamt.Polygon.prototype.update = function()
{
	if(typeof(this.scene) != "undefined")
		this.scene.updated = true;
};
/*
	@function
	@description Set whether the object is colliding.
	@param {Bool} colliding Is the object colliding?
*/
wamt.Polygon.prototype.setColliding = function(colliding)
{
	this.collideable = colliding;
	this.update();
};
/*
	@function
	@description Set whether the object is visible.
	@param {Bool} visible Is the object visible?
*/
wamt.Polygon.prototype.setVisible = function(visible)
{
	this.visible = visible;
	this.update();
};
/*
	@function
	@description Set whether the object is hollow.
	@param {Bool} hollow Is the object hollow?
*/
wamt.Polygon.prototype.setHollow = function(hollow)
{
	this.hollow = hollow;
	this.update();
};
/*
	@function
	@description Process the object's logic. (handles velocity, behaviours, etc)
	@param {Scene} scene The parent scene processing logic.
*/
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
/*
	@function
	@description Process the object's screen position and other misc. stuff (behaviours)
	@param {Scene} scene The parent scene.
	@param {Layer} layer The parent layer.
	@param {View} view The parent view.
*/
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
/*
	@function
	@description Render the object to the screen.
	@param {View} view The view to render the object into.
*/
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
/*
	@function
	@description Set the object's vertex array.
	@param {Array} vertices The array of 2-tuple vertices.
*/
wamt.Polygon.prototype.setVertices = function(vertices)
{
	this.vertices = vertices;
	this.computeBounds();
	this.update();
};
/*
	@function
	@description Stretch the object on the x-axis.
	@param {Number} x The amount to stretch on the x-axis.
*/
wamt.Polygon.prototype.stretchX = function(x)
{
	var vertices = this.vertices;
	for(var i=0;i<vertices.length;i++)
	{
		var vertice = vertices[i];
		vertice[0] += x;
	}
	this.computeBounds();
	this.update();
};
/*
	@function
	@description Stretch the object on the y-axis.
	@param {Number} y The amount to stretch on the y-axis.
*/
wamt.Polygon.prototype.stretchY = function(y)
{
	var vertices = this.vertices;
	for(var i=0;i<vertices.length;i++)
	{
		var vertice = vertices[i];
		vertice[1] += y;
	}
	this.computeBounds();
	this.update();
};
/*
	@function
	@description Stretch the object on the axi.
	@param {Number} x The amount to stretch on the x-axis.
	@param {Number} y The amount to stretch on the y-axis.
*/
wamt.Polygon.prototype.stretch = function(x,y)
{
	var vertices = this.vertices;
	for(var i=0;i<vertices.length;i++)
	{
		var vertice = vertices[i];
		vertice[0] += x;
		vertice[1] += y;
	}
	this.computeBounds();
	this.update();
};
/*
	@function
	@description Set the colour style of the object.
	@param {String} style The colour style.
*/
wamt.Polygon.prototype.setStyle = function(style)
{
	this.style = style;
	this.update();
};
/*
	@function
	@description Set the shadow of the object.
	@param {Number} offsetx The x-offset of the shadow.
	@param {Number} offsety The y-offset of the shadow.
	@param {Number} blur The blur radius of the shadow.
	@param {String} color The colour of the shadow.
*/
wamt.Polygon.prototype.setShadow = function(offsetx,offsety,blur,color)
{
	this.shadow = [offsetx,offsety,blur,color];
	this.update();
};
/*
	@function
	@description Set whether the object is shadowcasting.
	@param {Bool} shadowcast Is the object shadowcasting?
*/
wamt.Polygon.prototype.setShadowCasting = function(shadowcast)
{
	this.shadowcast = shadowcast;
	this.update();
};
/*
	@function
	@description Set the opacity of the object.
	@param {Number} opacity The new opacity of the object.
*/
wamt.Polygon.prototype.setOpacity = function(opacity)
{
	this.opacity = opacity;
	this.update();
};
/*
	@function
	@description Set the x-position of the object.
	@param {Number} x The x-position.
*/
wamt.Polygon.prototype.setX = function(x)
{
	this.x = x;
	this.update();
};
/*
	@function
	@description Set the y-position of the object.
	@param {Number} y The y-position.
*/
wamt.Polygon.prototype.setY = function(y)
{
	this.y = y;
	this.update();
};
/*
	@function
	@description Set the position of the object.
	@param {Number} x The x-position.
	@param {Number} y The y-position.
*/
wamt.Polygon.prototype.setPosition = function(x,y)
{
	this.x = x;
	this.y = y;
	this.update();
};
/*
	@function
	@description Snap the object to a grid.
	@param {Number} x The width of the grid blocks.
	@param {Number} y The height of the grid blocks.
*/
wamt.Polygon.prototype.snap = function(x,y)
{
	this.translate(-(this.x % x),-(this.y % y));
};
/*
	@function
	@description Translate the object (move) on the x-axis.
	@param {Number} x The x-offset.
*/
wamt.Polygon.prototype.translateX = function(x)
{
	this.x += x;
	this.update();
};
/*
	@function
	@description Translate the object (move) on the y-axis.
	@param {Number} y The y-offset.
*/
wamt.Polygon.prototype.translateY = function(y)
{
	this.y += y;
	this.update();
};
/*
	@function
	@description Translate the object (move).
	@param {Number} x The x-offset.
	@param {Number} y The y-offset.
*/
wamt.Polygon.prototype.translate = function(x,y)
{
	this.x += x;
	this.y += y;
	this.update();
};
/*
	@function
	@description Set the velocity of the object.
	@param {Number} x The x-axis pixels per logic speed.
	@param {Number} y The y-axis pixels per logic speed.
*/
wamt.Polygon.prototype.setVelocity = function(x,y)
{
	this.velocity = [x,y];
	this.update();
};
/*
	@function
	@description Stop the object's velocity.
*/
wamt.Polygon.prototype.stop = function()
{
	this.velocity = [0,0];
	this.update();
};
/*
	@function
	@description Set the object's rotation.
	@param {Number} angle The new rotation/angle. (degrees)
*/
wamt.Polygon.prototype.setAngle = function(angle)
{
	this.angle = angle % 360;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.update();
};
/*
	@function
	@description Rotate the object.
	@param {Number} angle The angle offset to rotate by. (degrees)
*/
wamt.Polygon.prototype.rotate = function(angle)
{
	this.angle += angle;
	this.angle %= 360;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.update();
};
/*
	@function
	@description Set the object's behaviour.
	@param {Object} The behaviour manager. (eg. wamt.behaviours.projectile)
*/
wamt.Polygon.prototype.setBehaviour = function(behaviour)
{
	this.behaviour = behaviour;
	if(typeof(behaviour) != "undefined")
		behaviour.init(this);
	this.update();
};
/*
	@function
	@description Add an event listener to the object.
	@param {String} type The type of event.
	@param {Function} bind The callback for the event.
*/
wamt.Polygon.prototype.addEventListener = function(type,bind)
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
wamt.Polygon.prototype.processEvent = function(type,holder)
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
wamt.Polygon.prototype.destroy = function()
{
	this.scene.removeObject(this);
};
