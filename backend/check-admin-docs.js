require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB');
  
  const users = await User.find({ role: 'admin' });
  console.log(`\nAdmin users found: ${users.length}`);
  
  for(const u of users) {
    console.log(`\nUser: ${u.email} (ID: ${u._id})`);
    const admin = await Admin.findOne({ user: u._id });
    console.log('Has Admin doc:', !!admin);
    if(admin) {
      console.log('Admin level:', admin.adminLevel);
      console.log('Admin ID:', admin._id);
    } else {
      console.log('⚠️  WARNING: Admin document is missing for this user!');
    }
  }
  
  console.log('\nAll Admin documents:');
  const allAdmins = await Admin.find().populate('user', 'email firstName lastName');
  console.log(`Total: ${allAdmins.length}`);
  allAdmins.forEach(admin => {
    console.log(`- ${admin.user?.email || 'No user'} - Level: ${admin.adminLevel}`);
  });
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
