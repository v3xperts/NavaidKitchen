// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var KitchenModel = require("../model/Kitchen.js");

// create a schema
var RefSchema = new Schema({
    referralfrom : {type: Schema.Types.ObjectId, ref:'Kitchen', required: true},
    status :  { type: Boolean, default: false },
    emailto : String,
    type : String
    });

// the schema is useless so far
// we need to create a model using it
var Referral = mongoose.model('Referral', RefSchema);

// make this available to our users in our Node applications
module.exports = Referral;