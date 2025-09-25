const express = require('express')
const authMiddleware = require('../middleware/auth-middleware.js')
const adminMiddleware = require('../middleware/admin-middleware.js')
const uploadMiddleware = require('../middleware/upload-middleware.js')
const {uploadImageController, fetchImageController, deleteImageController} = require('../controllers/image-controller.js')
// const  fetchImageController = require('../controllers/image-controller.js')
const router = express.Router()


//debugging 
console.log('authMiddleware', typeof authMiddleware);
console.log('adminMiddleware', typeof adminMiddleware);
console.log('uploadMiddleware.single', typeof uploadMiddleware.single);
console.log('uploadImageController', typeof uploadImageController);
console.log('deleteImageController', typeof deleteImageController);

//upload image
router.post('/upload',
  authMiddleware, 
  adminMiddleware, //if remove this line anyone can upload then
  uploadMiddleware.single('image'),
  uploadImageController);

//get all the images
router.get('/get',authMiddleware, fetchImageController)



//delete image route
//68cb278abefe06aa51d7b9b4
router.delete('/:id', authMiddleware,adminMiddleware,deleteImageController)

module.exports = router