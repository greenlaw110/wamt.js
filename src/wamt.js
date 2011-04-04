/*
	@title wamt.js
	@author Zack0Wack0/zack0wack0.com
	@package wamt.js
*/
var wamt = {};
wamt.support = {};
wamt.support.canvas = typeof(window.CanvasRenderingContext2D) != "undefined";
wamt.support.ajax = typeof(window.XMLHttpRequest) != "undefined";
wamt.support.socket = typeof(window.WebSocket) != "undefined";
wamt.support.local = typeof(localStorage) != "undefined";
wamt.support.light = typeof(window.CanvasRenderingContext2D.prototype.createRadialGradient) != "undefined" && typeof(window.CanvasRenderingContext2D.prototype.setShadow) != "undefined";
wamt.settings = {};
wamt.settings.culling = true;
wamt.settings.smoothing = true;
wamt.time = new Date();
wamt.delta = 0;
wamt.fps = 0;
Math["radians"] = function(degrees)
{
	return degrees * Math.PI / 180;
};
window.requestAnimationFrame = 
(
	function()
	{
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback,element)
		{
			window.setTimeout(callback,1000 / 60);
		};
    }
)();
wamt.collisionPointTest = function(scene,view,x,y)
{
	var collisions = [];
	for(var i=0;i<scene.objects.length;i++)
	{
		var object = scene.objects[i];
		if(!object.collideable)
			continue;
		if((x >= object.screenX - (object.bounds[0] * 2) && x <= object.screenX + (object.bounds[0] * 2)) && (y >= object.screenY - (object.bounds[1] * 2) && y <= object.screenY + (object.bounds[1] * 2)))
			collisions.push(object);
	}
	return collisions;
};
wamt.render = function(scene,view)
{
	var now = new Date();
	wamt.delta = now - wamt.time;
	wamt.fps = Math.round(1000 / wamt.delta);
	wamt.time = now;
	if(scene.updated || view.updated)
	{
		view.clearCanvas();
		view.renderBackdrop();
		if(typeof(view.target) != "undefined")
		{
			view.x = view.target.x;
			view.y = view.target.y;
			view.angle = view.target.angle;
			view.radians = view.target.radians;
		}
		var ix = view.canvas.width;
		var iy = view.canvas.height;
		for(var j=0;j<scene.layers.length;j++)
		{
			var layer = scene.layers[j];
			view.context.globalCompositeOperation = layer.composite;
			view.context.globalAlpha = layer.opacity;
			for(var i=0;i<layer.objects.length;i++)
			{
				var object = layer.objects[i];
				object.tick(scene,layer,view);
				if(typeof(object.render) == "undefined")
					continue;
				var ox = object.screenX + object.bounds[0];
				var oy = object.screenY + object.bounds[1];
				var cx = ix + (object.bounds[0] * 2);
				var cy = iy + (object.bounds[1] * 2);
				if((ox >= -cx && ox <= cx) && (oy >= -cy && oy <= cy) || !wamt.settings.culling)
					object.render(view);
			}
		}
		scene.updated = false;
		view.updated = false;
	}
	else
	{
		for(var j=0;j<scene.layers.length;j++)
		{
			var layer = scene.layers[j];
			for(var i=0;i<layer.objects.length;i++)
			{
				var object = layer.objects[i];
				object.tick(scene,layer,view);
			}
		}
	}
};
wamt.Layer = function(scene,index)
{
	this.scene = scene;
	this.index = index;
	this.objects = [];
	this.opacity = 1;
	this.composite = "source-over";
	this.locked = false;
};
wamt.Layer.prototype.constructor = wamt.Layer;
wamt.Layer.prototype.addObject = function(object)
{
	object.scene = this.scene;
	object.layer = this;
	this.objects.push(object);
};
wamt.Layer.prototype.setOpacity = function(opacity)
{
	this.opacity = opacity;
	this.scene.updated = true;
};
wamt.Layer.prototype.setCompositeOperation = function(type)
{
	this.composite = type;
	this.scene.updated = true;
};
wamt.Layer.prototype.setLocked = function(locked)
{
	this.locked = locked;
	this.scene.updated = true;
};
wamt.Scene = function()
{
	this.updated = false;
	this.layers = [];
};
wamt.Scene.prototype.constructor = wamt.Scene;
wamt.Scene.prototype.getLayer = function(index)
{
	var l;
	for(var i=0;i<this.layers.length;i++)
	{
		var layer = this.layers[i];
		if(layer.index == index)
		{
			l = layer;
			break;
		}
	}
	return l;
};
wamt.Scene.prototype.createLayer = function(index)
{
	var layer = new wamt.Layer(this,index);
	this.layers.push(layer);
	this.layers.sort(
						function(a,b)
						{
							if(a.index < b.index)
								return -1;
							if(a.index > b.index)
								return 1;
							else
								return 0;
						}
					);
	return layer;
};
wamt.Scene.prototype.addObject = function(object,layer)
{
	layer = typeof(layer) == "number" ? layer : 0;
	tlayer = this.getLayer(layer);
	if(typeof(tlayer) == "undefined")
		var tlayer = this.createLayer(layer);
	tlayer.addObject(object);
	if(typeof(object.render) != "undefined")
		this.updated = true;
};
wamt.Scene.prototype.clearLayers = function()
{
	this.layers = [];
};
wamt.View = function(canvas,x,y)
{
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.x = typeof(x) == "undefined" ? canvas.width / 2 : x;
	this.y = typeof(y) == "undefined" ? canvas.height / 2 : y;
};
wamt.View.prototype.constructor = wamt.View;
wamt.View.prototype.addEventListener = function(type,bind)
{
	switch(type)
	{
		case "mousemove":
			this.canvas.addEventListener("mousemove",function(event)
			{
				event.view = this;
				event.context = this.view;
				bind(event);
			});
			break;
		case "mousedown":
			this.canvas.addEventListener("mousedown",function(event)
			{
				event.view = this;
				event.context = this.view;
				bind(event);
			});
			break;
		case "mouseup":
			this.canvas.addEventListener("mouseup",function(event)
			{
				event.view = this;
				event.context = this.view;
				bind(event);
			});
			break;
		case "click":
			this.canvas.addEventListener("click",function(event)
			{
				event.view = this;
				event.context = this.view;
				bind(event);
			});
			break;
	}
};
wamt.View.prototype.setBackdrop = function(value)
{
	this.backdrop = value;
};
wamt.View.prototype.renderBackdrop = function()
{
	if(typeof(this.backdrop) == "undefined")
		return;
	if(this.backdrop instanceof Image)
		this.context.drawImage(this.backdrop,0,0,this.canvas.width,this.canvas.height);
	else
	{
		this.context.fillStyle = this.backdrop;
		this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
		this.context.fillStyle = "";
	}
};
wamt.View.prototype.setCanvas = function(canvas)
{
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
};
wamt.View.prototype.clearCanvas = function()
{
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
};
wamt.View.prototype.setTarget = function(target)
{
	this.target = target;
};
wamt.View.prototype.setX = function(x)
{
	this.x = x;
	this.updated = true;
};
wamt.View.prototype.setY = function(y)
{
	this.y = y;
	this.updated = true;
};
wamt.View.prototype.setPosition = function(x,y)
{
	this.x = x;
	this.y = y;
	this.updated = true;
};
wamt.View.prototype.translateX = function(x)
{
	if(wamt.settings.smoothing)
		x *= wamt.delta * 0.1;
	this.x += x;
	this.updated = true;
};
wamt.View.prototype.translateY = function(y)
{
	if(wamt.settings.smoothing)
		y *= wamt.delta * 0.1;
	this.y += y;
	this.updated = true;
};
wamt.View.prototype.translate = function(x,y)
{
	if(wamt.settings.smoothing)
		x *= wamt.delta * 0.1;
	if(wamt.settings.smoothing)
		y *= wamt.delta * 0.1;
	this.x += x;
	this.y += y;
	this.updated = true;
};