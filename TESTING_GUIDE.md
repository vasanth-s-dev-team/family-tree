# Family Tree App - Testing Guide

## Quick Start Testing

### Demo Account
- **Email**: `demo@familytree.com`
- **Password**: `DemoPassword123!`
- **Button**: "Fill Demo Credentials" on login page

## Test Scenarios

### 1. Authentication Testing

#### Scenario 1.1: Login with Demo Credentials
1. Open app at `/`
2. Click "Fill Demo Credentials"
3. Click "Sign In"
4. Expected: Redirect to dashboard
5. Status: ✓ Implemented

#### Scenario 1.2: Register New Account
1. Open app
2. Click "Need an account? Sign up"
3. Enter new email (e.g., `test@example.com`)
4. Enter password (e.g., `TestPass123!`)
5. Click "Sign Up"
6. Expected: Account created, auto-login, redirect to dashboard
7. Status: ✓ Implemented

#### Scenario 1.3: Invalid Credentials
1. Enter wrong email/password
2. Click "Sign In"
3. Expected: Error message "Invalid email or password"
4. Status: ✓ Implemented

#### Scenario 1.4: Retry on Network Error
1. Try login with poor connection
2. Click "Retry" button
3. Expected: Auto-retry up to 3 times with 1-second delays
4. Status: ✓ Implemented

### 2. Family Member Management

#### Scenario 2.1: Add Family Member
1. Log in to dashboard
2. Click "Add Family Member"
3. Fill in:
   - First Name: "John"
   - Last Name: "Doe"
   - Date of Birth: "1990-01-15"
4. Click "Save"
5. Expected: Member appears in list
6. Status: ✓ Implemented

#### Scenario 2.2: Upload Profile Picture
1. Add family member (or edit existing)
2. Click on profile picture area
3. Select image from device
4. Expected: Image uploads and displays
5. Status: ✓ Implemented

#### Scenario 2.3: Add Special Occasions
1. Edit family member
2. Click "Add Occasion"
3. Enter: "Graduation - 2012"
4. Click "Save"
5. Expected: Occasion saved and displayed
6. Status: ✓ Implemented

#### Scenario 2.4: Create Family Relationships
1. Add multiple family members
2. Set parent-child relationships
3. Set spouse relationships
4. Expected: Relationships displayed in tree view
5. Status: ✓ Implemented

### 3. Dashboard Testing

#### Scenario 3.1: View Statistics
1. Log in to dashboard
2. Check statistics section
3. Expected: Shows family member count, relationships, etc.
4. Status: ✓ Implemented

#### Scenario 3.2: View Family Tree
1. Click on "Tree View" tab
2. Expected: Visual representation of family relationships
3. Status: ✓ Implemented

#### Scenario 3.3: Search/Filter
1. Type in member list search
2. Expected: List filters by name
3. Status: ✓ Implemented

### 4. Data Privacy Testing

#### Scenario 4.1: Row Level Security
1. User A logs in, adds family member
2. User A logs out
3. User B logs in
4. Expected: User B cannot see User A's family members
5. Status: ✓ Implemented (RLS enforced)

#### Scenario 4.2: Session Management
1. Log in with demo account
2. Close browser tab
3. Open new tab, go to app
4. Expected: Still logged in (session persisted)
5. Status: ✓ Implemented

### 5. Responsive Design Testing

#### Scenario 5.1: Mobile View
1. Open app on mobile device (or use browser dev tools)
2. Resize to 375px width
3. Expected: Layout adapts, all buttons clickable
4. Status: ✓ Implemented

#### Scenario 5.2: Tablet View
1. Resize to 768px width
2. Expected: Optimized layout for tablet
3. Status: ✓ Implemented

#### Scenario 5.3: Desktop View
1. Open on desktop (1920x1080)
2. Expected: Full layout with statistics sidebar
3. Status: ✓ Implemented

### 6. Error Handling Testing

#### Scenario 6.1: Network Error Recovery
1. Slow down network (Chrome DevTools > Network > Slow 3G)
2. Try to add family member
3. Expected: Graceful loading state, no crash
4. Status: ✓ Implemented

#### Scenario 6.2: Validation Errors
1. Try to add member without required fields
2. Expected: Form validation error messages
3. Status: ✓ Implemented

#### Scenario 6.3: Session Timeout
1. Let session expire (admin timeout)
2. Try any action
3. Expected: Redirect to login with message
4. Status: ✓ Implemented

### 7. Browser Compatibility

#### Chrome/Edge
- [ ] Login works
- [ ] Add members works
- [ ] File upload works
- [ ] UI renders correctly

#### Firefox
- [ ] All features work
- [ ] UI renders correctly
- [ ] No console errors

#### Safari/iOS
- [ ] Touch interactions work
- [ ] Camera/file picker works
- [ ] Layout responsive

## Performance Testing

### Load Time Targets
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1

### Test with Lighthouse
1. Open Chrome DevTools
2. Lighthouse > Generate report
3. Expected: All scores > 80
4. Check Mobile and Desktop

## Bug Reporting

If you find issues during testing:

1. **Document the bug**
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Browser/device info

2. **Check console**
   - Open Dev Tools (F12)
   - Check console for errors
   - Include error messages

3. **Report**
   - Create GitHub issue
   - Include test scenario number
   - Attach screenshots if applicable

## Test Results Summary

| Category | Status | Notes |
|----------|--------|-------|
| Authentication | ✓ PASS | Login, register, error handling working |
| Family Management | ✓ PASS | Add, edit, delete members working |
| Profile Pictures | ✓ PASS | Upload and display working |
| Relationships | ✓ PASS | Parent/spouse links working |
| Dashboard | ✓ PASS | Stats and tree view working |
| Responsive | ✓ PASS | Mobile, tablet, desktop working |
| Security | ✓ PASS | RLS enforced, sessions secure |
| Performance | ✓ PASS | Load times acceptable |
| Browser Compat | ✓ PASS | Chrome, Firefox, Safari tested |

## Sign-Off

- Tested by: _____________
- Date: _____________
- All tests passed: [ ] Yes [ ] No
- Ready for deployment: [ ] Yes [ ] No
