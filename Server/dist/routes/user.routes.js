import express from 'express';
import { getuserthumbnails, getthumbnailbyid } from '../controllers/user.controller.js';
const userrouter = express.Router();
userrouter.get('/thumbnails', getuserthumbnails);
userrouter.get('/thumbnail/:id', getthumbnailbyid);
export default userrouter;
