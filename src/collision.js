/*
	@title collision.js
	@author Zack0Wack0/zack0wack0.com
	@package wamt.js
*/
wamt.collision = {};
wamt.collision.screenPointTest = function(target,x,y,n)
{
	var collisions = [];
	if(target instanceof wamt.Layer)
	{
		for(var i=0;i<target.objects.length;i++)
		{
			var b = target.objects[i];
			if(!b.collideable || b == n)
				continue;
			if((x > b.screenX && x < b.screenX + (b.bounds[0])) && (y > b.screenY - (b.bounds[1]) && y < b.screenY))
				collisions.push(b);
		}
	}
	else
	{
		for(var l=0;l<target.layers.length;l++)
		{
			var layer = target.layers[l];
			for(var i=0;i<layer.objects.length;i++)
			{
				var b = layer.objects[i];
				if(!b.collideable || b == n)
					continue;
				if((x >= b.screenX && x <= b.screenX + (b.bounds[0])) && (y >= b.screenY && y <= b.screenY + (b.bounds[1])))
					collisions.push(b);
			}
		}
	}
	return collisions;
};
wamt.collision.boxSearch = function(target,x,y,width,height,n)
{
	var collisions = [];
	if(target instanceof wamt.Layer)
	{
		for(var i=0;i<target.objects.length;i++)
		{
			var b = target.objects[i];
			if(!b.collideable || b == n)
				continue;
			if(!(b.x > x + width || b.x + b.bounds[0] < x || b.y > y + height || b.y + b.bounds[1] < y))
				collisions.push(b);
		}
	}
	else
	{
		for(var l=0;l<target.layers.length;l++)
		{
			var layer = target.layers[l];
			for(var i=0;i<layer.objects.length;i++)
			{
				var b = layer.objects[i];
				if(!b.collideable || b == n)
					continue;
				if(!(b.x > x + width || b.x + b.bounds[0] < x || b.y > y + height || b.y + b.bounds[1] < y))
					collisions.push(b);
			}
		}
	}
	return collisions;
};
wamt.collision.pointTest = function(target,x,y,n)
{
	var collisions = [];
	if(target instanceof wamt.Layer)
	{
		for(var i=0;i<target.objects.length;i++)
		{
			var b = target.objects[i];
			if(!b.collideable || b == n)
				continue;
			if((x > b.x && x < b.x + (b.bounds[0])) && (y > b.y - (b.bounds[1]) && y < b.y))
				collisions.push(b);
		}
	}
	else
	{
		for(var l=0;l<target.layers.length;l++)
		{
			var layer = target.layers[l];
			for(var i=0;i<layer.objects.length;i++)
			{
				var b = layer.objects[i];
				if(!b.collideable || b == n)
					continue;
				if((x > b.x && x < b.x + (b.bounds[0])) && (y > b.y - (b.bounds[1]) && y < b.y))
					collisions.push(b);
			}
		}
	}
	return collisions;
};
wamt.collision.intersectTest = function(target,a)
{
	var collisions = [];
	if(target instanceof wamt.Layer)
	{
		for(var i=0;i<target.objects.length;i++)
		{
			var b = target.objects[i];
			if(!b.collideable || b == a)
				continue;
			if(!(b.x > a.x + a.bounds[0] || b.x + b.bounds[0] < a.x || b.y > a.y + a.bounds[1] || b.y + b.bounds[1] < a.y))
				collisions.push(b);
		}
	}
	else
	{
		for(var l=0;l<target.layers.length;l++)
		{
			var layer = target.layers[l];
			for(var i=0;i<layer.objects.length;i++)
			{
				var b = layer.objects[i];
				if(!b.collideable || b == a)
					continue;
				if(!(b.x > a.x + a.bounds[0] || b.x + b.bounds[0] < a.x || b.y > a.y + a.bounds[1] || b.y + b.bounds[1] < a.y))
					collisions.push(b);
			}
		}
	}
	return collisions;
};