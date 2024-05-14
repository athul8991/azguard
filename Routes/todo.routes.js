const router = require('express').Router();
const multer = require('multer');

const fileController = require('../Controls/file.controller')
const dataController = require('../Controls/data.controller')

const upload = multer();
// fetch all todo item.
router.get("/",dataController.getAllTodo) 

// filter todo items based on status
router.get('/filter',dataController.getTodoByFilter)

// download the todo list in csv format.
router.get("/download",fileController.downloadCsv)

// add new todo item
router.post("/",dataController.postTodo)

// update an existing todo item
router.put("/:id",dataController.updateTodo)

// upload todo items from a csv file
router.post("/upload",upload.single('csvFile'),fileController.uploadCsv)

// fetch single todo item by id
router.get("/:id",dataController.getTodoById)

// delete a todo item
router.delete("/:id",dataController.deleteTodo)

module.exports =router