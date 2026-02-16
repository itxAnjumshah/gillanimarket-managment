═══════════════════════════════════════════════════════════════════════════════
                        SHOP RENT MANAGEMENT SYSTEM
                          Complete Web Application
                            (Bill View System)
═══════════════════════════════════════════════════════════════════════════════

PROJECT OVERVIEW
─────────────────────────────────────────────────────────────────────────────
A modern, full-stack web application for managing shop rentals, payments, and
tenant information. Built with the MERN stack (MongoDB, Express.js, React.js,
Node.js) with a beautiful UI inspired by Stripe, Linear, and Notion.

⚠️  IMPORTANT: Stripe and all online payment functionality have been REMOVED.
    This system now focuses on MANUAL payment tracking and bill viewing only.

═══════════════════════════════════════════════════════════════════════════════
TABLE OF CONTENTS
═══════════════════════════════════════════════════════════════════════════════
1. Features
2. Payment System Changes
3. Tech Stack
4. Folder Structure
5. Prerequisites
6. Installation & Setup
7. Environment Variables
8. Running the Application
9. API Endpoints
10. User Credentials
11. Manual Payment Process
12. Deployment
13. Future Improvements

═══════════════════════════════════════════════════════════════════════════════
1. FEATURES
═══════════════════════════════════════════════════════════════════════════════

ADMIN FEATURES:
├── Dashboard with statistics and charts
├── User management (Add, Edit, Delete shop owners)
├── Set/Update monthly rent for each shop
├── View all payment history with filters
├── Record manual payments (cash/bank transfer)
├── Verify cash payment receipts
├── Generate reports (Paid/Pending/Overdue)
├── Payment analytics and trends
└── Role-based access control

USER FEATURES:
├── Personal dashboard with payment status
├── View monthly bill summary (rent, paid, due)
├── Upload receipts for cash payments
├── View comprehensive payment history
├── Track monthly rent and dues
└── Read-only bill information

GENERAL FEATURES:
├── JWT-based authentication
├── Dark/Light mode toggle
├── Fully responsive design (Mobile & Desktop)
├── Real-time form validation
├── File upload for receipts
├── Secure manual payment tracking
└── Modern, clean UI/UX

═══════════════════════════════════════════════════════════════════════════════
2. PAYMENT SYSTEM CHANGES (STRIPE REMOVED)
═══════════════════════════════════════════════════════════════════════════════

WHAT WAS REMOVED:
├── ❌ Stripe payment gateway integration
├── ❌ Online credit/debit card payments
├── ❌ Payment intent creation
├── ❌ Automatic payment processing
├── ❌ Stripe webhooks and events
└── ❌ All Stripe-related dependencies

WHAT'S NOW AVAILABLE:
├── ✅ Bill view page (shows rent, paid, due amounts)
├── ✅ Manual payment recording (admin only)
├── ✅ Receipt upload for cash payments
├── ✅ Payment history tracking
├── ✅ Bill summary API endpoint
└── ✅ Clean, read-only payment information

PAYMENT WORKFLOW:
1. Admin sets monthly rent for each shop
2. Users can VIEW their bill summary (monthly rent, total paid, pending)
3. Users make payments offline (cash or bank transfer)
4. Users upload receipt proof through the system
5. Admin verifies and records the payment manually
6. System updates the bill summary automatically

═══════════════════════════════════════════════════════════════════════════════
3. TECH STACK
═══════════════════════════════════════════════════════════════════════════════

FRONTEND:
├── React.js v18.3.1
├── Vite v5.0.8 (Build tool)
├── Tailwind CSS v3.4.0 (Styling)
├── React Router v6.21.0 (Routing)
├── Axios v1.6.2 (HTTP client)
├── Recharts v2.10.3 (Charts)
├── Lucide React v0.300.0 (Icons)
└── Context API (State management)

BACKEND:
├── Node.js
├── Express.js v4.18.2
├── MongoDB + Mongoose v8.0.3
├── JWT (Authentication)
├── Bcrypt.js v2.4.3 (Password hashing)
├── Multer v1.4.5 (File uploads)
├── CORS v2.8.5
├── ❌ Stripe (REMOVED)
└── ❌ Cloudinary (REMOVED - using local storage)

═══════════════════════════════════════════════════════════════════════════════
3. FOLDER STRUCTURE
═══════════════════════════════════════════════════════════════════════════════

shop-rent-management/
│
├── Frontend/                     # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/              # Context API
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/                # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── AddUser.jsx
│   │   │   ├── SetRent.jsx
│   │   │   ├── PaymentHistory.jsx
│   │   │   ├── UploadReceipt.jsx
│   │   │   ├── BillView.jsx          # NEW - Bill summary page
│   │   │   └── Reports.jsx
│   │   ├── utils/                # Utilities
│   │   │   ├── api.js            # API functions
│   │   │   └── mockData.js       # Mock data (for demo)
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── Backend/                      # Node.js Backend
│   ├── config/                   # Configuration files
│   │   └── database.js           # MongoDB connection
│   ├── controllers/              # Route controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── rentController.js
│   │   └── paymentController.js  # UPDATED - Stripe removed
│   ├── middleware/               # Custom middleware
│   │   ├── auth.js               # JWT authentication
│   │   ├── upload.js             # File upload (Multer)
│   │   └── errorHandler.js       # Error handling
│   ├── models/                   # Mongoose models
│   │   ├── User.js
│   │   ├── Rent.js
│   │   └── Payment.js
│   ├── routes/                   # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── rentRoutes.js
│   │   └── paymentRoutes.js
│   ├── uploads/                  # Temporary file storage
│   ├── server.js                 # Entry point
│   ├── seed.js                   # Database seeder
│   ├── package.json
│   ├── .env.example              # Environment variables template
│   └── .gitignore
│
└── README.txt                    # This file

═══════════════════════════════════════════════════════════════════════════════
4. PREREQUISITES
═══════════════════════════════════════════════════════════════════════════════

Before running this application, ensure you have:

├── Node.js (v18+ recommended)
├── npm or yarn
├── MongoDB installed locally OR MongoDB Atlas account
├── ❌ Stripe account (NO LONGER NEEDED - REMOVED)
└── ❌ Cloudinary account (NO LONGER NEEDED - using local storage)

═══════════════════════════════════════════════════════════════════════════════
5. INSTALLATION & SETUP
═══════════════════════════════════════════════════════════════════════════════

STEP 1: INSTALL BACKEND DEPENDENCIES
─────────────────────────────────────────────────────────────────────────────
cd Backend
npm install

STEP 2: INSTALL FRONTEND DEPENDENCIES
─────────────────────────────────────────────────────────────────────────────
cd ../Frontend
npm install

STEP 3: CREATE UPLOADS FOLDER (BACKEND)
─────────────────────────────────────────────────────────────────────────────
cd ../Backend
mkdir uploads

═══════════════════════════════════════════════════════════════════════════════
6. ENVIRONMENT VARIABLES
═══════════════════════════════════════════════════════════════════════════════

BACKEND ENVIRONMENT VARIABLES:
─────────────────────────────────────────────────────────────────────────────
Create a .env file in the Backend folder:

cd Backend
copy .env.example .env          # Windows
cp .env.example .env            # Mac/Linux

Then edit the .env file with your actual values:

NODE_ENV=development
PORT=5000

# MongoDB Connection String
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/shop-rent-management

# Option 2: MongoDB Atlas (Cloud) - Replace with your credentials
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shop-rent

# JWT Secret (Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-12345
JWT_EXPIRE=7d

# ❌ STRIPE KEYS REMOVED - No longer needed
# ❌ CLOUDINARY REMOVED - Receipts stored locally in Backend/uploads folder

# Frontend URL
CLIENT_URL=http://localhost:3000


FRONTEND ENVIRONMENT VARIABLES:
─────────────────────────────────────────────────────────────────────────────
Create a .env file in the Frontend folder:

cd Frontend
copy .env.example .env          # Windows
cp .env.example .env            # Mac/Linux

Then edit with:

VITE_API_URL=http://localhost:5000/api

═══════════════════════════════════════════════════════════════════════════════
7. RUNNING THE APPLICATION
═══════════════════════════════════════════════════════════════════════════════

STEP 1: START MONGODB (if using local)
─────────────────────────────────────────────────────────────────────────────
mongod

STEP 2: SEED THE DATABASE (First time only)
─────────────────────────────────────────────────────────────────────────────
cd Backend
npm run seed

This will create:
├── 1 Admin user
├── 4 Shop owner users
├── Rent records
└── Sample payment records

STEP 3: START BACKEND SERVER
─────────────────────────────────────────────────────────────────────────────
cd Backend
npm run dev

Backend will run on: http://localhost:5000

STEP 4: START FRONTEND (in a new terminal)
─────────────────────────────────────────────────────────────────────────────
cd Frontend
npm run dev

Frontend will run on: http://localhost:3000

STEP 5: ACCESS THE APPLICATION
─────────────────────────────────────────────────────────────────────────────
Open your browser and go to: http://localhost:3000

═══════════════════════════════════════════════════════════════════════════════
8. API ENDPOINTS
═══════════════════════════════════════════════════════════════════════════════

All API endpoints are prefixed with: http://localhost:5000/api

AUTHENTICATION ENDPOINTS:
─────────────────────────────────────────────────────────────────────────────
POST   /auth/register          Register new user
POST   /auth/login             Login user
GET    /auth/me                Get current user
PUT    /auth/updatepassword    Update password

USER ENDPOINTS:
─────────────────────────────────────────────────────────────────────────────
GET    /users                  Get all users (Admin)
POST   /users                  Create user (Admin)
GET    /users/:id              Get single user
PUT    /users/:id              Update user (Admin)
DELETE /users/:id              Delete user (Admin)

RENT ENDPOINTS:
─────────────────────────────────────────────────────────────────────────────
GET    /rent                   Get all rents (Admin)
GET    /rent/stats             Get rent statistics (Admin)
GET    /rent/user/:userId      Get rent by user ID
PUT    /rent/:id               Update rent (Admin)

PAYMENT ENDPOINTS:
─────────────────────────────────────────────────────────────────────────────
GET    /payments                         Get all payments (Admin)
GET    /payments/stats                   Get payment statistics (Admin)
GET    /payments/user/:userId            Get payments by user
GET    /payments/bill-summary/:userId    Get bill summary (rent, paid, due)
POST   /payments/manual                  Record manual payment (Admin)
POST   /payments/upload-receipt          Upload receipt (User)
PUT    /payments/:id/verify              Verify payment (Admin)
DELETE /payments/:id                     Delete payment (Admin)

HEALTH CHECK:
─────────────────────────────────────────────────────────────────────────────
GET    /health                 API health status

═══════════════════════════════════════════════════════════════════════════════
9. USER CREDENTIALS (For Testing)
═══════════════════════════════════════════════════════════════════════════════

After running the seed script, use these credentials:

ADMIN LOGIN:
─────────────────────────────────────────────────────────────────────────────
Email:    admin@shop.com
Password: admin123

USER LOGINS:
─────────────────────────────────────────────────────────────────────────────
Email:    john@shop.com     (Shop #101)
Password: user123

Email:    jane@shop.com     (Shop #102)
Password: user123

Email:    bob@shop.com      (Shop #103)
Password: user123

Email:    alice@shop.com    (Shop #104 - Inactive)
Password: user123

═══════════════════════════════════════════════════════════════════════════════
10. MANUAL PAYMENT PROCESS
═══════════════════════════════════════════════════════════════════════════════

⚠️  IMPORTANT: This system NO LONGER supports online payments via Stripe.
    All payments are recorded manually by the admin.

USER WORKFLOW (Shop Owner):
─────────────────────────────────────────────────────────────────────────────
1. Log in to the system using shop owner credentials
2. Click on "View Bill" from dashboard or sidebar
3. View monthly rent, total paid, and pending amounts
4. Make payment offline (cash or bank transfer to admin)
5. Take a photo/scan of the payment receipt
6. Click "Upload Receipt" from the sidebar
7. Fill in payment details (month, amount, notes)
8. Upload the receipt image/PDF
9. Submit for admin verification
10. Wait for admin to verify and record the payment
11. Check payment history to confirm

ADMIN WORKFLOW (Property Manager):
─────────────────────────────────────────────────────────────────────────────
1. Log in as admin (admin@shop.com)
2. View "Payment History" to see pending receipts
3. Click on pending payment to view uploaded receipt
4. Verify the receipt and payment details
5. Option A - Verify existing receipt:
   - Click "Verify" button
   - Change status from "Pending" to "Paid"
6. Option B - Record new manual payment:
   - Go to payment management section
   - Click "Record Payment" or use API
   - Select user/shop
   - Enter amount, month, payment method
   - Add notes if needed
   - Submit
7. Payment is now recorded and bill is updated automatically

BILL CALCULATION:
─────────────────────────────────────────────────────────────────────────────
- Monthly Rent: Set by admin for each shop
- Total Paid: Sum of all payments with "paid" status
- Pending: Sum of all payments with "pending" status (awaiting verification)
- Due Balance: Monthly Rent × Number of Months - Total Paid

PAYMENT METHODS:
─────────────────────────────────────────────────────────────────────────────
├── Cash: Direct cash payment to admin
└── Bank Transfer: Bank-to-bank transfer

═══════════════════════════════════════════════════════════════════════════════
11. DEPLOYMENT
═══════════════════════════════════════════════════════════════════════════════

FRONTEND DEPLOYMENT (Vercel/Netlify):
─────────────────────────────────────────────────────────────────────────────
1. Build the frontend:
   cd Frontend
   npm run build

2. Deploy the 'dist' folder to Vercel/Netlify
3. Set environment variable: VITE_API_URL=<your-backend-url>

BACKEND DEPLOYMENT (Render/Railway/Heroku):
─────────────────────────────────────────────────────────────────────────────
1. Push code to GitHub
2. Connect your GitHub repo to hosting service
3. Set all environment variables in the hosting dashboard
4. Deploy!

IMPORTANT:
- Use MongoDB Atlas (cloud) for production
- Never commit .env files
- Change JWT_SECRET to a strong random string
- ❌ No Stripe keys needed anymore

═══════════════════════════════════════════════════════════════════════════════
12. FUTURE IMPROVEMENTS
═══════════════════════════════════════════════════════════════════════════════

FEATURES TO ADD:
├── Email notifications for payment reminders
├── SMS notifications via Twilio
├── Automatic late fee calculation
├── Multi-currency support
├── Export reports to PDF/Excel
├── Lease agreement management
├── Maintenance request system
├── Tenant communication portal
├── Payment plan/installments
├── Advanced analytics dashboard
├── Mobile app (React Native)
├── WhatsApp integration
├── Automated backup system
└── Multi-language support

TECHNICAL IMPROVEMENTS:
├── TypeScript migration
├── GraphQL API option
├── Redis caching
├── Rate limiting
├── Automated testing (Jest, Cypress)
├── Docker containerization
├── CI/CD pipeline
├── API documentation (Swagger)
└── Performance monitoring

═══════════════════════════════════════════════════════════════════════════════
TROUBLESHOOTING
═══════════════════════════════════════════════════════════════════════════════

ISSUE: MongoDB connection error
SOLUTION: Ensure MongoDB is running (mongod) or check your MongoDB Atlas URI

ISSUE: Port already in use
SOLUTION: Change PORT in .env or kill process using that port

ISSUE: CORS errors
SOLUTION: Ensure CLIENT_URL in backend .env matches your frontend URL

ISSUE: File upload fails
SOLUTION: Ensure 'uploads' folder exists in Backend directory. Check file size limits.

ISSUE: Login fails after deployment
SOLUTION: Verify JWT_SECRET is set in production environment

ISSUE: Bill summary not loading
SOLUTION: Check if rent is set for the user and payment records exist

═══════════════════════════════════════════════════════════════════════════════
SUPPORT & CONTACT
═══════════════════════════════════════════════════════════════════════════════

For issues, questions, or contributions:
- Check documentation above
- Review code comments
- Verify environment variables
- Check console logs for errors

═══════════════════════════════════════════════════════════════════════════════
LICENSE
═══════════════════════════════════════════════════════════════════════════════

MIT License - Free to use and modify for personal or commercial projects.

═══════════════════════════════════════════════════════════════════════════════
                              END OF DOCUMENTATION
                         Built with  Anjum shah ❤️ using MERN Stack
═══════════════════════════════════════════════════════════════════════════════
