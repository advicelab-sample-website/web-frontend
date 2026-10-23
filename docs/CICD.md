# CI/CD Guide

This project uses GitHub Actions to build the Vite frontend and deploy it to AWS S3 + CloudFront.

## Overview

The deployment flow is:

1. Push to the `main` branch.
2. GitHub Actions checks out the repository.
3. Node.js is installed.
4. Dependencies are installed with `npm ci`.
5. The frontend is built with `npm run build`.
6. AWS credentials are configured using GitHub secrets.
7. The script `publish.sh` uploads the generated files to the S3 bucket.
8. CloudFront is invalidated so the latest version is served.

---

## GitHub Actions workflow

File: `.github/workflows/frontend-deploy.yml`

This workflow is triggered on:

- push to `main`
- changes in these paths:
  - `src/**`
  - `public/**`
  - `index.html`
  - `package.json`
  - `scripts/**`
  - `vite.config.ts`
  - `vercel.json`
  - `publish.sh`
- manual trigger via `workflow_dispatch`

Important points:

- It uses `actions/checkout@v4` to fetch the repo.
- It uses `actions/setup-node@v4` with Node 20.
- It uses `npm ci` for deterministic installs.
- It runs the production build with `npm run build`.
- It configures AWS credentials with repository secrets.
- It executes `./publish.sh` after setting execute permission.

This is the correct pattern for a Vite frontend that is deployed as static assets to S3.

---

## Publish script

File: `publish.sh`

This script does the actual deployment to AWS:

1. Checks that AWS CLI is installed.
2. Verifies the bucket exists and is accessible.
3. Configures S3 website hosting.
4. Uploads the `dist` folder to the bucket root and removes objects no longer present in `dist`.
5. Uploads non-root HTML pages as route-specific files.
6. Creates a CloudFront invalidation for `/*`.

### Expected behavior

The script expects:

- a valid S3 bucket named `advicelab-web-prod`
- a CloudFront distribution ID `E1LOED90C0H8QD`
- a built frontend in `./dist`
- valid AWS credentials in GitHub secrets

The S3 sync uses `--delete`, so the bucket root is kept in sync with the latest
build. This is appropriate because the bucket is dedicated to this website;
do not use this script for a bucket containing unrelated objects.

### What it does with routes

For example:

- `./dist/about.html` becomes `about`
- `./dist/solutions.html` becomes `solutions`

This is useful for SPA-style static routes that need direct HTML files to exist in the bucket.

---

## Required GitHub secrets

Add these in the GitHub repository under Settings → Secrets and variables → Actions:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Optional if using temporary credentials:

- `AWS_SESSION_TOKEN`

These values must belong to an AWS user or role that has permission to:

- upload files to the S3 bucket
- invalidate CloudFront
- read the bucket configuration

Recommended IAM permissions:

- `s3:PutObject`
- `s3:DeleteObject`
- `s3:ListBucket`
- `cloudfront:CreateInvalidation`

---

## How to validate that the pipeline is correct

Run these checks locally before pushing:

```bash
npm ci
npm run build
chmod +x publish.sh
./publish.sh
```

You should confirm:

- the build finishes without errors
- `dist/` is created
- `publish.sh` runs without AWS permission errors
- the S3 bucket receives the files
- the CloudFront invalidation succeeds

---

## Common problems to watch for

### 1. Missing AWS credentials

If the GitHub secret is missing or expired, the job will fail at the AWS config step.

### 2. Wrong bucket name

The script uses `advicelab-web-prod`.
If the bucket was renamed or is in a different AWS account, deployment will fail.

### 3. Wrong CloudFront distribution ID

The script invalidates `E1LOED90C0H8QD`.
If the distribution is changed, update the value in `publish.sh`.

### 4. Build failure

If `npm run build` fails, the deploy job stops before any AWS upload happens.

### 5. Wrong region

The workflow is configured to deploy in `ap-southeast-2`. Make sure the S3 bucket and CloudFront distribution are in the same region or expected deployment target.

---

## Recommended deployment checklist

Before merging to `main`, confirm:

- [ ] Node version is compatible with the app
- [ ] `npm ci` succeeds
- [ ] `npm run build` succeeds
- [ ] AWS secrets exist in GitHub
- [ ] S3 bucket exists
- [ ] CloudFront distribution ID is correct
- [ ] `publish.sh` is executable in the repo
- [ ] `main` branch is the intended deployment branch

---

## Final note

This CI/CD setup is appropriate for a static React/Vite site deployed to AWS S3 with CloudFront caching. It is a good production pattern for this project, as long as the AWS bucket, distribution ID, and secrets match the live environment.
