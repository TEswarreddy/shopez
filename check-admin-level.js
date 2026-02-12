// Quick script to upgrade current admin via the running backend
// Run this in your browser console while logged in

async function upgradeCurrentAdminToSuperAdmin() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No token found. Please log in first.');
      return;
    }

    // Get current user info
    const profileResponse = await fetch('http://localhost:5000/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const profileData = await profileResponse.json();
    
    console.log('Current user:', profileData.user.email);
    console.log('Admin level:', profileData.user.admin?.adminLevel);
    
    if (profileData.user.admin?.adminLevel === 'super_admin') {
      console.log('✅ You are already a super admin!');
      return;
    }
    
    console.log('\n⚠️ You need to be upgraded to super_admin');
    console.log('\nOptions:');
    console.log('1. Log out and log in with: superadmin@shopez.com / admin123');
    console.log('2. Ask another super admin to upgrade your account');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

upgradeCurrentAdminToSuperAdmin();
