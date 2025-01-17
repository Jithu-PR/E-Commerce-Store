const Feature = require('../../models/Feature');

const addFeatureImage = async(req, res)=> {
    try{

        const {image} = req.body;

        const featureImages = new Feature({
            image
        });

        await featureImages.save();

        res.status(201).json({
            success : true,
            data : featureImages
        });

    }catch(e) {
        console.log(e);
        res.status(500).json({
            success : true,
            message : "some error has occured"
        });
        
    }
};

const getFeatureImages = async(req, res)=> {
    try{

        const images = await Feature.find({});

        res.status(200).json({
            success : true,
            data : images
        });

    }catch(e) {
        console.log(e);
        res.status(500).json({
            success : true,
            message : "some error has occured"
        });
        
    }
};

const deleteFeatureImage = async(req, res)=> {
    try{
        const {featureImageId} = req.params;
        if(!featureImageId) {
            return res.status(400).json({
                success : false,
                message : "Image Id is required",
            })
        }

        const featureImage = await Feature.findOneAndDelete({_id : featureImageId});
        if(!featureImage) {
            res.status(404).json({
                success : false,
                message : "Feature Image not found"
            })
        }

        res.status(200).json({
            success : true,
            message : "FFeature Image deleted successfully"
        });


    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "error"
        })
        
    }
};


module.exports = {addFeatureImage, getFeatureImages, deleteFeatureImage};