//this checks for error coming from registerValidation
//registervalidation does not stop the req
//so flow is req registervalidation validate-error yes return 400 no registeruser
//why not put validation result inside regiseter userbut then we would have to reuse this code inside each controller
//registerValidation  → What to validate
//validate            → How to handle validation failures
//registerUser        → Business logic
//This follows the Single Responsibility Principle (SRP):

//Validator defines the rules.
//Validate middleware processes the results.
//Controller focuses only on business logic.
const{ validationResult }= require("express-validator");//any err from authvalidator stores insdie this
const validate=(req,res,next)=>{//express middleware
    const errors=validationResult(req);
    if(!errors.isEmpty()){//for no error is empty is true
     return res.status(400).json({
        errors:errors.array()
     });
    }
    next();//if no err move to next
};
module.exports=validate;