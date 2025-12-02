# Deployment Checklist - Desktop Downloads Feature

Use this checklist to ensure smooth deployment of the desktop downloads feature.

## Pre-Deployment

### 1. GitHub Setup
- [ ] Created GitHub Personal Access Token
- [ ] Token has correct scope (`repo` or fine-grained `Contents: Read`)
- [ ] Token is saved securely (password manager)
- [ ] Token expiration date noted in calendar

### 2. Repository Setup
- [ ] At least one release exists in repository
- [ ] Release is marked as "latest" (not draft or pre-release)
- [ ] Release has assets uploaded
- [ ] Assets follow naming convention (platform-arch.ext)
- [ ] All platforms have builds (macOS, Windows, Linux)

### 3. Local Testing
- [ ] Created `.env` file with `GITHUB_TOKEN`
- [ ] Ran `npm run test:releases` successfully
- [ ] Started dev server (`npm run dev`)
- [ ] Visited `/download` page - loads correctly
- [ ] All platforms detected correctly
- [ ] Download links work
- [ ] Tested on mobile viewport
- [ ] No console errors

### 4. Code Review
- [ ] API endpoint properly authenticates
- [ ] Error handling in place
- [ ] Types are correct
- [ ] Cache headers configured
- [ ] No hardcoded tokens or secrets
- [ ] `.env` is in `.gitignore`

## Deployment

### 5. Environment Variables
- [ ] Added `GITHUB_TOKEN` to production environment
- [ ] Verified token value is correct (no extra spaces)
- [ ] Environment variable is marked as secret/hidden
- [ ] Tested environment variable is accessible

### 6. Build & Deploy
- [ ] Code committed to repository
- [ ] All tests passing
- [ ] Built successfully (`npm run build`)
- [ ] Deployed to staging/preview environment
- [ ] Tested on staging environment
- [ ] Deployed to production

### 7. Production Testing
- [ ] Visited production `/download` page
- [ ] Desktop downloads section appears
- [ ] All platforms showing correctly
- [ ] Version number is correct
- [ ] File sizes displaying properly
- [ ] Download links functional
- [ ] Tested at least one download from each platform
- [ ] Mobile app store links still work
- [ ] Page loads in under 3 seconds

## Post-Deployment

### 8. Monitoring
- [ ] Check server logs for errors
- [ ] Monitor API response times
- [ ] Check GitHub API rate limit usage
- [ ] Verify cache headers are working
- [ ] Test from different geographic locations
- [ ] Monitor download completion rates

### 9. Documentation
- [ ] Updated team documentation
- [ ] Shared GitHub token securely with team
- [ ] Documented token rotation schedule
- [ ] Updated runbook for common issues
- [ ] Notified stakeholders of deployment

### 10. User Communication
- [ ] Announced desktop app availability
- [ ] Updated social media / blog
- [ ] Sent newsletter (if applicable)
- [ ] Updated app store descriptions with desktop link
- [ ] Added desktop downloads to navigation/footer

## Platform-Specific Checks

### macOS
- [ ] Apple Silicon build available
- [ ] Intel build available
- [ ] .dmg files open correctly
- [ ] App is signed (if applicable)
- [ ] Gatekeeper warnings acceptable

### Windows
- [ ] x64 build available
- [ ] .exe or .msi installs correctly
- [ ] Windows Defender doesn't block
- [ ] App is signed (if applicable)

### Linux
- [ ] AppImage is executable
- [ ] .deb installs on Debian/Ubuntu
- [ ] .rpm installs on Fedora/RHEL
- [ ] Correct architecture (x64/ARM64)

## Security Checklist

### 11. Security Verification
- [ ] GitHub token not in source code
- [ ] Token not in git history
- [ ] `.env` file in `.gitignore`
- [ ] Token has minimum required permissions
- [ ] API endpoint doesn't leak token
- [ ] Downloads don't expose asset IDs publicly
- [ ] HTTPS enabled on production
- [ ] No CORS issues

## Performance Checklist

### 12. Performance Verification
- [ ] API response time < 2 seconds
- [ ] Cache headers working (5 minutes)
- [ ] Page loads quickly
- [ ] No unnecessary API calls
- [ ] Images optimized
- [ ] JavaScript bundle size reasonable

## Rollback Plan

### 13. Rollback Preparation
- [ ] Previous deployment still accessible
- [ ] Know how to revert deployment
- [ ] Have backup of environment variables
- [ ] Can quickly disable feature if needed
- [ ] Team knows rollback procedure

## Issue Response

### 14. Support Preparation
- [ ] Support team trained on new feature
- [ ] Common issues documented
- [ ] Troubleshooting guide accessible
- [ ] Contact channels working
- [ ] Escalation path defined

## Maintenance Schedule

### 15. Ongoing Maintenance
- [ ] Token rotation scheduled (6-12 months)
- [ ] Release process documented
- [ ] Monitoring dashboards set up
- [ ] Performance benchmarks recorded
- [ ] User feedback collection method established

## Success Metrics

### 16. Define Success
- [ ] Tracking desktop download counts
- [ ] Monitoring platform distribution
- [ ] Measuring page load times
- [ ] Tracking error rates
- [ ] User satisfaction metric defined

## Sign-Off

### Final Approval
- [ ] Technical lead approved
- [ ] QA team approved
- [ ] Product owner approved
- [ ] Security review passed
- [ ] Ready for production traffic

---

## Quick Commands Reference

```bash
# Test GitHub connection
npm run test:releases

# Run locally
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check environment variable
echo $GITHUB_TOKEN

# Test API endpoint
curl https://your-domain.com/api/download-desktop-app | jq
```

## Emergency Contacts

- **Technical Lead**: [Add contact]
- **DevOps Team**: [Add contact]
- **On-Call Engineer**: [Add contact]
- **GitHub Support**: support@github.com

## Post-Deployment Notes

**Deployed By**: ___________________  
**Date**: ___________________  
**Version**: ___________________  
**Environment**: ___________________  
**Issues Found**: ___________________  
**Resolution**: ___________________  

---

## Verification Commands

### Test Production API
```bash
curl https://pepakbasajawa.com/api/download-desktop-app | jq
```

### Check Rate Limit
```bash
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/rate_limit | jq
```

### Verify Release Assets
```bash
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/repos/setoelkahfi/pepakbasajawa/releases/latest | jq
```

### Monitor Cache Headers
```bash
curl -I https://pepakbasajawa.com/api/download-desktop-app
```

---

**Checklist Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Ready for Use ✅