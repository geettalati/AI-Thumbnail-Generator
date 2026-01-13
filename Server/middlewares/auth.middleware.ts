import { Request , Response ,NextFunction } from "express";
import user from "../models/user.model.js";

const protect = (req:Request,res:Response,next:NextFunction) => {
    const {isLoggedIn} = req.session;
    const sessionUser = (req.session as any).user;

    if(!isLoggedIn || !sessionUser){
        return res.status(401).json({message:"Unauthorized! Please log in to access this resource."});
    }
    next();
}
export default protect;
