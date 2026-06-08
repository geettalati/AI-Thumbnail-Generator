import { Request, Response } from 'express';
import Thumbnail from '../models/thumbnail.model.js';
import { Type } from '@google/genai';
import path from 'node:path';
import fs from 'node:fs';
import cloudinary from '../configs/cloudinary.js';
import ai from '../configs/ai.js';

const styleprompts: Record<string, string> = {
    'Bold and Graphic': 'a bold and graphic style thumbnail, vibrant colors, strong contrasts, eye-catching design, modern typography, dynamic layout, high visual impact, simple yet striking',
    'Tech/Futuristic': 'a tech and futuristic style thumbnail, sleek design, metallic colors, digital elements, modern typography, high-tech vibe, innovative layout, cutting-edge aesthetics',
    'Minimalist': 'a minimalist style thumbnail, clean design, simple color palette, ample white space, modern typography, elegant layout, understated aesthetics, focus on essentials',
    'Photorealistic': 'a photorealistic style thumbnail, high-detail imagery, lifelike colors, realistic lighting and shadows, modern typography, immersive design, visually rich aesthetics',
    'Illustrated': 'an illustrated style thumbnail, hand-drawn elements, vibrant colors, playful design, creative typography, whimsical layout, artistic aesthetics, unique visual appeal',
};

const colorschemedescriptions: Record<string, string> = {
    vibrant: 'bright and lively colors that grab attention and convey energy and excitement',
    sunset: 'warm and soothing colors inspired by a sunset, evoking feelings of calmness and tranquility',
    forest: 'earthy and natural colors inspired by a forest, conveying a sense of growth, stability, and harmony with nature',
    neon: 'bold and striking neon colors that create a futuristic and energetic vibe, perfect for grabbing attention',
    purple: 'rich and luxurious purple tones that convey creativity, mystery, and sophistication',
    monochrome: 'a sleek and modern monochrome color scheme using varying shades of a single color to create depth and interest',
    ocean: 'cool and refreshing ocean-inspired colors that evoke a sense of calmness, serenity, and vastness',
    pastel: 'soft and gentle pastel colors that create a light, airy, and approachable aesthetic',
};


export const generatethumbnail = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session as any;
        const { title, prompt: user_prompt, style, aspect_ratio, color_scheme, text_overlay } = req.body;

        const thumbnail = await Thumbnail.create({
            userId,
            title,
            prompt_used: user_prompt,
            user_prompt,
            style,
            aspect_ratio,
            color_scheme,
            text_overlay,
            isGenerating: true,
        });

        // Build the prompt using backtick template literals so variables actually interpolate
        let prompt = `Create a ${styleprompts[style] || 'visually striking'} thumbnail for: "${title}"`;

        if (color_scheme && colorschemedescriptions[color_scheme]) {
            prompt += ` using a ${colorschemedescriptions[color_scheme]}`;
        }

        if (user_prompt) {
            prompt += `. Also incorporate these details: "${user_prompt}"`;
        }

        prompt += `. The thumbnail should be of ${aspect_ratio} aspect ratio and should prominently feature the title text. Make it visually appealing and relevant to the content. Impossible to ignore.`;

        let width = 1280;
        let height = 720;
        if (aspect_ratio === '1:1') {
            width = 1024; height = 1024;
        } else if (aspect_ratio === '9:16') {
            width = 720; height = 1280;
        }

        // Generate image using Pollinations AI (100% Free, No API Key needed)
        const seed = Math.floor(Math.random() * 1000000);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
        
        console.log(`Fetching image from Pollinations AI: ${imageUrl}`);
        const imageResponse = await fetch(imageUrl);

        if (!imageResponse.ok) {
            throw new Error('Image generation failed — Pollinations API error');
        }

        const arrayBuffer = await imageResponse.arrayBuffer();
        const finalbuffer = Buffer.from(arrayBuffer);

        const filename = `final-output-${Date.now()}.png`;
        const filepath = path.join('images', filename);

        // Ensure the images directory exists
        fs.mkdirSync('images', { recursive: true });

        // Write the final image to the file
        fs.writeFileSync(filepath, finalbuffer);

        const uploadresult = await cloudinary.uploader.upload(filepath, { resource_type: 'image' });

        thumbnail.image_url = uploadresult.secure_url;
        thumbnail.isGenerating = false;
        await thumbnail.save();
        res.json({ message: 'Thumbnail generated successfully', thumbnail });

        // Clean up local file
        fs.unlinkSync(filepath);
    } catch (error: any) {
        console.log('Thumbnail generation error:', error);
        res.status(500).json({ message: 'Server Error! Thumbnail generation failed.' });
    }
};

export const deletethumbnail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.session as any;

        await Thumbnail.findOneAndDelete({ _id: id, userId });
        res.json({ message: 'Thumbnail deleted successfully' });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: 'Server Error! Thumbnail deletion failed.' });
    }
};

export const getThumbnailById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const thumbnail = await Thumbnail.findById(id);

        if (!thumbnail) {
            return res.status(404).json({ message: 'Thumbnail not found' });
        }

        res.json({ thumbnail });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: 'Server Error! Failed to fetch thumbnail.' });
    }
};

export const getUserThumbnails = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session as any;
        const thumbnails = await Thumbnail.find({ userId }).sort({ createdAt: -1 });

        res.json({ thumbnails });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: 'Server Error! Failed to fetch thumbnails.' });
    }
};