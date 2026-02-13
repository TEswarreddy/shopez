const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MongoDB URI not found in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log('✅ MongoDB connected successfully\n');

    // Check if superadmin already exists
    const existingSuperAdmin = await Admin.findOne({ 
      adminLevel: 'super_admin' 
    });

    if (existingSuperAdmin) {
      console.log('⚠️  A super admin already exists:');
      console.log(`   Email: ${existingSuperAdmin.email}`);
      console.log(`   Name: ${existingSuperAdmin.firstName} ${existingSuperAdmin.lastName}`);
      console.log('\nIf you want to create another super admin, delete the existing one first.\n');
      process.exit(0);
    }

    // Create superadmin
    const superAdminData = {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@shopez.com',
      password: 'SuperAdmin@123', // Change this password after first login
      phone: '+1234567890',
      adminLevel: 'super_admin',
      department: 'management',
      designation: 'Super Administrator',
      employeeId: 'SA001',
      isActive: true,
      isEmailVerified: true,
      permissions: {
        canManageUsers: true,
        canDeleteUsers: true,
        canSuspendUsers: true,
        canManageVendors: true,
        canVerifyVendors: true,
        canSuspendVendors: true,
        canDeleteVendors: true,
        canManageProducts: true,
        canDeleteProducts: true,
        canFeatureProducts: true,
        canManageOrders: true,
        canRefundOrders: true,
        canCancelOrders: true,
        canManageCategories: true,
        canManageBanners: true,
        canManagePromotions: true,
        canViewFinancials: true,
        canProcessPayouts: true,
        canManageCommissions: true,
        canManageSettings: true,
        canViewLogs: true,
        canManageAdmins: true,
      },
      notificationSettings: {
        email: true,
        sms: true,
        newOrders: true,
        newVendors: true,
        disputes: true,
        systemAlerts: true,
      },
    };

    const superAdmin = await Admin.create(superAdminData);

    console.log('✅ Super Admin created successfully!\n');
    console.log('📧 Login Credentials:');
    console.log('   Email:', superAdmin.email);
    console.log('   Password: SuperAdmin@123');
    console.log('\n⚠️  IMPORTANT: Please change the password after your first login!\n');
    console.log('Super Admin Details:');
    console.log('   Name:', `${superAdmin.firstName} ${superAdmin.lastName}`);
    console.log('   Admin Level:', superAdmin.adminLevel);
    console.log('   Department:', superAdmin.department);
    console.log('   Employee ID:', superAdmin.employeeId);
    console.log('   Created:', superAdmin.createdAt);
    console.log('\n✅ All permissions have been granted to this super admin.\n');

  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    if (error.code === 11000) {
      console.error('\n⚠️  An admin with this email already exists.');
    }
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

createSuperAdmin();
