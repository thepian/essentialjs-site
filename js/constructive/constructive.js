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


function generator(constr,variant)
{
       var variantConstr = constr;
       function generator(a,b,c,d,e,f,g,h,i,j,k,l) {
              return new variantConstr(a,b,c,d,e,f,g,h,i,j,k,l);
       }
       if (constr.__id) {
              var mConstructor = citadel.generator.VARIANTS[constr.__id];
              if (mConstructor && mConstructor[variant]) {
                     variantConstr = mConstructor[variant];
              }
       }
       generator.constructor = variantConstr;
      
       return generator;
};
 
generator.LAST_ID = 0;
 
generator.VARIANTS = {};
 
generator.setVariant = function(baseConstr,variant,variantConstr)
{
       if (baseConstr.__id == undefined) {
              ++this.LAST_ID;
              baseConstr.__id = this.LAST_ID;
       }
       generator.VARIANTS[baseConstr.__id] = generator.VARIANTS[baseConstr.__id] || {};
 
       generator.VARIANTS[baseConstr.__id][variant] = variantConstr;
};
 
generator.setVariantGenerator = function(baseConstr,variant,variantConstr)
{
       if (baseConstr.__id == undefined) {
              ++this.LAST_ID;
              baseConstr.__id = this.LAST_ID;
       }
       generator.VARIANTS[baseConstr.__id] = generator.VARIANTS[baseConstr.__id] || {};
 
       generator.VARIANTS[conbaseConstrstr.__id][variant] = variantConstr;
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
 
generator.setSingleton = function(constr,sVariant)
{
};
 
generator.setPoolSize = function(constr,sVariant,nSize)
{
};
