
const commonError = require('../util/error.common');
const commonSuccess = require('../util/success.common')
const Todo = require('../Models/todo.model');
const Counter =require('../Models/counter.model');

// Get all todo controller 
module.exports.getAllTodo = async (req,res)=>{

    try{
        const allData = await Todo.find();

        if(allData.length<1){
            return res.status(200).json(commonError.successNoData());
        }

        return res.status(200).json(commonSuccess.successSendData(allData))

    }catch(err){
        return res.status(400).json(commonError.catchError(err));
    }
}

// Get One todo by id

module.exports.getTodoById =async(req,res)=>{

    try{
        let {id} = req.params;
        if(isNaN(id)){
            throw "Integer Id only"
        }
        id = Number(id);
        

        if(id){
            const data = await Todo.findOne({id:id});

            if(!data){
                return res.status(200).json(commonError.successNoData())
            }

            return res.status(200).json(commonSuccess.successSendData(data))
        }else{
            return res.status(400).json(commonError.catchError("No Id found"))
        }

    }catch(err){
        //console.log(err);
        return res.status(400).json(commonError.catchError(err));
    }
}

// filtering Todo 

module.exports.getTodoByFilter = async(req,res)=>{

    try{

        let queryOptions = {};
        const {status} = req.query;
        // //console.log(status);

        if(status!=="all"){
            queryOptions.status = status.replace(/\s/g, '');
        }
        //console.log(queryOptions);
        const filterData = await Todo.find(queryOptions);
        // //console.log(filterData);

        if(filterData.length<1){
            return res.status(200).json(commonError.successNoData())
        }

        return res.status(200).json(commonSuccess.successSendData(filterData))

    }catch(err){
        return res.status(400).json(commonError.catchError(err));
    }
}

// add a new todo by input data

module.exports.postTodo=async (req,res)=>{
    try{

        const {description} =req.body;

        if(!description){
            return res.status(400).json(commonError.catchError("Enter Valid credentials"))
        }

        const newTodo = new Todo({
            status:"pending",
            description:description
        });

        const response = await newTodo.save();

        if(response){
            return res.status(201).json(commonSuccess.successSendData(response))
        }
        
    }catch(err){
        //console.log(err);
        return res.status(400).json(commonError.catchError(err));
    }
}

// update one todo based on id

module.exports.updateTodo = async(req,res)=>{

    try{
        const {status,description} =req.body;
        //console.log(req.body);
        
        const {id} =req.params;

        if(!status&& !description){
            return res.status(400).json(commonError.catchError("Enter Valid credentials"))
        }

     const findData = await  Todo.findOne({id:id});

     if(!findData){
        return res.status(400).json(commonError.catchError("No data found"))
     }

     if(status && status !== findData.status){
        findData.status =status;
     }

     if(description && description !== findData.description){
        const desc = description.replace(/\s+/g, ' ');
        findData.description = desc;
     }

     const response = await findData.save();

     //console.log(response);

     return res.status(200).json(commonSuccess.successSendData(response));
    
    }catch(err){
        //console.log(err);
        return res.status(400).json(commonError.catchError(err));
    }
}

//  delete a todo by using id
module.exports.deleteTodo = async(req,res)=>{
    try{
        const {id} = req.params;
    
        const deleteData = await Todo.findOneAndDelete({id:id});
    
        if(deleteData){
            const [updateCounter] = await Counter.find();
    
            if(updateCounter){
                updateCounter.seq = updateCounter.seq-1;
                updateCounter.save();
            }
    
            const wantUpdateId = await Todo.find({id:{$gt:deleteData.id}});
    
            wantUpdateId.forEach(item=>{
                item.id =item.id-1;
                item.save();
            });
    
           return res.status(200).json(commonSuccess.successSendData(deleteData));
        }else{
            throw "Not find/delete document";
        }
        }catch(err){
            //console.log(err);
        return res.status(400).json(commonError.catchError(err));
    }
}