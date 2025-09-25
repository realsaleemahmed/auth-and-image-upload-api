const Image = require('../models/Image.js');
const {uploadToCloudinary} = require('../helpers/cloudinaryHelper.js')
const fs = require('fs');
const cloudinary = require('../config/cloudinary.js');
const { message } = require('statuses');
const uploadImageController = async (req,res) => {
    try {
      //check if file is missing in req ob
      if(!req.file){
        return res.status(400).json({
          success : false,
          message : 'file is required upload an image'
        }); 
      };
      //upload to cloudinary
      const { url , publicId} = await uploadToCloudinary(req.file.path)

      //store the img url and public id along with uploaded user id in db
      const newlyUploadedImage = new Image({
        url,
        publicId,
        uploadedBy : req.userInfo.userId
      })

      await newlyUploadedImage.save();

      //delete the file from local storage

      fs.unlinkSync(req.file.path);

      res.status(201).json({
        success: true,
        message : 'Image uploaded successfully',
        image : newlyUploadedImage
      })
    }
    catch(error) {
      console.log('error while uploading to cloudinary', error);
      res.status(500).json({
        success: false,
        message: 'something went wrong try again'
      })
    }
  }

  const fetchImageController = async (req,res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 3;
      const skip = (page - 1) * limit;

      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
      const totalImages = await Image.countDocuments();
      const totalPages = Math.ceil(totalImages / limit);
      

      const sortObj = {};
      sortObj[sortBy] = sortOrder
      const images = await Image.find()
      .sort(sortObj)
      .skip(skip)
      .limit(limit);


      if(images) {
        res.status(200).json({
          success : true,
          currentPage : page,
          totalPages : totalPages,   
          totalImages : totalImages,
          data: images
        })
      }

    } catch(error){
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'something went wrong try again'
      })
    }
  }

    const deleteImageController = async (req,res) => {
    try {
      //debugging
      console.log('Deleting image id:', req.params.id);
      console.log('UserId from token:', req.userInfo.userId);
      
      const getCurrentImageId = req.params.id;
      const userId = req.userInfo.userId;

      const image = await Image.findById(getCurrentImageId);
      if(!image) {
        return res.status(404).json({
          success : false,
          message : 'image not found'
        })
      }

      //check if this image is uploaded by the current user who is trying to del this image;

      if(image.uploadedBy.toString() !== userId) {
        return res.status(403).json({
          success : false,
          message : 'You are not authorized to delete this image'
        })
      }
      //delete this image first from cloudinary storage
      await cloudinary.uploader.destroy(image.publicId);

      //now delete this image from mongoDb

      await Image.findByIdAndDelete(getCurrentImageId);

      res.status(200).json({
        success : true,
        message : 'image deleted successfully'
      })

    } catch(error){
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'something went wrong try again'
      })
    }
  }

  module.exports = {
    uploadImageController,
    fetchImageController,
    deleteImageController
  };
 