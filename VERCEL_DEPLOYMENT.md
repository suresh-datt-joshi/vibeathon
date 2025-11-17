# Vercel Deployment Guide

This guide will walk you through deploying your vibeathon application to Vercel step by step.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free account works)
2. **GitHub/GitLab/Bitbucket Account**: Your code should be in a Git repository
3. **Environment Variables Ready**:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `DATABASE_URL`: PostgreSQL connection string (Neon serverless)
   - `SESSION_SECRET`: A random secret string for session encryption

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Commit all changes** to your Git repository:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Verify your build works locally**:
   ```bash
   npm run build
   ```
   This should create a `dist` folder with your built application.

### Step 2: Install Vercel CLI (Optional but Recommended)

You can deploy via the Vercel dashboard or CLI. CLI is recommended for easier management:

```bash
npm install -g vercel
```

### Step 3: Deploy via Vercel Dashboard

#### Option A: Deploy via Dashboard (Easiest)

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in with your GitHub/GitLab/Bitbucket account

2. **Import Your Project**:
   - Click "Import Project"
   - Select your repository (`vibeathon`)
   - Vercel will auto-detect your project settings

3. **Configure Project Settings**:
   - **Framework Preset**: Select "Other" or "Vite"
   - **Root Directory**: Leave as `.` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   Click "Environment Variables" and add:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   DATABASE_URL=your_neon_database_url_here
   SESSION_SECRET=your_random_secret_string_here
   NODE_ENV=production
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (usually 2-5 minutes)

### Step 4: Deploy via CLI (Alternative)

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Deploy**:
   ```bash
   vercel
   ```
   Follow the prompts:
   - Link to existing project? **No** (first time)
   - Project name: **vibeathon** (or your preferred name)
   - Directory: **.** (current directory)
   - Override settings? **No**

3. **Set Environment Variables**:
   ```bash
   vercel env add GEMINI_API_KEY
   vercel env add DATABASE_URL
   vercel env add SESSION_SECRET
   vercel env add NODE_ENV production
   ```

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Step 5: Verify Deployment

1. **Check Deployment Status**:
   - Go to your Vercel dashboard
   - Click on your project
   - Check the "Deployments" tab

2. **Test Your Application**:
   - Visit the URL provided by Vercel (e.g., `https://vibeathon.vercel.app`)
   - Test API endpoints: `https://your-app.vercel.app/api/projects`
   - Test frontend routes

3. **Check Logs**:
   - In Vercel dashboard, go to "Functions" tab
   - Click on any function to see logs
   - Check for any errors

### Step 6: Configure Custom Domain (Optional)

1. **Add Domain**:
   - Go to Project Settings → Domains
   - Click "Add Domain"
   - Enter your domain name
   - Follow DNS configuration instructions

2. **Update DNS Records**:
   - Add CNAME record pointing to Vercel
   - Wait for DNS propagation (can take up to 48 hours)

## Troubleshooting

### Build Fails

**Error: Cannot find module**
- Ensure all dependencies are in `package.json`
- Check that `node_modules` is not committed (should be in `.gitignore`)

**Error: Build command failed**
- Run `npm run build` locally to see the exact error
- Check that all TypeScript errors are resolved
- Verify `dist/public` directory is created after build

### API Routes Not Working

**Error: 404 on API routes**
- Verify `vercel.json` routes configuration
- Check that `api/index.ts` exists
- Ensure routes are properly exported

**Error: Database connection failed**
- Verify `DATABASE_URL` environment variable is set correctly
- Check that your Neon database allows connections from Vercel IPs
- Ensure database is not paused (Neon free tier pauses after inactivity)

### Frontend Not Loading

**Error: Blank page**
- Check browser console for errors
- Verify `dist/public/index.html` exists
- Check that static assets are being served correctly

**Error: 404 on routes**
- Ensure SPA routing is configured correctly
- Check `vercel.json` routes configuration

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `SESSION_SECRET` | Random secret for sessions | `your-random-secret-here` |
| `NODE_ENV` | Environment mode | `production` |

## Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] API endpoints respond correctly
- [ ] Database connections work
- [ ] Environment variables are set
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate is active (automatic with Vercel)
- [ ] Monitoring/logging is set up

## Continuous Deployment

Vercel automatically deploys on every push to your main branch:

1. **Push to main branch**:
   ```bash
   git push origin main
   ```

2. **Vercel automatically**:
   - Detects the push
   - Runs build command
   - Deploys new version
   - Creates preview URL for each commit

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Serverless Functions Guide](https://vercel.com/docs/concepts/functions/serverless-functions)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review function logs in Vercel dashboard
3. Test locally with `npm run build` and `npm start`
4. Check Vercel community forums or support

