var nodemailer = require('nodemailer');
var ejs = require('ejs');
var randomstring = require("randomstring");

var emailFrom = 'customersupport@mealdaay.com';

var templateDir = '/NavaidKitchen/ms-6/email_template';
//var templateDir = '../ms-3/email_template';

var transporter = nodemailer.createTransport({
   service: "Gmail",  // sets automatically host, port and connection security settings
   auth: {
       user: "customersupport@mealdaay.com",
       pass: "mealdaay123"
   }
});


module.exports = {

    forgetEmailShoot: function(customer) {
        console.log(customer);
        customer['resetPassLink'] = 'http://mealdaay.com:3004/admin/reset-password/'+customer._id;
        // rendering html template (same way can be done for subject, text)
        var html = ejs.renderFile(templateDir + '/forgetPassword.ejs', {customer : customer},
            function(err, data) {
                if (err) {
                    console.log(err);
                }
                return data;
            });

        //build options
        var options = {
            from: emailFrom,
            to: customer.username,
            subject: 'Mealdaay admin reset password',
            html: html,
            text: 'text'
        };
        sendmail(options);
    }
};


function sendmail(options){
    transporter.sendMail(options, function(error, info) {
        if (error) {
            console.log('Message not sent');
            console.log(error);
            return false;
        } else {
            console.log('Message sent Successfully !!!');
            return true;
        };
    });
}