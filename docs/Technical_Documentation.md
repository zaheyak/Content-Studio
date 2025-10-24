# Content Studio Technical Documentation

## Overview
Content Studio is a microservice-based AI-powered educational content creation platform built with modern web technologies and following clean architecture principles.

## Architecture

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                      │
│              React 18, JavaScript, Tailwind CSS           │
└─────────────────────────────────────────────────────────────┘
                                      │
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway                              │
│              Load Balancing, Rate Limiting                  │
└─────────────────────────────────────────────────────────────┘
                                      │
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js)                       │
│              Express, Onion Architecture                   │
└─────────────────────────────────────────────────────────────┘
                                      │
┌─────────────────────────────────────────────────────────────┐
│                    Database (PostgreSQL)                   │
│              Supabase, Prisma ORM                          │
└─────────────────────────────────────────────────────────────┘
                                      │
┌─────────────────────────────────────────────────────────────┐
│                    AI Services                             │
│              Mock AI, Future: OpenAI/Anthropic             │
└─────────────────────────────────────────────────────────────┘
```

### Onion Architecture Implementation

#### Domain Layer (Core Business Logic)
```
src/domain/
├── entities/
│   ├── Course.js              # Course business entity
│   ├── Lesson.js              # Lesson business entity
│   ├── Content.js             # Content business entity
│   ├── Trainer.js             # Trainer business entity
│   └── AIJob.js               # AI processing job entity
├── value-objects/
│   ├── ContentType.js         # Content type value object
│   ├── LessonStatus.js        # Lesson status value object
│   └── CourseStatus.js        # Course status value object
├── repositories/
│   ├── ICourseRepository.js   # Course repository interface
│   ├── ILessonRepository.js   # Lesson repository interface
│   └── IContentRepository.js  # Content repository interface
└── services/
    ├── IContentValidationService.js    # Content validation interface
    ├── IAIProcessingService.js           # AI processing interface
    └── IQualityAssessmentService.js    # Quality assessment interface
```

#### Application Layer (Use Cases)
```
src/application/
├── use-cases/
│   ├── CreateCourseUseCase.js         # Course creation use case
│   ├── ProcessContentUseCase.js       # Content processing use case
│   ├── GenerateAIContentUseCase.js   # AI content generation
│   └── ValidateContentUseCase.js     # Content validation use case
├── services/
│   ├── CourseService.js               # Course application service
│   ├── ContentService.js              # Content application service
│   └── AIService.js                   # AI application service
└── dto/
    ├── CourseDTO.js                   # Course data transfer object
    ├── ContentDTO.js                  # Content data transfer object
    └── AIRequestDTO.js                # AI request data transfer object
```

#### Infrastructure Layer (External Concerns)
```
src/infrastructure/
├── database/
│   ├── PrismaCourseRepository.js     # Prisma course repository
│   ├── PrismaLessonRepository.js     # Prisma lesson repository
│   └── PrismaContentRepository.js    # Prisma content repository
├── external/
│   ├── MockAIService.js              # Mock AI service
│   ├── EmailService.js               # Email service
│   └── FileStorageService.js         # File storage service
├── cache/
│   ├── RedisCache.js                 # Redis cache implementation
│   └── MemoryCache.js                # In-memory cache
└── monitoring/
    ├── Logger.js                     # Application logging
    ├── Metrics.js                    # Performance metrics
    └── HealthCheck.js                # Health monitoring
```

#### Presentation Layer (API & UI)
```
src/presentation/
├── controllers/
│   ├── CourseController.js           # Course API controller
│   ├── LessonController.js          # Lesson API controller
│   ├── ContentController.js         # Content API controller
│   └── AIController.js              # AI API controller
├── routes/
│   ├── courses.js                    # Course API routes
│   ├── lessons.js                    # Lesson API routes
│   ├── content.js                    # Content API routes
│   └── ai.js                         # AI API routes
├── middleware/
│   ├── AuthMiddleware.js             # Authentication middleware
│   ├── ValidationMiddleware.js       # Request validation
│   └── ErrorMiddleware.js            # Error handling
└── dto/
    ├── CreateCourseRequest.js        # Course creation request
    ├── UpdateCourseRequest.js        # Course update request
    └── AIProcessingRequest.js        # AI processing request
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14
- **Language**: JavaScript (ES6+)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Testing**: Jest, React Testing Library

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: JavaScript (ES6+)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Validation**: Joi
- **Testing**: Jest, Supertest

### Database
- **Primary Database**: PostgreSQL 15
- **ORM**: Prisma
- **Migrations**: Prisma Migrate
- **Connection Pooling**: Prisma Connection Pool
- **Backup**: Automated daily backups

### AI Services
- **Current**: Mock AI Service
- **Future**: OpenAI GPT-4, Anthropic Claude
- **Processing**: Async job processing
- **Queue**: Redis-based job queue
- **Monitoring**: AI service health checks

### Infrastructure
- **Hosting**: Railway (Backend), Vercel (Frontend)
- **Database**: Supabase PostgreSQL
- **CDN**: Vercel Edge Network
- **Monitoring**: GitHub Actions, Custom dashboards
- **Logging**: Structured JSON logging

## Database Schema

### Core Entities

#### Trainer
```sql
CREATE TABLE Trainer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  authId VARCHAR UNIQUE NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  firstName VARCHAR,
  lastName VARCHAR,
  skills TEXT[] DEFAULT '{}',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Course
```sql
CREATE TABLE Course (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainerId UUID REFERENCES Trainer(id),
  title VARCHAR NOT NULL,
  description TEXT,
  status VARCHAR DEFAULT 'draft',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Lesson
```sql
CREATE TABLE Lesson (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  courseId UUID REFERENCES Course(id),
  title VARCHAR NOT NULL,
  description TEXT,
  order INTEGER NOT NULL,
  status VARCHAR DEFAULT 'draft',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Content
```sql
CREATE TABLE Content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lessonId UUID REFERENCES Lesson(id),
  trainerId UUID REFERENCES Trainer(id),
  type VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  format VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'draft',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### AIJob
```sql
CREATE TABLE AIJob (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contentId UUID REFERENCES Content(id),
  type VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'pending',
  input TEXT NOT NULL,
  output TEXT,
  error TEXT,
  processingTime INTEGER,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Indexes
```sql
-- Performance indexes
CREATE INDEX idx_course_trainer_id ON Course(trainerId);
CREATE INDEX idx_lesson_course_id ON Lesson(courseId);
CREATE INDEX idx_content_lesson_id ON Content(lessonId);
CREATE INDEX idx_content_trainer_id ON Content(trainerId);
CREATE INDEX idx_aijob_content_id ON AIJob(contentId);

-- Status indexes for filtering
CREATE INDEX idx_course_status ON Course(status);
CREATE INDEX idx_lesson_status ON Lesson(status);
CREATE INDEX idx_content_status ON Content(status);
CREATE INDEX idx_aijob_status ON AIJob(status);

-- Timestamp indexes for sorting
CREATE INDEX idx_course_created_at ON Course(createdAt);
CREATE INDEX idx_lesson_created_at ON Lesson(createdAt);
CREATE INDEX idx_content_created_at ON Content(createdAt);
```

## API Design

### RESTful API Principles
- **Resource-based URLs**: `/api/courses`, `/api/lessons`
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: Standard HTTP status codes
- **Content Types**: JSON request/response
- **Versioning**: URL versioning (`/api/v1/`)

### Request/Response Format
```javascript
// Request
{
  "title": "Course Title",
  "description": "Course Description"
}

// Response
{
  "success": true,
  "data": {
    "id": "course-123",
    "title": "Course Title",
    "description": "Course Description"
  },
  "message": "Course created successfully"
}

// Error Response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "details": "The title field cannot be empty"
  }
}
```

### Authentication
```javascript
// JWT Token in Authorization Header
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Token Payload
{
  "sub": "trainer-123",
  "email": "trainer@example.com",
  "iat": 1640995200,
  "exp": 1641081600
}
```

## Security Implementation

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication
- **Role-based Access**: Trainer, Admin roles
- **Resource Ownership**: Users can only access their resources
- **Token Expiration**: 24-hour token lifetime
- **Refresh Tokens**: Secure token renewal

### Input Validation
- **Request Validation**: Joi schema validation
- **SQL Injection Prevention**: Prisma ORM protection
- **XSS Prevention**: Input sanitization
- **File Upload Security**: Type and size validation
- **Rate Limiting**: 1000 requests per hour

### Data Protection
- **Encryption at Rest**: Database encryption
- **Encryption in Transit**: HTTPS/TLS
- **PII Protection**: Minimal data collection
- **Data Retention**: Configurable retention policies
- **Audit Logging**: All actions logged

## Performance Optimization

### Caching Strategy
- **Redis Cache**: Frequently accessed data
- **CDN**: Static asset delivery
- **Database Query Optimization**: Efficient queries
- **Connection Pooling**: Database connection reuse
- **Response Compression**: Gzip compression

### Database Optimization
- **Indexes**: Strategic database indexing
- **Query Optimization**: Efficient Prisma queries
- **Pagination**: Limit result sets
- **Connection Pooling**: Reuse database connections
- **Read Replicas**: Separate read/write operations

### Frontend Optimization
- **Code Splitting**: Lazy loading components
- **Image Optimization**: Next.js image optimization
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Browser and CDN caching
- **Performance Monitoring**: Real-time performance tracking

## Testing Strategy

### Test Pyramid
```
    ┌─────────────────┐
    │   E2E Tests     │  ← Few, high-level
    ├─────────────────┤
    │ Integration     │  ← Some, component interaction
    ├─────────────────┤
    │   Unit Tests    │  ← Many, isolated units
    └─────────────────┘
```

### Test Coverage
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths
- **E2E Tests**: User workflows
- **Performance Tests**: Load testing
- **Security Tests**: Vulnerability scanning

### Testing Tools
- **Jest**: Test framework
- **Supertest**: API testing
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **Artillery**: Load testing

## Monitoring & Observability

### Application Monitoring
- **Health Checks**: `/health` endpoint
- **Metrics**: Response time, error rate, throughput
- **Logging**: Structured JSON logs
- **Tracing**: Request tracing
- **Alerting**: Slack/email notifications

### Infrastructure Monitoring
- **Server Metrics**: CPU, memory, disk usage
- **Database Metrics**: Connection pool, query performance
- **Network Metrics**: Latency, bandwidth
- **Error Tracking**: Error aggregation and analysis
- **Uptime Monitoring**: Service availability

### Business Metrics
- **User Engagement**: Active users, session duration
- **Content Metrics**: Creation rate, usage patterns
- **AI Processing**: Success rate, processing time
- **Performance**: Page load times, API response times
- **Quality**: Error rates, user satisfaction

## Deployment Architecture

### Development Environment
- **Local Development**: Node.js with npm/yarn
- **Database**: Local PostgreSQL
- **AI Services**: Mock services
- **Hot Reload**: Development server with hot reload

### Staging Environment
- **Backend**: Railway staging deployment
- **Frontend**: Vercel preview deployment
- **Database**: Supabase staging database
- **AI Services**: Mock services with realistic delays
- **Monitoring**: Full monitoring stack

### Production Environment
- **Backend**: Railway production deployment
- **Frontend**: Vercel production deployment
- **Database**: Supabase production database
- **AI Services**: Real AI services (future)
- **Monitoring**: Full production monitoring
- **Backup**: Automated backups

## Scalability Considerations

### Horizontal Scaling
- **Stateless Services**: No server-side state
- **Load Balancing**: Multiple backend instances
- **Database Scaling**: Read replicas
- **CDN**: Global content delivery
- **Microservices**: Service decomposition

### Performance Scaling
- **Caching**: Multi-level caching
- **Database Optimization**: Query optimization
- **Connection Pooling**: Efficient resource usage
- **Async Processing**: Background job processing
- **Resource Monitoring**: Proactive scaling

### Cost Optimization
- **Resource Right-sizing**: Appropriate instance sizes
- **Auto-scaling**: Scale based on demand
- **Caching**: Reduce database load
- **Efficient Queries**: Optimize database usage
- **Monitoring**: Track and optimize costs

## Future Roadmap

### Short-term (3 months)
- **Real AI Integration**: Replace mock services
- **Advanced Analytics**: Detailed usage analytics
- **Mobile App**: React Native mobile app
- **API Versioning**: API version management
- **Performance Optimization**: Further optimizations

### Medium-term (6 months)
- **Microservices**: Service decomposition
- **Event Sourcing**: Event-driven architecture
- **Advanced AI**: More AI features
- **Internationalization**: Multi-language support
- **Enterprise Features**: Advanced enterprise features

### Long-term (12 months)
- **Machine Learning**: Custom ML models
- **Advanced Analytics**: Predictive analytics
- **Global Deployment**: Multi-region deployment
- **Advanced Security**: Enhanced security features
- **Ecosystem**: Third-party integrations

## Conclusion

Content Studio is built with modern architecture principles, focusing on scalability, maintainability, and performance. The Onion Architecture ensures clean separation of concerns, while the comprehensive testing strategy ensures reliability and quality.

The platform is designed to grow with your needs, from individual trainers to large educational organizations, providing the flexibility and power needed for modern educational content creation.
