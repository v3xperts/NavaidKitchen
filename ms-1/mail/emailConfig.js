var nodemailer = require('nodemailer');
var ejs = require('ejs');
var randomstring = require("randomstring");

var emailFrom = 'navaidkitchen@gmail.com';

var templateDir = '/NavaidKitchen/ms-1/email_template';
//var templateDir = '../ms-3/email_template';

var transporter = nodemailer.createTransport("SMTP", {
   service: "Gmail",  // sets automatically host, port and connection security settings
   auth: {
       user: "navaidkitchen@gmail.com",
       pass: "navaidkitchennavaidkitchen"
   }
});


module.exports = {
    
    emailShoot: function(emailTo, username, id) {

        console.log(emailTo, username, id);

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
            subject: 'Mealdaay Owner Activate Account',
            html: html,
            text: 'text'
        };
        sendmail(options);
    },

    referalShoot: function(emailTo, id) {

        console.log(emailTo, username, id);

        // rendering html template (same way can be done for subject, text)
        var html = ejs.renderFile(templateDir + '/referal.ejs', { username: username , token: id},
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
            subject: 'Mealdaay Owner Referral link',
            html: html,
            text: 'text'
        };
        sendmail(options);
    },


    partneremailShoot: function(emailTo, username, id) {

        console.log(emailTo, username, id);

        // rendering html template (same way can be done for subject, text)
        var html = ejs.renderFile(templateDir + '/partner.ejs', { username: username , token: id},
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
            subject: 'Mealdaay Partner Activate Account',
            html: html,
            text: 'text'
        };
        sendmail(options);
    },

emailAdminDriverShoot: function(username) {

        // rendering html template (same way can be done for subject, text)
        var html = ejs.renderFile(templateDir + '/adminfordriver.ejs', { username: username },
            function(err, data) {
                if (err) {
                    console.log(err);
                }
                return data;
            });

        //build options
        var options = {
            from: emailFrom,
            to: "ankurkumarphp@gmail.com",
            subject: 'Activate account for new driver',
            html: html,
            text: 'text'
        };
        sendmail(options);
    },

    forgetEmailShoot: function(customer, type) {
            customer['resetPassLink'] = 'http://mealdaay.com:3004/owner/reset-password/'+customer._id;

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
            to: customer.username + " <" + customer.email + " >",
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