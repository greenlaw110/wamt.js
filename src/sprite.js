/*
	wamt.js/sprite.js
	@author Zack0Wack0/http://zack0wack0.com
*/
/*
	@class The Sprite is a renderable object that renders a texture or video.
	@param {Number} x The x-position of the object.
	@param {Number} y The y-position of the object.
	@param {Number} angle The angle of the object.
*/
wamt.Sprite = function(image,x,y,angle)
{
	image = typeof(image.data) != "undefined" ? image.canvas : image;
	this.events = [];
	this.collideable = true;
	this.image = image;
	this.x = typeof(x) == "undefined" ? 0 : x;
	this.y = typeof(y) == "undefined" ? 0 : y;
	this.velocity = [0,0];
	this.tileWidth = 0;
	this.tileHeight = 0;
	this.tileAnimation = "";
	this.tileAnimationFrame = 0;
	this.tileAnimationSpeed = 0;
	this.tileAnimations = [];
	this.screenX = this.x;
	this.screenY = this.y;
	this.angle = typeof(angle) == "undefined" ? 0 : angle;
	this.radians = typeof(angle) == "undefined" ? 0 : Math.radians(angle);
	var isVideo = typeof(image.videoWidth) != "undefined";
	this.width = isVideo ? image.videoWidth : image.width;
	this.height = isVideo ? image.videoHeight : image.height;
	this.shadow = [0,0,0,"rgba(0,0,0,0)"];
	this.shadowcast = false;
	this.visible = true;
	this.opacity = 1;
	this.computeBounds();
};
wamt.Sprite.prototype.constructor = wamt.Sprite;
/*
	@function
	@description Compute the bounds of the object, by rotating the width and height based on angle.
*/
wamt.Sprite.prototype.computeBounds = function()
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
wamt.Sprite.prototype.setColliding = function(colliding)
{
	this.collideable = colliding;
};
/*
	@function
	@description Set whether the object is visible.
	@param {Bool} visible Is the object visible?
*/
wamt.Sprite.prototype.setVisible = function(visible)
{
	this.visible = visible;
	this.scene.updated = true;
};
/*
	@function
	@description Process the object's logic. (handles velocity, behaviours, etc)
	@param {Scene} scene The parent scene processing logic.
*/
wamt.Sprite.prototype.logic = function(scene)
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
wamt.Sprite.prototype.tick = function(scene,layer,view)
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
wamt.Sprite.prototype.render = function(view)
{
	var hasBehaviour = typeof(this.behaviour) != "undefined";
	if(hasBehaviour)
		this.behaviour.prerender(this);
	var radians = this.radians;
	var context = view.context;
	context.shadowOffsetX = this.shadow[0];
	context.shadowOffsetY = this.shadow[1];
	context.shadowBlur = this.shadow[2];
	context.shadowColor = this.shadow[3];
	var animation = this.tileAnimations[this.tileAnimation];
	var image = this.image;
	if(typeof(animation) == "undefined")
	{
		if(radians == 0)
		{
			context.drawImage(image,this.screenX,this.screenY,this.width,this.height);
		}
		else
		{
			var transx = (this.width / 2) + this.screenX;
			var transy = (this.height / 2) + this.screenY;
			context.save();
			context.translate(transx,transy);
			context.rotate(radians);
			context.translate(-transx,-transy);
			context.drawImage(image,this.screenX,this.screenY,this.width,this.height);
			context.restore();
		}
	}
	else
	{
		var fa = this.tileAnimationSpeed / wamt.delta;
		var of = Math.floor(this.tileAnimationFrame);
		this.tileAnimationFrame += fa;
		if(this.tileAnimationFrame > animation[2] * animation[3] + 1)
			this.tileAnimationFrame = 0;
		var ff = Math.floor(this.tileAnimationFrame);
		if(ff != of)
			this.processEvent("frame");
		var tilex = Math.floor(ff % animation[2]);
		var tiley = Math.floor(ff % animation[3]);
		if(radians == 0)
			context.drawImage(image,animation[0] * this.tileWidth + tilex * this.tileWidth,animation[1] * this.tileHeight + tiley * this.tileHeight,this.tileWidth,this.tileHeight,this.screenX,this.screenY,this.width,this.height);
		else
		{
			var transx = (this.width / 2) + this.screenX;
			var transy = (this.height / 2) + this.screenY;
			context.save();
			context.translate(transx,transy);
			context.rotate(radians);
			context.translate(-transx,-transy);
			context.drawImage(image,animation[0] * this.tileWidth + tilex * this.tileWidth,animation[1] * this.tileHeight + tiley * this.tileHeight,this.tileWidth,this.tileHeight,this.screenX,this.screenY,this.width,this.height);
			context.restore();
		}
	}
	context.shadowOffsetX = "";
	context.shadowOffsetY = "";
	context.shadowBlur = "";
	context.shadowColor = "";
	if(hasBehaviour)
		this.behaviour.render(this);
	this.processEvent("render",{object:this,view:view});
};
/*
	@function
	@description Set the sprite's texture/image.
	@param {Image} image The new texture/image.
	NOTE: HTML5 Video elements are accepted.
	NOTE: The sprite's animations will be cleared.
*/
wamt.Sprite.prototype.setImage = function(image)
{
	image = typeof(image.data) != "undefined" ? image.canvas : image;
	this.clearTileAnimations();
	this.image = image;
	var isVideo = typeof(image.videoWidth) != "undefined";
	this.width = isVideo ? image.videoWidth : image.width;
	this.height = isVideo ? image.videoHeight : image.height;
	this.computeBounds();
	this.scene.updated = true;
};
/*
	@function
	@description Set the sprite's tiling width and height (for tilesheets)
	@param {Number} width The tiling width.
	@param {Number} height THe tiling height.
*/
wamt.Sprite.prototype.setTiling = function(width,height)
{
	this.width = width;
	this.height = height;
	this.computeBounds();
	this.tileWidth = width;
	this.tileHeight = height;
	this.scene.updated = true;
};
/*
	@function
	@description Clear the sprite's tile animations.
*/
wamt.Sprite.prototype.clearTileAnimations = function()
{
	this.tileAnimation = "";
	this.tileAnimationFrame = 0;
	this.tileAnimationSpeed = 0;
	this.tileAnimations = [];
};
/*
	@function
	@description Add a tile animation.
	@param {String} name The animation name.
	@param {Number} x The start x-position for the frame on the tileset.
	@param {Number} y The start y-position for the frame on the tileset.
	@param {Number} framesx The x-width on the tileset for the frames.
	@param {Number} framesy The y-height on the tileset for the frames.
*/
wamt.Sprite.prototype.addTileAnimation = function(name,x,y,framesx,framesy)
{
	this.tileAnimations[name] = [x,y,framesx,framesy];
};
/*
	@function
	@description Play a tile animation, by name.
	@param {String} name The name of the animation to play.
	@param {Number} speed The speed to play (animation frame per rendering frame)
*/
wamt.Sprite.prototype.playTileAnimation = function(name,speed)
{
	var animation = this.tileAnimations[name];
	if(typeof(animation) == "undefined")
		return;
	speed = typeof(speed) == "number" ? speed : 1;
	if(animation[0] == animation[2] && animation[1] == animation[3])
		speed = 0;
	if(name != this.tileAnimation)
		this.tileAnimationFrame = 0;
	this.tileAnimation = name;
	this.tileAnimationSpeed = speed;
	this.scene.updated = true;
};
/*
	@function
	@description Set the tile animation frame speed.
	@param {Number} speed The speed.
*/
wamt.Sprite.prototype.setTileAnimationSpeed = function(speed)
{
	if(animation[0] == animation[2] && animation[1] == animation[3])
		speed = 0;
	this.tileAnimationSpeed = speed;
	this.scene.updated = 1;
};
/*
	@function
	@description Pause the tile animation.
*/
wamt.Sprite.prototype.pauseTileAnimation = function()
{
	this.tileAnimationSpeed = 0;
};
/*
	@function
	@description Set the object's width.
	@param {Number} width The new width.
*/
wamt.Sprite.prototype.setWidth = function(width)
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
wamt.Sprite.prototype.setHeight = function(height)
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
wamt.Sprite.prototype.setSize = function(width,height)
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
wamt.Sprite.prototype.stretchX = function(width)
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
wamt.Sprite.prototype.stretchY = function(height)
{
	this.height += height;
	if(this.height < 1)
		this.height = 1;
	this.computeBounds();
	this.scene.updated = true;
};
/*
	@function
	@description Stretch the object on both axis.
	@param {Number} width The amount to stretch on the x-axis.
	@param {Number} height The amount to stretch on the y-axis.
*/
wamt.Sprite.prototype.stretch = function(width,height)
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
	@description Set the shadow of the object.
	@param {Number} offsetx The x-offset of the shadow.
	@param {Number} offsety The y-offset of the shadow.
	@param {Number} blur The blur radius of the shadow.
	@param {String} color The colour of the shadow.
*/
wamt.Sprite.prototype.setShadow = function(offsetx,offsety,blur,color)
{
	this.shadow = [offsetx,offsety,blur,color];
	this.scene.updated = true;
};
/*
	@function
	@description Set whether the object is shadowcasting.
	@param {Bool} shadowcast Is the object shadowcasting?
*/
wamt.Sprite.prototype.setShadowCasting = function(shadowcast)
{
	this.shadowcast = shadowcast;
	this.scene.updated = true;
};
/*
	@function
	@description Set the opacity of the object.
	@param {Number} opacity The new opacity of the object.
*/
wamt.Sprite.prototype.setOpacity = function(opacity)
{
	this.opacity = opacity;
	this.scene.updated = true;
};
/*
	@function
	@description Set the x-position of the object.
	@param {Number} x The x-position.
*/
wamt.Sprite.prototype.setX = function(x)
{
	this.x = x;
	this.scene.updated = true;
};
/*
	@function
	@description Set the y-position of the object.
	@param {Number} y The y-position.
*/
wamt.Sprite.prototype.setY = function(y)
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
wamt.Sprite.prototype.setPosition = function(x,y)
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
wamt.Sprite.prototype.snap = function(x,y)
{
	this.translate(-(this.x % x),-(this.y % y));
};
/*
	@function
	@description Translate the object (move) on the x-axis.
	@param {Number} x The x-offset.
*/
wamt.Sprite.prototype.translateX = function(x)
{
	this.x += x;
	this.scene.updated = true;
};
/*
	@function
	@description Translate the object (move) on the y-axis.
	@param {Number} y The y-offset.
*/
wamt.Sprite.prototype.translateY = function(y)
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
wamt.Sprite.prototype.translate = function(x,y)
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
wamt.Sprite.prototype.setVelocity = function(x,y)
{
	this.velocity = [x,y];
	this.scene.updated = true;
};
/*
	@function
	@description Stop the object's velocity.
*/
wamt.Sprite.prototype.stop = function()
{
	this.velocity = [0,0];
	this.scene.updated = true;
};
/*
	@function
	@description Set the object's rotation.
	@param {Number} angle The new rotation/angle. (degrees)
*/
wamt.Sprite.prototype.setAngle = function(angle)
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
wamt.Sprite.prototype.rotate = function(angle)
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
wamt.Sprite.prototype.setBehaviour = function(behaviour)
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
wamt.Sprite.prototype.addEventListener = function(type,bind)
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
wamt.Sprite.prototype.processEvent = function(type,holder)
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
wamt.Sprite.prototype.destroy = function()
{
	this.scene.removeObject(this);
};
