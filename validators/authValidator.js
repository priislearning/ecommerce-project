//abhi tk jo authmiddleware tha it checked is there a jwt is it valid if yes next otherwise 401
//this is just another middleware email valid password long enough name empty jwt check identity this check input
//if validation fail registeruser never return that meanno other time waste
const { body }=require("express-validator");
const registerValidation=[
    body("name")//look at req.body.name
    .trim()//bx what if someone has lot os just empty space trim remove extra space
    .notEmpty()
    .withMessage("Name is required"),//if empty will give this error msg

    body("email")
    .trim()
    .isEmail()
    .withMessage("invalid email"),//it quitely store err insde req

    body("password")
    .isLength({min:6})
    .withMessage("Password must be atleast 6 characters")
];
const loginValidation=[
    body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email"),

    body("password")
    .notEmpty()
    .withMessage("Password is required")
];
module.exports={
    registerValidation,
    loginValidation
};