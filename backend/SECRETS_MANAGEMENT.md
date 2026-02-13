# 🔐 Secrets Lifecycle Management with dotenvx

Complete guide to managing secrets securely using [dotenvx](https://dotenvx.com/ops).

---

## 📚 What is dotenvx?

**dotenvx** is a modern secrets management tool that provides:
- ✅ **Encryption**: Encrypt secrets at rest (`.env.vault`)
- ✅ **Versioning**: Track secret changes with audit logs
- ✅ **Multi-Environment**: Separate secrets for dev, staging, production
- ✅ **Team Collaboration**: Share encrypted secrets securely
- ✅ **Observability**: Track secrets access and usage
- ✅ **No External Dependencies**: Runs locally, no cloud required

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install dotenvx
```bash
npm install -g dotenvx
```

Verify installation:
```bash
dotenvx --version
```

### Step 2: Initialize dotenvx in your project
```bash
cd backend
dotenvx init
```

This creates:
- `.env.keys` - Master encryption keys (KEEP SECURE, add to .gitignore)
- `.env.vault` - Encrypted secrets file (can commit to git)

### Step 3: Encrypt your existing .env
```bash
# Option A: Add new secret
dotenvx set RAZORPAY_KEY_ID "your_key_here"

# Option B: Encrypt entire .env file
dotenvx encrypt
```

### Step 4: Run your app with encrypted secrets
```bash
# Development (uses .env and .env.vault)
dotenvx run -- npm start

# With specific .env file
dotenvx -f .env.production run -- npm start

# View decrypted secrets (requires .env.keys)
dotenvx ls
```

---

## 📁 File Structure After Setup

```
backend/
├── .env              # Local development secrets (add to .gitignore)
├── .env.production   # Production secrets (add to .gitignore)
├── .env.vault        # Encrypted secrets (SAFE TO COMMIT)
├── .env.keys         # Encryption keys (KEEP SECRET, add to .gitignore)
├── .gitignore        # Updated to ignore .env* files
└── server.js
```

---

## 🔑 Secret Management Workflow

### Create New Secret
```bash
# Interactive prompt
dotenvx set

# Direct command
dotenvx set RAZORPAY_KEY_ID "key_value_here"

# Multiple at once
dotenvx set RAZORPAY_KEY_ID "key" RAZORPAY_KEY_SECRET "secret"
```

### Update Existing Secret
```bash
# Overwrite secret
dotenvx set RAZORPAY_KEY_ID "new_key_value"

# Verify change
dotenvx ls
```

### Delete Secret
```bash
# Remove from vault
dotenvx unset RAZORPAY_KEY_ID

# Confirm deletion
dotenvx ls
```

### View All Secrets
```bash
# Show all decrypted values (requires .env.keys)
dotenvx ls

# Show vault contents (encrypted)
cat .env.vault
```

---

## 🌍 Multi-Environment Setup

### Create Environment-Specific Vaults

#### Development Environment
```bash
# Create dev secrets
dotenvx -f .env.development set RAZORPAY_KEY_ID "dev_key"
dotenvx -f .env.development set RAZORPAY_KEY_SECRET "dev_secret"
dotenvx -f .env.development set MONGODB_URI "mongodb://localhost:27017/shopez_dev"
```

#### Staging Environment
```bash
# Create staging secrets
dotenvx -f .env.staging set RAZORPAY_KEY_ID "staging_key"
dotenvx -f .env.staging set MONGODB_URI "mongodb+srv://user:pass@cluster.mongodb.net/shopez_staging"
```

#### Production Environment
```bash
# Create production secrets (MOST CAREFUL)
dotenvx -f .env.production set RAZORPAY_KEY_ID "prod_key_real"
dotenvx -f .env.production set MONGODB_URI "prod_mongodb_url"
dotenvx -f .env.production set JWT_SECRET "strong_random_string"
```

### Run with Specific Environment
```bash
# Development
dotenvx -f .env.development run -- npm start

# Staging
dotenvx -f .env.staging run -- npm start

# Production
dotenvx -f .env.production run -- npm start
```

---

## 🔄 Deployment & CI/CD Integration

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # Set encrypted keys as secret
      - name: Setup secrets
        env:
          DOTENV_KEY: ${{ secrets.DOTENV_KEY }}
        run: |
          echo "$DOTENV_KEY" > .env.keys
      
      # Install and run with dotenvx
      - name: Install deps
        run: npm install -g dotenvx && npm install
      
      # Run with .env.vault (from repo) + .env.keys (from GitHub secret)
      - name: Start server
        run: dotenvx -f .env.production run -- npm start &
```

### Docker Example
```dockerfile
# Dockerfile
FROM node:24-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install -g dotenvx && npm ci

COPY . .

# Copy encrypted vault (from repo)
COPY .env.vault .env.vault

# Encryption keys passed as build arg or env
ARG DOTENV_KEY
ENV DOTENV_KEY=$DOTENV_KEY

CMD ["dotenvx", "run", "--", "npm", "start"]
```

Build with:
```bash
docker build \
  --build-arg DOTENV_KEY="your_key_here" \
  -t shopez:latest .

docker run -e DOTENV_KEY="your_key_here" shopez:latest
```

---

## ✅ Security Best Practices

### 1. Protect .env.keys
```bash
# Add to .gitignore (CRITICAL)
echo ".env.keys" >> .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### 2. Rotate Secrets Regularly
```bash
# Monthly security rotation
dotenvx set RAZORPAY_KEY_SECRET "new_secret_$(date +%s)"

# Verify rotation
dotenvx ls | grep RAZORPAY
```

### 3. Audit Secret Access
```bash
# View when secrets were last accessed
dotenvx ls --all

# Check modification timestamps
ls -la .env.vault
```

### 4. Backup Encryption Keys
```bash
# IMPORTANT: Backup .env.keys in secure location
# (Password manager, secure cloud storage, etc.)
# WITHOUT these keys, encrypted secrets cannot be decrypted
```

### 5. Team Secret Sharing
```bash
# Share encrypted secrets (safe):
# 1. Commit .env.vault to git (encrypted, safe)
# 2. Share .env.keys via secure channel (email, password manager)
# 3. Team member: Copy .env.keys to local backend/

# DO NOT share:
# ❌ .env files (unencrypted)
# ❌ Raw secret values in chat/email
# ❌ Screenshots of secrets
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "DOTENV_KEY not found"
```bash
# Solution: Generate new keys
dotenvx init

# Or export existing key
export DOTENV_KEY="your_key_value"
dotenvx run -- npm start
```

### Issue 2: "Cannot decrypt .env.vault"
```bash
# Check if .env.keys exists and is readable
ls -la .env.keys

# If missing, restore from backup or regenerate:
dotenvx init
```

### Issue 3: ".env.vault file is empty"
```bash
# Ensure secrets are set
dotenvx set MY_SECRET "value"

# Encrypt to vault
dotenvx encrypt

# Verify
cat .env.vault
```

### Issue 4: "dotenvx command not found"
```bash
# Install globally
npm install -g dotenvx

# Or use npx
npx dotenvx run -- npm start
```

---

## 📊 Monitoring & Observability

### Enable Debug Logging
```bash
# See detailed secret loading info
DOTENVX_DEBUG=true dotenvx run -- npm start

# Output example:
# [dotenvx] loading .env.vault...
# [dotenvx] decryption successful
# [dotenvx] injecting 8 env variables
```

### Check Secret Injection
```bash
# In your server.js, add logging:
console.log("✅ RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID ? "SET" : "MISSING");
console.log("✅ JWT_SECRET:", process.env.JWT_SECRET ? "SET" : "MISSING");
```

### View Secrets in Production
```bash
# Docker: Print loaded env vars
docker exec container_name printenv | grep RAZORPAY

# Server logs: Check environment loaded
dotenvx -f .env.production run -- npm start 2>&1 | head -20
```

---

## 🔐 Secrets Checklist

### Sensitive Values to Encrypt
- [ ] `RAZORPAY_KEY_ID`
- [ ] `RAZORPAY_KEY_SECRET`
- [ ] `MONGODB_URI` (includes password)
- [ ] `JWT_SECRET`
- [ ] `JWT_REFRESH_SECRET`
- [ ] Database passwords
- [ ] API keys (third-party services)
- [ ] Admin email credentials (if used)
- [ ] Webhook signing keys

### Safe to Keep Unencrypted
- [ ] `NODE_ENV`
- [ ] `PORT`
- [ ] Public API endpoints
- [ ] Feature flags
- [ ] Log levels

---

## 📝 Update server.js for dotenvx

Your server.js already loads dotenv. dotenvx works alongside it:

```javascript
// server.js
require("dotenv").config(); // Standard dotenv

// With dotenvx, secrets from .env.vault are automatically injected
// at runtime when you run: dotenvx run -- npm start

// No code changes needed!
// All environment variables work the same way:
console.log(process.env.RAZORPAY_KEY_ID);  // Works with both dotenv and dotenvx
```

---

## 🚀 Complete Implementation Steps

### For Development
```bash
# 1. Init dotenvx
cd backend
dotenvx init

# 2. Add your development secrets
dotenvx set RAZORPAY_KEY_ID "test_key"
dotenvx set RAZORPAY_KEY_SECRET "test_secret"
dotenvx set MONGODB_URI "mongodb://localhost:27017/shopez"

# 3. Run your app
dotenvx run -- npm start

# 4. Commit vault (not keys!)
git add .env.vault
git commit -m "Add encrypted environment variables"
```

### For Production Deployment
```bash
# 1. On your server, create production vault
dotenvx -f .env.production set RAZORPAY_KEY_ID "prod_key"

# 2. Copy encryption key securely to server
# (From password manager, not git)
echo "your_prod_key" > .env.keys

# 3. Run with production config
dotenvx -f .env.production run -- npm start

# 4. Verify secrets loaded
docker logs container_name | grep "✅"
```

### For Team Collaboration
```bash
# 1. Git push encrypted vault
git push origin .env.vault

# 2. Team pulls repo
git pull

# 3. Team receives encryption key via secure channel
# (Email, password manager, 1Password, etc.)

# 4. Team sets up locally
echo "received_key_value" > .env.keys

# 5. Team runs app
dotenvx run -- npm start
```

---

## 📖 Additional Resources

- **Official Docs**: https://dotenvx.com/docs
- **Security Best Practices**: https://dotenvx.com/security
- **Observability**: https://dotenvx.com/ops
- **GitHub Marketplace**: https://github.com/dotenvx/dotenvx-action

---

## ✨ Summary

**Before dotenvx**:
```
❌ Secrets in .env (unencrypted in git)
❌ Manual secret distribution
❌ No audit trail
❌ Hard to rotate secrets safely
```

**After dotenvx**:
```
✅ Secrets encrypted in .env.vault
✅ Safe to commit to git
✅ Audit logs track changes
✅ Easy rotation and versioning
✅ Team-friendly secret sharing
✅ Production-ready security
```

---

**Next Steps**: 
1. Run `dotenvx init` in backend/
2. Migrate existing .env secrets
3. Update deployment scripts
4. Document team access procedures

