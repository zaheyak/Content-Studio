# Content Studio

AI-powered content creation microservice for the Educore AI Learning Management Platform.

## Overview

Content Studio enables trainers and educational organizations to create, transform, and manage digital learning content with AI assistance. It supports multiple content creation methods and integrates with other Educore microservices.

## Features

- **Multiple Creation Methods**: Video-to-transcript conversion, AI-assisted material creation, fully AI-generated lessons, and manual upload
- **Multi-Format Output**: Text, presentations, illustrations, mind maps, interactive code snippets, avatar videos, and audio
- **AI Integration**: Content enhancement, mind map generation, multi-language processing
- **Version Control**: Git-like history of content changes
- **Quality Assurance**: Plagiarism checking, content validation, and quality metrics

## Technology Stack

- **Frontend**: Next.js 14, React 18, JavaScript/JSX, Tailwind CSS
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL, Supabase
- **Deployment**: Vercel (Frontend), Railway (Backend)
- **Testing**: Jest, Cypress
- **Linting**: ESLint, Prettier

## Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

3. **Database Setup**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## Project Structure

```
Content-Studio/
├── frontend/                 # Next.js React dashboard
├── backend/                  # Node.js API server
├── database/                 # Prisma schema and migrations
├── shared/                   # Shared utilities and types
├── docs/                     # Documentation
└── scripts/                  # Development and deployment scripts
```

## Development Workflow

This project follows a structured development process with 8 phases:

1. **Initial Development Setup** - Project initialization and environment setup
2. **User Dialogue & Requirements** - Requirements analysis and user personas
3. **Feature Planning** - MVP prioritization and feature breakdown
4. **Design & Architecture** - System design and security foundation
5. **Implementation** - TDD execution and code implementation
6. **Testing & Verification** - Automated and manual testing
7. **Code Review & Deployment** - Peer review and deployment
8. **Final Artifacts** - Documentation and quality assurance

## Contributing

Please follow the established development workflow and maintain code quality standards.

## License

Private - Educore AI Learning Management Platform
