const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const conn = require('./conn');
const todoRoutes = require('./Routes/todo.routes')

const app = express();
const port = process.env.PORT|| 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/todos',todoRoutes);

app.listen(port,()=>{
        console.log(`Server @${port}`);
        conn.connect().then(()=>{
            console.log("Db Connect");
    }).catch(err=>{
        console.log((err));
    })
});


