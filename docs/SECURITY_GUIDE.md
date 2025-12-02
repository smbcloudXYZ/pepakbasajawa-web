# Security Guide - Protecting Credentials in Public Repository

> **⚠️ CRITICAL: This repository (pepakbasajawa-web) is PUBLIC**  
> All code committed here is visible to everyone on the internet.

## 🎯 Quick Security Rules

### ❌ NEVER Commit These:
- `.env` files
- GitHub tokens (ghp_*, github_pat_*)
- API keys (Stripe, AWS, etc.)
- Passwords
- Private keys
- Database credentials
- Any sensitive configuration

### ✅ ALWAYS Do This:
- Use environment variables for secrets
- Add `.env` to `.gitignore`
- Use placeholders in documentation
- Review code before committing
- Double-check staged files

## 🔒 How to Handle Secrets Safely

### 1. Local Development

**Create .env file** (never commit):
```bash
# Create .env in project root
echo "GITHUB_TOKEN=your_actual_token_here" > .env

# Verify it's gitignored
git status  # Should NOT show .env
```

**Load secrets in code**:
```typescript
// ✅ CORRECT: Load from environment
const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN

// ❌ WRONG: Never hardcode
const GITHUB_TOKEN = "ghp_actual_token_here"
```

### 2. Documentation

**Use placeholders**:
```bash
# ✅ CORRECT: Placeholder token
GITHUB_TOKEN=ghp_your_token_here

# ❌ WRONG: Real token
GITHUB_TOKEN=ghp_s3cr3tt0k3nH3r3XXXXXXXXXX
```

### 3. Production Deployment

**Set environment variables in hosting platform**:

**Vercel**:
```bash
vercel env add GITHUB_TOKEN
# Paste token when prompted
```

**Netlify**:
```bash
netlify env:set GITHUB_TOKEN your_token_here
```

**Or via dashboards**:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables

## 🛡️ Security Checklist

Before every commit:
- [ ] Run `git status` - check what's being committed
- [ ] Run `git diff --cached` - review changes
- [ ] Verify no `.env` files in staged files
- [ ] Search for token patterns: `ghp_`, `sk_live_`, `pk_live_`
- [ ] Ensure all secrets use environment variables
- [ ] Documentation uses only placeholders

## 🚨 If You Accidentally Commit a Secret

### Immediate Actions (Within 5 minutes):

1. **Revoke the secret immediately**:
   - GitHub: https://github.com/settings/tokens
   - Stripe: https://dashboard.stripe.com/apikeys
   - AWS: AWS IAM Console

2. **Remove from git history**:
   ```bash
   # Remove file from git history
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (be careful!)
   git push origin --force --all
   ```

3. **Generate new secret**:
   - Create a new token/key immediately
   - Update `.env` locally
   - Update production environment variables

4. **Notify the team**:
   - Inform relevant team members
   - Document what happened
   - Update procedures to prevent recurrence

### If More Than 5 Minutes Have Passed:

**Assume the secret is compromised!**
- Revoke immediately
- Generate new credentials
- Monitor for unauthorized usage
- Consider changing related passwords
- File incident report if required

## 🔧 Setup Pre-Commit Hooks

Prevent accidents with automated checks:

```bash
# Configure git to use custom hooks directory
git config core.hooksPath .githooks

# Copy the example hook
cp .githooks/pre-commit.example .githooks/pre-commit

# Make it executable
chmod +x .githooks/pre-commit
```

The pre-commit hook will:
- ✅ Block commits with `.env` files
- ✅ Detect GitHub token patterns
- ✅ Find API key patterns
- ✅ Warn about hardcoded passwords
- ✅ Check .gitignore configuration

## 📋 Project-Specific Security

### Desktop Downloads Feature

**What needs to be secret**:
- `GITHUB_TOKEN` - Personal Access Token for GitHub API

**How it's protected**:
1. Token stored in `.env` (gitignored)
2. Token loaded via `import.meta.env.GITHUB_TOKEN`
3. Token used only in server-side API routes
4. Token never sent to client browser
5. Downloads proxied through server

**Verify security**:
```bash
# Check token isn't in code
grep -r "ghp_[a-zA-Z0-9]\{36\}" . --exclude-dir=node_modules

# Check .env is gitignored
git ls-files | grep .env

# Both should return no results
```

## 🎓 Security Training

### For New Team Members

1. **Read this guide completely**
2. **Never commit secrets** - use environment variables
3. **Check before pushing** - review your commits
4. **Report incidents immediately** - no blame, just fix
5. **Keep credentials secure** - use password managers

### Code Review Checklist

When reviewing PRs, verify:
- [ ] No `.env` files added
- [ ] No hardcoded tokens/keys
- [ ] Secrets loaded from environment
- [ ] No tokens in console.log()
- [ ] Error messages don't leak secrets
- [ ] Documentation uses placeholders

## 📊 Regular Security Audits

### Weekly:
- [ ] Review recent commits for leaks
- [ ] Check GitHub security alerts
- [ ] Verify environment variables are set

### Monthly:
- [ ] Audit all secret usage
- [ ] Review access permissions
- [ ] Check for unused tokens
- [ ] Update dependencies

### Every 6 Months:
- [ ] Rotate all tokens/keys
- [ ] Review team access
- [ ] Update security procedures
- [ ] Security training refresh

## 🔐 Token Management

### GitHub Personal Access Tokens

**Create token**:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → Fine-grained token
3. Name: "PepakBasaJawa Downloads - [Your Name]"
4. Expiration: 1 year
5. Repository access: Only `setoelkahfi/pepakbasajawa`
6. Permissions: Contents: Read-only
7. Generate and copy immediately

**Store token**:
```bash
# Add to .env (never commit!)
echo "GITHUB_TOKEN=ghp_your_token" >> .env

# Or use password manager
# 1Password, LastPass, Bitwarden, etc.
```

**Rotate token** (every 6 months):
1. Generate new token
2. Update `.env` locally
3. Test locally: `npm run test:releases`
4. Update production env vars
5. Test production
6. Revoke old token
7. Document rotation date

## 🚨 Emergency Contacts

If you discover a security issue:

1. **For leaked credentials**:
   - Revoke immediately
   - Contact: [Team Lead]
   - Document incident

2. **For vulnerabilities**:
   - Email: info@pepakbasajawa.com
   - Use GitHub Security Advisories (private)
   - Don't publicly disclose until patched

3. **For production issues**:
   - Contact DevOps team
   - Check monitoring dashboards
   - Follow incident response plan

## 📚 Additional Resources

### Internal Docs:
- `SECURITY_AUDIT.md` - Latest security audit results
- `DESKTOP_DOWNLOADS_SETUP.md` - Feature setup guide
- `.env.example` - Template for environment variables

### External Resources:
- [GitHub Token Security](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure)
- [OWASP Secure Coding](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [Git Security Best Practices](https://github.com/git/git/blob/master/Documentation/technical/security.txt)

## ✅ Security Certification

I, _________________, have read and understood this security guide.

I commit to:
- Never committing secrets to the repository
- Using environment variables for all sensitive data
- Reviewing my code before committing
- Reporting security incidents immediately
- Following security best practices

Signature: _________________  
Date: _________________

---

**Document Version**: 1.0.0  
**Last Updated**: 2024  
**Next Review**: Every 6 months

**Remember: This is a PUBLIC repository. When in doubt, DON'T commit it!** 🔒