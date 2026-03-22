# ShajSutro Backend

ShajSutro e-commerce REST API built with Express.js, TypeScript, and MongoDB.

## Prerequisites

- Node.js 18+
- MongoDB Atlas account
- npm or yarn

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shajsutro
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NODE_ENV=development
PORT=4000
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Start production server:
```bash
npm start
```

## Vercel Deployment

### Required Environment Variables

Configure these in your Vercel project settings:

- `MONGODB_URI` - MongoDB Atlas connection string (required)
- `JWT_SECRET` - Secret key for JWT token signing (required)
- `CLIENT_URL` - Comma-separated list of allowed CORS origins (optional)
- `EMAIL_USER` - Email address for nodemailer (optional)
- `EMAIL_PASS` - Email password/app password (optional)
- `JWT_EXPIRES_IN` - JWT expiration time (optional, defaults to "7d")

**Note**: `NODE_ENV` is automatically set to `production` by Vercel.

### Deployment Steps

1. Connect your GitHub repository to Vercel
2. Set the root directory to `backend`
3. Configure environment variables
4. Deploy

Vercel will automatically:
- Install dependencies (`npm install`)
- Run the build script (`npm run build`)
- Deploy the compiled code from `dist/`

### Important Notes

**File Uploads**: The current implementation uses local file storage (`uploads/` directory) which will not work on Vercel's serverless environment. For production deployment, you need to:
- Use a cloud storage solution (AWS S3, Cloudinary, etc.)
- Update the file upload middleware to use the cloud storage
- Configure the appropriate environment variables

**CORS Configuration**: The server automatically allows:
- All localhost/127.0.0.1 origins (any port)
- All `*.vercel.app` subdomains
- Any origins explicitly listed in `CLIENT_URL`

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/auth/*` - Authentication routes
- `GET /api/products` - Product listing
- `GET /api/categories` - Category listing
- `POST /api/cart` - Cart management
- `POST /api/orders` - Order management
- `POST /api/contact` - Contact form
- `/api/admin/*` - Admin routes (protected)
- `/api/jobs/*` - Job posting routes
- `/api/job-applications/*` - Job application routes
- `/api/stats/*` - Statistics routes

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Type check without emitting files

## Tech Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email service
- **PDFKit** - PDF generation
