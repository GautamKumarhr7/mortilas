import axios from 'axios';

async function test() {
  try {
    const loginRes = await axios.post('https://mortilas.vercel.app/api/auth/login', {
      email: 'admin@mortilas.com',
      password: 'password123'
    });
    const token = loginRes.data.data?.accessToken || loginRes.data.accessToken;
    console.log('Got token:', !!token);
    
    const rolesRes = await axios.get('https://mortilas.vercel.app/api/roles', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Roles:', JSON.stringify(rolesRes.data, null, 2));
  } catch (err) {
    console.error('Error:', err.response?.status, err.response?.data || err.message);
  }
}
test();
