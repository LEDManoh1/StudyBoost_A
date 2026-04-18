# StudyBoost Deployment Guide

This guide will help you deploy StudyBoost to Vercel with Firebase integration.

## Prerequisites

- Vercel account (free)
- Firebase project
- PostgreSQL database (Vercel Postgres, Railway, or similar)
- Google OAuth credentials
- Gemini API key

## Step 1: Firebase Setup

### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable the following services:
   - Authentication (Email, Phone, Google)
   - Firestore Database
   - Cloud Storage
   - Cloud Messaging (optional)

### Get Firebase Client Config
1. In Firebase Console, go to Project Settings
2. Find your Web App configuration
3. Copy your config values for `NEXT_PUBLIC_FIREBASE_*` environment variables

### Create Service Account for Backend
1. Go to Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. You'll get a JSON file with credentials
4. Extract `project_id`, `client_email`, and `private_key`
5. Store these for the server-side environment variables

## Step 2: Environment Variables Setup

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### Required Variables:

**Database:**
```
DATABASE_URL=postgresql://user:password@host:port/database
```

**NextAuth:**
```
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
```

**Google OAuth:**
- Get from [Google Cloud Console](https://console.cloud.google.com)

**Firebase Client (Public):**
- Get from Firebase Console → Project Settings → Your Apps

**Firebase Admin (Server-only):**
- From the Service Account JSON file you downloaded

**Gemini API:**
- Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

### Option B: Connect GitHub
1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### Add Environment Variables in Vercel:
1. Go to your project settings
2. Click "Environment Variables"
3. Add all variables from `.env.local` EXCEPT those starting with `NEXT_PUBLIC_`
4. Add `NEXT_PUBLIC_` variables separately (they need to be public)

**Important:** Never commit `.env.local` to git. It's in `.gitignore`.

## Step 4: Database Setup

### Using Vercel Postgres (Easiest):
1. In Vercel project, go to Storage
2. Click "Create Database" → "Postgres"
3. Vercel will automatically add `DATABASE_URL` to your env

### Using External Database:
1. Create a PostgreSQL database
2. Add the connection string as `DATABASE_URL`
3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

## Step 5: Run Migrations

After deploying, run database migrations:

```bash
# From Vercel deployment terminal or locally
npx prisma migrate deploy

# If you need to create initial migration
npx prisma migrate dev --name init
```

## Step 6: Testing

After deployment:
1. Visit your Vercel URL
2. Test Google OAuth login
3. Test OTP login
4. Check Firebase integration in browser console

## Environment Variables Reference

| Variable | Type | Description |
|----------|------|-------------|
| `DATABASE_URL` | Secret | PostgreSQL connection string |
| `NEXTAUTH_URL` | Public | Your deployed URL (auto-set by Vercel) |
| `NEXTAUTH_SECRET` | Secret | Auth secret key |
| `GOOGLE_CLIENT_ID` | Secret | Google OAuth ID |
| `GOOGLE_CLIENT_SECRET` | Secret | Google OAuth secret |
| `GEMINI_API_KEY` | Secret | Google Gemini API key |
| `NEXT_PUBLIC_FIREBASE_*` | Public | Firebase client config |
| `FIREBASE_PROJECT_ID` | Secret | Firebase server config |
| `FIREBASE_CLIENT_EMAIL` | Secret | Firebase service account |
| `FIREBASE_PRIVATE_KEY` | Secret | Firebase private key |

## Troubleshooting

### Build Failures:
1. Check build logs in Vercel
2. Ensure all environment variables are set
3. Run `npm run build` locally to debug

### Runtime Errors:
1. Check Vercel Function logs
2. Enable error tracking in Firebase
3. Check browser console for client-side errors

### Database Connection Issues:
1. Verify `DATABASE_URL` is correct
2. Check database is running
3. Run migrations manually if needed

### Firebase Errors:
1. Verify Firebase config in browser DevTools
2. Check Firebase rules in console
3. Ensure service account has proper permissions

## Monitoring

Set up monitoring with:
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Firebase Console](https://console.firebase.google.com)
- [Google Cloud Console](https://console.cloud.google.com)

## Production Checklist

- [ ] All environment variables set in Vercel
- [ ] Database migrations applied
- [ ] Firebase project created and configured
- [ ] Google OAuth working
- [ ] OTP authentication working
- [ ] Firebase storage working
- [ ] Analytics enabled
- [ ] Error logging configured
- [ ] Custom domain configured (optional)
- [ ] SSL certificate installed (auto with Vercel)

## Support & Documentation

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [NextAuth Docs](https://next-auth.js.org/)