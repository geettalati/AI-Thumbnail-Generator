import { Request, Response } from 'express';
import Thumbnail from '../models/thumbnail.model.js';
import { GenerateContentConfig, HarmBlockThreshold, HarmCategory } from '@google/genai';
import { config } from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import {v2 as cloudinary} from 'cloudinary';


const styleprompts = {
    'Bold and Graphic':'a bold and graphic style thumbnail, vibrant colors, strong contrasts, eye-catching design  , modern typography, dynamic layout , high visual impact , simple yet striking',
    'Tech/Futuristic':'a tech and futuristic style thumbnail, sleek design, metallic colors, digital elements, modern typography, high-tech vibe, innovative layout, cutting-edge aesthetics',
    'Minimalist':'a minimalist style thumbnail, clean design, simple color palette, ample white space, modern typography, elegant layout, understated aesthetics, focus on essentials',
    'Photorealistic':'a photorealistic style thumbnail, high-detail imagery, lifelike colors, realistic lighting and shadows, modern typography, immersive design, visually rich aesthetics',
    'Illustrated':'an illustrated style thumbnail, hand-drawn elements, vibrant colors, playful design, creative typography, whimsical layout, artistic aesthetics, unique visual appeal',
}

const colorschemedescriptions = {
    vibrant: 'bright and lively colors that grab attention and convey energy and excitement  ',
    sunset: 'warm and soothing colors inspired by a sunset, evoking feelings of calmness and tranquility',
    forest: 'earthy and natural colors inspired by a forest, conveying a sense of growth, stability, and harmony with nature',
    neon: 'bold and striking neon colors that create a futuristic and energetic vibe, perfect for grabbing attention',
    purple: 'rich and luxurious purple tones that convey creativity, mystery, and sophistication',
    monochrome: 'a sleek and modern monochrome color scheme using varying shades of a single color to create depth and interest',
    ocean: 'cool and refreshing ocean-inspired colors that evoke a sense of calmness, serenity, and vastness',
    pastel: 'soft and gentle pastel colors that create a light, airy, and approachable aesthetic',
}


export const generatethumbnail = async (req: Request, res: Response) => { 
    try {
        const{userId} = req.session as any;
        const{title , prompt:user_prompt, style, aspect_ratio, color_scheme, text_overlay} = req.body;

        const thumbnail = await Thumbnail.create({
            userId,
            title,
            prompt_used:user_prompt,
            user_prompt,
            style,
            aspect_ratio,
            color_scheme,
            text_overlay,
            isGenerating:true,  
        })

        const model = 'gemini-3-pro-image-preview';

        const generaionconfig: GenerateContentConfig = {
            maxOutputTokens:32768,
            temperature:1,
            topP:0.95,
            responseModalities:['image'],
            imageConfig:{
                aspectRatio: aspect_ratio,
                imageSize:'1K',
            },
            safetySettings:[
                {
                    category:HarmCategory.HARM_CATEGORY_HATE_SPEECH,threshold:HarmBlockThreshold.OFF
                },
                {
                         category:HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,threshold:HarmBlockThreshold.OFF
                },
                {
                        category:HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,threshold:HarmBlockThreshold.OFF
                },
                {
                        category:HarmCategory.HARM_CATEGORY_HARASSMENT,threshold:HarmBlockThreshold.OFF
                },
                
            ]
        }
        let prompt = 'Create a ${styleprompts[style as keyof styleprompts]} for: "{title}" '

        if(color_scheme){
            prompt += ' using a ${colorschemedescriptions[color_scheme as keyof colorschemedescriptions]}'
        }

        if(user_prompt){
            prompt += '. Also incorporate these details: "{user_prompt}"' 
        }
        
        prompt += 'The thumbnail should be of ${aspect_ratio} and should prominently feature the title text.Make it visually appealing and relevant to the content.Impossible to ignore.'

        // generate image using Gemini API
        const response = await ai.generateContent({
            model:model,
            prompt:[prompt],
            config:generaionconfig,
        })

        // check if image is generated
        
        if(!response?.candidates?.[0].content?.parts){
            throw new Error('Image generation failed');
        }

        const parts = response.candidates[0].content.parts;

        let finalbuffer : Buffer | null = null;

        for(const part of parts){
            if(part.inlinedata){
                finalbuffer = Buffer.from(part.inlinedata);
            }
        }

        const filename = 'final-output-${Date.now()}.png';
        const filepath = path.join('images' , filename);

        //check the images directory exists 

        fs.mkdirSync('images' , {recursive:true});

        // write the final image to the file 

        fs.writeFileSync (filepath , finalbuffer as Buffer);

        const uploadresult = await cloudinary.uploader.upload(filepath , {resource_type:'image',})

        thumbnail.image_url = uploadresult.secure_url;
        thumbnail.isGenerating = false;
        await thumbnail.save();
        res.json({message:'Thumbnail generated successfully', thumbnail});

        fs.unlinkSync(filepath);
    } catch (error) {

        console.log(error)
        res.status(500).json({message:'Server Error! Thumbnail generation failed.'});
        
    }
}