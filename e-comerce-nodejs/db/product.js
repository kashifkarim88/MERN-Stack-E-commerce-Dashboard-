const mongoose = require('mongoose');
const productCollection = "products"

const productSchema = new mongoose.Schema({
    product_name: String,
    product_description:String,
    product_brand:String,
    product_type:String,
    product_category:String,
    product_quantity:Number,
    product_price:Number,
    user_id:String,
},{versionKey:false})

module.exports = mongoose.model(productCollection,productSchema)