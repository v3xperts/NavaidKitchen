var nodemailer = require('nodemailer');
var ejs = require('ejs');
var randomstring = require("randomstring");

var emailFrom = 'navaidkitchen@gmail.com';

var templateDir = '/NavaidKitchen/ms-3/email_template';
//var templateDir = '../ms-3/email_template';

var transporter = nodemailer.createTransport({
   service: "Gmail",  // sets automatically host, port and connection security settings
   auth: {
       user: "navaidkitchen@gmail.com",
       pass: "navaidkitchennavaidkitchen"
   }
});


module.exports = {

    emailShoot: function(emailTo, username, id) {

        /*console.log(emailTo, username, id);*/

        // rendering html template (same way can be done for subject, text)
        var html = ejs.renderFile(templateDir + '/register.ejs', { username: username , token: id},
            function(err, data) {
                if (err) {
                    console.log(err);
                }
                return data;
            });

        //build options
        var options = {
            from: emailFrom,
            to: emailTo,
            subject: 'Activate Account',
            html: html,
            text: 'text'
        };
        sendmail(options);
    },

emailAdminShoot: function(emailTo, username, id, password) {

        console.log(emailTo, username, id);

        // rendering html template (same way can be done for subject, text)
        var html = ejs.renderFile(templateDir + '/register.ejs', { username: username , password : password, token: id},
            function(err, data) {
                if (err) {
                    console.log(err);
                }
                return data;
            });

        //build options
        var options = {
            from: emailFrom,
            to: emailTo,
            subject: 'Activate Account',
            html: html,
            text: 'text'
        };
        sendmail(options);
    },

    forgetEmailShoot: function(customer, type) {
        console.log(customer);
        if (type == 'cust') {
            customer['resetPassLink'] = 'http://mealdaay.com/customers/reset-password/'+customer._id;
            /*customer['resetPassLink'] = 'http://localhost:4200/customer/reset-password/'+customer._id;*/
        }else{
            customer['resetPassLink'] = 'http://mealdaay.com/admin/reset-password/'+customer._id;
            /*customer['resetPassLink'] = 'http://localhost:4200/admin/reset-password/'+customer._id;*/
        }

        console.log(customer);

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
            to: customer.firstname + " <" + customer.email + " >",
            subject: 'Reset Password',
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