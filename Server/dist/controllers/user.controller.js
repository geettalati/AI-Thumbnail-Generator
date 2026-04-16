import Thumbnail from "../models/thumbnail.model.js";
export const getuserthumbnails = async (req, res) => {
    try {
        const { userId } = req.session;
        const thumbnails = await Thumbnail.find({ userId }).sort({ createdAt: -1 });
        res.json({ thumbnails });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error! Could not fetch thumbnails.' });
    }
};
//  yeh controller to get a single thumbnail by ID
export const getthumbnailbyid = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.session;
        const thumbnail = await Thumbnail.findOne({ _id: id, userId });
        if (!thumbnail) {
            return res.status(404).json({ message: 'Thumbnail not found' });
        }
        res.json({ thumbnail });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error! Could not fetch thumbnail.' });
    }
};
