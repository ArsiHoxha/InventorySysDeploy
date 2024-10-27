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
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');



require('dotenv').config();
require('./auth'); 
require('./db');


const app = express();
app.set('trust proxy', true);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

function isLogedIn(req, res, next) {
    req.user ? next() :res.sendStatus(401)
}


const mongoURI = process.env.MONGODB_URI; // Ensure your MongoDB URI is in your .env

// Create a mongo connection
const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Init gfs
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads'); // Set collection name
});

// Set up GridFS storage
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: 'uploads' // Set the name of the bucket
        };
    }
});

const upload = multer({ storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: "https://inventorysysdeploy-3-client.onrender.com",
  credentials: true
}));
app.use(session({
  secret: 'yourSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,  // Required for cookies to work in secure environments
    sameSite: 'None'  // Necessary for cross-site cookies in Safari
  }
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
      res.redirect('https://inventorysysdeploy-3-client.onrender.com/profile');
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
      res.redirect('https://inventorysysdeploy-3-client.onrender.com/pending'); // Redirect to pending page
    } else if (failureMessage === 'User is blocked') {
      res.redirect('https://inventorysysdeploy-3-client.onrender.com/blocked'); // Redirect to blocked page
    } else {
      res.redirect(`https://inventorysysdeploy-3-client.onrender.com/login?error=${encodeURIComponent(failureMessage)}`);
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
            productImg: file.filename, // This will still refer to the filename in MongoDB
            priceTxt: price,
            descriptionTxt: description,
            filename: file.filename,
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

// Route to get the uploaded file
app.get('/file/:id', (req, res) => {
    gfs.files.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({ err: 'No file exists' });
        }

        // Check if the file is an image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            // Create a read stream for the file
            const readstream = gfs.createReadStream(file._id);
            readstream.pipe(res);
        } else {
            res.status(404).json({ err: 'Not an image' });
        }
    });
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
app.put('/products/:id', async (req, res) => {
  try {
    const updatedProduct = await ProducMain.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).send(err);
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

      // Check if productNameTxt and userDisplayName are not empty
      if (PRODUCT && PRODUCT.productNameTxt && USER && USER.displayName) {
        const reservationData = {
          reservedAt: reservation.reservedAt,
          userDisplayName: USER.displayName,
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
app.post('/removeUser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(id); // Remove user from the database

    res.status(200).json({ message: 'User removed successfully' }); // Send success message
  } catch (error) {
    console.error('Error removing user:', error);
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
