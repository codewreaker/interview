//@ts-ignore
Array.prototype.myMap = function<T, U>(predicate:(item:T, index:number, array:T[])=>U): U[]{
    const len = this.length;
    const result:U[] = [];
    for (let i=0;i<len;i++){
        result[i] = predicate(this[i], i, this)
    }
    return result;
}

//@ts-ignore
Array.prototype.myFilter = function<T>(predicate:(item:T, index:number, array:T[])=>boolean):T[]{
    const len = this.length;
    const result:T[] = [];
    for (let i=0;i<len;i++){
        if(Boolean(predicate(this[i], i, this)) === true){
            result.push(this[i])
        }
    }
    return result;
}

//@ts-ignore
Array.prototype.myReduce = function<T, P, O=any[]>(predicate:(acc:T,curr:P, array:O )=>T, initial:any){
    const len = this.length;
    let accumulator = initial ?? this[0];
    let i = (initial == null || initial === undefined) ? 1:0;

    for (i;i<len;i++){
        accumulator = predicate(accumulator, this[i], this)
    }
    return accumulator;
}
