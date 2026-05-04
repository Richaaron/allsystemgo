# 🚀 Render Setup Guide
# Folusho Victory Schools Backend API

## 🎯 Overview

This guide will help you deploy your backend API to Render for free. Render will host your Node.js server, database connection, and email functionality.

---

## 📋 Step-by-Step Setup

### **Step 1: Create Render Account**

1. **Go to Render:** https://render.com
2. **Click "Sign Up"**
3. **Choose "GitHub"** (recommended for easy deployment)
4. **Authorize GitHub** - Allow Render to access your repositories
5. **Verify your email** if prompted

---

### **Step 2: Create Web Service**

1. **Click "New +"** → "Web Service"
2. **Select Repository:**
   - Find: `Richaaron/allsystemgo`
   - Click "Connect"
3. **Configure Service:**

#### **Basic Settings:**
```
Name: folusho-victory-schools-api
Environment: Node
Region: Choose closest to Nigeria (Europe)
Branch: main
Root Directory: ./
```

#### **Build Settings:**
```
Build Command: npm install
Start Command: node server.js
```

#### **Instance Type:**
```
Instance Type: Free
RAM: 512 MB
CPU: 0.25 vCPU
```

4. **Click "Advanced Settings"** for additional configuration

---

### **Step 3: Configure Environment Variables**

In the "Environment" section, add these variables:

#### **Required Variables:**
```env
NODE_VERSION=18
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/postgres
JWT_SECRET=nigerian-school-jwt-secret-2024
REACT_APP_SMTP_HOST=smtp.gmail.com
REACT_APP_SMTP_PORT=587
REACT_APP_SMTP_SECURE=false
REACT_APP_SMTP_USER=folushovictoryschool@gmail.com
REACT_APP_SMTP_PASS=zulz lkxf rdaz ojnb
```

#### **How to Add:**
1. **Click "+ Add Environment Variable"**
2. **Key:** `NODE_VERSION`
3. **Value:** `18`
4. **Repeat** for all variables above

---

### **Step 4: Database Configuration**

#### **Option 1: Use External Database (Recommended)**

1. **Get ElephantSQL Database:**
   - Go to https://elephantsql.com
   - Sign up for free plan
   - Create new database
   - Copy connection string

2. **Update DATABASE_URL:**
   ```
   DATABASE_URL=postgres://username:password@host:5432/database_name
   ```

#### **Option 2: Use Render PostgreSQL**

1. **Go back to Render Dashboard**
2. **Click "New +"** → "PostgreSQL"
3. **Configure:**
   ```
   Name: folusho-victory-schools-db
   Database Name: folusho_victory_schools
   User: folusho_user
   Plan: Free
   ```
4. **Get connection string** from database dashboard
5. **Update DATABASE_URL** in your web service

---

### **Step 5: Deploy Backend**

1. **Click "Create Web Service"**
2. **Wait for deployment** (2-5 minutes)
3. **Check the "Events" tab** for build progress

#### **Expected Build Log:**
```
Cloning repository...
Installing dependencies...
Building...
Starting service...
Service is running on https://folusho-victory-schools-api.onrender.com
```

---

### **Step 6: Test Backend Deployment**

1. **Get your service URL** from Render dashboard
2. **Test health endpoint:**
   ```
   https://your-service-name.onrender.com/api/health
   ```
3. **Expected response:**
   ```json
   {
     "status": "OK",
     "message": "Folusho Victory Schools API is running",
     "timestamp": "2026-05-04T00:00:00.000Z"
   }
   ```

---

### **Step 7: Update CORS Settings**

Your backend needs to allow requests from your Netlify domain.

1. **Edit server.js** (if not already done):
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3001',
    'https://your-netlify-site.netlify.app'
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

2. **Commit and push changes:**
```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

---

## 🔧 Troubleshooting

### **Common Issues:**

#### **1. Build Fails:**
```
Error: Cannot find module 'express'
```
**Solution:** Check `package.json` has all dependencies

#### **2. Database Connection Error:**
```
Error: Connection refused
```
**Solution:** Verify DATABASE_URL format and database is running

#### **3. Port Issues:**
```
Error: Port already in use
```
**Solution:** Use `process.env.PORT` in server.js

#### **4. Email Not Working:**
```
Error: Authentication failed
```
**Solution:** Use Gmail App Password, not regular password

---

### **Health Checks:**

#### **Test Endpoints:**
```bash
# Health check
curl https://your-service.onrender.com/api/health

# Login test
curl -X POST https://your-service.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@folushovictory.com","password":"admin123","role":"admin"}'
```

---

## 📱 Production URLs

### **Final URLs Structure:**
```
Backend API: https://folusho-victory-schools-api.onrender.com
Frontend: https://your-site.netlify.app
Database: ElephantSQL or Render PostgreSQL
```

### **API Endpoints Available:**
```
GET  /api/health
POST /api/auth/login
GET  /api/teachers
POST /api/teachers
GET  /api/students
POST /api/students
GET  /api/classes
GET  /api/results
POST /api/email/send-notification
```

---

## 🔄 Automatic Deployments

### **How It Works:**
1. **Push to GitHub** → Automatic Render deployment
2. **Build time:** 2-3 minutes
3. **Zero downtime** during updates

### **Deployment Commands:**
```bash
# Make changes
git add .
git commit -m "Update features"
git push origin main

# Automatic deployment starts
```

---

## 📊 Monitoring

### **Render Dashboard Features:**
- **Service Logs** - Real-time error tracking
- **Metrics** - CPU, memory, response time
- **Health Checks** - Service uptime monitoring
- **Deploy History** - Version tracking

### **Important Metrics:**
- **Response time:** Should be < 500ms
- **Uptime:** Should be > 99%
- **Memory usage:** Should be < 512MB (free tier)

---

## 🎯 Success Checklist

### **Before Going Live:**
- [ ] Backend deploys successfully
- [ ] Health endpoint responds
- [ ] Database connection works
- [ ] Email functionality works
- [ ] CORS allows frontend domain
- [ ] All API endpoints work
- [ ] Login authentication works

### **Testing Complete System:**
1. **Deploy frontend to Netlify**
2. **Update REACT_APP_API_URL** in Netlify
3. **Test login from frontend**
4. **Test teacher/student creation**
5. **Test email notifications**

---

## 🆘 Support

### **Render Documentation:**
- https://render.com/docs
- https://render.com/docs/node-serve

### **Common Solutions:**
- **Slow startup:** Add health check timeout
- **Memory issues:** Optimize database queries
- **CORS errors:** Update allowed origins

---

## 🎉 Deployment Complete!

Once deployed, your backend will be:
- **✅ Live at:** `https://your-service-name.onrender.com`
- **✅ Connected to database**
- **✅ Sending emails**
- **✅ Handling authentication**
- **✅ Ready for frontend connection**

**Your Folusho Victory Schools API is now production-ready!** 🚀
