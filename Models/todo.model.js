const mongoose =require('mongoose');
const mongooseSeq = require('mongoose-sequence')

const todoSchema = new mongoose.Schema({
        // id:Number,
        description:String,
        status:String
})

todoSchema.plugin(mongooseSeq(mongoose),{inc_field:'id'});
module.exports =new mongoose.model("TodoItem",todoSchema);