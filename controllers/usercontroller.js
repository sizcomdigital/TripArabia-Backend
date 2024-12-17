const Category = require('../models/categorymodel')
const Tour = require("../models/tourmodel");
const Blog = require("../models/blogmodel");


module.exports = {
    userhome: async (req, res) => {
        try {
            const categories = await Category.find({}).limit(5);
            const category = await Category.find({})
            // Map icons and delays for each category name
            const categoryDetails = categories.map((category, index) => {
                let iconClass = "";
                let delay = `${(index + 1) * 0.1}s`; // Increment delay for animations
    
                switch (category.name) {
                    case "Desert Adventure Tours":
                        iconClass = "icon-tent-1";
                        break;
                    case "Liwa Desert Safari Tours":
                        iconClass = "icon-sunset-1";
                        break;
                    case "City Sightseeing Tours":
                        iconClass = "icon-Group-2";
                        break;
                    case "Luxury Sea Tours":
                        iconClass = "icon-Hiking";
                        break;
                    case "Hummer Desert Safari Tours":
                        iconClass = "icon-Group-11";
                        break;
                    default:
                        iconClass = "icon-default"; // Fallback icon
                }
                return {
                    ...category._doc, // Spread original category fields
                    iconClass,
                    delay,
                };
            });
            res.render("user/userHome", { categories: categoryDetails,
                category,
                activePage: "home" // Set the active page dynamically
             });
        } catch (error) {
            console.error("Error fetching categories:", error);
            res.status(500).send("Internal Server Error");
        }
    },  
    getservicepage: async (req, res) => {
        try {
            const category = await Category.find({});
            res.render("user/service", {
                category,
                activePage: "service" // Set the active page dynamically
            });
        } catch (error) {
            console.error("Error fetching service page:", error);
            res.status(400).json({ message: "Error fetching service page", error: error.message });
        }
    },
    getcontactpage: async (req, res) => {
        try {
            const category = await Category.find({});
            res.render("user/contact", {
                category,
                activePage: "contact" // Set the active page dynamically
            });
        } catch (error) {
            console.error("Error fetching contact page:", error);
            res.status(400).json({ message: "Error fetching contact page", error: error.message });
        }
    },
    getprivacypolicypage: async (req, res) => {
        try {
            const category = await Category.find({});
            res.render("user/privacypolicy", {
                category,
                activePage: "privacypolicy" // Set the active page dynamically
            });
        } catch (error) {
            console.error("Error fetching privacypolicy page:", error);
            res.status(400).json({ message: "Error fetching privacypolicy page", error: error.message });
        }
    },
    gettermsconditionpage: async (req, res) => {
        try {
            const category = await Category.find({});
            res.render("user/termscondition", {
                category,
                activePage: "termscondition" // Set the active page dynamically
            });
        } catch (error) {
            console.error("Error fetching termscondition page:", error);
            res.status(400).json({ message: "Error fetching termscondition page", error: error.message });
        }
    },
    getaboutpage: async (req, res) => {
        try {
            const category = await Category.find({});
            res.render("user/about", {
                category,
                activePage: "about" // Set the active page dynamically
            });
        } catch (error) {
            console.error("Error fetching about page:", error);
            res.status(400).json({ message: "Error fetching about page", error: error.message });
        }
    },
    getCategoryWiseTours: async (req, res) => {
        const categories = await Category.find({}).limit();
    
        const { id } = req.query; // Get id from the query string
        
        try {
            // Find the category by its _id
            const category = await Category.findById(id);
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
    
    
            // Find tours that match the specified category
            const tours = await Tour.find({ category: id })
                .populate("category", "name") // Populating the category to include its name
                .exec();
    
            res.render("user/tours", {
                tours,
                category:categories,
                categoryName: category.name, // Pass the category name
                activePage: "Tours" // Set the active page dynamically
            });
        } catch (error) {
            res.status(400).json({ message: "Error fetching tours", error: error.message });
        }
    },
    getpertour: async (req, res) => {
        const { Tourid } = req.query; // Extract Tourid from the query
    
        try {
            // Retrieve all categories for rendering
            const category = await Category.find({});
    
            // Find the specific tour by ID
            const tour = await Tour.findById(Tourid).populate("category", "name").exec();
    
            // Handle the case where the tour is not found
            if (!tour) {
                return res.status(404).json({ message: "Tour not found" });
            }
    
            // Render the tour details page
            res.render("user/tourDetails", {
                tour,
                category,
                activePage: "Tours", // Set the active page dynamically
            });
        } catch (error) {
            // Handle errors and send a response
            res.status(400).json({ message: "Error fetching tour details", error: error.message });
        }
    },
    getblogpage: async (req, res) => {
        try {
            const category = await Category.find({});
            const blog = await Blog.find()
            res.render("user/blog", {
                category,
                blog,
                activePage: "blog" // Set the active page dynamically
            });
        } catch (error) {
            console.error("Error fetching about page:", error);
            res.status(400).json({ message: "Error fetching about page", error: error.message });
        }
    },
    getBlogdetailsPage : async (req, res) => {
        try {
            const category = await Category.find({});
            const blogs = await Blog.find()

            const { blogId } = req.query;
            // Validate that the blogId is provided
            if (!blogId) {
                return res.status(400).send('Blog ID is required');
            }
            // Fetch the blog details from the database
            const blog = await Blog.findById(blogId);
            // Check if the blog exists
            if (!blog) {
                return res.status(404).send('Blog not found');
            }
            // Render the blog details page with the blog data
            res.render('user/blogdetails', { blog,
                blogs,
                category,
                activePage: "blog" // Set the active page dynamically
            });
        } catch (error) {
            console.error('Error fetching blog details:', error);
            res.status(500).send('Server error');
        }
    },
    searchtour: async (req, res) => {
        const searchQuery = req.query.tours || '';  // Get the search query if any
        try {
            let tours;
            if (searchQuery) {
                // If a search query is provided, search by tour name
                tours = await Tour.find({
                    tourName: { $regex: searchQuery, $options: 'i' }  // Case-insensitive search
                });
            } else {
                // If no search query, return all tours
                tours = await Tour.find();
            }
    
            if (tours.length === 0) {
                return res.status(404).json({ message: 'No tours found' });  // Return 404 if no tours found
            }
    
            res.json(tours);  // Return the tours as JSON
        } catch (error) {
            console.error('Error fetching tours:', error);
            res.status(500).send('Error fetching tours');
        }
    }  
}