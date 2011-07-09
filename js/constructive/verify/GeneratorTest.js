Test.setUp = function()
{
};

function Base()
{
};

function Variant1()
{
};
caplin.extend(Variant1,Base);
generator.setVariant(Base,"one",Variant1);

Test.generator = function()
{
	assertEquals(Base, citadel.generator(Base).constructor);
	assertEquals(Variant1, generator(Base,"one").constructor);
	assertEquals(Base, generator(Base,"unknown").constructor);
};

function SingleBase()
{
}
generator.setBase(SingleBase,{},[{ method:"init", args:[] }]);

SingleBase.prototype.init = function()
{
	this.initCalled = true;
};
	
generator.setSingleton(SingleBase);

Test.singleton = function()
{
	var instance = generator(SingleBase)()
//	assertTrue(instance.initCalled);
	
	var instance2 = generator(SingleBase)();
	assertEquals(instance,instance2);
};