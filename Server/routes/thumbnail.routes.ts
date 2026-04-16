import express from "express";
import { deletethumbnail, generatethumbnail, getThumbnailById, getUserThumbnails } from "../controllers/thumbnail.controller.js";

const thumbnailrouter = express.Router();

// POST /api/thumbnails/generate  — client calls this
thumbnailrouter.post('/generate', generatethumbnail);

// GET /api/thumbnails/:id  — client fetches thumbnail by ID
thumbnailrouter.get('/:id', getThumbnailById);

// GET /api/thumbnails  — client fetches all user thumbnails
thumbnailrouter.get('/', getUserThumbnails);

// DELETE /api/thumbnails/:id
thumbnailrouter.delete('/:id', deletethumbnail);

export default thumbnailrouter;
