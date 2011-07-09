function resolver(global)
{
    /**
     * string with name to resolve and an optional boolean stating if the resolve can be undefined
     *
     * or
     *
     * { name: , generator: , allowUndefined: }
     */
    return function(name,allowUndefined) {
        var _generator, names;
        if (typeof name == "object") {
            _generator = name.generator;
            name = name.name;
            names = name.split(".");
            if (allowUndefined == undefined) allowUndefined = name.allowUndefined || name.allowNull;
        }
        else {
            names = name.split(".");
        }
        var top = global;
        for (var j = 0, n; n = names[j]; ++j) {
            var prev_top = top;
            top = top[n];
            if (top == undefined) {
                if (_generator) {
                    top = prev_top[n] = _generator();
                }
                else {
                    if (!allowUndefined) throw new Error("The '" + n + "' part of '" + name + "' couldn't be resolved.");
                    return null;
                }
            }
        }
        return top;
    };
}
resolver.top = {};

var resolve = resolver(resolver.top);

// if (typeof pGlobals == "object" && typeof pGlobals.length == "undefined") pGlobals = [pGlobals];
// for (var i = 0, g; g = pGlobals[i]; ++i) {
//     var fResolved = _resolve(g, pName, false);
//     if (fResolved) return fResolved
// }


function generator(baseConstr,variant)
{
	variant = variant || null; // defaults to null
	
	var info = { constructor: baseConstr, func: baseConstr, construction: [] };
	
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
	
	if (baseConstr.generator_variants && baseConstr.generator_variants[variant]) {
		info = baseConstr.generator_variants[variant];

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
 
generator.setBase = function(baseConstr,mHandlers,pConstruction,v1,v2,v3,v4)
{
	// ensure that variants map is present on base constructor
	baseConstr.generator_variants = baseConstr.generator_variants || { };
	
	baseConstr.generator_variants[null] = {
		func: baseConstr,
		handlers: mHandlers	|| {},
		construction: pConstruction || [],
		additional: [v1,v2,v3,v4] 
	};
};

generator.setVariant = function(baseConstr,variant,variantConstr,mHandlers,pConstruction,v1,v2,v3,v4)
{
	variant = variant || null; // defaults to null
	
	// ensure that variants map is present on base constructor
	baseConstr.generator_variants = baseConstr.generator_variants || {}; 

	//TODO blend with previous config
	baseConstr.generator_variants[variant] = { 
		func: variantConstr,
		handlers: mHandlers || {},
		construction: pConstruction || [],
		additional: [v1,v2,v3,v4] 
	}; 
};

 
generator.setVariantGenerator = function(baseConstr,variant,fGenerator,mHandlers,pConstruction,v1,v2,v3,v4)
{
	variant = variant || null; // defaults to null
	
	// ensure that variants map is present on base constructor
	baseConstr.generator_variants = baseConstr.generator_variants || {}; 

	baseConstr.generator_variants[variant] = { 
		generator: fGenerator,
		handlers: mHandlers || {},
		construction: pConstruction || [],
		additional: [v1,v2,v3,v4] 
	}; 
};

generator.setHandlers = function(constr,mHandlers)
{
       // morph arguments generator -> constructor
       // unknown variant
       // configuration finalize
       // pool size change
       // unload
};
 
/* setArguments ( config,config,config )
*
 * { call: myfunc, obj: myobj, params: [] }
* { generate: MyBase, variant: "one" }
* { constant: 1 }
*/
generator.setArguments = function(mFirst,mSecond)
{
};
 
/**
 * Configure the base constructor to generate a singleton of a specific variant
 */
generator.setSingleton = function(baseConstr,variant)
{
	// ensure that variants map is present on base constructor
	baseConstr.generator_variants = fConstructor.generator_variants || {}; 
	baseConstr.generator_variants[null] = fConstructor.generator_variants[null] || {};
	
	baseConstr.generator_variants[null].default_variant = variant || null; // defaults to null
	baseConstr.generator_variants[null].singleton = null;
};

 
/**
 * Configure the base constructor to generate a instances of a specific variant limited by a pool size
 */
generator.setPoolSize = function(baseConstr,variant,nSize)
{
	// ensure that variants map is present on base constructor
	baseConstr.generator_variants = baseConstr.generator_variants || {}; 
	baseConstr.generator_variants[null] = baseConstr.generator_variants[null] || {};
	
	baseConstr.generator_variants[null].default_variant = variant || null; // defaults to null
	baseConstr.generator_variants[null].pool = {};
	baseConstr.generator_variants[null].pool_size = nSize;
};

