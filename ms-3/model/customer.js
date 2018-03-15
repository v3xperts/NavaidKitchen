var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
  firstname: String,
  lastname: String,
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: String,
  homephone: String,
  cellphone: String,
  gender : String,
  termsandcondition : String,
  status: { type: Boolean, default: false },
  customerpoints : { type: Number, default: 15 },
  customerfavrestro : [],
  timezone: String,
  cardinfo: [{ cardtype : String, nameoncard : String, cardnumber : String, expirymonth : String, expiryyear : String, default: { type: Boolean, default: false }}],
  customeraddresses : [{ lat : String, lng : String, phoneno : String, landline : String, address : String, 
                      landmark : String, city : String, zipcode : String, country : String, default: {type: Boolean, default: false} }],

});

var Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;