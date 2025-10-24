# Content Studio Deployment Guide

## Overview
This guide covers the complete deployment process for the Content Studio application, including CI/CD pipelines, environment setup, and monitoring.

## Prerequisites

### Required Accounts & Services
- **GitHub**: Repository hosting and CI/CD
- **Railway**: Backend deployment platform
- **Vercel**: Frontend deployment platform
- **Supabase**: Database hosting
- **Slack**: Notifications and alerts

### Required Secrets
Configure the following secrets in your GitHub repository:

#### Backend Secrets
```
RAILWAY_TOKEN=your_railway_token
STAGING_DATABASE_URL=postgresql://...
PRODUCTION_DATABASE_URL=postgresql://...
STAGING_BACKEND_URL=https://your-staging-backend.railway.app
PRODUCTION_BACKEND_URL=https://your-production-backend.railway.app
```

#### Frontend Secrets
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
VERCEL_PROJECT_ID_PROD=your_prod_project_id
STAGING_FRONTEND_URL=https://your-staging-frontend.vercel.app
PRODUCTION_FRONTEND_URL=https://your-production-frontend.vercel.app
```

#### Monitoring Secrets
```
SLACK_WEBHOOK=https://hooks.slack.com/services/...
SONAR_TOKEN=your_sonar_token
```

## Environment Setup

### 1. Development Environment
```bash
# Clone repository
git clone https://github.com/your-org/content-studio.git
cd content-studio

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start development servers
npm run dev
```

### 2. Staging Environment
- **Backend**: Railway staging deployment
- **Frontend**: Vercel preview deployments
- **Database**: Supabase staging database
- **Domain**: `staging.contentstudio.app`

### 3. Production Environment
- **Backend**: Railway production deployment
- **Frontend**: Vercel production deployment
- **Database**: Supabase production database
- **Domain**: `contentstudio.app`

## CI/CD Pipeline

### 1. Continuous Integration (CI)
**Trigger**: Push to `main` or `develop` branches, Pull Requests

**Workflows**:
- **Backend CI**: Tests, linting, security scans
- **Frontend CI**: Tests, linting, build verification
- **Security Scan**: Vulnerability scanning, secret detection
- **Code Quality**: SonarCloud analysis
- **Performance Test**: Load testing (PR only)

### 2. Continuous Deployment (CD)
**Trigger**: Push to `main` branch, Manual workflow dispatch

**Deployment Flow**:
1. **Staging Deployment** (Automatic)
   - Deploy backend to Railway staging
   - Deploy frontend to Vercel preview
   - Run database migrations
   - Execute health checks
   - Send notifications

2. **Production Deployment** (Manual)
   - Requires manual approval
   - Deploy to production environments
   - Run production migrations
   - Execute production health checks
   - Create release tags

### 3. Code Review Process
**Trigger**: Pull Request creation/updates

**Automated Checks**:
- Code quality analysis
- Security vulnerability scanning
- Dependency review
- Performance impact analysis
- Automated PR comments with analysis

## Deployment Steps

### Automatic Deployment (Staging)
1. Push code to `main` branch
2. GitHub Actions triggers CI pipeline
3. All tests must pass
4. Security scans must pass
5. Automatic deployment to staging
6. Health checks executed
7. Notifications sent

### Manual Deployment (Production)
1. Go to GitHub Actions tab
2. Select "Continuous Deployment" workflow
3. Click "Run workflow"
4. Select "production" environment
5. Confirm deployment
6. Monitor deployment progress
7. Verify production health

### Rollback Procedure
1. Go to GitHub Actions
2. Find the last successful deployment
3. Click "Re-run jobs"
4. Or use Railway/Vercel rollback features
5. Verify rollback success
6. Notify team

## Monitoring

### Health Checks
- **Backend**: `GET /health` endpoint
- **Frontend**: HTTP 200 response
- **Database**: Connection verification
- **Frequency**: Every 5 minutes

### Performance Monitoring
- **Response Time**: < 2 seconds
- **Uptime**: > 99.9%
- **Error Rate**: < 1%
- **Resource Usage**: < 80% CPU/Memory

### Alerting
- **Slack**: Real-time notifications
- **Email**: Critical alerts
- **Dashboard**: GitHub Actions status

## Database Management

### Migrations
```bash
# Generate migration
npx prisma migrate dev --name migration_name

# Deploy migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Backup Strategy
- **Automated**: Daily backups
- **Retention**: 30 days
- **Location**: Supabase managed backups
- **Recovery**: Point-in-time recovery available

## Security Considerations

### Environment Variables
- Never commit secrets to repository
- Use GitHub Secrets for sensitive data
- Rotate secrets regularly
- Monitor secret usage

### Access Control
- **Repository**: Team-based access
- **Deployment**: Environment-specific permissions
- **Database**: Connection string security
- **Monitoring**: Audit log access

### Security Scanning
- **Dependencies**: Weekly vulnerability scans
- **Code**: Static analysis on every PR
- **Containers**: Image vulnerability scanning
- **Secrets**: Automated secret detection

## Troubleshooting

### Common Issues

#### Deployment Failures
1. Check GitHub Actions logs
2. Verify environment variables
3. Check service availability
4. Review resource limits

#### Health Check Failures
1. Verify service endpoints
2. Check database connectivity
3. Review application logs
4. Test locally first

#### Performance Issues
1. Check resource usage
2. Review application metrics
3. Analyze database queries
4. Consider scaling options

### Debug Commands
```bash
# Check service status
curl -f https://your-backend.railway.app/health

# View logs
railway logs
vercel logs

# Database connection
npx prisma db pull
npx prisma studio
```

## Maintenance

### Regular Tasks
- **Weekly**: Dependency updates
- **Monthly**: Security patches
- **Quarterly**: Performance reviews
- **Annually**: Architecture reviews

### Monitoring Tasks
- **Daily**: Check alert status
- **Weekly**: Review performance metrics
- **Monthly**: Security audit
- **Quarterly**: Capacity planning

## Cost Management

### Current Costs
- **GitHub Actions**: Included in plan
- **Railway**: ~$5-20/month
- **Vercel**: ~$0-20/month
- **Supabase**: ~$0-25/month
- **Total**: ~$5-65/month

### Optimization
- Use preview deployments for testing
- Implement caching strategies
- Optimize resource usage
- Monitor and right-size services

## Support & Documentation

### Resources
- **GitHub**: Repository and issues
- **Documentation**: `/docs` folder
- **Monitoring**: GitHub Actions dashboard
- **Logs**: Railway and Vercel dashboards

### Team Contacts
- **DevOps**: devops@contentstudio.com
- **Security**: security@contentstudio.com
- **Development**: dev@contentstudio.com

### Emergency Procedures
1. **Critical Issues**: Contact on-call engineer
2. **Security Incidents**: Contact security team
3. **Data Issues**: Contact database team
4. **Service Outages**: Follow incident response plan
