/*
	@title behaviours/projectile.js
	@author Zack0Wack0/zack0wack0.com
	@package wamt.js
*/
wamt.behaviours.projectile = {};
wamt.behaviours.projectile.init = function(obj)
{
	obj._pjsc = false;
	obj._pjg = 0;
	obj._pjar = 0;
};
wamt.behaviours.projectile.setSceneColliding = function(obj,sc)
{
	obj._pjsc = sc;
};
wamt.behaviours.projectile.setGravity = function(obj,g)
{
	obj._pjg = g;
};
wamt.behaviours.projectile.setAirResistance = function(obj,ar)
{
	obj._pjar = ar;
};
wamt.behaviours.projectile.fire = function(obj,vx,vy)
{
	obj.setVelocity(vx,vy);
};
wamt.behaviours.projectile.velocity = function(obj)
{
	if(obj._pjar != 0)
		obj.velocity[0] *= 1 - obj._pjar;
	if(obj._pjg != 0)
		obj.velocity[1] += obj._pjg * 0.01;
	obj.translate(obj.velocity[0],obj.velocity[1]);
	obj.processEvent("move",{object:obj});
};
wamt.behaviours.projectile.prelogic = function(obj)
{
};
wamt.behaviours.projectile.logic = function(obj)
{
};
wamt.behaviours.projectile.pretick = function(obj)
{
	if(obj._pjsc)
		var col = wamt.collision.sceneObjectTest(obj);
	else
		var col = wamt.collision.layerObjectTest(obj);
	if(col.length)
	{
		obj.processEvent("collision",{object:obj,collisions:col});
	}
};
wamt.behaviours.projectile.tick = function(obj)
{
};
wamt.behaviours.projectile.prerender = function(obj)
{
};
wamt.behaviours.projectile.render = function(obj)
{
};