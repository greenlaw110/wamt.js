/*
	wamt.js/wamt.js [ENGINE]
	@author Zack0Wack0/http://zack0wack0.com
*/
var wamt =
{
	time: new Date(),
	delta: 0,
	fps: 0
};
wamt.behaviours = {};
wamt.support = 
{
	canvas: typeof(window.CanvasRenderingContext2D) != "undefined",
	light: typeof(window.CanvasRenderingContext2D.prototype.createRadialGradient) != "undefined" && typeof(window.CanvasRenderingContext2D.prototype.setShadow) != "undefined"
};
wamt.settings = 
{
	culling: true
};
Math["radians"] = function(degrees)
{
	return degrees * Math.PI / 180;
};
Math["degrees"] = function(radians)
{
	return radians * 180 / Math.PI;
};
/*
	@function
	@description Requests the window to schedule a good time to render the next frame.
*/
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
/*
	@function
	@description Start the logic tick for a scene.
	@param {Scene} scene The scene.
*/
wamt.play = function(scene)
{
	var ts = scene;
	scene.worker = setInterval
	(
		function()
		{
			ts.logic();
		},
		1000 / 60
	);
};
/*
	@function
	@description Stop the logic tick for a scene.
	@param {Scene} scene The scene.
*/
wamt.pause = function(scene)
{
	clearInterval(scene.worker);
};
/*
	@function
	@description Process the scene & view. (render & tick objects)
	@param {Scene} scene The scene.
	@param {View} view The view to render into.
*/
wamt.process = function(scene,view)
{
	var now = new Date();
	wamt.delta = now - wamt.time;
	wamt.fps = Math.round(1000 / wamt.delta);
	wamt.time = now;
	var layers = scene.layers;
	var canvas = view.canvas;
	var context = view.context;
	if(scene.updated || view.updated)
	{
		view.clearCanvas();
		view.renderBackdrop();
		var target = view.target;
		if(typeof(target) != "undefined")
		{
			view.x = target.x;
			view.y = target.y;
		}
		var ix = canvas.width;
		var iy = canvas.height;
		for(var j=0;j<layers.length;j++)
		{
			var layer = layers[j];
			context.globalCompositeOperation = layer.composite;
			var oldAlpha = layer.opacity;
			context.globalAlpha = oldAlpha;
			var objects = layer.objects;
			for(var i=0;i<objects.length;i++)
			{
				var object = objects[i];
				object.tick(scene,layer,view);
				if(typeof(object.render) == "undefined")
					continue;
				if(!object.visible)
					continue;
				var opacity = object.opacity;
				if(opacity != 1)
					context.globalAlpha = oldAlpha * opacity;
				if(!wamt.settings.culling)
					object.render(view);
				else
				{
					var ox = object.screenX + object.bounds[0];
					var oy = object.screenY + object.bounds[1];
					var cx = ix + (object.bounds[0] * 2);
					var cy = iy + (object.bounds[1] * 2);
					if((ox >= -cx && ox <= cx) && (oy >= -cy && oy <= cy))
						object.render(view);
				}
				context.globalAlpha = oldAlpha;
			}
			layer.processEvent("tick",{scene:scene,view:view});
			layer.processEvent("render",{scene:scene,view:view});
		}
		scene.processEvent("tick",{scene:scene,view:view});
		scene.processEvent("render",{scene:scene,view:view});
		scene.updated = false;
		view.updated = false;
	}
	else
	{
		for(var j=0;j<layers.length;j++)
		{
			var layer = layers[j];
			var objects = layer.objects;
			for(var i=0;i<objects.length;i++)
				objects[i].tick(scene,layer,view);
			layer.processEvent("tick",{scene:scene,view:view});
		}
		scene.processEvent("tick",{scene:scene,view:view});
	}
};
/*
	@class The Layer class is a container of objects used for rendering on a scene in a specific order.
	@param {Scene} scene The parent scene.
	@param {Number} index The layer's z-index.
*/
wamt.Layer = function(scene,index)
{
	this.events = [];
	this.scene = scene;
	this.index = index;
	this.objects = [];
	this.opacity = 1;
	this.composite = "source-over";
	this.locked = false;
};
wamt.Layer.prototype.constructor = wamt.Layer;
/*
	@function
	@description Add an object to the layer.
	@param {Object} object The object.
*/
wamt.Layer.prototype.addObject = function(object)
{
	object.scene = this.scene;
	object.layer = this;
	this.objects.push(object);
};
/*
	@function
	@description Remove an object from the layer.
	@param {Object} object The object.
*/
wamt.Layer.prototype.removeObject = function(obj)
{
	var objects = this.objects;
	objects.splice(objects.indexOf(obj),1);
	this.scene.updated = true;
};
/*
	@function
	@description Set a layer's global opacity.
	@param {Number} opacity The opacity.
*/
wamt.Layer.prototype.setOpacity = function(opacity)
{
	this.opacity = opacity;
	this.scene.updated = true;
};
/*
	@function
	@description Clear the layer's objects.
*/
wamt.Layer.prototype.clear = function()
{
	this.objects = [];
	this.scene.updated = true;
};
/*
	@function
	@description Set the layer's composite operation.
	@param {String} type The composite operation.
	@see https://developer.mozilla.org/en/Canvas_tutorial/Compositing
*/
wamt.Layer.prototype.setCompositeOperation = function(type)
{
	this.composite = type;
	this.scene.updated = true;
};
/*
	@function
	@description Set whether the layer is locked (locked means x-position = screen x-position & layer scrolls with the view)
	@param {Bool} locked Is the layer locked?
*/
wamt.Layer.prototype.setLocked = function(locked)
{
	this.locked = locked;
	this.scene.updated = true;
};
/*
	@function
	@description Add an event listener to the object.
	@param {String} type The type of event.
	@param {Function} bind The callback for the event.
*/
wamt.Layer.prototype.addEventListener = function(type,bind)
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
wamt.Layer.prototype.processEvent = function(type,holder)
{
	var e = this.events[type];
	if(typeof(e) != "undefined")
	{
		for(var i=0;i<e.length;i++)
			e[i](holder);
	}
};
/*
	@class The Scene is a container of objects and controls them.
*/
wamt.Scene = function()
{
	this.events = [];
	this.updated = false;
	this.time = new Date();
	this.layers = [];
};
wamt.Scene.prototype.constructor = wamt.Scene;
/*
	@function
	@description Get the layer at z-index.
	@param {Number} index The z-index.
*/
wamt.Scene.prototype.getLayer = function(index)
{
	var l;
	var layers = this.layers;
	for(var i=0;i<layers.length;i++)
	{
		var layer = layers[i];
		if(layer.index == index)
		{
			l = layer;
			break;
		}
	}
	return l;
};
/*
	@function
	@description Create a layer at z-index.
	@param {Number} index The z-index.
*/
wamt.Scene.prototype.createLayer = function(index)
{
	var layer = new wamt.Layer(this,index);
	var layers = this.layers;
	layers.push(layer);
	layers.sort
	(
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
/*
	@function
	@description Add an object to the scene.
	@param {Object} object The object.
	@param {Number} layer The z-index of the layer to add it to.
*/
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
/*
	@function
	@description Remove an object from the scene.
*/
wamt.Scene.prototype.removeObject = function(object)
{
	this.getLayer(object.layer.index).removeObject(object);
};
/*
	@function
	@description Clear all of the scene's objects.
*/
wamt.Scene.prototype.clear = function()
{
	this.layers = [];
	this.updated = true;
};
/*
	@function
	@description Process an entire scene's (and its object's) logic.
	@param {Scene} scene The scene.
*/
wamt.Scene.prototype.logic = function()
{
	var layers = this.layers;
	for(var j=0;j<layers.length;j++)
	{
		var layer = layers[j];
		var objects = layer.objects;
		for(var i=0;i<objects.length;i++)
		{
			var object = objects[i];
			object.logic(this);
		}
	}
	this.processEvent("logic",{scene:this});
};
/*
	@function
	@description Add an event listener to the object.
	@param {String} type The type of event.
	@param {Function} bind The callback for the event.
*/
wamt.Scene.prototype.addEventListener = function(type,bind)
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
wamt.Scene.prototype.processEvent = function(type,holder)
{
	var e = this.events[type];
	if(typeof(e) != "undefined")
	{
		for(var i=0;i<e.length;i++)
			e[i](holder);
	}
};
/*
	@class The View is like a camera, it renders the scene into a canvas. It also has a position, so it can scroll through the scene.
	@param {HTMLCanvasElement} canvas The canvas element.
	@param {Number} x The view's x-position.
	@param {Number} y The view's y-position.
*/
wamt.View = function(canvas,x,y)
{
	this.events = [];
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.x = typeof(x) == "undefined" ? canvas.width / 2 : x;
	this.y = typeof(y) == "undefined" ? canvas.height / 2 : y;
};
wamt.View.prototype.constructor = wamt.View;
/*
	@function
	@description Add an event listener to the object.
	@param {String} type The type of event.
	@param {Function} bind The callback for the event.
	NOTE: This accepts DOM Canvas events as well.
*/
wamt.View.prototype.addEventListener = function(type,bind)
{
	var e = this.events[type];
	if(typeof(e) == "undefined")
		this.events[type] = [];
	this.events[type].push(bind);
	switch(type)
	{
		case "mousemove":
			this.canvas.addEventListener("mousemove",function(event)
			{
				event.view = this;
				event.context = this.view;
				bind(event);
			},false);
			break;
		case "mousedown":
			this.canvas.addEventListener("mousedown",function(event)
			{
				event.view = this;
				event.context = this.view;
				bind(event);
			},false);
			break;
		case "mouseup":
			this.canvas.addEventListener("mouseup",function(event)
			{
				event.view = this;
				event.context = this.view;
				bind(event);
			},false);
			break;
		case "click":
			this.canvas.addEventListener("click",function(event)
			{
				event.view = this;
				event.context = this.view;
				bind(event);
			},false);
			break;
	}
};
/*
	@function
	@description Process an event listener on the object.
	@param {String} type The type of event.
	@param {Object} holder The holder object to be sent along to the event callback.
*/
wamt.View.prototype.processEvent = function(type,holder)
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
	@description Set the view's backdrop.
	@param {String or Image} value The backdrop. It can be a fillStyle or an Image.
*/
wamt.View.prototype.setBackdrop = function(value)
{
	this.backdrop = value;
};
/*
	@function
	@description Render the backdrop onto the view.
*/
wamt.View.prototype.renderBackdrop = function()
{
	if(typeof(this.backdrop) == "undefined")
		return;
	var canvas = this.canvas;
	var context = this.context;
	if(this.backdrop instanceof Image)
		this.context.drawImage(this.backdrop,0,0,canvas.width,canvas.height);
	else
	{
		context.fillStyle = this.backdrop;
		context.fillRect(0,0,canvas.width,canvas.height);
		context.fillStyle = "";
	}
};
/*
	@function
	@description Set the canvas that the view renders into.
*/
wamt.View.prototype.setCanvas = function(canvas)
{
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
};
/*
	@function
	@description Clear the canvas's pixel content.
*/
wamt.View.prototype.clearCanvas = function()
{
	var canvas = this.canvas;
	this.context.clearRect(0,0,canvas.width,canvas.height);
};
/*
	@function
	@description Set the view's target. It follows it.
	@param {Object} target The target.
*/
wamt.View.prototype.setTarget = function(target)
{
	this.target = target;
};
/*
	@function
	@description Set the x-position of the object.
	@param {Number} x The x-position.
*/
wamt.View.prototype.setX = function(x)
{
	this.x = x;
	this.scene.updated = true;
};
/*
	@function
	@description Set the y-position of the object.
	@param {Number} y The y-position.
*/
wamt.View.prototype.setY = function(y)
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
wamt.View.prototype.setPosition = function(x,y)
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
wamt.View.prototype.snap = function(x,y)
{
	this.translate(-(this.x % x),-(this.y % y));
};
/*
	@function
	@description Translate the object (move) on the x-axis.
	@param {Number} x The x-offset.
*/
wamt.View.prototype.translateX = function(x)
{
	this.x += x;
	this.scene.updated = true;
};
/*
	@function
	@description Translate the object (move) on the y-axis.
	@param {Number} y The y-offset.
*/
wamt.View.prototype.translateY = function(y)
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
wamt.View.prototype.translate = function(x,y)
{
	this.x += x;
	this.y += y;
	this.scene.updated = true;
};
