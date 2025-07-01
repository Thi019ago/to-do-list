import { Request, Response } from "express";
import Task from "../models/task";


//esteder a interface Request para incluir o user
interface AuthenticatedRequest extends Request{
    user?:{
        id:string;
        email:string;
    };
}


//criar nova tarefa

export const createTask = async(req:AuthenticatedRequest,res:Response)=>{
    try{
        const{title,description,priority,dueDate}=req.body;
        const userId=req.user?.id;

        const task=new Task({
            title,
            description,
            priority,
            dueDate,
            user:userId
        });

        await task.save();
        res.status(201).json(task);
    }catch(err:any){
        res.status(400).json({error:err.message});
    }
};

//buscar todas as tarefas do usuario

export const getTasks = async(req:AuthenticatedRequest,res:Response)=>{
    try{
        const userId = req.user?.id;
        const tasks = await Task.find({user:userId}).sort({createdAt:-1});
        res.status(200).json(tasks);
    }catch(err:any){
        res.status(500).json({error:err.message});
    }
};

//buscar uma tarefa especifica

export const getTaskById = async(req:AuthenticatedRequest,res:Response)=>{
    try{
        const {id}=req.params;
        const userId =req.user?.id;

        const task = await Task.findOne({_id:id,user:userId})

        if (!task){
            return res.status(404).json({error:"Tarefa não encontrada"})
        }
        res.status(200).json(task);
    
    }catch(err:any){
        res.status(500).json({error:err.message});
    }
};

 //atualizar tarefa
export const updateTask = async(req:AuthenticatedRequest,res:Response)=>{
    try{
        const {id}=req.params;
        const userId = req.user?.id;
        const updates = req.body;

        const task = await Task.findOneAndUpdate({_id:id,user: userId},updates,{new:true});
        if(!task){
            return res.status(404).json({error:"Tarefa não encontrada"})
        }
        res.status(200).json(task);
    }catch(err:any){
        res.status(500).json({error:err.message})
    }
};

//deletar tarefa








//alternar status da tarefa (conluida/pendente)






