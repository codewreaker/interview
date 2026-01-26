const isPrimitive=(value)=>Boolean(typeof value !== "object" || value ===null);

export const flatten=(values)=>{
    if(isPrimitive(values)) return values;

    if(Array.isArray(values)){
        return values.reduce((acc, curr)=>(acc.concat(flatten(curr))),[])
    }

    return Object.entries(values).reduce((acc, [k,v])=>{
        acc[k] = flatten(v)
        return acc;
    },{})
}