/*
	@title collision.js
	@author Zack0Wack0/zack0wack0.com
	@package wamt.js
*/
wamt.collision = {};
wamt.collision.screenPointTest = function(target,x,y)
{
	var collisions = [];
	if(target instanceof wamt.Layer)
	{
		for(var i=0;i<target.objects.length;i++)
		{
			var object = target.objects[i];
			if(!object.collideable)
				continue;
			if((x >= object.screenX - (object.bounds[0]) && x <= object.screenX + (object.bounds[0])) && (y >= object.screenY - (object.bounds[1]) && y <= object.screenY + (object.bounds[1])))
				collisions.push(object);
		}
	}
	else
	{
		for(var l=0;l<target.layers.length;l++)
		{
			var layer = target.layers[l];
			for(var i=0;i<layer.objects.length;i++)
			{
				var object = layer.objects[i];
				if(!object.collideable)
					continue;
				if((x >= object.screenX - (object.bounds[0]) && x <= object.screenX + (object.bounds[0])) && (y >= object.screenY - (object.bounds[1]) && y <= object.screenY + (object.bounds[1])))
					collisions.push(object);
			}
		}
	}
	return collisions;
};
wamt.collision.layerObjectTest = function(a)
{
	var collisions = [];
	for(var i=0;i<a.layer.objects.length;i++)
	{
		var b = a.layer.objects[i];
		if(!b.collideable || b == a)
			continue;
		if(!(b.x > a.x + a.bounds[0] || b.x + b.bounds[0] < a.x || b.y > a.y + a.bounds[1] || b.y + b.bounds[1] < a.y))
			collisions.push(b);
	}
	return collisions;
};
wamt.collision.sceneObjectTest = function(a)
{
	var collisions = [];
	for(var l=0;l<a.scene.layers.length;l++)
	{
		var layer = a.scene.layers[l];
		for(var i=0;i<layer.objects.length;i++)
		{
			var b = layer.objects[i];
			if(!b.collideable || b == a)
				continue;
			if(!(b.x > a.x + a.bounds[0] || b.x + b.bounds[0] < a.x || b.y > a.y + a.bounds[1] || b.y + b.bounds[1] < a.y))
				collisions.push(b);
		}
	}
	return collisions;
};