const express = require('express');
require("./db/config");
const User = require("./db/users");
const Product = require("./db/product")
const cors = require("cors");
const app = express();
const { body, validationResult } = require('express-validator');

const Jwt = require("jsonwebtoken")
const jwtKey = 'e-com-dash'

app.use(express.json());
app.use(cors());
const bcrypt = require("bcryptjs");



//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------  User SignUp API -------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//.trim().escape() is a Sanitization which is used to to sanitize user input before saving it to the database to prevent potential 
//security vulnerabilities.
app.post("/signup", [
  body("name").notEmpty().isString().trim().escape(),
  body("email").notEmpty().isString().trim().escape(),
  body("phone").notEmpty().isString().trim().escape(),
  body("password").notEmpty().isString().trim().escape(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsResponce = {
      success: false,
      message: "Validation failed",
      errors: errors.array()
    }
    res.status(400).json(errorsResponce);
    console.log(`Response Status: ${res.statusCode}`);
    console.log('Error Response:', errorsResponce);
    return;
  }
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists with this email." });
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await new User({ ...req.body, password: hashedPassword });
    const results = await newUser.save();
    const userData = results.toObject();
    delete userData.password;
    res.status(201).json({ success: true, results: userData });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: "Validation failed", errors: error.errors });
    } else {
      console.error("Error saving user:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
});


//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------  User Login API -------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
app.post("/login",[
  body("email").notEmpty().isString().trim().escape(),
  body("password").notEmpty().isString().trim().escape(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsResponce = {
      success: false,
      message: "Validation failed",
      errors: errors.array()
    };
    res.status(400).json(errorsResponce);
    console.log(`Response Status: ${res.statusCode}`);
    console.log('Error Response:', errorsResponce);
    return;
  }
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide both email and password." });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(204).json({ error: "Invalid credentials." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(204).json({ error: "Invalid credentials." });
    }
    const userData = { ...user.toObject() };
    delete userData.password;
    Jwt.sign({userData},jwtKey,{expiresIn:'2h'},(error,token)=>{
      if(error){
        res.status(403).json({success:false,message:"Something went wrong Please try again."})
      }
      res.status(200).json({ success: true, message: "Login successful.", data: {userdata:userData,auth:token}});
    })
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------  Add Products API ------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
app.post("/addproducts", verifyJWT, [
  body("product_name").notEmpty().isString().trim().escape(),
  body("product_description").notEmpty().isString().trim().escape(),
  body("product_brand").notEmpty().isString().trim().escape(),
  body("product_type").notEmpty().isString().trim().escape(),
  body("product_category").notEmpty().isString().trim().escape(),
  body("product_quantity").notEmpty().isNumeric().trim().escape(),
  body("product_price").notEmpty().isNumeric().trim().escape(),
  body("user_id").notEmpty().isString().trim().escape(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorResponse = {
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    };
    res.status(400).json(errorResponse);
    console.log(`Response Status: ${res.statusCode}`);
    console.log('Error Response:', errorResponse);
    return;
  }
  try {
    const productDetails = req.body;
    const newProduct = new Product({ ...productDetails })
    const results = await newProduct.save();
    console.log(results.status)
    res.status(200).json({ success: true, results: "Product Added successfully", data: results.toObject() })

  }
  catch (error) {
    res.status(500).json({ success: false, results: error })
  }
});

//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------  Get all Products API --------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------

app.get("/allproductslist", verifyJWT,async(_,res)=>{
  try{
    const productData = await Product.find()
    res.status(201).json({success:true,data:productData})
  }
  catch (error){
    res.status(500).json({success:false,message:"Internal server issues.",error:error})
  }
})

//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------  Delete Product API ----------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------

app.delete("/deleteproduct/:id",verifyJWT,async(req,res)=>{
  try{
    const deleteProduct = await Product.deleteOne({_id:req.params.id});
    res.status(201).json({success:true,message:"product deleted successfully.", data:deleteProduct})
  }
  catch(error){
    res.status(500).json({success:false,message:"Internal server issues",error:error})
  }
})

//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------  Get Product by ID API -------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
app.get("/getproduct/:_id",verifyJWT,[
  param('_id').isMongoId().withMessage("Invalid product ID")
],async(req,res)=>{
  const error = validationResult(req)
  if(!error.isEmpty())
  {
    res.status(400).json({success:false,message:"Validation failed", error:error.array()});
    console.log("Validation failed")
  }
  try{
    const proData = await Product.find(req.params)
    if(!proData){
      res.status(400).json({success:false,message:"Product not found"})
      console.log("PNF")
    }
    res.status(201).json({success:true,message:"Product data found successfully", data:proData})
    console.log(proData)
  }
  catch(error){
    req.status(500).json({success:false,message:"internal server issues", error:error})
    console.log("ISI")
  }
})
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------  Edit Product API ------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
app.put("/editproduct/:_id",verifyJWT,[
  param('_id').isMongoId().withMessage("Invalid user id"),
  body("product_name").notEmpty().isString().trim().escape(),
  body("product_description").notEmpty().isString().trim().escape(),
  body("product_brand").notEmpty().isString().trim().escape(),
  body("product_type").notEmpty().isString().trim().escape(),
  body("product_category").notEmpty().isString().trim().escape(),
  body("product_quantity").notEmpty().isNumeric().trim().escape(),
  body("product_price").notEmpty().isNumeric().trim().escape(),
  body("user_id").notEmpty().isString().trim().escape(),
] ,async(req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorResponse = {
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    };
    res.status(400).json(errorResponse);
    console.log(`Response Status: ${res.statusCode}`);
    console.log('Error Response:', errorResponse);
    return;
  }
  try{
    const updateProduct = await Product.updateOne(req.params,
      {
        $set:req.body
      })
    res.status(201).json({success:true,message:"Product data updated successfully", data:updateProduct})
  }
  catch(error){
    res.status(500).json({success:false,message:"Insternal Server Issues", error:error})
  }
})

//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------  Search Product API ----------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
app.get("/search/:key", verifyJWT,async(req,res)=>{
  try{
    let result = await Product.find({
      "$or":[
        {product_name:{$regex:req.params.key}},
        {product_brand:{$regex:req.params.key}},
        {product_type:{$regex:req.params.key}},
        {product_category:{$regex:req.params.key}},
      ]
    })
    if(result.length > 0){
      res.status(201).json({success:true,message:"Product found",data:result})
    }
    else{
      res.status(400).json({success:false,message:"Invalid"})
    }
  }
  catch{
    res.status(500).json({success:false,message:"Internal server issues"})
  }
})

// middleware
function verifyJWT(req, res, next){
  let token = req.headers['authorization'];
  if(token){
    Jwt.verify(token,jwtKey,(error,valid)=>{
      if(error){
        res.status(401).send({responce:"You are not valid user"})
      }
      else{
        next();
      }
    })
  }
  else{
    res.status(401).send({responce:"You are not valid user"})
  }
}
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
