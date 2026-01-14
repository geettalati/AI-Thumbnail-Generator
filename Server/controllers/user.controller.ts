import { Request, Response } from "express";
import Thumbnail from "../models/thumbnail.model.js";
// Add a new controller function in thumbnail.controller.ts
// controllers to get all user thumbnails 

// users ke sare thumbnail de dega
import session from "express-session";
export const getuserthumbnails = async (req: Request, res: Response) => {
    try {
        const {userId} = req.session as any;
        const thumbnails = await Thumbnail.find({userId}).sort({createdAt:-1});
        res.json({thumbnails});
    } catch (error : any) {
        console.log(error)
        res.status(500).json({message:'Server Error! Could not fetch thumbnails.'});
    }
}

//  yeh controller to get a single thumbnail by ID

export const getthumbnailbyid = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const {userId} = req.session as any;
        const thumbnail = await Thumbnail.findOne({_id:id, userId});
        if(!thumbnail){
            return  res.status(404).json({message:'Thumbnail not found'});
        }

        res.json({thumbnail});


    } catch (error : any) {
        console.log(error)
        res.status(500).json({message:'Server Error! Could not fetch thumbnail.'});
    }
}