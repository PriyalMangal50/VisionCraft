VisionCraft is a full-stack e-commerce platform for eyewear (eyeglasses, sunglasses, and contact lenses).  
Built using the **MERN stack**, it provides a seamless shopping experience with advanced features like bulk product import, AI-assisted image handling, and an intuitive admin dashboard.  

---


---

## 🚀 Features

### 👤 User Features (Frontend)
- Modern **responsive homepage**
- Product listing with **filters** (brand, price, category, etc.)
- Product details with **multiple images**
- Cart management & secure checkout via Stripe
- Order history & tracking
- Login / Signup with **JWT authentication**
- **Frame finder quiz** for personalized recommendations
- Prescription upload
- Multilingual support
- Blogs, FAQs, Contact Us page

### 🛠️ Admin Features (Admin Dashboard)
- Manage products (add / edit / delete)
- **Bulk product import via XLSX**
- Smart **image handling**  
  - If images are missing → auto-fetch using Google Custom Search API  
  - Images uploaded to **Cloudinary** and stored in DB  
- Manage categories & orders
- Blog & FAQ management
- Dashboard analytics

### ⚙️ Backend Features
- RESTful APIs using **Express.js**
- Database with **MongoDB + Mongoose**
- Secure authentication with **JWT**
- File & image storage using **Cloudinary**
- Payment gateway via **Stripe**
- Google Custom Search API integration for product images
- Error handling & logging

---

## 🧑‍💻 Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Context API / Redux  
- **Admin:** React, Tailwind CSS  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose  
- **Authentication:** JWT  
- **Image Handling:** Cloudinary + Google Custom Search API  
- **Payments:** Stripe  
- **Deployment:** Vercel (frontend), Render/Netlify (backend & admin)

---

## ⚙️ Installation & Setup

### Clone the repository
```bash
git clone https://github.com/your-username/visioncraft.git
cd visioncraft

git clone https://github.com/PriyalMangal50/VisionCraft.git
cd visioncraft

## For backend:

cd backend
npm install

### Install dependencies

For backend:

cd backend
npm install


For frontend:

cd frontend
npm install


For admin:

cd admin
npm install

3Setup environment variables

Create a .env file inside backend/ with the following:

PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret


Run the development servers

Backend:

cd backend
npm run dev


Frontend:

cd frontend
npm start


Admin:

cd admin
npm start

📦 Bulk Import Workflow (Key Feature)

Admin uploads an XLSX file containing product data.

System checks if product images are available.

Images are downloaded or uploaded to Cloudinary.

Final product saved in DB with an array of 4 image URLs.

Frontend automatically displays these images.
