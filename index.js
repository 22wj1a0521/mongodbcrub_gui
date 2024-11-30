const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Brand = require('./model/Brand');

const app = express();
const port = 3009;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/branddb') 
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Fixed typo: extend to extended
app.use(express.static(path.join(__dirname, 'public'))); // Ensure public folder path is resolved correctly

// View engine setup
app.set('views', path.join(__dirname, 'views')); // Ensure views directory is correctly set
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
  try {
    const brands = await Brand.find(); // Fetch all brands from MongoDB
    res.render('index', { brands });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add brand
app.post('/add', async (req, res) => {
  try {
    const newBrand = new Brand({
      name: req.body.name,
      description: req.body.description
    });
    await newBrand.save(); // Save new brand to the database
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding brand');
  }
});

// Edit brand (load edit page)
app.get('/edit/:id', async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).send('Brand not found'); // 404 if brand not found
    res.render('edit', { brand });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update brand
app.post('/edit/:id', async (req, res) => {
  try {
    await Brand.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description
    }); // Update brand details
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating brand');
  }
});

// Delete brand
app.post('/delete/:id', async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id); // Delete brand by ID
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting brand');
  }
});

// Start server
app.listen(port, () => {
  console.log('Server running at http://localhost:${port}');
});