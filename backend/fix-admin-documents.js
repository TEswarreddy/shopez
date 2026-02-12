require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
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

    const admins = await Admin.find().select("-password");
    console.log(`📊 Found ${admins.length} admin account(s)\n`);

    console.log('═══════════════════════════════════════════════════════');
    console.log('CURRENT ADMIN ACCOUNTS:');
    console.log('═══════════════════════════════════════════════════════\n');

    admins.forEach((admin) => {
      console.log(`   • ${admin.email} (${admin.adminLevel})`);
    });

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
