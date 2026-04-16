import mongoose from 'mongoose';
const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    }
}, { timestamps: true });
const user = mongoose.models.user || mongoose.model('user', userschema);
export default user;
