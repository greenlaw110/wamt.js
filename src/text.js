/*
	wamt.js/text.js
	@author Zack0Wack0/http://zack0wack0.com
*/
/*
	@class The Text class is a renderable object that displays text.
	@param {String} text The text to display.
	@param {String} font The font style.
	@param {String} style The colour style.
	@param {Number} x The x-position of the object.
	@param {Number} y The y-position of the object.
	@param {Number} angle The angle of the object.
*/
wamt.Text = function(text,font,style,x,y,angle)
{
	this.events = [];
	this.collideable = false;
	this.x = typeof(x) == "undefined" ? 0 : x;
	this.y = typeof(y) == "undefined" ? 0 : y;
	this.velocity = [0,0];
	this.screenX = this.x;
	this.screenY = this.y;
	this.angle = typeof(angle) == "undefined" ? 0 : angle;
	this.radians = typeof(angle) == "undefined" ? 0 : Math.radians(angle);
	this.width = 1;
	this.height = 10;
	this.text = String(text).split("\n");
	this.font = font;
	this.style = style;
	this.align = "start";
	this.shadow = [0,0,0,"rgba(0,0,0,0)"];
	this.hollow = false;
	this.visible = true;
	this.opacity = 1;
	this.updated = true;
	this.computeBounds();
};
wamt.Text.prototype.constructor = wamt.Text;
/*
	@function
	@description Compute the bounds of the object, by rotating the width and height based on angle.
*/
wamt.Text.prototype.computeBounds = function()
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
wamt.Text.prototype.setColliding = function(colliding)
{
	this.collideable = colliding;
};
/*
	@function
	@description Set whether the object is visible.
	@param {Bool} visible Is the object visible?
*/
wamt.Text.prototype.setVisible = function(visible)
{
	this.visible = visible;
	this.scene.updated = true;
};
/*
	@function
	@description Set whether the object is hollow.
	@param {Bool} hollow Is the object hollow?
*/
wamt.Text.prototype.setHollow = function(hollow)
{
	this.hollow = hollow;
	this.scene.updated = true;
};
/*
	@function
	@description Process the object's logic. (handles velocity, behaviours, etc)
	@param {Scene} scene The parent scene processing logic.
*/
wamt.Text.prototype.logic = function(scene,layer,view)
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
wamt.Text.prototype.tick = function(scene,layer,view)
{
	var hasBehaviour = typeof(this.behaviour) != "undefined";
	if(hasBehaviour)
		this.behaviour.pretick(this);
	if(scene.updated)
	{
		if(this.updated)
		{
			this.width = view.context.measureText(this.text).width;
			var fspos = this.font.indexOf("px");
			if(fspos != -1)
			{
				var fs = this.font.substring(0,fspos);
				this.height = parseInt(fs);
			}
			else
				this.height = 10;
			this.computeBounds();
			this.updated = false;
		}
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
	if(hasBehaviour)
		this.behaviour.tick(this);
	this.processEvent("tick",{object:this,scene:scene,layer:layer,view:view});
};
/*
	@function
	@description Render the object to the screen.
	@param {View} view The view to render the object into.
*/
wamt.Text.prototype.render = function(view)
{
	var hasBehaviour = typeof(this.behaviour) != "undefined";
	if(hasBehaviour)
		this.behaviour.prerender(this);
	var radians = this.radians;
	var context = view.context;
	context.strokeStyle = this.style;
	context.fillStyle = this.style;
	context.font = this.font;
	context.textAlign = this.align;
	context.shadowOffsetX = this.shadow[0];
	context.shadowOffsetY = this.shadow[1];
	context.shadowBlur = this.shadow[2];
	context.shadowColor = this.shadow[3];
	if(radians == 0)
	{
		if(this.hollow)
		{
			for(var i=0;i<this.text.length;i++)
			{
				var text = this.text[i];
				context.strokeText(text,this.screenX,this.screenY + (i * this.height * 1.5));
			}
		}
		else
		{
			for(var i=0;i<this.text.length;i++)
			{
				var text = this.text[i];
				context.fillText(text,this.screenX,this.screenY + (i * this.height * 1.5));
			}
		}
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
		{
			for(var i=0;i<this.text.length;i++)
			{
				var text = this.text[i];
				context.strokeText(text,this.screenX,this.screenY + (i * this.height * 1.5));
			}
		}
		else
		{
			for(var i=0;i<this.text.length;i++)
			{
				var text = this.text[i];
				context.fillText(text,this.screenX,this.screenY + (i * this.height * 1.5));
			}
		}
		context.restore();
	}
	context.strokeStyle = "";
	context.fillStyle = "";
	context.font = "";
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
	@description Set the colour style of the object.
	@param {String} style The colour style.
*/
wamt.Text.prototype.setStyle = function(style)
{
	this.style = style;
	this.updated = true;
	this.scene.updated = true;
};
/*
	@function
	@description Set the font.
	@param {String} font The font style.
	@see https://developer.mozilla.org/en/Drawing_text_using_a_canvas
*/
wamt.Text.prototype.setFont = function(font)
{
	this.font = font;
	this.updated = true;
	this.scene.updated = true;
};
/*
	@function
	@description Set the text to be displayed.
	@param {String} text The text to display.
*/
wamt.Text.prototype.setText = function(text)
{
	this.text = String(text).split("\n");
	this.updated = true;
	this.scene.updated = true;
};
/*
	@function
	@description Set the text-aligning.
	@param {String} align The aligning method.
	@see https://developer.mozilla.org/en/Drawing_text_using_a_canvas
*/
wamt.Text.prototype.setTextAlign = function(align)
{
	this.align = align;
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
wamt.Text.prototype.setShadow = function(offsetx,offsety,blur,color)
{
	this.shadow = [offsetx,offsety,blur,color];
	this.scene.updated = true;
};
/*
	@function
	@description Set whether the object is shadowcasting.
	@param {Bool} shadowcast Is the object shadowcasting?
*/
wamt.Text.prototype.setShadowCasting = function(shadowcast)
{
	this.shadowcast = shadowcast;
	this.scene.updated = true;
};
/*
	@function
	@description Set the opacity of the object.
	@param {Number} opacity The new opacity of the object.
*/
wamt.Text.prototype.setOpacity = function(opacity)
{
	this.opacity = opacity;
	this.scene.updated = true;
};
/*
	@function
	@description Set the x-position of the object.
	@param {Number} x The x-position.
*/
wamt.Text.prototype.setX = function(x)
{
	this.x = x;
	this.scene.updated = true;
};
/*
	@function
	@description Set the y-position of the object.
	@param {Number} y The y-position.
*/
wamt.Text.prototype.setY = function(y)
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
wamt.Text.prototype.setPosition = function(x,y)
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
wamt.Text.prototype.snap = function(x,y)
{
	this.translate(-(this.x % x),-(this.y % y));
};
/*
	@function
	@description Translate the object (move) on the x-axis.
	@param {Number} x The x-offset.
*/
wamt.Text.prototype.translateX = function(x)
{
	this.x += x;
	this.scene.updated = true;
};
/*
	@function
	@description Translate the object (move) on the y-axis.
	@param {Number} y The y-offset.
*/
wamt.Text.prototype.translateY = function(y)
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
wamt.Text.prototype.translate = function(x,y)
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
wamt.Text.prototype.setVelocity = function(x,y)
{
	this.velocity = [x,y];
	this.scene.updated = true;
};
/*
	@function
	@description Stop the object's velocity.
*/
wamt.Text.prototype.stop = function()
{
	this.velocity = [0,0];
	this.scene.updated = true;
};
/*
	@function
	@description Set the object's rotation.
	@param {Number} angle The new rotation/angle. (degrees)
*/
wamt.Text.prototype.setAngle = function(angle)
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
wamt.Text.prototype.rotate = function(angle)
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
wamt.Text.prototype.setBehaviour = function(behaviour)
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
wamt.Text.prototype.addEventListener = function(type,bind)
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
wamt.Text.prototype.processEvent = function(type,holder)
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
wamt.Text.prototype.destroy = function()
{
	this.scene.removeObject(this);
};
