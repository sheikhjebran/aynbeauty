# ADMIN LOGIN TROUBLESHOOTING GUIDE

## 🔍 Current Status

✅ **Admin user exists in database**:
- Email: admin@aynbeauty.com  
- Role: admin
- Password: admin123 (bcrypt hashed)
- Email verified: Yes
- Active: Yes

## 🚨 Possible Issues & Solutions

### 1. **Browser Console Errors**
**Debug Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try logging in with admin@aynbeauty.com / admin123
4. Check for any JavaScript errors

**Common Errors:**
- Network errors (API call failures)
- JWT token issues
- CORS problems
- LocalStorage issues

### 2. **Check Network Tab**
**Debug Steps:**
1. Open DevTools → Network tab
2. Try logging in
3. Look for `/api/auth/login` request
4. Check if it returns 200 status
5. Verify response contains `isAdmin: true`

### 3. **Check LocalStorage**
**Debug Steps:**
1. After login, press F12
2. Go to Application → Local Storage
3. Check for:
   - `token` (JWT token)
   - `user` (user object with role: "admin")

### 4. **API Response Debugging**
**Expected Login Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 3,
    "email": "admin@aynbeauty.com",
    "role": "admin",
    "first_name": "Admin",
    "last_name": "User"
  },
  "token": "eyJ...",
  "isAdmin": true
}
```

### 5. **Server-Side Issues**
**If login API fails on server, check:**

1. **Upload fixed database files**:
   ```bash
   scp src/lib/db.ts user@server:/var/www/aynbeauty/src/lib/
   scp src/lib/database.ts user@server:/var/www/aynbeauty/src/lib/
   ```

2. **Run fresh migration**:
   ```bash
   npm run fresh:migrate
   npm run admin:reset
   ```

3. **Rebuild and restart**:
   ```bash
   npm run build
   pm2 restart aynbeauty
   ```

## 🔧 Quick Fixes

### Fix 1: Clear Browser Cache
```bash
# Clear localStorage in browser console
localStorage.clear()
# Then try logging in again
```

### Fix 2: Check JWT Secret
Make sure `.env.local` has:
```
JWT_SECRET=your-secret-key-here
```

### Fix 3: Verify Admin Role Check
In AdminLayout.tsx, it checks:
```typescript
if (parsedUser.role !== 'admin') {
  router.push('/')
  return
}
```

Make sure the user object in localStorage has `role: "admin"`.

## 🎯 Testing Steps

1. **Test Login API Directly:**
   ```bash
   curl -X POST http://your-domain.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@aynbeauty.com","password":"admin123"}'
   ```

2. **Test on Local Development:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/auth/login
   # Try admin@aynbeauty.com / admin123
   ```

3. **Check Database Connection:**
   ```bash
   # On server
   npm run fresh:status
   ```

## 📊 Expected Flow

1. User enters admin@aynbeauty.com / admin123
2. `/api/auth/login` validates credentials
3. Returns `isAdmin: true` in response
4. Frontend stores token and user in localStorage
5. Redirects to `/admin`
6. AdminLayout checks `user.role === 'admin'`
7. Shows admin dashboard

## 🚨 Most Likely Issues

1. **Database connection string parsing** (we fixed this)
2. **Missing admin user** (we verified it exists)
3. **JWT secret mismatch**
4. **Browser cache/localStorage issues**
5. **Network/CORS issues**

Try clearing browser cache and localStorage first, then check browser console for errors during login.