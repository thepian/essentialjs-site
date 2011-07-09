caplin.namespace("citadel.utilities");

/*
Handlers

	// morph arguments generator -> constructor
	// unknown variant
	// configuration finalize
	// pool size change
	// unload
	
	// domload, pageload, framesload

*/

/* setArguments ( config,config,config )
* 
* { arg:true } picks the next arg from generator call args
* { arg:3 } picks specific arg from generator call args
* { call: myfunc, obj: myobj, args: [] }
* { method: name, args: [] }
* { generate: MyBase, variant: "one" }
* { constant: 1 }
*/


citadel.generator = function(fConstructor,sVariant)
{
	sVariant = sVariant || null; // defaults to null
	
	var info = { constructor: fConstructor, func: fConstructor, construction: [] };
	
	function newGenerator(a,b,c,d,e,f,g,h,i,j,k,l) {
		// TODO map args using handler
		
		// args
		for(var i=0,l=info.construction.length; i<l; ++i) {
			//TODO call $_init
		}
		var object = new info.func(a,b,c,d,e,f,g,h,i,j,k,l);
		
		// setters and calls
		for(var i=0,l=info.construction.length; i<l; ++i) {
			//TODO call $_init
		}
		return object;
	}

	function singletonGenerator(a,b,c,d,e,f,g,h,i,j,k,l) {
		if (info.singleton == null) {
			info.singleton = new info.func(a,b,c,d,e,f,g,h,i,j,k,l); 
		}
		return info.singleton;
	}
	
	if (fConstructor.generator_variants && fConstructor.generator_variants[sVariant]) {
		info = fConstructor.generator_variants[sVariant];

		// explicit generator function
		if (info.generator) return info.generator;
		
		// singleton generator
		if (info.singleton !== undefined) {
			singletonGenerator.constructor = info.func;
			return singletonGenerator;
		}

		// pooled generator
		//TODO
		
		// regular new
	}
	newGenerator.constructor = info.func;
	
	return newGenerator;
};

citadel.generator.setBase = function(fConstructor,mHandlers,pConstruction,v1,v2,v3,v4)
{
	// ensure that variants map is present on base constructor
	fConstructor.generator_variants = fConstructor.generator_variants || { };
	
	fConstructor.generator_variants[null] = {
		func: fConstructor,
		handlers: mHandlers	|| {},
		construction: pConstruction || [],
		additional: [v1,v2,v3,v4] 
	};
};

citadel.generator.setVariant = function(fConstructor,sVariant,fVariant,mHandlers,pConstruction,v1,v2,v3,v4)
{
	sVariant = sVariant || null; // defaults to null
	
	// ensure that variants map is present on base constructor
	fConstructor.generator_variants = fConstructor.generator_variants || {}; 

	//TODO blend with previous config
	fConstructor.generator_variants[sVariant] = { 
		func: fVariant,
		handlers: mHandlers || {},
		construction: pConstruction || [],
		additional: [v1,v2,v3,v4] 
	}; 
};

citadel.generator.setVariantGenerator = function(fConstructor,sVariant,fGenerator,mHandlers,pConstruction,v1,v2,v3,v4)
{
	sVariant = sVariant || null; // defaults to null
	
	// ensure that variants map is present on base constructor
	fConstructor.generator_variants = fConstructor.generator_variants || {}; 

	fConstructor.generator_variants[sVariant] = { 
		generator: fGenerator,
		handlers: mHandlers || {},
		construction: pConstruction || [],
		additional: [v1,v2,v3,v4] 
	}; 
};

/**
 * Configure the base constructor to generate a singleton of a specific variant
 */
citadel.generator.setSingleton = function(fConstructor,sVariant)
{
	// ensure that variants map is present on base constructor
	fConstructor.generator_variants = fConstructor.generator_variants || {}; 
	fConstructor.generator_variants[null] = fConstructor.generator_variants[null] || {};
	
	fConstructor.generator_variants[null].default_variant = sVariant || null; // defaults to null
	fConstructor.generator_variants[null].singleton = null;
};

/**
 * Configure the base constructor to generate a instances of a specific variant limited by a pool size
 */
citadel.generator.setPoolSize = function(fConstructor,sVariant,nSize)
{
	// ensure that variants map is present on base constructor
	fConstructor.generator_variants = fConstructor.generator_variants || {}; 
	fConstructor.generator_variants[null] = fConstructor.generator_variants[null] || {};
	
	fConstructor.generator_variants[null].default_variant = sVariant || null; // defaults to null
	fConstructor.generator_variants[null].pool = {};
	fConstructor.generator_variants[null].pool_size = nSize;
};

citadel.utilities.Generator = function() {};

citadel.utilities.Generator.generator = citadel.generator;