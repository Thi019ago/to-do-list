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