const express = require("express");
const router = express.Router();
// const tourcontroller = require('../controllers/tourcontroller')

const usercontroller = require('../controllers/usercontroller')
// static files
router.get("/",usercontroller.userhome);
router.get('/service',usercontroller.getservicepage)
router.get('/aboutus',usercontroller.getaboutpage)
router.get('/search',usercontroller.searchtour)

router.get('/contact',usercontroller.getcontactpage)
router.get('/privacypolicy',usercontroller.getprivacypolicypage)
router.get('/termscondition',usercontroller.gettermsconditionpage)

// dynamic files
router.get('/category', usercontroller.getCategoryWiseTours);
router.get('/tour', usercontroller.getpertour);
router.get('/blog',usercontroller.getblogpage)
router.get('/blogDetails',usercontroller.getBlogdetailsPage)


module.exports= router