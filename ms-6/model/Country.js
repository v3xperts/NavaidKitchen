var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var CountrySchema = new Schema({
    countryName: { type: String, required: true, unique: true},
    activestatus : { type : Boolean , default: false}
});

var Country = mongoose.model('Country', CountrySchema);

module.exports = Country;