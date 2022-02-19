module.exports = class Order_2{
    // constructor(){
        
    //     this.sitems = "";
    //     this.sSize = "";
    //     this.sToppings = "";
    //     this.sTotalPrice = 0;
    // }
    constructor(sitems,sSize,sToppings,sTotalPrice,sitemPrice,sToppingPrice){
        
        this.sitems = sitems;
        this.sSize = sSize;
        this.sToppings = sToppings;
        this.sitemPrice = sitemPrice;
        this.sToppingPrice = sToppingPrice;
        this.sTotalPrice = sTotalPrice;
        console.log(`In this order, sitem:${this.sitems};sSize:${this.sSize};sToppings:${this.sToppings};totalprice:${this.sTotalPrice}`)
    }
    isDone(bDone){
        if(bDone){
            this.bDone = bDone;
        }
        return this.bDone;
    }
}