import  express  from "express";
import { deletethumbnail, generatethumbnail } from "../controllers/thumbnail.controller.js";

const thumbnailrouter = express.Router();

thumbnailrouter.post('/generate-thumbnail', generatethumbnail);
thumbnailrouter.delete('/delete-thumbnail/:id', deletethumbnail);

export default thumbnailrouter

