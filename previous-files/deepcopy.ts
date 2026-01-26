const isPrimitive=(value)=>Boolean((typeof value !== "object" || value === null));

export const deepcopy = (values) => {
    if(isPrimitive(values)) return values; 

    if (Array.isArray(values)){
        return values.map(deepcopy);
    }

    return Object.entries(values).reduce((acc, [k,v])=>{
        acc[k] = deepcopy(v);
        return acc
    },{});
}