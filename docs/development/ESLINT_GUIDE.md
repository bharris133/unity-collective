# ESLint Configuration Guide

**Date**: January 30, 2026  
**Repository**: https://github.com/bharris133/unity-collective  
**Status**: ✅ Configured with TypeScript Best Practices

---

## 1. Overview

Unity Collective uses ESLint with TypeScript support to maintain code quality and consistency across the codebase. This guide explains the ESLint configuration and best practices.

---

## 2. Configuration

### **ESLint Setup**

The project uses the flat config format (`eslint.config.js`) with the following plugins:

- **@eslint/js** - Core ESLint recommended rules
- **typescript-eslint** - TypeScript-specific linting
- **eslint-plugin-react-hooks** - React Hooks rules
- **eslint-plugin-react-refresh** - React Fast Refresh rules

### **Key Features**

✅ **TypeScript Support** - Full TypeScript linting with type-aware rules  
✅ **React Support** - React Hooks and Fast Refresh validation  
✅ **Flexible** - Warnings instead of errors for better developer experience  
✅ **Comprehensive** - Covers JavaScript, TypeScript, and JSX/TSX files  

---

## 3. Running ESLint

### **Check for Issues**

```bash
pnpm lint
```

This command will check all files and report errors and warnings.

### **Auto-Fix Issues**

```bash
pnpm lint --fix
```

This will automatically fix issues that can be safely corrected.

---

## 4. Rules Configuration

### **TypeScript Rules**

| Rule | Level | Description |
|------|-------|-------------|
| `@typescript-eslint/no-unused-vars` | warn | Warns about unused variables (allows `_` prefix) |
| `@typescript-eslint/no-explicit-any` | warn | Warns when using `any` type |
| `@typescript-eslint/no-non-null-assertion` | warn | Warns about non-null assertions (`!`) |
| `@typescript-eslint/no-empty-function` | warn | Warns about empty functions |

### **React Rules**

| Rule | Level | Description |
|------|-------|-------------|
| `react-hooks/rules-of-hooks` | error | Enforces Rules of Hooks |
| `react-hooks/exhaustive-deps` | warn | Checks effect dependencies |
| `react-refresh/only-export-components` | warn | Ensures Fast Refresh compatibility |

### **General Rules**

| Rule | Level | Description |
|------|-------|-------------|
| `no-var` | error | Disallows `var`, requires `let` or `const` |
| `prefer-const` | warn | Prefers `const` for variables that aren't reassigned |
| `eqeqeq` | warn | Requires `===` and `!==` instead of `==` and `!=` |
| `no-console` | off | Allows console statements for development |

---

## 5. Ignored Files

The following files and directories are excluded from linting:

- `dist/` - Build output
- `node_modules/` - Dependencies
- `*.config.js` - Configuration files
- `*.config.ts` - TypeScript configuration files
- `tests/e2e/**` - End-to-end tests
- `functions/**` - Firebase Cloud Functions

---

## 6. Best Practices

### **Unused Variables**

Prefix unused variables with underscore to suppress warnings:

```typescript
// ❌ Warning: unused variable
const handleClick = (event) => {
  console.log('clicked');
};

// ✅ No warning
const handleClick = (_event) => {
  console.log('clicked');
};
```

### **Type Safety**

Avoid using `any` type when possible:

```typescript
// ❌ Warning: explicit any
const data: any = fetchData();

// ✅ Better: use proper types
const data: UserData = fetchData();

// ✅ Or: use unknown for truly unknown types
const data: unknown = fetchData();
```

### **React Hooks**

Always follow the Rules of Hooks:

```typescript
// ❌ Error: conditional hook
if (condition) {
  useEffect(() => {}, []);
}

// ✅ Correct: hooks at top level
useEffect(() => {
  if (condition) {
    // ...
  }
}, [condition]);
```

### **Import Organization**

Keep imports organized:

```typescript
// ✅ Good: organized imports
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import type { User } from '../types';
```

---

## 7. Fixing Common Issues

### **Unused Imports**

Remove imports that aren't used:

```typescript
// ❌ Warning: unused import
import { useState, useEffect, useMemo } from 'react';

function Component() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}

// ✅ Fixed: only import what's used
import { useState } from 'react';

function Component() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

### **Missing Dependencies**

Add missing dependencies to useEffect:

```typescript
// ❌ Warning: missing dependency
useEffect(() => {
  fetchData(userId);
}, []);

// ✅ Fixed: include userId
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

---

## 8. IDE Integration

### **VS Code**

Install the ESLint extension:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "ESLint"
4. Install the official ESLint extension

The extension will automatically lint your code as you type and show errors/warnings inline.

### **Enable Auto-Fix on Save**

Add to your VS Code settings (`.vscode/settings.json`):

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## 9. Continuous Integration

ESLint runs automatically in CI/CD pipelines. All code must pass linting before being merged.

### **GitHub Actions**

The lint check runs on every pull request:

```yaml
- name: Lint
  run: pnpm lint
```

---

## 10. Troubleshooting

### **"Parsing error" for config files**

Config files (`.config.ts`, `.config.js`) are intentionally excluded from linting. This is normal.

### **Too many warnings**

Warnings are informational and don't block development. Fix them gradually as you work on files.

### **ESLint not working in IDE**

1. Restart your IDE
2. Run `pnpm install` to ensure dependencies are installed
3. Check that the ESLint extension is enabled

---

This guide ensures consistent code quality across the Unity Collective project. For questions or suggestions, please open an issue on GitHub.
