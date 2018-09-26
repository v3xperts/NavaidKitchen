var express = require('express');
var router = express.Router();
var Customer = require('../model/customer.js');
var emails = require('../mail/emailConfig.js');



router.post('/multiple', function(req, res, next) {  
    var response={};
    Customer.find({"_id": {"$in" : req.body.ids}}, null, {sort: {created_at: 1}},function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : data};
        };
        console.log(response);
        res.json(response);
    }); 
});



/*router.post('/signup',function(req, res) {
    
    var response = {};
    req.body.username = req.body.username.toLowerCase();
    var cust = new Customer(req.body);

    cust.save(function (err, data) {
        if (err) {

            response = {"error": true, "message": err};
        } else {
            if(req.body.accounttype){
            }else{
            emails.emailShoot(req.body.email, req.body.username, data._id);
            }
            response = {"error": false, "message": "Registration successful"};
        }
        res.json(response);
    });
});
*/



router.post('/signup',function(req, res) {
    // if (typeof req.body.accounttype == 'undefined' || req.body.accounttype == null || req.body.accounttype.trim() == '') {
    //     req.body.accounttype = 'customer'
    // }

	Customer.find({ username: req.body.username.toLowerCase()},function(err,customer) {
        if (err) {
            res.json({error:true, message: 'Error fetching data'});
        }else{
            if(customer && customer.length > 0){
                if (customer[0]['accounttype'] == 'customer') {
                    res.json({error:true, message: 'Customer already exists.'});
                }else{
                    res.json({error:false, message: customer[0]});
                }
            }else{
                var response = {};
                req.body.username = req.body.username.toLowerCase();
            	var cust = new Customer(req.body);

            	cust.save(function (err, data) {
            		if (err) {

            			response = {"error": true, "message": err};
            		} else {
                        if(req.body.accounttype){
                        }else{
                        emails.emailShoot(req.body.email, req.body.username, data._id);
                        }
            			response = {"error": false, "message": "Registration successful"};
            		}
            		res.json(response);
            	});
            }
        };
    });
});


router.post('/login', function(req, res, next) {
    Customer.find({ username: req.body.username.toLowerCase(), password:req.body.password},function(err,customer) {
        if (err) {
            res.json({error:true, data: err});
            }else{
            if(customer && customer.length > 0){
                if(customer[0].status){
                Customer.update({ "_id": customer[0]._id },{"timezone": req.body.timezone}, function(err, data){
                    res.json({error:false, data: customer[0]});
                });
                }else{
                 res.json({error: true, data: 'Account not activated Yet. Please Check Your email And Activate account.'})   
                }
                }else{
                res.json({error:true, data: 'No Customer with provided credentials.'});
            }
        };
    });
});


router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

router.post('/forget-password', function(req,res,next){
    var response={};
    Customer.find({email:req.body.email},function(err,data){
        if (err) {
            req.flash('error', 'something went wrong!');            
        } else{
            if (data.length>0) {
                emails.forgetEmailShoot(data[0], 'cust');
               /* var name = data[0].firstname+" <"+data[0].email+" >";
                var content = "Hi, <br> <br> Your userId <b>"+ data[0].username +"</b> Please click the below link to reset your password. <a href='http://mealdaay.com:3004/customer/reset-password/"+data[0]._id+"'>Click Here</a>"
                req.mail.sendMail({  //email options
                   from: "Restaurant Team <navaidkitchen@gmail.com>", // sender address.  Must be the same as authenticated user if using GMail.
                   to: name, // receiver
                   subject: "Reset Password", // subject
                   //text: "Email Example with nodemailer" // body
                   html: content
                }, function(error, response){  //callback
                   if(error){
                       console.log(error);
                   }
                   else{
                       console.log("Message sent: " + response.message);
                   }
                   req.mail.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
                   
                });*/
                // console.log(data);
                res.json({error:false});
            }else{
                res.json({error:true,message:'Email does not exist'});
            }
        };
    }); 
});

router.put('/change-password/:id',function(req, res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	Customer.findById(req.params.id,function(err,data){
		if (data.password == req.body.oldpassword) {
			var newObject = {};
			newObject.password = req.body.newpassword;
			Customer.findByIdAndUpdate(req.params.id, newObject, function(err, customer) {
		    	if(err) {
		            response = {"error" : true,"message" : err};
		        } else {
		            response = {"error" : false,"message" : "Password changed Successfully "};
		        }
		        res.json(response);
	        });
		}else{
			response = {"error" : true,"message" : "Password Incorect"};
			res.json(response);
		};
    });
});

router.get('/:id',function(req,res){
    var response={};
    console.log(req.params.id);
    Customer.findById(req.params.id,function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : data};
        };
        res.json(response);
    }); 
});

router.put('/:id',function(req, res){
    var response={};
    Customer.findByIdAndUpdate(req.params.id, req.body, function(err, owner) {
            if(err) {
                response = {"error" : true,"message" : err};
            } else {
                response = {"error" : false,"message" : "Data Update"};
            }
            res.json(response);
        });
});

router.delete('/:id',function(req,res){
    var response={};
    console.log(req.params.id);
    Customer.remove({_id:req.params.id},function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : "Deleted Successfully"};
        };
        res.json(response);
    }); 
});

router.get('/', function(req, res, next) {
    var response={};
    Customer.find({}, null, {sort: {created_at: 1}},function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : data};
        };
        console.log(response);
        res.json(response);
    }); 
});



router.put('/referralpoint/:id',function(req, res){
    // if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }

    var response={};
    Customer.findByIdAndUpdate(req.params.id, req.body, function(err, customer) {
                if(err) {
                    response = {"error" : true,"message" : err};
                } else {
                    response = {"error" : false,"message" : "Points changed Successfully "};
                }
                res.json(response);
            });
    });

module.exports = router;