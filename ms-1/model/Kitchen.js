// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var KitchenSchema = new Schema({
  restaurantname: String,
  address: String,
  city: String,
  ownerId : { type: Schema.Types.ObjectId, ref:'Owner', required: true},
  zipcode: String,
  country: String,
  lat: String,
  lng: String,
  loc : {type: [Number], index: '2d'},
  phoneno1: Number,
  phoneno2: Number,
  phoneno3: Number,
  phoneno4: Number,
  logo: String,
  image: [],
  partners : [{
              firstname : String,
              lastname : String
            }],
  status: { type: Boolean, default: true },
  created_at : { type: Date, default: Date.now }, 
  updated_at : { type: Date, default: Date.now }, 
  cuisines : [],
  activestatus : {type : Boolean, default: false},
  cancelPolicy: String,
  reschedulingPolicy: String,
  deliveryChargesPolicy: String,
  paymentPolicy: String,
  openinghours : [],  
 openingstatus : String,
 kitchenservices: Array,
 kitchencapacity : String,
 cateringcapacity : String,
 offerings : Array,
 fastestdelivery : {type : Boolean, default: false},
 minimumorder : String,
 mindeliveryime : String,
 bakeryitems :String,
 foodtype : Array,
 deliveryservice : {status : "", value : ""},
 documentation : Array,
 bankinginformation : Array,
 tax: {status : "", value : ""},
 serviceAllow: {"daliymenuservice": {type: Boolean, default: false}, "cateringservice": {type: Boolean, default: false}, "mealpackageservice": {type: Boolean, default: false}, "comboservice": {type: Boolean, default: false}}
});

// the schema is useless so far
// we need to create a model using it
var Kitchen = mongoose.model('Kitchen', KitchenSchema);

// make this available to our users in our Node applications
module.exports = Kitchen;