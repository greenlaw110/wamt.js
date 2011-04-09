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
		if(!b.collideable)
			continue;
		if(Math.abs(a.x - b.x) * 2 < a.bounds[0] + b.bounds[0] && Math.abs(a.y - b.y) * 2 < a.bounds[1] + b.bounds[1])
			collisions.push(b);
	}
	return collisions;
/*(abs(a.x - b.x) * 2 < (a.width + b.width)) &&
         (abs(a.y - b.y) * 2 < (a.height + b.height))*/
};