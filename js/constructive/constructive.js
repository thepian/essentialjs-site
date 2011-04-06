function generator(fConstructor,sVariant)
{
       var fVariant = fConstructor;
       function generator(a,b,c,d,e,f,g,h,i,j,k,l) {
              return new fVariant(a,b,c,d,e,f,g,h,i,j,k,l);
       }
       if (fConstructor.__id) {
              var mConstructor = citadel.generator.VARIANTS[fConstructor.__id];
              if (mConstructor && mConstructor[sVariant]) {
                     fVariant = mConstructor[sVariant];
              }
       }
       generator.constructor = fVariant;
      
       return generator;
};
 
generator.LAST_ID = 0;
 
generator.VARIANTS = {};
 
generator.setVariant = function(fConstructor,sVariant,fVariant)
{
       if (fConstructor.__id == undefined) {
              ++this.LAST_ID;
              fConstructor.__id = this.LAST_ID;
       }
       citadel.generator.VARIANTS[fConstructor.__id] = citadel.generator.VARIANTS[fConstructor.__id] || {};
 
       citadel.generator.VARIANTS[fConstructor.__id][sVariant] = fVariant;
};
 
generator.setVariantGenerator = function(fConstructor,sVariant,fVariant)
{
       if (fConstructor.__id == undefined) {
              ++this.LAST_ID;
              fConstructor.__id = this.LAST_ID;
       }
       citadel.generator.VARIANTS[fConstructor.__id] = citadel.generator.VARIANTS[fConstructor.__id] || {};
 
       citadel.generator.VARIANTS[fConstructor.__id][sVariant] = fVariant;
};

generator.setHandlers = function(fConstructor,mHandlers)
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
 
generator.setSingleton = function(fConstructor,sVariant)
{
};
 
generator.setPoolSize = function(fConstructor,sVariant,nSize)
{
};
