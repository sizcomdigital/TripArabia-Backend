const Admin = require('../models/adminmodel');
const bcrypt = require('bcrypt');
const Category = require('../models/categorymodel')
const Ticket = require('../models/ticketmodel')
const jwt = require('jsonwebtoken');
const Tour = require('../models/tourmodel');

module.exports = {
    admingetlogin: async (req, res) => {
        res.render("admin/adminlogin");
    },
    adminlogin: async (req, res) => {
        try {
            const { username, password } = req.body;
            const admin = await Admin.findOne({ username });
            if (!admin) {
                return res.status(400).send({ message: "no admin in this username" });
            }
            // Compare the provided password with the stored hashed password
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(400).send({ message: "Invalid username or password" });
            }
            const token = jwt.sign(
                { id: admin._id, role: "admin" },  // Payload data (like admin ID and role)
                process.env.JWT_SECRET,            // Secret key from your environment variables
                { expiresIn: "7d" }                // Token expiration time
            );
            // Send the token back to the client
            res.cookie("token", token, {
                httpOnly: true,
                secure: true, // Set to true if using HTTPS
                sameSite: "Strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
              });
              res.send({ message: "Login successful", token:token });
        } catch (error) {
            console.error("Error during login:", error);          
              return res.status(500).send({ message: "Internal Server Error" });
        }
    },
    logout: (req, res) => {
        res.clearCookie("token");
        res.redirect('/admin/login'); // Redirect to login page after logout
        res.status(200).send({ message: "User logged out successfully" });
    },
    register:  async (req, res) => {
        const { username, password} = req.body;
    
      
        try {
            const existingAdmin = await Admin.findOne({ username });
            if (existingAdmin) {
                return res.status(400).json({ message: 'Admin already exists with this username' });
            }
    
            // Create a new admin
            const newAdmin = new Admin({
                username,
                password, // The password will be hashed automatically due to the pre-save hook
                
            });
    
            // Save the new admin to the database
            await newAdmin.save();
            
            // Send a success response
            res.status(201).json({
                message: 'Admin registered successfully!',
                admin: {
                    username: newAdmin.username,
                    status: newAdmin.status,
                }
            });
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    adminhome: async (req, res) => {
      const categoryCount = await Category.countDocuments({});
      const ticketCount = await Ticket.countDocuments({});
      const tourCount = await Tour.countDocuments({});
        res.render("admin/dashboard",{
          
            categoryCount,
            tourCount,
            ticketCount
        
        });
    },
    addcategory: async (req,res)=>{
    res.render("admin/addcategory");
    },
    addtour: async (req,res)=>{
      try {
        // Fetch all categories from the database
        const categories = await Category.find({});
        
        // Pass categories to the view
        res.render("admin/addtour", { categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).send("Internal Server Error");
    }
    },
  alltours: async (req, res) => {
      const categories = await Category.find({});
      const page = parseInt(req.query.page) || 1; // Current page, default to 1
      const limit = 6; // Number of tours per page
      const skip = (page - 1) * limit; // Skip calculation for pagination
  
      try {
          const [tour, total] = await Promise.all([
              Tour.find({}).skip(skip).limit(limit), // Fetch tours with pagination
              Tour.countDocuments({}), // Get total count of tours
          ]);
  
          const totalPages = Math.ceil(total / limit);
  
          res.render("admin/Alltours", { 
              tour, 
              currentPage: page, 
              totalPages,
              categories
          });
      } catch (error) {
          console.error('Error fetching tours:', error);
          res.status(500).send('Error fetching tours');
      }
  },
    postaddCategory :async (req, res) => {
        const { name } = req.body;
        try {
          const newCategory = new Category({ name });
          await newCategory.save();
          res.status(201).json({ message: 'Category added successfully', category: newCategory });
        } catch (error) {
          res.status(400).json({ message: 'Error adding category', error: error.message });
        }
      },
    editCategory : async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        try {
          const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, updatedAt: Date.now() },
            { new: true, runValidators: true }
          );
          if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
          }
          res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
        } catch (error) {
          res.status(400).json({ message: 'Error updating category', error: error.message });
        }
      },
    deleteCategory : async (req, res) => {
        const { id } = req.params;
        
        
        try {
          const deletedCategory = await Category.findByIdAndDelete(id);
          if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
          }
          res.status(200).json({ message: 'Category deleted successfully', category: deletedCategory });
        } catch (error) {
          res.status(400).json({ message: 'Error deleting category', error: error.message });
        }
      },
    allcategory: async(req,res)=>{
      const categories = await Category.find({});
      res.render("admin/allcategory", { categories });
    },
    getblogpage: async(req,res)=>{
      res.render("admin/blogpage");
    },
    getticketspage: async(req,res)=>{
     res.render("admin/ticketpage");
    },
    alleditabletours: async (req, res) => {
      try {
          // Fetch all categories
          const categories = await Category.find({}).lean(); // Using `.lean()` for performance
          // Fetch all tours and populate their category information
          const tours = await Tour.find({}).populate('category','_id name').lean();
          // Render the admin/Editabletours view with the fetched data
          res.render("admin/Editabletours", { 
              tours, 
              categories, 
          });
      } catch (error) {
          console.error('Error fetching tours:', error);
          res.status(500).send('Error fetching tours');
      }
    } ,
    geteditCategory : async (req, res) => {
      try {
          const { id } = req.params; // Extract category ID from URL
          const category = await Category.findById(id); // Fetch the category details
  
          if (!category) {
              return res.status(404).send("Category not found"); // Handle case if category is not found
          }
  
          // Render the 'editcategory' view and pass the category data
          res.render("admin/editcategory", { category });
      } catch (error) {
          console.error(error);
          res.status(500).send("Internal Server Error"); // Handle any unexpected errors
      }
  }
}
    
    
    
   