const mongoose = require('mongoose');


const countersSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    reference_value:Object,
    seq:Number
});

module.exports =  new mongoose.model('counter',countersSchema);