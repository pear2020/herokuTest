const Order_2 = require("./Order_2.js");
const Order = require("./Order.js");

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    ITEMS:       Symbol("items"),
    SIZE:        Symbol("size"),
    TOPPINGS:    Symbol("toppings"),
    DRINKS:      Symbol("drinks"),
    IfOtherItems: Symbol("IfOtherItems"),
    AskUpsell:    Symbol("AskUpsell")
});

let chooseitems = (num) => {
    let items = ["pizza", "pasta", "soup"]
    return items[num - 1];
 }
 let 
 availableSizes = (item) => {
    let sizes = {"pizza": ["6inch","9inch","12inch"],
                 "pasta":["medium","large"],
                 "soup":["small","medium","large"]}
    return sizes[item];
 }
 let availableToppings = (item) => {
    let toppings = {"pizza": ["broccoli","sausage","eggplant"],
                 "pasta":["LEMON ARTICHOKE","TOMATO","MUSHROOM AND CREAM"],
                 "soup":["Chopped herbs","Dusting of spice","Lemon zest"]}
    return toppings[item];
 }
 // price
let basePriceDict = (item) =>{
    let priceDict = {};
    switch(item){
        case "pizza":
            priceDict = {"6inch":10,"9inch":15,"12inch":18};
            break;
        case "pasta":
            priceDict = {"medium":8,"large":10};
            break;  
        case "soup":
            priceDict = {"small":5,"medium":7,"large":9};
            break;  
    }
    return priceDict;
}

 let basePrice = (item,size)=>{
    return basePriceDict(item)[size]
 }

 let toppingpriceDict = (item) =>{
    let toppingpriceDict = {};
    switch(item){
        case "pizza":
            toppingpriceDict = {"broccoli":2,"sausage":5,"eggplant":3};
            break;
        case "pasta":
            toppingpriceDict = {"LEMON ARTICHOKE":3,"TOMATO":2,"MUSHROOM AND CREAM":3};
            break;  
        case "soup":
            toppingpriceDict = {"Chopped herbs":2,"Dusting of spice":3,"Lemon zest":1.5};
            break;  
    }
    return toppingpriceDict;
}
let upsellDict ={"nothing":0,"drinks":4,"Tiramisu":8}

let upsell = ["nothing","drinks", "Tiramisu"]

 let addTotalPrice = (upsell)=>{
    let totalprice_dr = 0;
    for(var o in orders){
        totalprice_dr += orders[o].sTotalPrice;
    }
    totalprice_dr += upsellDict[upsell];
    return totalprice_dr;
 }

 let foreachArray = (type,item) => {
    let dict = {};
    switch(type){
        case "basePriceDict":
            dict = basePriceDict(item)
            break;
        case "toppingpriceDict":
            dict = toppingpriceDict(item)
            break;
        case "upsellDict":
            dict = upsellDict
            break;    
    }
    let str = "";
    let count = 0;
    for(var key in dict){
        if (dict.hasOwnProperty(key)) {          
            console.log(key, dict[key]);
            str += " "+ count +" for " + key + "($"+ dict[key]+  ");" ;
            count++
        }
    }
    return str;
 };

let orders = [];


module.exports = class ShwarmaOrder extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sitems = "";
        this.sSize = "";
        this.sToppings = "";
        this.sDrinks = "";
        this.sprice = 0;
        this.sdateTime = "";
    }
    handleInput(sInput){
      let aReturn = [];
      switch(this.stateCur){
          case OrderState.WELCOMING:
              this.stateCur = OrderState.ITEMS;
              aReturn.push("Welcome to Richard's Shawarma.");
              aReturn.push("menu: 1 for pizza, 2 for pasta, 3 for soup");
              aReturn.push("which items would you like?");
              break;
         case OrderState.ITEMS:
             this.stateCur = OrderState.SIZE;
             if(this.sitems == "" || this.sitems == undefined){
              this.sitems = chooseitems(sInput);
              if(this.sitems == undefined){
                  aReturn.push("You must choose from menu. Press random key to re-input")
                  this.stateCur = OrderState.WELCOMING;
                  break;
                 }
             }
             console.log(`this.sitems is ${this.sitems}`)
             console.log(`availableSizes is ${availableSizes(this.sitems)}`)
             let askSize = foreachArray("basePriceDict",this.sitems);
             aReturn.push("which size would you like?");
             aReturn.push(`${askSize}`);
              break;
          case OrderState.SIZE:
              this.stateCur = OrderState.TOPPINGS // 下一个问题
              if(this.sSize == "" || this.sSize == undefined){
                  this.sSize = availableSizes(this.sitems)[sInput]; // 存入上一次的回答,计算baseprice
                  if(this.sSize == undefined){
                      aReturn.push("You must choose from menu. Press random key to re-input")
                      this.stateCur = OrderState.ITEMS;
                      break;
                     }
                     this.sprice = basePrice(this.sitems,this.sSize);
                     console.log(`this.sSize is ${this.sSize}`);
                 }    
              let asksToppings = foreachArray("toppingpriceDict",this.sitems);
              aReturn.push("What toppings would you like?");
              aReturn.push(`${asksToppings}`);
              break;
          case OrderState.TOPPINGS:
              this.stateCur = OrderState.IfOtherItems
              if(this.sToppings == "" || this.sToppings == undefined){
                  this.sToppings = availableToppings(this.sitems)[sInput];
                  if(this.sToppings == undefined){
                      aReturn.push("You must choose from menu. Press random key to re-input")
                      this.stateCur = OrderState.SIZE;
                      break;
                     }
                 }
                 // save the order-item1
              this.sprice += toppingpriceDict(this.sitems)[this.sToppings]
              var order = new Order_2(this.sitems,this.sSize,this.sToppings,this.sprice,basePriceDict(this.sitems)[this.sSize],toppingpriceDict(this.sitems)[this.sToppings]);
              //console.log(`***sitem:${this.sitems};sSize:${this.sSize};sToppings:${this.sToppings};totalprice:${this.sprice}`)
              orders.push(order)
              for(var o in orders){
                  console.log(`***sitem:${orders[o].sitems};sSize:${orders[o].sSize};sToppings:${orders[o].sToppings};totalprice:${orders[o].sTotalPrice}`)
              }
              // another item
              aReturn.push("Would you like other items? (y or n) ");
              break;
          case OrderState.IfOtherItems:
                 switch(sInput){
                      case "y":
                          this.stateCur = OrderState.WELCOMING
                          this.sitems = "";
                          this.sSize = "";
                          this.sToppings = "";
                          this.sprice = "";
                          aReturn.push("Press random key to continue ");
                          break;
                      case "n":
                          this.stateCur = OrderState.AskUpsell
                          aReturn.push("Press random key to continue ");
                          break;
                      default:
                          this.stateCur = OrderState.IfOtherItems
                          aReturn.push("Would you like other items? (y or n) ")
                          break;      
                 }
              break;
          case OrderState.AskUpsell:
                  this.stateCur = OrderState.DRINKS
                  aReturn.push("Would you like something else with that? ");
                  let asksDrinks = foreachArray("upsellDict",this.sitems);
                  aReturn.push(`${asksDrinks}`)
              break;            
          case OrderState.DRINKS:
              if(this.sDrinks == "" || this.sDrinks == undefined){
                  this.sDrinks = upsell[sInput]; 
                  if(this.sDrinks == undefined){
                      aReturn.push("You must choose from menu. Press random key to re-input")
                      this.stateCur = OrderState.AskUpsell;
                      break;
                     }
                  this.isDone(true);   
                 // console.log(`***sitem:${this.sitems};stoppings:${this.sToppings};Drinks:${this.sDrinks}`)
                 // this.sprice += addPrice(this.sitems,this.sToppings,this.sDrinks)
                  this.sprice = addTotalPrice(this.sDrinks)
                  aReturn.push("Thank-you for your order of");
                  for(var o in orders){
                      aReturn.push(`${orders[o].sSize} ${orders[o].sitems} $${orders[o].sitemPrice} with ${orders[o].sToppings} $${orders[o].sToppingPrice}; Price is $${orders[o].sTotalPrice}`);
                  }
                  if(this.sDrinks != "nothing"){
                      aReturn.push(`${this.sDrinks}; Price is $${upsellDict[this.sDrinks]}`);
                  }
                  aReturn.push(` Total Price is $${this.sprice} `)
                  aReturn.push(`Please pay for your order here`);
                  aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                  break;
                 }
          case OrderState.PAYMENT:
                 // console.log(sInput);
                 try {
                  let address = sInput['purchase_units'][0]['shipping']['address']
                  let addressStr = address['address_line_1']+", "+address['admin_area_2']+", "+address['admin_area_1']+", "+address['postal_code']+", "+address['country_code']
                  this.isDone(true);
                  let d = new Date();
                  d.setMinutes(d.getMinutes() + 20);
                  aReturn.push(`Your order will be delivered at ${d.toTimeString()} to ${addressStr}`);
                   // clean
                   orders.length = 0;
                 } catch (error) {
                    aReturn.push(`Please pay for your order here`);
                    aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                 }
                 break;
                 
      }
      return aReturn;
  }
    renderForm(sTitle = "-1", sAmount = "-1"){
      // your client id should be kept private
      if(sTitle != "-1"){
        this.sItem = sTitle;
      }
      if(sAmount != "-1"){
        this.nOrder = sAmount;
      }
      const sClientID = process.env.SB_CLIENT_ID
    //  const sClientID = "AeCo-IWepmHt0a0yVInfViksALhq0wpo-rLtTc5jgyd5vTr_DDk311hOgyDEj-tWN-lm2rWMvLV8KiJg" || 'put your client id here for testing ... Make sure that you delete it before committing'
      return(`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your ${this.sitems} order of $${this.sprice}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.sprice}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);
  
    }
}