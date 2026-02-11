const mongoose = require('mongoose');
const Product = require('./src/models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const products = await Product.find({});
    console.log(`\nTotal products: ${products.length}`);
    
    const productsWithoutVendor = products.filter(p => !p.vendor);
    console.log(`Products without vendor: ${productsWithoutVendor.length}`);
    
    if (productsWithoutVendor.length > 0) {
      console.log('\nProducts missing vendor:');
      productsWithoutVendor.forEach(p => {
        console.log(`- ${p.name} (ID: ${p._id})`);
      });
      console.log('\n⚠️  These products need vendors assigned before orders can be placed!');
    } else {
      console.log('✅ All products have vendors assigned');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
