require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const User = require('./src/models/User');
const Admin = require('./src/models/Admin');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function fixAdminDocuments() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log('✅ Connected to MongoDB\n');

    // Find all users with admin role
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`📊 Found ${adminUsers.length} user(s) with admin role\n`);

    if (adminUsers.length === 0) {
      console.log('No admin users found. Exiting.');
      await mongoose.connection.close();
      rl.close();
      return;
    }

    // Check which ones are missing Admin documents
    const missingAdminDocs = [];
    const existingAdminDocs = [];

    for (const user of adminUsers) {
      const adminDoc = await Admin.findOne({ user: user._id });
      if (!adminDoc) {
        missingAdminDocs.push(user);
      } else {
        existingAdminDocs.push({ user, admin: adminDoc });
      }
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('CURRENT STATUS:');
    console.log('═══════════════════════════════════════════════════════\n');

    if (existingAdminDocs.length > 0) {
      console.log('✅ Users with Admin documents:');
      existingAdminDocs.forEach(({ user, admin }) => {
        console.log(`   • ${user.email} (${admin.adminLevel})`);
      });
      console.log('');
    }

    if (missingAdminDocs.length > 0) {
      console.log('⚠️  Users WITHOUT Admin documents:');
      missingAdminDocs.forEach(user => {
        console.log(`   • ${user.email} (ID: ${user._id})`);
      });
      console.log('');

      const answer = await question(`\n❓ Do you want to create Admin documents for these ${missingAdminDocs.length} user(s)? (yes/no): `);
      
      if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        console.log('\n📝 Creating Admin documents...\n');

        for (const user of missingAdminDocs) {
          // Ask for admin level
          console.log(`\nUser: ${user.email}`);
          const levelAnswer = await question('   Admin level (1=super_admin, 2=admin) [default: 2]: ');
          const adminLevel = levelAnswer === '1' ? 'super_admin' : 'admin';
          
          // Create admin document
          const newAdmin = await Admin.create({
            user: user._id,
            adminLevel: adminLevel,
            canManageUsers: adminLevel === 'super_admin',
            canManageVendors: true,
            canVerifyVendors: adminLevel === 'super_admin',
            canManageProducts: true,
            canDeleteProducts: adminLevel === 'super_admin',
            canFeatureProducts: adminLevel === 'super_admin',
            canManageOrders: true,
            canSuspendVendors: adminLevel === 'super_admin',
            canSuspendUsers: adminLevel === 'super_admin',
            canDeleteVendors: adminLevel === 'super_admin',
            canViewFinancials: adminLevel === 'super_admin',
            isActive: true
          });

          console.log(`   ✅ Admin document created (${adminLevel})`);
        }

        console.log('\n✨ All Admin documents created successfully!');
      } else {
        console.log('\n❌ Operation cancelled.');
      }
    } else {
      console.log('✅ All admin users have Admin documents. No action needed.');
    }

    console.log('\n═══════════════════════════════════════════════════════\n');
    await mongoose.connection.close();
    rl.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.connection.close();
    rl.close();
    process.exit(1);
  }
}

fixAdminDocuments();
