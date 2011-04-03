/*
	@title sprite.js
	@author Zack0Wack0/zack0wack0.com
	@package wamt.js
*/
wamt.Sprite = function(image,x,y,angle)
{
	this.collideable = true;
	this.image = image;
	this.x = typeof(x) == "undefined" ? 0 : x;
	this.y = typeof(y) == "undefined" ? 0 : y;
	this.screenX = this.x;
	this.screenY = this.y;
	this.angle = typeof(angle) == "undefined" ? 0 : angle;
	this.radians = typeof(angle) == "undefined" ? 0 : Math.radians(angle);
	this.width = image.width;
	this.height = image.height;
	this.shadow = [0,0,0,"rgba(0,0,0,0)"];
	this.shadowcast = false;
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
wamt.Sprite.prototype.tick = function(scene,layer,view)
{
	if(scene.updated)
	{
		this.screenX = -view.x + this.x + (view.canvas.width / 2);
		this.screenY = -view.y + this.y + (view.canvas.height / 2);
	}
};
wamt.Sprite.prototype.render = function(view)
{
	var radians = this.radians;
	view.context.shadowOffsetX = this.shadow[0];
	view.context.shadowOffsetY = this.shadow[1];
	view.context.shadowBlur = this.shadow[2];
	view.context.shadowColor = this.shadow[3];
	if(radians == 0)
		view.context.drawImage(this.image,this.screenX,this.screenY,this.width,this.height);
	else
	{
		var transx = (this.width / 2) + this.screenX;
		var transy = (this.height / 2) + this.screenY;
		view.context.save();
		view.context.translate(transx,transy);
		view.context.rotate(radians);
		view.context.translate(-transx,-transy);
		view.context.drawImage(this.image,this.screenX,this.screenY,this.width,this.height);
		view.context.restore();
	}
	view.context.shadowOffsetX = "";
	view.context.shadowOffsetY = "";
	view.context.shadowBlur = "";
	view.context.shadowColor = "";
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
wamt.Sprite.prototype.setImage = function(image)
{
	this.image = image;
	this.width = image.width;
	this.height = image.height;
	this.computeBounds();
	this.scene.updated = true;
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
	this.angle = angle;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Sprite.prototype.rotate = function(angle)
{
	this.angle += angle;
	if(this.angle > 360)
		this.angle = this.angle - 360;
	else if(this.angle < 0)
		this.angle = 360 - this.angle;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.scene.updated = true;
};