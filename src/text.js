/*
	@title text.js
	@author Zack0Wack0/zack0wack0.com
	@package wamt.js
*/
wamt.Text = function(text,font,style,x,y,angle)
{
	this.collideable = true;
	this.x = typeof(x) == "undefined" ? 0 : x;
	this.y = typeof(y) == "undefined" ? 0 : y;
	this.velocity = [0,0];
	this.screenX = this.x;
	this.screenY = this.y;
	this.angle = typeof(angle) == "undefined" ? 0 : angle;
	this.radians = typeof(angle) == "undefined" ? 0 : Math.radians(angle);
	this.width = 1;
	this.height = 10;
	this.text = text;
	this.font = font;
	this.style = style;
	this.align = "start";
	this.shadow = [0,0,0,"rgba(0,0,0,0)"];
	this.hollow = false;
	this.updated = true;
	this.computeBounds();
};
wamt.Text.prototype.constructor = wamt.Text;
wamt.Text.prototype.computeBounds = function()
{
	if(this.angle == 0 || this.angle == 180)
		this.bounds = [this.width,this.height];
	else if(this.angle == 90 || this.angle == 270)
		this.bounds = [this.height,this.width];
	else
		this.bounds = [Math.abs(Math.cos(this.angle) * this.width),Math.abs(Math.sin(this.angle) * this.height)];
};
wamt.Text.prototype.setColliding = function(colliding)
{
	this.collideable = colliding;
};
wamt.Text.prototype.setHollow = function(hollow)
{
	this.hollow = hollow;
	this.scene.updated = true;
};
wamt.Text.prototype.tick = function(scene,layer,view)
{
	if(this.velocity[0] != 0 || this.velocity[1] != 0)
		this.translate(this.velocity[0],this.velocity[1]);
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
};
wamt.Text.prototype.render = function(view)
{
	var radians = this.radians;
	view.context.strokeStyle = this.style;
	view.context.fillStyle = this.style;
	view.context.font = this.font;
	view.context.textAlign = this.align;
	view.context.shadowOffsetX = this.shadow[0];
	view.context.shadowOffsetY = this.shadow[1];
	view.context.shadowBlur = this.shadow[2];
	view.context.shadowColor = this.shadow[3];
	if(radians == 0)
	{
		if(this.hollow)
			view.context.strokeText(this.text,this.screenX,this.screenY);
		else
			view.context.fillText(this.text,this.screenX,this.screenY);
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
			view.context.strokeText(this.text,this.screenX,this.screenY);
		else
			view.context.fillText(this.text,this.screenX,this.screenY);
		view.context.restore();
	}
	view.context.strokeStyle = "";
	view.context.fillStyle = "";
	view.context.font = "";
	view.context.shadowOffsetX = "";
	view.context.shadowOffsetY = "";
	view.context.shadowBlur = "";
	view.context.shadowColor = "";
};
wamt.Text.prototype.setStyle = function(style)
{
	this.style = style;
	this.updated = true;
	this.scene.updated = true;
};
wamt.Text.prototype.setFont = function(font)
{
	this.font = font;
	this.updated = true;
	this.scene.updated = true;
};
wamt.Text.prototype.setText = function(text)
{
	this.text = text;
	this.updated = true;
	this.scene.updated = true;
};
wamt.Text.prototype.setShadow = function(offsetx,offsety,blur,color)
{
	this.shadow = [offsetx,offsety,blur,color];
	this.scene.updated = true;
};
wamt.Text.prototype.setShadowCasting = function(shadowcast)
{
	this.shadowcast = shadowcast;
	this.scene.updated = true;
};
wamt.Text.prototype.setX = function(x)
{
	this.x = x;
	this.scene.updated = true;
};
wamt.Text.prototype.setY = function(y)
{
	this.y = y;
	this.scene.updated = true;
};
wamt.Text.prototype.setPosition = function(x,y)
{
	this.x = x;
	this.y = y;
	this.scene.updated = true;
};
wamt.Text.prototype.setVelocity = function(x,y)
{
	this.velocity = [x,y];
	this.scene.updated = true;
};
wamt.Text.prototype.translateX = function(x)
{
	this.x += x;
	this.scene.updated = true;
};
wamt.Text.prototype.translateY = function(y)
{
	this.y += y;
	this.scene.updated = true;
};
wamt.Text.prototype.translate = function(x,y)
{
	this.x += x;
	this.y += y;
	this.scene.updated = true;
};
wamt.Text.prototype.setVelocity = function(x,y)
{
	this.velocity = [x,y];
	this.scene.updated = true;
};
wamt.Text.prototype.stop = function()
{
	this.velocity = [0,0];
	this.scene.updated = true;
};
wamt.Text.prototype.setAngle = function(angle)
{
	this.angle = angle;
	this.radians = Math.radians(this.angle);
	this.computeBounds();
	this.scene.updated = true;
};
wamt.Text.prototype.rotate = function(angle)
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