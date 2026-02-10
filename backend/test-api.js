const axios = require('axios');

async function testSignup() {
  try {
    console.log('Testing signup...');
    const response = await axios.post('http://localhost:5000/api/auth/signup', {
      firstName: 'John',
      lastName: 'Doe',
      email: 'customer@test.com',
      password: 'test123',
      role: 'customer'
    });
    
    console.log('✅ Signup Success:', response.data);
  } catch (error) {
    console.error('❌ Signup Failed:',Human: [TASK RESUMPTION] Let me try a different approach. Stop the servers and create a minimal test case.