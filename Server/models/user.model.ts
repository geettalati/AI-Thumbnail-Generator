import mongoose, { Document } from 'mongoose'

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const userschema = new mongoose.Schema<IUser>({
    name:{
        type:String,
        required:true,
        trim:true,   
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    }

},{timestamps:true})

const user = mongoose.models.user || mongoose.model<IUser>('user' , userschema)

export default user;