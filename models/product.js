const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    },

    brand:{
        type:String,
        required:true
    },

    category:{
        type:String,
        required:true
    },

    image:{
        type:String,
        required:true
    },

    rating:{
        type:Number,
        default:0
    },

    stock:{
        type:Number,
        default:0
    }

},{toJSON:{virtuals:true}});

productSchema.virtual("id").get(function(){
    return this._id.toString();
});

module.exports = mongoose.model("Product",productSchema);