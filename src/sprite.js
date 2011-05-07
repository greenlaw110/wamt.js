/*
	@title sprite.js
	@author Zack0Wack0/zack0wack0.com
	@package wamt.js
*/
wamt.Sprite = function(image,x,y,angle)
{
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
	this.width = image.width;
	this.height = image.height;
	this.shadow = [0,0,0,"rgba(0,0,0,0)"];
	this.shadowcast = false;
	this.visible = true;
	this.opacity = 1;
	this.computeBounds();
};
wamt.Sprite.prototype.constructor = wamt.Sprite;
wamt.Sprite.prototype.computeBounds = function()
{
	if(this.angle == 0 || this.angle == 180)
		this.bounds = [this.width,this.height];
	else if(this.angle == 90 || this.angle == 270)
		this.bounds = [this.height,this.width];
	else
		this.bounds = [Math.abs(Math.cos(this.angle) * this.width),Math.abs(Math.sin(this.angle) * this.height)];
};
wamt.Sprite.prototype.setColliding = function(colliding)
{
	this.collideable = colliding;
};
wamt.Sprite.prototype.setVisible = function(visible)
{
	this.visible = visible;
	this.scene.updated = true;
};
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
	if(typeof(animation) == "undefined")
	{
		if(radians == 0)
			context.drawImage(this.image,this.screenX,this.screenY,this.width,this.height);
		else
		{
			var transx = (this.width / 2) + this.screenX;
			var transy = (this.height / 2) + this.screenY;
			context.save();
			context.translate(transx,transy);
			context.rotate(radians);
			context.translate(-transx,-transy);
			context.drawImage(this.image,this.screenX,this.screenY,this.width,this.height);
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
			context.drawImage(this.image,animation[0] * this.tileWidth + tilex * this.tileWidth,animation[1] * this.tileHeight + tiley * this.tileHeight,this.tileWidth,this.tileHeight,this.screenX,this.screenY,this.width,this.height);
		else
		{
			var transx = (this.width / 2) + this.screenX;
			var transy = (this.height / 2) + this.screenY;
			context.save();
			context.translate(transx,transy);
			context.rotate(radians);
			context.translate(-transx,-transy);
			context.drawImage(this.image,animation[0] * this.tileWidth + tilex * this.tileWidth,animation[1] * this.tileHeight + tiley * this.tileHeight,this.tileWidth,this.tileHeight,this.screenX,this.screenY,this.width,this.height);
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
wamt.Sprite.prototype.setShadow = function(offsetx,offsety,blur,color)
{
	this.shadow = [offsetx,offsety,blur,color];
	this.scene.updated = true;
};
wamt.Sprite.prototype.setShadowCasting = function(shadowcast)
{
	this.shadowcast = shadowcast;
	this.scene.updated = true;
};
wamt.Sprite.prototype.setOpacity = function(opacity)
{
	this.opacity = opacity;
	this.scene.updated = true;
};
wamt.Sprite.prototype.setImage = function(image)
{
	this.clearTileAnimations();
	this.image = image;
	if(typeof(image.videoWidth) != "undefined")
	{
		this.width = image.videoWidth;
		this.height = image.videoHeight;
	}
	else
	{
		this.width = image.width;
		this.height = image.height;
	}
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Sprite.prototype.setTiling = function(width,height)
{
	this.width = width;
	this.height = height;
	this.computeBounds();
	this.tileWidth = width;
	this.tileHeight = height;
	this.scene.updated = true;
};
wamt.Sprite.prototype.clearTileAnimations = function()
{
	this.tileAnimation = "";
	this.tileAnimationFrame = 0;
	this.tileAnimationSpeed = 0;
	this.tileAnimations = [];
};
wamt.Sprite.prototype.addTileAnimation = function(name,x,y,framesx,framesy)
{
	this.tileAnimations[name] = [x,y,framesx,framesy];
};
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
wamt.Sprite.prototype.setTileAnimationSpeed = function(speed)
{
	if(animation[0] == animation[2] && animation[1] == animation[3])
		speed = 0;
	this.tileAnimationSpeed = speed;
	this.scene.updated = 1;
};
wamt.Sprite.prototype.pauseTileAnimation = function()
{
	this.tileAnimationSpeed = 0;
};
wamt.Sprite.prototype.setX = function(x)
{
	this.x = x;
	this.scene.updated = true;
};
wamt.Sprite.prototype.setY = function(y)
{
	this.y = y;
	this.scene.updated = true;
};
wamt.Sprite.prototype.setPosition = function(x,y)
{
	this.x = x;
	this.y = y;
	this.scene.updated = true;
};
wamt.Sprite.prototype.snap = function(x,y)
{
	this.translate(-(this.x % x),-(this.y % y));
};
wamt.Sprite.prototype.translateX = function(x)
{
	this.x += x;
	this.scene.updated = true;
};
wamt.Sprite.prototype.translateY = function(y)
{
	this.y += y;
	this.scene.updated = true;
};
wamt.Sprite.prototype.translate = function(x,y)
{
	this.x += x;
	this.y += y;
	this.scene.updated = true;
};
wamt.Sprite.prototype.setVelocity = function(x,y)
{
	this.velocity = [x,y];
	this.scene.updated = true;
};
wamt.Sprite.prototype.stop = function()
{
	this.velocity = [0,0];
	this.scene.updated = true;
};
wamt.Sprite.prototype.setWidth = function(width)
{
	this.width = width;
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Sprite.prototype.setHeight = function(height)
{
	this.height = height;
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Sprite.prototype.setSize = function(width,height)
{
	this.width = width;
	this.height = height;
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Sprite.prototype.stretchX = function(width)
{
	this.width += width;
	if(this.width < 1)
		this.width = 1;
	this.computeBounds();
	this.scene.updated = true;
}
wamt.Sprite.prototype.stretchY = function(height)
{
	this.height += height;
	if(this.height < 1)
		this.height = 1;
	this.computeBounds();
	this.scene.updated = true;
}
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
}
wamt.Sprite.prototype.setAngle = function(angle)
{
	this.angle = angle % 360;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Sprite.prototype.rotate = function(angle)
{
	this.angle += angle;
	this.angle %= 360;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Sprite.prototype.setBehaviour = function(behaviour)
{
	this.behaviour = behaviour;
	if(typeof(behaviour.init) != "undefined")
		behaviour.init(this);
	this.scene.updated = true;
};
wamt.Sprite.prototype.addEventListener = function(type,bind)
{
	var e = this.events[type];
	if(typeof(e) == "undefined")
		this.events[type] = [];
	this.events[type].push(bind);
};
wamt.Sprite.prototype.processEvent = function(type,holder)
{
	var e = this.events[type];
	if(typeof(e) != "undefined")
	{
		for(var i=0;i<e.length;i++)
			e[i](holder);
	}
};
wamt.Sprite.prototype.destroy = function()
{
	this.scene.removeObject(this);
};