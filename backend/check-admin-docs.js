require('dotenv').config();
const mongoose = require('mongoose');
const AdminAccount = require('./src/models/AdminAccount');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB');

  const admins = await AdminAccount.find().select('-password');
  console.log(`\nAdmin accounts found: ${admins.length}`);

  admins.forEach((admin) => {
    console.log(`\nAdmin: ${admin.email} (ID: ${admin._id})`);
    console.log('Admin level:', admin.adminLevel);
    console.log('Is active:', admin.isActive);
  });

  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
