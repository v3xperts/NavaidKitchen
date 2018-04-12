// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var KitchenSchema = new Schema({
  restaurantname: String,
  address: String,
  city: { type : String, lowercase: true, trim: true},
  ownerId : {type: Schema.Types.ObjectId, ref:'Owner', required: true},
  zipcode: String,
  country: {type : String, lowercase: true, trim: true},
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
  preorderforlater: { type: Boolean, default: true },
  preorderforlaterafterdays: { type: Number, default: 2 },
  preorderforlatertodays: { type: Number, default: 60 },
  mealpackageallowdays: { type: Number, default: 2 },
  created_at : { type: Date, default: Date.now }, 
  updated_at : { type: Date, default: Date.now }, 
  cuisines : [],
  activestatus : {type : Boolean, default: false},
  cancelPolicy: String,
  reschedulingPolicy: String,
  deliveryChargesPolicy: String,
  paymentPolicy: String,
  advertisementpolicy: String,
  advertisepolicychangesandlegal: String,
  advertisepromotions: String,
  openinghours : [],  
 openingstatus : {type: String, default:'open'},
 kitchenservices: Array,
 kitchencapacity : String,
 cateringcapacity : String,
 offerings : Array,
 fastestdelivery : {type : Boolean, default: true},
 minimumorder : {type: String, default: 0},
 mindeliveryime : String,
 bakeryitems : {type : Boolean, default: false},
 foodtype : Array,
 deliveryservice : {status : {type : Boolean, default: true}, value : ""},
 documentation : [{"documentname": { type: String , default: ""}, "filename":{ type: String, default: "" } } ],
 bankinginformation : Array,
 tax: {status : "", value : ""},
 serviceAllow: {"daliymenuservice": {type: Boolean, default: true}, "cateringservice": {type: Boolean, default: false}, "mealpackageservice": {type: Boolean, default: false}, "comboservice": {type: Boolean, default: true}},
 completeprofilenameaddress : {type: Number, dafault : 0},
 completeprofileservice : {type: Number, dafault : 0},
 currency: { type : String, uppercase: true, trim: true },
 shortName: { type : String, uppercase: true, trim: true }
 });

// the schema is useless so far
// we need to create a model using it
var Kitchen = mongoose.model('Kitchen', KitchenSchema);

// make this available to our users in our Node applications
module.exports = Kitchen;