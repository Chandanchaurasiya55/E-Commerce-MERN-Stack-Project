# E-Commerce MERN Stack - Authentication Flow Guide

## 🎯 Updated Features

### 1. **User Authentication**
- **Login/Register**: Same page form
- **Route**: `/auth`
- **File**: `src/pages/UserAuthForm.jsx`
- **After Login**: 
  - Login button disappears
  - Avatar appears in navbar
  - "Become a Seller" button disappears (since they're now a user)

### 2. **Seller Authentication** ⭐ NEW
- **Login/Register**: Same page form (INDEPENDENT - no user login required!)
- **Route**: `/seller-auth`
- **File**: `src/pages/SellerAuthForm.jsx`
- **Access**: Anyone can register/login as seller directly
- **After Login**: 
  - Redirects to seller dashboard
  - "Become a Seller" button disappears
  - Seller dashboard button appears (in profile)

### 3. **User Profile Page**
- **Route**: `/profile`
- **File**: `src/pages/UserProfile.jsx`
- **Features**:
  - Shows user avatar and info
  - Logout button
  - Link to seller dashboard (if seller)
  - Back to home button

### 4. **Seller Dashboard**
- **Route**: `/seller-dashboard`
- **File**: `src/pages/SellerDashbord.jsx`
- **Features**:
  - Shows seller shop name
  - Logout as seller button
  - Back to home button

---

## 📱 Navigation Flow

### User Path:
```
Home (not logged in) → Login (/auth) → Home with Avatar → Profile (/profile) → Logout
```

### Seller Path (INDEPENDENT - No user login required!):
```
Home → Become a Seller (/seller-auth) → Register/Login as Seller → Seller Dashboard (/seller-dashboard) → Logout
```

### Both User + Seller:
```
User logged in + Seller logged in → Avatar shown → "Become a Seller" HIDDEN
```

---

## 🔄 State Management (localStorage)

### User Tokens:
```javascript
localStorage.getItem("userToken")      // User auth token
localStorage.getItem("userEmail")      // User email
localStorage.getItem("userName")       // User full name
```

### Seller Tokens:
```javascript
localStorage.getItem("sellerToken")    // Seller auth token
localStorage.getItem("sellerEmail")    // Seller email
localStorage.getItem("sellerName")     // Seller shop name
```

---

## 🌐 API Endpoints

### User APIs:
- **Register**: `POST /api/auth/user/register`
  ```json
  {
    "Fullname": "string",
    "Email": "string",
    "Password": "string"
  }
  ```

- **Login**: `POST /api/auth/user/login`
  ```json
  {
    "Email": "string",
    "password": "string"
  }
  ```

### Seller APIs:
- **Register**: `POST /api/seller/register`
  ```json
  {
    "fullname": "string",
    "shopname": "string",
    "email": "string",
    "password": "string",
    "GST_number": "string",
    "address": "string"
  }
  ```

- **Login**: `POST /api/seller/login`
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

---

## 📂 Files Modified/Created

### Created Files:
- ✅ `src/pages/SellerAuthForm.jsx` - Seller login/register form
- ✅ `src/Style/SellerAuthForm.css` - Seller auth form styles

### Modified Files:
- ✅ `src/pages/Home.jsx` - Updated seller button logic
- ✅ `src/Routes/AppRoutes.jsx` - Added seller-auth route
- ✅ `src/pages/SellerDashbord.jsx` - Added logout functionality
- ✅ `src/pages/UserProfile.jsx` - Improved logout

---

## 🎨 UI Components

### Navbar (Home.jsx):
- Logo (clickable)
- Search bar with button
- Cart button
- **Login Button** (shows when NOT logged in)
- **Avatar** (shows when logged in)
- **Become a Seller Button** (shows when user logged in but NOT seller)

---

## ⚙️ Environment Variables

Make sure your `.env` file has:
```
VITE_API_URL=http://localhost:5000  # Your backend URL
```

---

## 🚀 Usage Instructions

### For Users:
1. Click "Login" button on home page
2. Login or register as a user
3. Avatar appears in navbar
4. "Become a Seller" button disappears (user is now logged in)
5. Click avatar to view profile
6. Option to register as seller from profile

### For Sellers (INDEPENDENT):
1. Click "Become a Seller" button on home page (NO user login required!)
2. Register/Login with shop details directly
3. Access seller dashboard
4. Manage products and sales
5. Logout as seller

### For User + Seller:
1. Login as user first
2. Logout from profile
3. Click "Become a Seller" to register as seller
4. Both tokens can exist independently

---

## 🔐 Security Notes

- Tokens are stored in localStorage (for demo purposes)
- For production, use httpOnly cookies
- Validate tokens on backend for all protected routes
- Implement token refresh mechanism
- Add CSRF protection

---

## 📝 Notes

- Both user and seller can coexist (one person can be both)
- Logout clears all tokens from localStorage
- Protected routes check for tokens before rendering
- API calls use `credentials: "include"` for cookie handling

