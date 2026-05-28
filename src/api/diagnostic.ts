// API Diagnostic & Testing
import { GET, POST } from './client';

/**
 * Test backend connection and authentication
 * Run this in browser console to diagnose issues
 */
export async function testAPI() {
  console.log('🔍 Starting API Diagnostic...\n');

  // 1. Check backend health
  try {
    console.log('1️⃣ Testing backend health...');
    const healthUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/health`;
    const health = await fetch(healthUrl);
    console.log(`✅ Backend Health: ${health.status}`, await health.json());
  } catch (e) {
    console.error('❌ Backend unreachable:', e);
    return;
  }

  // 2. Check auth token
  console.log('\n2️⃣ Checking authentication token...');
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  if (token) {
    console.log('✅ Token found:', token.substring(0, 20) + '...');
  } else {
    console.error('❌ NO TOKEN FOUND - This is why POST/GET requests fail!');
    console.log('You need to login first');
    return;
  }

  // 3. Test GET /posts
  try {
    console.log('\n3️⃣ Testing GET /posts...');
    const posts = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/posts?skip=0&limit=5`, {
      method: 'GET',
      headers: {
        'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`Status: ${posts.status}`);
    const data = await posts.json();
    console.log('✅ Posts response:', data);
  } catch (e) {
    console.error('❌ GET /posts failed:', e);
  }

  // 4. Test POST /posts
  try {
    console.log('\n4️⃣ Testing POST /posts (create)...');
    const formData = new FormData();
    formData.append('content', 'Test post from diagnostic');

    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
      },
      body: formData,
    });
    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log('✅ Create post response:', data);
  } catch (e) {
    console.error('❌ POST /posts failed:', e);
  }

  // 5. Test GET /notifications
  try {
    console.log('\n5️⃣ Testing GET /notifications...');
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/notifications?skip=0&limit=10`, {
      method: 'GET',
      headers: {
        'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log('✅ Notifications response:', data);
  } catch (e) {
    console.error('❌ GET /notifications failed:', e);
  }

  // 6. Test GET /feed/engagement
  try {
    console.log('\n6️⃣ Testing GET /feed/engagement (explore)...');
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/feed/engagement?skip=0&limit=10`, {
      method: 'GET',
      headers: {
        'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log('✅ Explore response:', data);
  } catch (e) {
    console.error('❌ GET /feed/engagement failed:', e);
  }

  console.log('\n✅ Diagnostic complete!');
}

/**
 * Check stored token info
 */
export function checkToken() {
  console.log('🔐 Token Check:');
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  console.log('Token:', token ? token.substring(0, 30) + '...' : 'NOT FOUND');
  console.log('API URL:', import.meta.env.VITE_API_URL);
  return token;
}

/**
 * Clear and reset authentication
 */
export function resetAuth() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('✅ Auth cleared');
}
