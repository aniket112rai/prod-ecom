# Ecommerce Project — Start Instructions

## 1. Extract the Project

Extract the zip file to a folder of your choice.

## 2. Open Terminals

Open **two terminals**, both from the extracted project folder.

## 3. Backend Setup

In the first terminal:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
node index.js
```

Backend runs on: **http://localhost:3000**

## 4. Frontend Setup

In the second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

## 5. Required Backend Environment

Make sure `backend/.env` contains:

```
DATABASE_URL="your_postgresql_connection_url"
JWT_SECRET="your_secret_key"
GOOGLE_CLIENT_ID="optional_if_using_google_auth"
RAZORPAY_API_KEY="your_razorpay_key_id"
RAZORPAY_SECRET="your_razorpay_key_secret"
```

## 6. Notes

- Public signup now creates only normal users.
- Admin access requires a user with role `"admin"` in the database.
- New features included:
  - Stock reduction after order
  - Cart clear after checkout
  - User/admin separation
  - Search pagination and sorting
  - User order cancellation
  - Razorpay checkout for online payments
  - Razorpay refund request when a paid order is cancelled from user/admin order screens
