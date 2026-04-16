import mongoose, { Schema } from "mongoose";
const thumbnailSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    style: {
        type: String,
        required: true,
        enum: [
            "Bold and Graphic",
            "Tech/Futuristic",
            "Minimalist",
            "Photorealistic",
            "Illustrated",
        ],
    },
    aspect_ratio: {
        type: String,
        enum: ["16:9", "1:1", "9:16"],
        default: "16:9",
    },
    color_scheme: {
        type: String,
        enum: [
            "vibrant",
            "sunset",
            "forest",
            "neon",
            "purple",
            "monochrome",
            "ocean",
            "pastel",
        ],
    },
    text_overlay: {
        type: Boolean,
        default: false,
    },
    image_url: {
        type: String,
        default: "",
    },
    prompt_used: {
        type: String,
    },
    user_prompt: {
        type: String,
    },
    isGenerating: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const Thumbnail = mongoose.models.Thumbnail ||
    mongoose.model("Thumbnail", thumbnailSchema);
export default Thumbnail;
