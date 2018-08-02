var express = require('express');
var router = express.Router();
var NodeGeocoder = require('node-geocoder');
var Customer = require('../model/customer.js');
var referralModel = require('../model/referral.js');



var options = {
    provider: 'google',
    httpAdapter: 'https', // Default 
    apiKey: null, // for Mapquest, OpenCage, Google Premier 
    formatter: null         // 'gpx', 'string', ... 
};
 
var geocoder = NodeGeocoder(options);

/*-------------------------------Start referral--------------------------------------------------------*/

router.post('/customerreferral',function(req,res,next) {

    var response={};
    Customer.find({email:req.body.emailto},function (err,data2) {
        if(data2.length>0){
            res.status(200).json({
               "error" : true,"message" : 'Email Already exist'
            });
        }else{
            var referral = new referralModel(req.body);
            referral.save(function(err, data){   
                if(err) {
                    response = {"error" : true,"message" : err};
                } else {
                     if (data) {
                        var content = "Referral Link <a href='http://mealdaay.com/customer/referralregister/"+data._id+"'>Click Here</a>"
                        console.log(content);
                        req.mail.sendMail({  //email options 
                            from: "Restaurant Team <navaidkitchen@gmail.com>", // sender address.  Must be the same as authenticated user if using GMail.
                           to: req.body.emailto, // receiver                                     
                           subject: "Sign Up by Referral", // subject
                           html: content
                        }, function(error, response){  //callback
                           if(error){
                               console.log(error);
                           }else{
                               console.log("Message sent: " + response.message);
                           }
                           req.mail.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
                           //res.json({error:false});                  
                        });
                     }
                     response = {"error" : false,"message" : data};
                }
                res.json(response);
            });
        }
    });
});

router.get('/customerreferral/:id',function(req,res){
    // if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }

    var response={};    
    referralModel.findById(req.params.id , function (err, data) {
        console.log(data);
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : data};
        };
        res.json(response);
    }); 

});



router.put('/customerreferral/:id',function(req, res){
    // if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    } 
    var response={};
        referralModel.findByIdAndUpdate(req.params.id, req.body, function(err, kitchen) {
            if(err) {
                response = {"error" : true,"message" : err};
            } else {
                response = {"error" : false,"message" : "Data Update"};
            }
            res.json(response);
        });
      });
/*-------------------------------END referral--------------------------------------------------------*/

/*-------------------------------Start FRONTEND SERVICE FOR Favourites--------------------------------------------------------*/

router.get('/favourite-list/:id', function(req, res, next) {
  var response={};
  Customer.find({_id: req.params.id}, null, {sort: {created_at: 1}},function(err,data){
    if (err) {
      response = {"error" : true,"message" : "Error fetching data"};
    } else{
      response = {"error" : false,"message" : data};
    };
    res.json(response);
  }); 
});

router.post('/favourite/:id',function(req, res){

 // if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    } 

 var response={};
 Customer.findById(req.params.id, function(err, favourite) {
  const index = favourite.customerfavrestro.findIndex(item => item === req.body.rid); 
  if(index === -1){
    favourite.customerfavrestro.push(req.body.rid); 
    favourite.save(function(err, data){
     if (err) {
      response = {"error" : true,"message" : "Error fetching data"};
    } else{
      response = {"error" : false,"message" : data};
    };
    res.json(response);
  });
  }else{
    favourite.customerfavrestro.splice(index, 1);
    favourite.save(function(err, data){
      if (err) {
        response = {"error" : true,"message" : "Error fetching data"};
      } else{
        response = {"error" : false,"message" : data};
      };
      res.json(response);
    }); 
  }
});
});


router.get('/favouriteitem-list/:id', function(req, res, next) {
  var response={};
  Customer.find({_id: req.params.id}, null, {sort: {created_at: 1}},function(err,data){
    if (err) {
      response = {"error" : true,"message" : "Error fetching data"};
    } else{
      response = {"error" : false,"message" : data};
    };
    res.json(response);
  }); 
});

router.post('/favouriteitem/:id',function(req, res){
 var response={};
 Customer.findById(req.params.id, function(err, favourite) {
  const index = favourite.favouriteitems.findIndex(item => item === req.body.rid); 
  if(index === -1){
    favourite.favouriteitems.push(req.body.rid); 
    favourite.save(function(err, data){
     if (err) {
      response = {"error" : true,"message" : "Error fetching data"};
    } else{
      response = {"error" : false,"message" : data};
    };
    res.json(response);
  });
  }else{
    favourite.favouriteitems.splice(index, 1);
    favourite.save(function(err, data){
      if (err) {
        response = {"error" : true,"message" : "Error fetching data"};
      } else{
        response = {"error" : false,"message" : data};
      };
      res.json(response);
    }); 
  }
});
});



router.post('/customer-address/:id',function(req, res){
  var response = {};
  var fullAddress = req.body.address+" "+req.body.zipcode+" "+req.body.city+" "+req.body.country;    
  geocoder.geocode(fullAddress, function(err, gResponse) {
    if(err){
      response = {"error" : true,"message" : err};
      res.json(response);
    }else{   
      if(gResponse.length == 0){
        response = {"error" : true,"message" : "Address not found."};
        res.json(response);
      }else{

        req.body.lat = gResponse[0].latitude;
        req.body.lng = gResponse[0].longitude;

        Customer.findById({"_id": req.params.id}, function(err, doc){
          if(typeof doc.customeraddresses != 'undefined' && doc.customeraddresses.length > 0){
            var index = doc.customeraddresses.findIndex(addr => {
              return addr.address == req.body.address;
            });
            if(index != -1){
              if((doc.customeraddresses[index].city == req.body.city) && (doc.customeraddresses[index].country == req.body.country)){
                res.json({"error" : true, "message" : "Address Already Existing!"}); 
              }else{
                doc.customeraddresses.push(req.body);
                doc.save(function(err, data){
                  if(err) {
                    response = {"error" : true,"message" : err};
                  } else {
                    response = {"error" : false,"message" : data};
                  }     
                  res.json(response);
                });
              }
            }else{
              doc.customeraddresses.push(req.body);
              doc.save(function(err, data){
                if(err) {
                  response = {"error" : true,"message" : err};
                } else {
                  response = {"error" : false,"message" : data};
                }     
                res.json(response);
              });
            }     
          }else{
            doc.customeraddresses = [];
            doc.customeraddresses.push(req.body);
            doc.save(function(err, data){
              if(err) {
                response = {"error" : true,"message" : err};
              } else {
                response = {"error" : false,"message" : data};
              }     
              res.json(response);
            });
          }   
        });
      } 
    }
  });
});




router.put('/customer-address/:id',function(req, res){

    // if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    } 

 var response={};
 Customer.findById(req.params.id, function(err, favourite) {  
  const index = favourite.customeraddresses.findIndex(item => item._id == req.body.id);  
  if(index !== -1){
    favourite.customeraddresses.splice(index, 1);
  }
  favourite.save(function(err, data){
      if (err) {
        response = {"error" : true,"message" : "Error fetching data"};
      } else{
        response = {"error" : false,"message" : data};
      };
      res.json(response);
    }); 
});
});

/*-------------------------------End FRONTEND SERVICE FOR Favourites--------------------------------------------------------*/



/* Contact Us Start*/
router.post('/contactus',function(req,res,next){
                var response={};
                var content = "<html><head></head><body><table> <tr> <td>Name :</td><td>"+req.body.name+"</td></tr><tr><td>Email : </td><td>"+req.body.email+"</td></tr><tr><td>Phone : </td><td>"+req.body.phone+"</td></tr><tr><td>Message : </td><td>"+req.body.message+"</td></tr></table></body></html>";
                //console.log(content);
                req.mail.sendMail({  //email options
                   from: "Restaurant Team <navaidkitchen@gmail.com>", // sender address.  Must be the same as authenticated user if using GMail.
                   to: "Restaurant Team <ankur@v3xperts.com>", // receiver
                   subject: "Any Query to Customer (" + req.body.name + ' )', // subject
                   //text: "Email Example with nodemailer" // body
                   html: content
                }, function(error, response){  //callback
                    if(error){
                       console.log(error);
                   }else{
                       console.log("Message sent: " + response.message);
                   }
                   req.mail.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
                   res.json({error:false});
                });
});


/* Contact Us End*/
module.exports = router;