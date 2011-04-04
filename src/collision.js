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