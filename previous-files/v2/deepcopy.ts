
const isPrimitive=(val:any)=>(typeof val !== 'object' || val === null);
const isTrueObject=(obj:any)=>(Object.prototype.toString.call(obj)==='[object Object]') // {} , String

export const deepcopy=<T>(original:T | T[])=>{

    if(isPrimitive(original)) return original;
    
    if(Array.isArray(original)){
        return original.map(deepcopy);
    }

    if(isTrueObject(original)){
        const newObj = {};
        // if(Object.keys(original as object).length === 0) return original;
        //@ts-ignore
        for (const [k, v] of Object.entries(original)){
            newObj[k] = deepcopy(v)
        }
        return newObj
    }

    return original;

}