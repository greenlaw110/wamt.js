/*
	wamt.js/collision.js
	@author Zack0Wack0/http://zack0wack0.com
*/
wamt.collision = {};
/*
	@description Perform a point on screen collision test.
	@param {Scene} target The scene to perform the collision tests on. Also accepts layers.
	@param {Number} x The screen x-position.
	@param {Number} y The screen y-position.
	@param {Object} n Optional. An object to ignore tests on.
	@returns {Array} A list of successful collisions.
*/
wamt.collision.screenPointTest = function(target,x,y,n)
{
	var collisions = [];
	if(target instanceof wamt.Layer)
	{
		var objects = target.objects;
		for(var i=0;i<objects.length;i++)
		{
			var b = objects[i];
			if(!b.collideable || b == n)
				continue;
			if(b instanceof wamt.Text)
			{
				if(b.screenX <= x && b.screenX + b.bounds[0] >= x && b.screenY >= y && b.screenY - b.bounds[1] <= y)
					collisions.push(b);
			}
			else
			{
				if(b.screenX <= x && b.screenX + b.bounds[0] >= x && b.screenY <= y && b.screenY + b.bounds[1] >= y)
					collisions.push(b);
			}
		}
	}
	else
	{
		var layers = target.layers;
		for(var l=0;l<layers.length;l++)
		{
			var layer = layers[l];
			var objects = layer.objects;
			for(var i=0;i<objects.length;i++)
			{
				var b = objects[i];
				if(!b.collideable || b == n)
					continue;
				if(b.screenX <= x && b.screenX + b.bounds[0] >= x && b.screenY <= y && b.screenY + b.bounds[1] >= y)
					collisions.push(b);
			}
		}
	}
	return collisions;
};
/*
	@description Perform a box search/test. Searches through the target and checks if any objects are inside the box.
	@param {Scene} target The scene to perform the collision tests on. Also accepts layers.
	@param {Number} x The x-position.
	@param {Number} y The y-position.
	@param {Number} width The width of the box.
	@param {Number} height The height of the box.
	@param {Object} n Optional. An object to ignore tests on.
	@returns {Array} A list of successful collisions.
*/
wamt.collision.boxSearch = function(target,x,y,width,height,n)
{
	var collisions = [];
	if(target instanceof wamt.Layer)
	{
		var objects = target.objects;
		for(var i=0;i<objects.length;i++)
		{
			var b = objects[i];
			if(!b.collideable || b == n)
				continue;
			if(!(b.x > x + width || b.x + b.bounds[0] < x || b.y > y + height || b.y + b.bounds[1] < y))
				collisions.push(b);
		}
	}
	else
	{
		var layers = target.layers;
		for(var l=0;l<layers.length;l++)
		{
			var layer = layers[l];
			var objects = layer.objects;
			for(var i=0;i<objects.length;i++)
			{
				var b = objects[i];
				if(!b.collideable || b == n)
					continue;
				if(!(b.x > x + width || b.x + b.bounds[0] < x || b.y > y + height || b.y + b.bounds[1] < y))
					collisions.push(b);
			}
		}
	}
	return collisions;
};
/*
	@description Perform a point collision test.
	@param {Scene} target The scene to perform the collision tests on. Also accepts layers.
	@param {Number} x The x-position.
	@param {Number} y The y-position.
	@param {Object} n Optional. An object to ignore tests on.
	@returns {Array} A list of successful collisions.
*/
wamt.collision.pointTest = function(target,x,y,n)
{
	var collisions = [];
	if(target instanceof wamt.Layer)
	{
		var objects = target.objects;
		for(var i=0;i<objects.length;i++)
		{
			var b = objects[i];
			if(!b.collideable || b == n)
				continue;
			if(b instanceof wamt.Text)
			{
				if(b.x <= x && b.x + b.bounds[0] >= x && b.y >= y && b.y - b.bounds[1] <= y)
					collisions.push(b);
			}
			else
			{
				if(b.x <= x && b.x + b.bounds[0] >= x && b.y <= y && b.y + b.bounds[1] >= y)
					collisions.push(b);
			}
		}
	}
	else
	{
		var layers = target.layers;
		for(var l=0;l<layers.length;l++)
		{
			var layer = layers[l];
			var objects = layer.objects;
			for(var i=0;i<objects.length;i++)
			{
				var b = objects[i];
				if(!b.collideable || b == n)
					continue;
				if(b instanceof wamt.Text)
				{
					if(b.x <= x && b.x + b.bounds[0] >= x && b.y >= y && b.y - b.bounds[1] <= y)
						collisions.push(b);
				}
				else
				{
					if(b.x <= x && b.x + b.bounds[0] >= x && b.y <= y && b.y + b.bounds[1] >= y)
						collisions.push(b);
				}
			}
		}
	}
	return collisions;
};
/*
	@description Perform an intersect test. Checks if the object is intersecting with any other objects in the target.
	@param {Scene} target The scene to perform the collision tests on. Also accepts layers.
	@param {Object} a The object that you want to test intersections on.
	@returns {Array} A list of successful collisions.
*/
wamt.collision.intersectTest = function(target,a)
{
	var collisions = [];
	if(target instanceof wamt.Layer)
	{
		var objects = target.objects;
		for(var i=0;i<objects.length;i++)
		{
			var b = objects[i];
			if(!b.collideable || b == a)
				continue;
			if(!(b.x > a.x + a.bounds[0] || b.x + b.bounds[0] < a.x || b.y > a.y + a.bounds[1] || b.y + b.bounds[1] < a.y))
				collisions.push(b);
		}
	}
	else
	{
		var layers = target.layers;
		for(var l=0;l<layers.length;l++)
		{
			var layer = layers[l];
			var objects = layer.objects;
			for(var i=0;i<objects.length;i++)
			{
				var b = objects[i];
				if(!b.collideable || b == a)
					continue;
				if(!(b.x > a.x + a.bounds[0] || b.x + b.bounds[0] < a.x || b.y > a.y + a.bounds[1] || b.y + b.bounds[1] < a.y))
					collisions.push(b);
			}
		}
	}
	return collisions;
};
