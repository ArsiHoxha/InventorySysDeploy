const express = require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const ProducMain = require("./schemas/ProduktSkema")
const Reservation = require("./schemas/Rezervation")
const User = require("./schemas/UserAuth")
const helmet = require('helmet'); // Import Helmet
  
require('dotenv').config();
require('./auth'); 
require('./db');


const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

function isLogedIn(req, res, next) {
    req.user ? next() :res.sendStatus(401)
}

app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, "uploads/");
    } else {
      cb(new Error("Invalid file type"));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + uuidv4();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};


const upload = multer({ storage: storage, fileFilter: fileFilter });


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://inventorysysdeploy-1-front.onrender.com',
  credentials: true
}));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
  );
  
  app.get('/auth/google/callback',
    passport.authenticate('google', { 
      failureRedirect: '/auth/google/failure', 
      failureMessage: true 
    }),
    (req, res) => {
      // Successful authentication
      res.redirect('https://inventorysysdeploy-1-front.onrender.com/profile');
    }
  );
    
  app.get('/auth/google/success', (req, res) => {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });
  
  app.get('/auth/google/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Logout successful' });
        });
    });
  });
  
  app.get('/auth/google/failure', (req, res) => {
    const failureMessage = req.session.messages ? req.session.messages[0] : 'Login failed';
  
    if (failureMessage === 'User is pending approval') {
      res.redirect('https://inventorysysdeploy-1-front.onrender.com/pending'); // Redirect to pending page
    } else if (failureMessage === 'User is blocked') {
      res.redirect('https://inventorysysdeploy-1-front.onrender.com/blocked'); // Redirect to blocked page
    } else {
      res.redirect(`https://inventorysysdeploy-1-front.onrender.com/login?error=${encodeURIComponent(failureMessage)}`);
    }
  });
      const isLoged = async (req, res, next) => {
    if (req.isAuthenticated()) {
      try {
        const user = await User.findById(req.user._id); // Ensure you have the user ID in the session
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
        next(); // Proceed to the next middleware or route handler if the user is authenticated and pending is true
      } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    } else {
      res.status(401).json({ message: 'Not authenticated' }); // Unauthorized status
    }
  };
  

  app.get("/getUserInfo", isLoged, async (req, res) => {
    try {
      const users = await User.find({});
      console.log(users);
      res.json(req.user ); // Return all users
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
app.post('/uploadProduct', upload.single('file'), async (req, res) => {
  try {
    const { productName, price, description } = req.body;
    const file = req.file;

    const newProduct = new ProducMain({
      id: uuidv4(),
      productNameTxt: productName,
      productImg: file.filename,
      priceTxt: price,
      descriptionTxt: description,
      filename: file.filename,
      path: file.path,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    await newProduct.save();
    res.status(200).json({ message: 'Product uploaded successfully', newProduct });
  } catch (error) {
    console.error('Error uploading product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/products', async (req, res) => {
  try {
    const product = await ProducMain.find({});
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    await ProducMain.findByIdAndDelete(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/reserve',isLoged, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.googleId;
  try {

    const product = await ProducMain.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the product is available for reservation
    if (product.priceTxt <= 0) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }

    // Create the reservation
    const reservation = new Reservation({
      productId,
      userId,
      reservedAt: new Date(),
    });

    await reservation.save();

    // Decrement the product quantity
    product.priceTxt -= 1;
    await product.save();

    res.status(200).json({ message: 'Product reserved successfully' });
  } catch (error) {
    console.error('Error reserving product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.get('/totalUsersCount', async (req, res) => {
  try {
    // Count all users in the User collection
    const totalUsersCount = await User.countDocuments({});

    res.status(200).json({ totalUsersCount });
  } catch (error) {
    console.error('Error counting total users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.get('/productsPrice', async (req, res) => {
  try {
    const products = await ProducMain.find();

    if (products.length === 0) {
      return res.status(200).json({ products: [], lowestPriceProduct: null, highestPriceProduct: null });
    }

    const prices = products.map(product => parseFloat(product.priceTxt));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const lowestPriceProduct = products.find(product => parseFloat(product.priceTxt) === minPrice);
    const highestPriceProduct = products.find(product => parseFloat(product.priceTxt) === maxPrice);

    res.status(200).json({
      products,
      lowestPriceProduct,
      highestPriceProduct
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET all reservations

app.get('/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    const formattedReservations = [];

    // Iterate through each reservation
    for (const reservation of reservations) {
      const userID = reservation.userId;
      const USER = await User.findOne({ googleId: userID });

      const productID = reservation.productId;
      const PRODUCT = await ProducMain.findById(productID);

      // Check if productNameTxt is not empty
      if (PRODUCT && PRODUCT.productNameTxt) {
        const reservationData = {
          reservedAt: reservation.reservedAt,
          userDisplayName: USER ? USER.displayName : null,
          productNameTxt: PRODUCT.productNameTxt
        };

        formattedReservations.push(reservationData);
      }
    }

    // Send formatted reservations data to the frontend
    res.status(200).json(formattedReservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({isAdmin: false});
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Block a user
app.post('/blockUser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.blocked = true;
    await user.save();

    res.status(200).json({ message: 'User blocked successfully' });
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Unblock a user
app.post('/unblockUser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.blocked = false;
    await user.save();

    res.status(200).json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/pendingUsers', async (req, res) => {
  try {
    const pendingUsers = await User.find({ isAdmin: false, pending: true });
    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Approve pending user
app.post('/approveUser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.pending = false;
    await user.save();

    res.status(200).json({ message: 'User approved successfully' });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/rejectUser/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID and update their status
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user status to rejected
    user.pending = false;
    user.blocked = false;
    user.rejected = true; // Assuming you have a 'rejected' field or similar
    
    await user.save();

    res.status(200).json({ message: 'User rejected successfully' });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/deleteAllUsers', async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: 'All users deleted successfully' });
  } catch (error) {
    console.error('Error deleting all users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Approve a pending user
  
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
