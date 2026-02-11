const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const User = require('./src/models/User');
const Admin = require('./src/models/Admin');

async function createSuperAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingUser = await User.findOne({ email: 'superadmin@shopez.com' });
    if (existingUser) {
      console.log('⚠️  Super admin already exists');
      mongoose.connection.close();
      return;
    }

    // Create super admin user
    const user = await User.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@shopez.com',
      password: 'admin123',
      role: 'admin',
      isEmailVerified: true,
      isActive: true
    });

    console.log('✅ User created:', user.email);

    // Create admin profile with all permissions
    const admin = await Admin.create({
      user: user._id,
      adminLevel: 'super_admin',
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
      canViewFinancials: true
    });

    console.log('\n✅ SUPER ADMIN CREATED SUCCESSFULLY!\n');
    console.log('📧 Email: superadmin@shopez.com');
    console.log('🔑 Password: admin123');
    console.log('👑 Admin Level: super_admin');
    console.log('\n✨ All permissions granted!\n');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
}

createSuperAdmin();
