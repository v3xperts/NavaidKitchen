var nodemailer = require('nodemailer');
var ejs = require('ejs');
var randomstring = require("randomstring");

var emailFrom = 'no_reply@mealdaay.com';

var templateDir = '/NavaidKitchen/ms-1/email_template';
//var templateDir = '../ms-3/email_template';

var transporter = nodemailer.createTransport("SMTP", {
   service: "Gmail",  // sets automatically host, port and connection security settings
   auth: {
       user: "no_reply@mealdaay.com",
       pass: "Me@lD@@y786"
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
            subject: 'MealDaay - Restaurant Activation',
            html: html,
            text: 'text'
        };
        sendmail(options);
    }, 

    customerOrderEmailShoot: function(emailTo, username, order) {
        // rendering html template (same way can be done for subject, text)
        console.log("order", order);
        var html = ejs.renderFile(templateDir + '/customerOrder.ejs', { username: username , token: order._id.substr(18,6), order: order},
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
            subject: 'MealDaay - Restaurant Order',
            html: html,
            text: 'text'
        };
        sendmail(options);
    },

    customerOrderRejectedEmailShoot: function(emailTo, order) {
        // rendering html template (same way can be done for subject, text)
        console.log("order", order);
        var html = ejs.renderFile(templateDir + '/customerOrderRejected.ejs', {username: order.customerid.email, token: order._id.substr(18,6), order: order},
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
            subject: 'MealDaay - Restaurant Order',
            html: html,
            text: 'text'
        };
        sendmail(options);
    },

     kitchenOrderRejectedEmailShoot: function(emailTo, order) {
        // rendering html template (same way can be done for subject, text)
        console.log("order", order);
        var html = ejs.renderFile(templateDir + '/customerOrderCancel.ejs', {username: order.customerid.email, token: order._id.substr(18,6), order: order},
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
            subject: 'MealDaay - Restaurant Order',
            html: html,
            text: 'text'
        };
        sendmail(options);
    }, 
    restroOrderEmailShoot: function(emailTo, username, order) {
        console.log("order", order);
        // rendering html template (same way can be done for subject, text)
        var html = ejs.renderFile(templateDir + '/restroOrder.ejs', { username: username , token: order._id.substr(18,6), order: order},
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
            subject: 'MealDaay - Restaurant Order',
            html: html,
            text: 'text'
        };
        sendmail(options);
    },
    driveremailShoot: function(emailTo, username, id) {

        console.log(emailTo, username, id);

        // rendering html template (same way can be done for subject, text)
        var html = ejs.renderFile(templateDir + '/driver.ejs', { username: username , token: id},
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
            subject: 'MealDaay - Driver Activation',
            html: html,
            text: 'text'
        };
        sendmail(options);
    },

    referalShoot: function(emailTo, id) {

        // rendering html template (same way can be done for subject, text)
        var html = ejs.renderFile(templateDir + '/referal.ejs', {token: id},
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

        customer['resetPassLink'] = 'https://mealdaay.com/owner/resetpassword/'+customer._id;

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
    },
    driverForgetEmailShoot: function(emailTo, username, token) {
            var customer = {'resetPassLink': 'https://mealdaay.com/customer/driver/reset-password/'+token};
            // customer['resetPassLink'] = 'http://mealdaay.com/customer/driver/reset-password/'+token;

        // rendering html template (same way can be done for subject, text)
        var html = ejs.renderFile(templateDir + '/driverForgetPassword.ejs', {"customer" : customer, "username": username},
            function(err, data) {
                if (err) {
                    console.log(err);
                }
                return data;
            });

        //build options
        var options = {
            from: emailFrom,
            to: username + " <" + emailTo + " >",
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