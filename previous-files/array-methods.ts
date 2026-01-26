//@ts-nocheck

Array.prototype.myMap = function (callback) {
    const len = this.length;
    const newArr = [];
    for (let i=0; i<len;i++){
      newArr.push(callback(this[i], i, this))
    }
    return newArr
  }
  
  Array.prototype.myFilter = function (callback) {
    const len = this.length;
    const newArr = [];
    for (let i=0; i<len;i++){
      const bool = callback(this[i], i, this);
      (bool === true) && newArr.push(this[i])
    }
    return newArr
  }
  
  Array.prototype.myReduce = function (callback, initialValue) {
    const len = this.length;
    let acc = (initialValue===undefined) ? this[0]:initialValue;
    for (let i = (initialValue === undefined) ? 1:0; i<len;i++){
        acc = callback(acc, this[i], i, this);
    }
    return acc;
  }