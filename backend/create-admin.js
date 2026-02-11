const mongoose = require('mongoose');
const User = require('./src/models/User');
const Admin = require('./src/models/Admin');
require('dotenv').config();

async function createSuperAdmin() {
  try {
    console.log('🔌 Connecting to database...');
    
    // Use .env URI which is configured correctly
    const mongoUri = process.env.MONGODB_URI;
    console.log('📍 Using connection string:', mongoUri.substring(0, 50) + '...');
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      retryWrites: true,
    });

    console.log('✅ Connected to MongoDB');

    // Check if already exists
    const existingUser = await User.findOne({ email: 'superadmin@shopez.com' });
    if (existingUser) {
      const existingAdmin = await Admin.findOne({ user: existingUser._id });
      if (existingAdmin) {
        console.log('✅ Super admin already exists - no action taken');
        await mongoose.connection.close();
        return;
      } else {
        console.log('📝 Creating admin profile for existing user...');
      }
    }

    // Create user if doesn't exist
    if (!existingUser) {
      const user = await User.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@shopez.com',
        password: 'admin123',
        role: 'admin',
        isEmailVerified: true,
        isActive: true
      });
      console.log('✅ User created');

      // Create admin profile
      const admin = await Admin.create({
        user: user._id,
        adminLevel: 'super_admin',
        department: 'Administration',
        canManageUsers: true,
        canManageVendors: true,
        canVerifyVendors: true,
        canManageProducts: true,
        canDeleteProducts: true,
        canFeatureProducts: true,
        canManageOrders: true,
        canSuspendVendors: true,
        canSuspendUsers: true,
        canDeleteVendors: true,
        canViewFinancials: true,
        isActive: true
      });
      console.log('✅ Admin profile created');
    } else {
      // User exists, create admin profile
      const admin = await Admin.create({
        user: existingUser._id,
        adminLevel: 'super_admin',
        department: 'Administration',
        canManageUsers: true,
        canManageVendors: true,
        canVerifyVendors: true,
        canManageProducts: true,
        canDeleteProducts: true,
        canFeatureProducts: true,
        canManageOrders: true,
        canSuspendVendors: true,
        canSuspendUsers: true,
        canDeleteVendors: true,
        canViewFinancials: true,
        isActive: true
      });
      console.log('✅ Admin profile created');
    }

    console.log('');
    console.log('═════════════════════════════════════════════════════');
    console.log('✨ SUPER ADMIN READY FOR TESTING');
    console.log('═════════════════════════════════════════════════════');
    console.log('📧 Email:       superadmin@shopez.com');
    console.log('🔐 Password:    admin123');
    console.log('👤 Role:        admin');
    console.log('🎯 Level:       super_admin');
    console.log('🌐 Login URL:   http://localhost:5173/admin-access/login');
    console.log('═════════════════════════════════════════════════════');
    console.log('');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Network Error: Cannot reach MongoDB Atlas');
    }
    process.exit(1);
  }
}

createSuperAdmin();
