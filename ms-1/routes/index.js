var express = require('express');
var router = express.Router();
var NodeGeocoder = require('node-geocoder');
var kitchenModel  =  require("../model/Kitchen.js");
var referralModel  =  require("../model/referral.js");
var ownerModel  =  require("../model/Owner.js");
var partnerModel  =  require("../model/Partner.js");
var emails = require('../mail/emailConfig.js');

var options = {
  	provider: 'google',
  	httpAdapter: 'https', // Default 
  	apiKey: null, // for Mapquest, OpenCage, Google Premier 
  	formatter: null         // 'gpx', 'string', ... 
};
 
var geocoder = NodeGeocoder(options);

/* GET home kitchen. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/login', function(req, res, next) {
	req.body.username = req.body.username.toLowerCase();
	ownerModel.find({username: req.body.username,password: req.body.password},function(err,owner) { 
	    if(err){
	    	res.json({status:false, data: 'error', type:'owner'});
	    }      
		if (owner.length>0) { 
			var ownerdetail = owner[0];        
			kitchenModel.find({ownerId: ownerdetail._id}).populate('ownerId').exec(function(err, data){	
			  if(err){
	    	   res.json({status:false, data: 'error', type:'owner'});
	          }   			
			console.log("owner test1", data);	
			if(owner[0].status){
			res.json({status:true, data: data[0], type:'owner'});	
			}else{
		    res.json({status:true, data: data[0], type:'owner','notapprove': true});			
			}
			});
		}else{ 
			partnerModel.find({username:req.body.username,password:req.body.password},function(err,partner) {
			if(err){
			res.json({status:false, data: 'error', type:'partner'});
			}   		
			if (partner.length>0) {
		    var partnerinfo = partner[0];		
			kitchenModel.find({ownerId: partnerinfo.OwnerId}).populate('ownerId').exec(function(err, data){
			//	console.log(data[0].ownerId.username);
			// console.log("owner test2", data);	
			data[0].ownerId.username = partner[0]["username"];
			// console.log(data[0]["restaurantname"] , partner[0]["username"]);
			if(partner[0].status){
			res.json({status:true,data: data[0],type:'partner'});	
			}else{
		    res.json({status:true,data: data[0],type:'partner', 'notapprove': true});			
			}
			});
			}else{
			res.json({status:false, data:''});    
			}  
			});
		}
	});
});




router.post('/owner/forget-password',function(req,res,next){
    var response={};
    ownerModel.find({email:req.body.email},function(err,data){
        if (err) {
            req.flash('error', 'something went wrong!');
            
        } else{
        	console.log(data);
            if (data.length>0) {
                emails.forgetEmailShoot(data[0],'owner');
                res.json({error:false,message:'send email'});
                /*var name = data[0].firstname+" <"+data[0].email+" >";
                var content = "Password reset Link <a href='http://mealdaay.com:3004/owner/resetpassword/"+data[0]._id+"'>Click Here</a>"
                req.mail.sendMail({  //email options
                   from: "Restaurant Team <navaidkitchen@gmail.com>", // sender address.  Must be the same as authenticated user if using GMail.
                   to: name, // receiver
                   subject: "Reset Password", // subject
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
                console.log(data);*/

            }else{
            	res.json({error:true,message:'Email Does Not Exist'});
            }
        };
    }); 
});


router.get('/kitchen', function(req, res, next) {

	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }

	var response={};
	kitchenModel.find({}).populate('ownerId').exec(function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});



router.post('/kitchenb', function(req, res, next) {
	
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }

   var datac = {};
   datac.activestatus = true;
   if((req.body.city != '') && (typeof req.body.city != 'undefined') ){
     datac.city = req.body.city;
    }

    console.log(req.body.city);
	var response={};
	kitchenModel.find(datac, null, {sort: {created_at: 1}},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});


router.post('/owner',function(req, res){
 
 // if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }

	var response={};
    var owner = new ownerModel(req.body);
    owner.save(function(err){
    	if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : "Owner Added Successfully"};
        }
        res.json(response);
    });
});


router.post('/kitchen',function(req, res){
 
 // if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
 
	var response={};
	var fullAddress = req.body.address+" "+req.body.zipcode+" "+req.body.city+" "+req.body.country;
	console.log(fullAddress);
	geocoder.geocode(fullAddress, function(err, gResponse) {
		console.log(gResponse);
		    req.body.lat = gResponse[0].latitude;
		  	req.body.lng = gResponse[0].longitude;
	    var kitchen = new kitchenModel(req.body);
	    kitchen.save(function(err){
	    	if(err) {
	            response = {"error" : true,"message" : err};
	        } else {
	            response = {"error" : false,"message" : "Data added"};
	        }
	        res.json(response);
	    });
	});
});


router.put('/owner/:id',function(req, res){

 // if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }

	var response={};
	req.body.status = true;
	ownerModel.findByIdAndUpdate(req.params.id, req.body, function(err, kitchen) {
	    	if(err) {
	            response = {"error" : true,"message" : err};
	        } else {
	            response = {"error" : false,"message" : "Data Update"};
	        }
	        res.json(response);
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
	ownerModel.findByIdAndUpdate(req.params.id, {password : req.body.password}, function(err, kitchen) {
		    	if(err) {
		            response = {"error" : true,"message" : err};
		        } else {
		        	kitchenModel.find({ownerId : req.params.id}).populate('ownerId').exec(function(err,data){
		        	response = {"error" : false,"message" : data[0]};	
		        	res.json(response);
		        	});
		        }		        
	        });
			});


router.put('/kitchen/:id',function(req, res){

	    var response={}; 
	    if(typeof req.body.lat != 'undefined') {
             req.body.loc = [req.body.lat, req.body.lng];
	    }        
        if(req.body.city && req.body.country){
           req.body.city = req.body.city.toLowerCase();
           req.body.country = req.body.country.toLowerCase();
        }
		kitchenModel.findByIdAndUpdate({_id : req.params.id}, req.body, function(err, kitchen) {
	    	if(err) {
	            response = {"error" : true,"message" : err};
	        } else {
	            response = {"error" : false,"message" : "Data Update"};
	        }
	        res.json(response);
        });




	/*console.log(req.body);

	var fullAddress = req.body.address+" "+req.body.zipcode+" "+req.body.city+" "+req.body.country;
	console.log(fullAddress);

	geocoder.geocode(fullAddress, function(err, gResponse) {
		console.log(gResponse);
		//req.body.lat = gResponse[0].latitude;
	    //	req.body.lng = gResponse[0].longitude;

	  	
    });*/
});

router.get('/kitchen/:id',function(req,res){

 // if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }

	var response={};
	console.log(req.params.id);
    var active = {};

    active._id = req.params.id;
    active.activestatus = true;

	kitchenModel.findById(active,function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});


router.delete('/kitchen/:id',function(req,res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	console.log(req.params.id);
	kitchenModel.remove({_id: req.params.id},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : "Deleted Successfully"};
		};
		res.json(response);
	});	
});


router.post('/kitchenfilters',function(req,res){
    console.log(req.body);
    var conditions = {}; 
    var conditions2 = {};
    conditions.activestatus = true;
    if((req.body.city != '') && (typeof req.body.city != 'undefined')){
            conditions.city = req.body.city.toLowerCase();
     }

     if((req.body.country != '') && (typeof req.body.country != 'undefined')){
            conditions.country = req.body.country.toLowerCase();
     }
            
    if((req.body.sortby != '') && (typeof req.body.sortby != 'undefined') && (req.body.sortby != 'rating')){
    	     var newsort = req.body.sortby;
    	     var newsorttype = ((newsort == 'created_at') ? -1 : 1);
             conditions2[newsort] = newsorttype;
     }

    if(typeof req.body.cousine != 'undefined' && req.body.cousine.length > 0){
       conditions.cuisines = {$in: req.body.cousine};     
    }

    if(req.body.range > 0 && req.body.lat != 0 && req.body.lng != 0){       
       conditions.loc = {        
         $near: [req.body.lat, req.body.lng],
         $maxDistance: req.body.range/111.12
         } 
     }
      
    console.log(conditions);
    console.log(conditions2);

	var response={};
     kitchenModel.find(conditions).sort(conditions2).exec(function(err, locations) {
      if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : locations};
		}
		res.json(response);
    });
});



router.post('/filterKitchen',function(req,res){
 
    var conditions = {};
    conditions.activestatus = true;

    var lastMonth = new Date();
    lastMonth.setDate(lastMonth.getMonth());

    if(typeof req.body.country != 'undefined' && req.body.country != ''){
     conditions.country = req.body.country;
 }
    if(typeof req.body.city != 'undefined' && req.body.city != ''){
        conditions.city = req.body.city;
    }
    if(typeof req.body.cuisines != 'undefined' && req.body.cuisines.length > 0){
       conditions.cuisines = {$in: req.body.cuisines};
    }
    if(typeof req.body.restaurant != 'undefined'){
     if(req.body.restaurant == 'new'){
      conditions.created_at = {'$gte':lastMonth};
     }
     if(req.body.restaurant == 'fastDelivery'){
      conditions.fastestdelivery = true;
     }
     if(req.body.restaurant == 'open'){
      conditions.openingstatus = "open";
     }
    }
 if(req.body.range > 0 && req.body.lat != 0 && req.body.lng != 0){
  conditions.loc = {
   $near: [req.body.lat, req.body.lng],
   $maxDistance: req.body.range/111.12
  }
 }
 
    console.log(conditions);

 var response={};
     kitchenModel.find(conditions).exec(function(err, locations) {
      if (err) {
   response = {"error" : true,"message" : "Error fetching data"};
  } else{
   response = {"error" : false,"message" : locations};
  }
  res.json(response);
    });
});


/*-------------------------------Start referral--------------------------------------------------------*/

router.post('/ownerreferral',function(req,res,next) {
    var response={};
    
     referralModel.find({emailto : req.body.emailto}, function(err, data) {
    if(err){
		res.status(403).json({"error" : true,"message" : err});
    }else if(data.length > 0){
		res.status(200).json({"error" : true,"message" : 'Email Already exist'});
    }else{
    	 ownerModel.find({email:req.body.emailto},function (err,data2) {
    	if(err){
			res.status(403).json({ "error" : true,"message" : err});		
    	}else if(data2.length>0){
    		res.status(200).json({"error" : true,"message" : 'Email Already exist'});
    	}else{
    		partnerModel.find({email:req.body.emailto},function (err,data3) {
					if(err){
					res.status(403).json({ "error" : true,"message" : err});		
					}else if(data3.length>0){
    						res.status(200).json({"error" : true,"message" : 'Email Already exist'});
    					}else{
						var referral = new referralModel(req.body);
						referral.save(function(err, sdata){   
							if(err) {
							res.status(403).json({ "error" : true,"message" : err});	
							} else if(sdata) {		             
							emails.referalShoot(req.body.emailto, sdata._id);
							res.status(200).json({ "error" : false,"message" : "Refferral has been Send Sucessfully!"});

							/* var content = "Referral Link <a href='http://mealdaay.com:3004/owner/referralregister/"+data._id+"'>Click Here</a>"
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
							});*/	

							}		        
						});

					}
				});
		    
    	}
    });

    }
});
});

router.get('/ownerreferral/:id',function(req,res){
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

router.get('/ownerreferral-ownerlist/:id',function(req,res){
	var response={};	
	referralModel.find({"referralfrom":req.params.id}).lean().exec((err, data)=>{
		console.log(data);
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});


router.put('/ownerreferral/:id',function(req, res){
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


router.post('/kitchenfiltersstr',function(req,res){
	var response={};	
	kitchenModel.find({restaurantname:{ $regex: new RegExp(req.body.str, "ig") }, activestatus : true} , function (err, data) {			
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});
});


router.get("/heatmaplatlng", (req, res) => {
	kitchenModel.find({}, 'lat lng', (err, data)=> {
	if(err){
		res.json({"error" : true,"message" : err});
		} else {
		res.json({"error" : false,"message" : data});
	}
	});
});

/*-------------------------------END referral--------------------------------------------------------*/




/*-------------------------------Start Email for successfully-----------------------------------------------------------*/
router.post('/order-email',function(req,res,next){
    var response={};
    kitchenModel.find({ _id : req.body.restaurantid }).populate('ownerId').exec(function(err,data){
        if (err) {
            res.json({error: true, message: err});          
        } else{  
                //console.log("eml", data);      	
            if (data.length>0) {
            	
            	emails.restroOrderEmailShoot(data[0].ownerId.email,data[0].username,req.body.order);
            	emails.customerOrderEmailShoot(req.body.customeremail,data[0].username,req.body.order);
                res.json({error: false, message: 'Email send successfully.'});
                }else{
                res.json({error: true, message: 'It did not find any restaurant.'});
            } 
        };
    }); 
});


router.post('/order-rejected-email',function(req,res,next){
    emails.customerOrderRejectedEmailShoot(req.body.customeremail, req.body.order);
    res.json({error: false, message: 'Customer email Sent.'})
});
/*-------------------------------End Email for successfully-----------------------------------------------------------*/

module.exports = router;
