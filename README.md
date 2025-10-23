# Content Studio

Content Studio is a web-based microservice that simplifies content creation by making it reliable, structured, user-friendly, and multi-format. It manages the creation, organization, and storage of lesson materials for all learners, serving as a foundational pillar of EduCore AI.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Content-Studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   cd ../database && npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials and other settings
   ```

4. **Set up the database**
   ```bash
   cd database
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Database: PostgreSQL (configured in .env)

## 🏗️ Architecture

### Monorepo Structure

```
Content-Studio/
├── frontend/          # Next.js application
├── backend/           # Express.js API server
├── database/          # Prisma schema and migrations
├── .github/           # CI/CD workflows
└── docs/              # Documentation
```

### Technology Stack

**Frontend:**
- Next.js 14 with App Router
- React 18 with JavaScript/JSX only
- Tailwind CSS for styling
- Jest + Testing Library for testing

**Backend:**
- Node.js with Express
- JavaScript only (no TypeScript)
- Prisma ORM with PostgreSQL
- Jest + Supertest for testing

**Database:**
- PostgreSQL
- Prisma for schema management
- Database migrations and seeding

## 🧪 Development

### Running Tests

```bash
# Run all tests
npm run test

# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend

# Run with coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint all code
npm run lint

# Format all code
npm run format

# Fix linting issues
npm run lint:fix
```

### Database Management

```bash
# Generate Prisma client
cd database && npm run generate

# Run migrations
cd database && npm run migrate

# Open Prisma Studio
cd database && npm run studio

# Seed database
cd database && npm run seed
```

## 🚀 Deployment

### Frontend (Vercel)
- Automatic deployment on push to main
- Configured in `.github/workflows/frontend.yml`
- Environment variables set in Vercel dashboard

### Backend (Railway)
- Automatic deployment on push to main
- Configured in `.github/workflows/backend.yml`
- Environment variables set in Railway dashboard

### Database (Supabase)
- PostgreSQL database with Prisma
- Automatic migrations on deployment
- Connection string in environment variables

## 📋 Development Phases

This project follows a structured development approach:

1. **Initial Development Setup** ✅
2. **User Dialogue & Requirements Analysis** (Next)
3. **Feature Planning**
4. **Design & Architecture**
5. **Implementation**
6. **Testing & Verification**
7. **Code Review & Deployment**
8. **Final Artifacts**

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/content_studio"

# Server
PORT=3001
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
```

### JavaScript-Only Development

This project enforces JavaScript-only development:
- All React components use `.jsx` extension
- All backend modules use `.js` extension
- No TypeScript files allowed
- Babel/SWC compilation for JSX

## 📚 API Documentation

### Content Management
- `GET /api/v1/content` - List all content
- `POST /api/v1/content` - Create new content
- `GET /api/v1/content/:id` - Get specific content
- `PUT /api/v1/content/:id` - Update content
- `DELETE /api/v1/content/:id` - Delete content

### User Management
- `GET /api/v1/users` - List all users
- `POST /api/v1/users` - Create new user
- `GET /api/v1/users/:id` - Get specific user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the documentation
2. Review the GitHub issues
3. Create a new issue with detailed information

---

**Content Studio** - Simplifying content creation for educators and learners worldwide.
