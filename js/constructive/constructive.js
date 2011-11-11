/**
 * @param {Object} ns Namespace base (Optional)
 * " 
 * @param {Object} options Options { generator: function } (Optional) 
 */
function Resolver(name,ns,options)
{
	switch(typeof(name)) {
	case "undefined":
		// Resolver()
		return Resolver.top;
		
	case "string":
		// Resolver("abc")
		// Resolver("abc",{})
		// Resolver("abc",{},{options})
		if (Resolver[name] == undefined) {
			if (options == undefined) { options = ns; ns = {}; }
			Resolver[name] = Resolver(ns,options);
			}
		return Resolver[name];
	}

	// Resolver({})
	// Resolver({},{options})
	options = ns || {};
	ns = name;
	var _generator = options.generator || Generator(Object); //TODO faster default

	function _resolve(names,onundefined) {
        var top = ns;
        for (var j = 0, n; n = names[j]; ++j) {
            var prev_top = top;
            top = top[n];
            if (top == undefined) {
                switch(onundefined) {
                case undefined:
                case "generate":
                    top = prev_top[n] = _generator();
                    break;
                case "null":
                    return null;
                case "throw":
                	throw new Error("The '" + n + "' part of '" + names.join(".") + "' couldn't be resolved.");
                }
            }
        }
        return top;
	}
	
    /**
     * @param name To resolve
     * @param onundefined What to do for undefined symbols ("generate","null","throw")
     */
    function resolve(name,onundefined) {
        if (typeof name == "object") {
            return _resolve(name.name.split("."),name.onundefined);
        }
        else {
            return _resolve(name.split("."),onundefined);
        }
    };

    resolve.namespace = ns;
    
    resolve.declare = function(name,value,onundefined) 
    {
        var names = name.split(".");
        var symbol = names.pop();
    	var base = _resolve(names,onundefined);
    	if (base[symbol] === undefined) base[symbol] = value;
    };

    resolve.set = function(name,value,onundefined) 
    {
        var names = name.split(".");
        var symbol = names.pop();
    	var base = _resolve(names,onundefined);
    	base[symbol] = value;
    };

    return resolve;
}
Resolver.top = Resolver({});

var resolve = Resolver(Resolver.top);

// if (typeof pGlobals == "object" && typeof pGlobals.length == "undefined") pGlobals = [pGlobals];
// for (var i = 0, g; g = pGlobals[i]; ++i) {
//     var fResolved = _resolve(g, pName, false);
//     if (fResolved) return fResolved
// }


function Generator(baseConstr,variant)
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
 
Generator.setBase = function(baseConstr,mHandlers,pConstruction,v1,v2,v3,v4)
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

Generator.setVariant = function(baseConstr,variant,variantConstr,mHandlers,pConstruction,v1,v2,v3,v4)
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

 
Generator.setVariantGenerator = function(baseConstr,variant,fGenerator,mHandlers,pConstruction,v1,v2,v3,v4)
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

Generator.setHandlers = function(constr,mHandlers)
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
Generator.setArguments = function(mFirst,mSecond)
{
};
 
/**
 * Configure the base constructor to generate a singleton of a specific variant
 */
Generator.setSingleton = function(baseConstr,variant)
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
Generator.setPoolSize = function(baseConstr,variant,nSize)
{
	// ensure that variants map is present on base constructor
	baseConstr.generator_variants = baseConstr.generator_variants || {}; 
	baseConstr.generator_variants[null] = baseConstr.generator_variants[null] || {};
	
	baseConstr.generator_variants[null].default_variant = variant || null; // defaults to null
	baseConstr.generator_variants[null].pool = {};
	baseConstr.generator_variants[null].pool_size = nSize;
};

