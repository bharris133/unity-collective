# Unity Collective - Testing Guide

Comprehensive guide to testing the Unity Collective platform.

## 📋 Table of Contents

- [Overview](#overview)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Structure](#test-structure)
- [Testing Best Practices](#testing-best-practices)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

Unity Collective uses **Vitest** and **React Testing Library** for comprehensive testing.

### Test Coverage

- **112 tests** across 14 test files
- **100% pass rate** required before merging
- Tests cover:
  - React components
  - Context providers
  - TypeScript types
  - User interactions
  - Form validations

### Testing Stack

- **Vitest**: Fast unit test framework
- **React Testing Library**: Component testing
- **@testing-library/user-event**: User interaction simulation
- **jsdom**: DOM environment for tests

## 🚀 Running Tests

### Run All Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Run Specific Tests

```bash
# Run tests in a specific file
pnpm test src/__tests__/components/Navigation.test.tsx

# Run tests matching a pattern
pnpm test Navigation

# Run a specific test by name
pnpm test -t "should render navigation"
```

### Test Output

```
Test Files  14 passed (14)
Tests      112 passed (112)
Duration    6.04s
```

## ✍️ Writing Tests

### Component Test Template

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import YourComponent from '../../components/YourComponent';
import React from 'react';

// Mock dependencies
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    currentUser: { uid: 'test-user', displayName: 'Test User' },
    loading: false,
  })),
}));

describe('YourComponent', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render the component', () => {
    renderWithRouter(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    renderWithRouter(<YourComponent />);
    const button = screen.getByRole('button', { name: 'Click Me' });
    fireEvent.click(button);
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

### Context Test Template

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { YourProvider, useYour } from '../../contexts/YourContext';
import React from 'react';

describe('YourContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <YourProvider>{children}</YourProvider>
  );

  it('should provide initial state', () => {
    const { result } = renderHook(() => useYour(), { wrapper });
    expect(result.current.data).toEqual([]);
  });

  it('should update state', () => {
    const { result } = renderHook(() => useYour(), { wrapper });
    
    act(() => {
      result.current.addItem('test');
    });

    expect(result.current.data).toContain('test');
  });
});
```

### Type Test Template

```typescript
import { describe, it, expect } from 'vitest';
import type { YourType } from '../../types';

describe('YourType', () => {
  it('should have required properties', () => {
    const obj: YourType = {
      id: '1',
      name: 'Test',
      // ... other required properties
    };

    expect(obj.id).toBeDefined();
    expect(obj.name).toBeDefined();
  });
});
```

## 📁 Test Structure

### Directory Organization

```
src/
├── __tests__/
│   ├── components/          # Component tests
│   │   ├── Navigation.test.tsx
│   │   ├── VendorStorefront.test.tsx
│   │   └── ProductDetail.test.tsx
│   ├── contexts/            # Context tests
│   │   ├── AuthContext.test.tsx
│   │   └── MarketplaceContext.test.tsx
│   └── types/               # Type tests
│       └── types.test.ts
└── test/
    ├── setup.ts             # Test setup and globals
    └── test-utils.tsx       # Shared test utilities
```

### Test Naming Conventions

- Test files: `ComponentName.test.tsx`
- Test suites: `describe('ComponentName', () => {})`
- Test cases: `it('should do something', () => {})`

## 🎯 Testing Best Practices

### 1. Test User Behavior, Not Implementation

**❌ Bad:**
```typescript
expect(component.state.count).toBe(1);
```

**✅ Good:**
```typescript
expect(screen.getByText('Count: 1')).toBeInTheDocument();
```

### 2. Use Semantic Queries

**Priority order:**
1. `getByRole` - Best for accessibility
2. `getByLabelText` - Good for forms
3. `getByPlaceholderText` - For inputs
4. `getByText` - For non-interactive content
5. `getByTestId` - Last resort

**Example:**
```typescript
// ✅ Good
const button = screen.getByRole('button', { name: 'Submit' });

// ❌ Avoid
const button = screen.getByTestId('submit-button');
```

### 3. Mock External Dependencies

```typescript
// Mock Firebase
vi.mock('../firebase', () => ({
  auth: { currentUser: null },
  db: {},
}));

// Mock contexts
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({ currentUser: null })),
}));
```

### 4. Test Async Behavior

```typescript
it('should load data asynchronously', async () => {
  render(<Component />);
  
  // Wait for element to appear
  const element = await screen.findByText('Loaded Data');
  expect(element).toBeInTheDocument();
});
```

### 5. Test Error States

```typescript
it('should display error message on failure', async () => {
  // Mock API to return error
  vi.mocked(fetchData).mockRejectedValueOnce(new Error('Failed'));
  
  render(<Component />);
  
  const error = await screen.findByText('Failed to load data');
  expect(error).toBeInTheDocument();
});
```

### 6. Clean Up After Tests

```typescript
import { beforeEach, afterEach } from 'vitest';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.clearAllMocks();
});
```

## 🔄 CI/CD Integration

### GitHub Actions Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install pnpm
      run: npm install -g pnpm
      
    - name: Install dependencies
      run: pnpm install
      
    - name: Run tests
      run: pnpm test
      
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/coverage-final.json
```

### Pre-commit Hook

Install Husky for pre-commit testing:

```bash
pnpm add -D husky

# Initialize husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "pnpm test"
```

## 🐛 Troubleshooting

### Tests Timing Out

Increase timeout in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    testTimeout: 10000, // 10 seconds
  },
});
```

### Mock Not Working

Ensure mocks are defined before imports:

```typescript
// ✅ Correct order
vi.mock('./module');
import { Component } from './Component';

// ❌ Wrong order
import { Component } from './Component';
vi.mock('./module');
```

### "Cannot find module" Errors

Check `vitest.config.ts` resolve aliases:

```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

### Tests Pass Locally But Fail in CI

- Check Node.js version matches
- Ensure all dependencies are in `package.json`
- Clear cache: `pnpm store prune`

### Flaky Tests

Avoid:
- Hardcoded timeouts
- Relying on execution order
- Testing implementation details

Use:
- `waitFor` for async operations
- `findBy` queries for async elements
- Proper cleanup in `afterEach`

## 📊 Coverage Reports

### Generate Coverage Report

```bash
pnpm test:coverage
```

### View Coverage Report

```bash
# Open HTML report
open coverage/index.html
```

### Coverage Goals

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## 🎓 Testing Checklist

Before submitting a PR:

- [ ] All tests pass locally
- [ ] New features have tests
- [ ] Edge cases are tested
- [ ] Error states are tested
- [ ] Async operations are tested
- [ ] No console errors or warnings
- [ ] Coverage meets requirements
- [ ] Tests are documented

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## ✅ Quick Reference

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage

# Specific file
pnpm test Navigation

# Update snapshots
pnpm test -u

# Debug tests
pnpm test --inspect-brk
```

**Happy Testing! 🧪**
