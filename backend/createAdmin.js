const mongoose = require('mongoose');
const Admin = require('./models/admin');  // Import Admin model

async function createAdmin() {
  try {
    // Connect to the database (replace with your actual MongoDB URI)
    await mongoose.connect('mongodb+srv://abraralvee:ars242423@styleswap.ezzcs5q.mongodb.net/?retryWrites=true&w=majority&appName=StyleSwap');

    // Check if the admin already exists
    const existing = await Admin.findOne({ email: 'admin@styleswap.com' });
    if (existing) {
      console.log('Admin already exists!');
      return;
    }

    // Create a new admin user
    const admin = new Admin({
      email: 'admin@styleswap.com',
      password: 'admin123', // This password will be hashed automatically by the pre-save hook
      name: 'Style Admin',
    });

    // Save the admin user to the database
    await admin.save();
    console.log('Admin created successfully');
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    // Ensure to close the connection
    mongoose.connection.close();
    process.exit();
  }
}

createAdmin();
