const Stream = require('stream');
const csv = require ('csv-parser');
const ObjectToCsv = require('objects-to-csv');
const path = require('path');
const fs =require('fs');

const commonError = require("../util/error.common");
const commonSuccess = require("../util/success.common");
const Todo = require('../Models/todo.model');

module.exports.uploadCsv = async(req,res)=>{
    try{
        const file = req.file;
        if(!file){
            return res.status(400).json(commonError.catchError("CSV file not found"))
        }
        if(file.mimetype !=="text/csv"){
            // return res.status(400).json(commonError.catchError("Only Csv file is acceptable"))
            throw "Only Csv file";
        }

        const csvString = file.buffer.toString();
        const result =[];
    
        const csvStream = new Stream.Readable();
    
        csvStream.push(csvString);
        csvStream.push(null);
        csvStream.pipe(csv()).on('data',(data)=>{
            // //console.log(data);
            result.push(data);
        }).on('end',()=>{
            // //console.log(result);
            if(result.length<1){
                throw "No document find";
            }
    
            // //console.log(result);
            const todos = result.map(item=>{
                // const status = item.status.replace(/\s+/g,)
                const status = item.status.replace(/\s/g, '');
                //console.log(status);
                return {status:status,description:item.description}
            });

            todos.forEach(async item=>{
                //console.log(item);
                if(item.description){
                const newTodo = new  Todo({
                    ...item
            });
            const response = await newTodo.save();

        }
    })
    res.status(201).json(commonSuccess.successSendData("Created"))
        
    })

    }catch(err){
        //console.log(err);
        return res.status(400).json(commonError.catchError(err));
    }
}

module.exports.downloadCsv = async (req,res)=>{
    try{

        const allData =await Todo.find();

        if(allData.length >0){

            const Data = allData.map(item=>{
                return {id:item.id,description:item.description,status:item.status}
            })
  
            const objToCsv = new ObjectToCsv(Data);

            // //console.log(await objToCsv.toString(Data));

            const response = await objToCsv.toDisk('./temp/todo.csv');

            if(response){
                //console.log(path.join(__dirname,'../temp/todo.csv'));
                // return res.attach(path.join(__dirname,'../temp/todo.csv'));
                // res.setHeader('Content-Type', 'application/octet-stream');
                // res.setHeader('Content-Disposition', 'attachment; filename=todo.csv');
                // fs.createReadStream(path.join(__dirname,'../temp/todo.csv')).pipe(res);
            }else{
                // return res.status(400).json(commonError.catchError("File error"));
                throw "File error"
            }
        }


    }catch(err){
        //console.log(err);
        return res.status(400).json(commonError.catchError(err));
    }
}