const express = require("express");
const router = express.Router();
const admincontroller = require('../controllers/admincontroller')
const tourcontroller = require('../controllers/tourcontroller')
const upload = require('../config/multer')
const verifyToken = require('../middleware/authmiddleware')

// login route
router.get("/login",admincontroller.admingetlogin);
router.get("/",verifyToken,admincontroller.adminhome);
router.post("/login",admincontroller.adminlogin);
router.post("/register",admincontroller.register);
router.post('/logout',verifyToken, admincontroller.logout)

// category details
router.get("/addcategory",verifyToken,admincontroller.addcategory);
router.post("/categories",verifyToken,admincontroller.postaddCategory );
router.put("/categories/:id",verifyToken,admincontroller.editCategory );
router.get("/allcategory",verifyToken,admincontroller.allcategory);
router.delete("/deletecategory/:id",verifyToken,admincontroller.deleteCategory);
//active and inactive
router.put('/toursactive/:id', verifyToken, tourcontroller.updateStatus);

// tour details
router.post('/tours',verifyToken, upload.array('images', 5), tourcontroller.addTour); // 'images' is the field name in the form
 //get edit tour
router.get('/tours/:id',verifyToken,tourcontroller.geteditTour);
// Edit a tour
router.put('/tours/:id',verifyToken,upload.array('images', 5),tourcontroller.editTour);
// Delete a tour
router.delete('/tours/:id',verifyToken,tourcontroller.deleteTour);
//make bestseller
router.put('/mark-bestseller/:id', verifyToken, tourcontroller.updatebestStatus);

// Get all tours
router.get('/tours',verifyToken,tourcontroller.getAllTours);
router.get("/alltour",verifyToken,admincontroller.alltours);
router.get("/addtour",verifyToken,admincontroller.addtour);

router.delete('/img/:id',verifyToken,tourcontroller.deletePerImage)

// categorywise
router.get('/tours/:categoryId',verifyToken,tourcontroller.getCategoryWiseTours);
// blog details
router.post('/blog',verifyToken, upload.array('images', 5), tourcontroller.addBlog); // 'images' is the field name in the form
router.get('/blogs/:id',verifyToken,tourcontroller.geteditblog); 
router.put('/blogs/:id',verifyToken, upload.array('images',5), tourcontroller.editBlog);
router.delete('/blogs/:id',verifyToken, tourcontroller.deleteBlog);
router.delete('/blogimg/:id',verifyToken,tourcontroller.deletePerblogImage)

router.get('/blog',verifyToken,admincontroller.getblogpage)
router.get('/allblog',verifyToken,tourcontroller.allblogs)


module.exports= router