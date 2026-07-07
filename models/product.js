const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    }

},{toJSON:{virtuals:true}});

productSchema.virtual("id").get(function(){
    return this._id.toString();
});

module.exports = mongoose.model("Product",productSchema);