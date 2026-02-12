require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const AdminAccount = require('./src/models/AdminAccount');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function upgradeToSuperAdmin() {
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

    const admins = await AdminAccount.find().select('-password');

    if (admins.length === 0) {
      console.log('❌ No admin profiles found in the database.');
      console.log('\nRun this command to create a super admin:');
      console.log('   node create-super-admin.js\n');
      await mongoose.connection.close();
      rl.close();
      return;
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('CURRENT ADMIN ACCOUNTS:');
    console.log('═══════════════════════════════════════════════════════\n');

    admins.forEach((admin, index) => {
      const levelIcon = admin.adminLevel === 'super_admin' ? '👑' : '👤';
      console.log(`${index + 1}. ${levelIcon} ${admin.email}`);
      console.log(`   Name: ${admin.firstName} ${admin.lastName}`);
      console.log(`   Level: ${admin.adminLevel}`);
      console.log(`   Active: ${admin.isActive ? '✅' : '❌'}`);
      console.log('');
    });

    console.log('═══════════════════════════════════════════════════════\n');

    const answer = await question('Enter the number of the admin to upgrade to super_admin (or "q" to quit): ');
    
    if (answer.toLowerCase() === 'q') {
      console.log('\n❌ Operation cancelled.');
      await mongoose.connection.close();
      rl.close();
      return;
    }

    const selectedIndex = parseInt(answer) - 1;
    
    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= admins.length) {
      console.log('\n❌ Invalid selection.');
      await mongoose.connection.close();
      rl.close();
      return;
    }

    const selectedAdmin = admins[selectedIndex];

    if (selectedAdmin.adminLevel === 'super_admin') {
      console.log(`\n⚠️  ${selectedAdmin.email} is already a super admin!`);
      await mongoose.connection.close();
      rl.close();
      return;
    }

    console.log(`\n📝 Upgrading ${selectedAdmin.email} to super_admin...`);

    // Update admin level and grant all permissions
    await AdminAccount.findByIdAndUpdate(selectedAdmin._id, {
      adminLevel: 'super_admin',
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
      isActive: true
    });

    console.log('\n✅ SUCCESS! Admin upgraded to super_admin');
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('UPDATED ADMIN DETAILS:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`👑 Email: ${selectedAdmin.email}`);
    console.log(`🎯 Level: super_admin`);
    console.log(`✨ All permissions: GRANTED`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n🔄 Please log out and log back in for changes to take effect.\n');

    await mongoose.connection.close();
    rl.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.connection.close();
    rl.close();
    process.exit(1);
  }
}

upgradeToSuperAdmin();
