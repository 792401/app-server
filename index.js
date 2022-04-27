const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db");
require('dotenv').config();

const PORT = process.env.SERVER_PORT;

//middleware
app.use(cors());
app.use(express.json());

//routes

//create
app.post("/todos", async(req,res)=>{
    try {
        const {description} = req.body;

        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *",[description]);
        res.json(newTodo.rows[0]);

    } catch (err){
        console.log(err.message);
    }
})

//get all
app.get("/todos", async(req,res)=>{
    try {

     
        const newTodo = await pool.query("SELECT * FROM todo");
        res.json(newTodo.rows);

    } catch (err){
        console.log(err.message);
    }
})
//get
app.get("/todos/:id", async(req,res)=>{
    try {
        const {id} = req.params; 
        const todo = await pool.query(`SELECT * FROM todo WHERE todo_id=$1`,[id])
        res.json(todo.rows)
    } catch (err){
        console.log(err.message)
    }
})
//update 
app.put("/todos/:id", async(req,res)=>{
    try{
        const {id} = req.params;
        const {description} = req.body;
        const todo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *",[description, id])
        res.json(todo.rows[0])
    } catch (err){
        console.log(err.message);
    }
})
//delete
app.delete("/todos/:id", async (req,res)=>{
    try{
        const {id} = req.params;
        const del = await pool.query("DELETE FROM todo WHERE todo_id=$1",[id])
        res.json(del.rows)
    } catch(err){
        console.log(err.message)
    }
})

app.listen(5000, ()=>{
    console.log(`Server started on port ${PORT}`)
})