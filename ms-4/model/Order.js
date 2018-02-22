var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema

var OrderSchema = new Schema({
restaurantid : { type: String, required: true },
customerid : { type: String, required: true },
ordertiming: Object,
note:String,
coupon:Object,
combo: [],
items:[],
package: [],
paymenttype : String,
total: Number,
subtotal: Number,
tax: Number,
discount: Number,
fulladdress : Object,
driverDetail : Object,
cardinfo : Object,
status : {type : String, default : 'received'},
created_at: { type: Date, default: Date.now },
cardPaidStatus: Object 
});

var Order = mongoose.model('Order', OrderSchema);

module.exports = Order;