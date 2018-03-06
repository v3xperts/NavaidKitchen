var express = require('express');
var router = express.Router();
var orderModel  =  require("../model/Order.js");
const keyPublishable = 'pk_test_zd2LWmkl0Z6DKHbBGUjXooyo';
const keySecret = 'sk_test_zjKxMUcCsGAG2uEN0xKz8mlU';
const stripe = require("stripe")(keySecret);

/*-------------------------------START Order--------------------------------------------------------*/

router.get('/order', function(req, res, next) {
 
 // if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }

	var response={};
	orderModel.find({}, null, {sort: {created_at: -1}},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});

router.post('/driverorders', function(req, res, next) {
 	var response={};
	orderModel.find({'restaurantid':{$in:req.body.rids}}, null, {sort: {created_at: -1}},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});


router.get('/customerorder/:id', function(req, res, next) {
 	var response={};
	orderModel.find({customerid: req.params.id}, null, {sort: {created_at: -1}}, function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});


router.post('/order',function(req, res){
 	var response={};
    var order = new orderModel(req.body);
    order.save(function(err, data){
    	if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : data};
        }
        res.json(response);
    });
});


router.post("/charge", (req, res) => {
	let token = req.body.token;
	let amount = req.body.amount;
	stripe.charges.create({
	amount: amount,
	currency: "usd",
	description: "Payment Charge for MealDaay.com",
	source: token,
	}, function(err, charge) {    		
	// asynchronously called
	if(err){
	res.status(500).json(err);
	}else{
	res.status(200).json(charge);
	}
	});
});



router.put('/order/:id',function(req, res){

 // if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }

	var response={};
	orderModel.findByIdAndUpdate(req.params.id, req.body, function(err, order) {
	    	if(err) {
	            response = {"error" : true,"message" : err};
	        } else {
	            response = {"error" : false,"message" : "Data Update"};
	        }
	        res.json(response);
        });
});




router.get('/order/:id',function(req,res){
 
 // if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }

	var response={};
	console.log(req.params.id);
	orderModel.findById(req.params.id,function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});



router.get('/orderbussiness',function(req,res){
	var response={};

	orderModel.aggregate([
        {$match: {"status" : "completed"}},
        {
        $group: {
            _id: '$restaurantid', // grouping key - group by field district                
            bussinessamount: { $sum: '$subtotal' }
        }
        }
    ]).exec((err,data) => {
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});

});


router.delete('/order/:id',function(req,res){
 
 // if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
 
	var response={};
	console.log(req.params.id);
	orderModel.remove({_id:req.params.id},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : "Deleted Successfully"};
		};
		res.json(response);
	});	
});
/*-------------------------------END Order--------------------------------------------------------*/

router.get('/restaurantorders/:id',function(req, res){
var response={};
orderModel.find({ restaurantid: req.params.id}, null, {sort: {created_at: -1}}, function(err,data){
	if (err) {
		response = {"error" : true,"message" : err};
	} else{
		response = {"error" : false,"message" : data};
	};
	res.json(response);
  });	
});



module.exports = router;