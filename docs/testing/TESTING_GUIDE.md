# Unity Collective - Testing Guide

This guide provides instructions and best practices for running and writing tests for the Unity Collective platform. A robust testing strategy is crucial for maintaining code quality, preventing regressions, and ensuring a reliable user experience.

## 1. Testing Framework

The project uses **[Vitest](https://vitest.dev/)**, a blazing-fast unit-test framework powered by Vite. For component testing, we use **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)**, which encourages writing tests that resemble how users interact with the application.

### **Key Principles:**

- **Test user behavior, not implementation details.** Instead of testing component state or internal methods, we test what the user sees and does.
- **Write accessible queries.** We use queries that find elements the way users would, such as by role, label text, or placeholder text.
- **Maintain high test coverage.** All new features and components should be accompanied by corresponding tests.

## 2. Running Tests

We have a comprehensive suite of 112 tests covering components, contexts, and type definitions. To run the entire test suite, use the following command from the project root:

```bash
pnpm test
```

This will execute all files ending in `.test.tsx` or `.test.ts` located in the `src/__tests__` directory.

### **Running Tests in Watch Mode**

For a better development experience, you can run tests in watch mode. This will automatically re-run tests whenever you save a file:

```bash
pnpm test --watch
```

### **Viewing Test Coverage**

To generate a report of your test coverage, run:

```bash
pnpm test --coverage
```

This will create a `coverage` directory with an HTML report that you can open in your browser to see which parts of your code are covered by tests.

## 3. Writing New Tests

When adding new features or components, you must also add corresponding tests. Follow the structure below for creating new test files.

### **File Naming and Location**

- All test files should be located in `src/__tests__/`.
- Test files should be named after the component they are testing, with the `.test.tsx` extension. For example, a test for `MyComponent.tsx` should be named `MyComponent.test.tsx`.

### **Example: Testing a Simple Component**

Here is an example of a basic test for a hypothetical `Greeting.tsx` component:

**`src/components/Greeting.tsx`**
```tsx
import React from 'react';

const Greeting = ({ name }) => {
  return <h1>Hello, {name}!</h1>;
};

export default Greeting;
```

**`src/__tests__/components/Greeting.test.tsx`**
```tsx
import { render, screen } from '@testing-library/react';
import Greeting from '../../components/Greeting';
import { describe, it, expect } from 'vitest';

describe('Greeting Component', () => {
  it('renders a greeting with the provided name', () => {
    // 1. Render the component
    render(<Greeting name="Community" />);

    // 2. Find the element on the screen
    const headingElement = screen.getByRole('heading', {
      name: /Hello, Community!/i,
    });

    // 3. Assert that the element is in the document
    expect(headingElement).toBeInTheDocument();
  });
});
```

### **Testing User Interactions**

To test user interactions like clicks or form inputs, use the `user-event` library, which is pre-configured in our test setup.

**Example: Testing a Counter Button**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from '../../components/Counter';
import { describe, it, expect } from 'vitest';

describe('Counter Component', () => {
  it('increments the count when the button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    // Initial state
    const countElement = screen.getByText(/Count: 0/i);
    expect(countElement).toBeInTheDocument();

    // Find and click the button
    const button = screen.getByRole('button', { name: /Increment/i });
    await user.click(button);

    // Assert the new state
    const updatedCountElement = screen.getByText(/Count: 1/i);
    expect(updatedCountElement).toBeInTheDocument();
  });
});
```

## 4. Mocking and Contexts

### **Mocking API Calls**

For components that fetch data, you should mock the API calls to avoid making real network requests in your tests. We use `msw` (Mock Service Worker) for this purpose.

### **Testing with React Contexts**

When testing a component that consumes a React Context (e.g., `AuthContext`, `MarketplaceContext`), you must wrap the component in the corresponding `Provider` in your test file. Provide mock values to simulate different states (e.g., logged-in vs. logged-out user).

**Example: Testing a component that uses `AuthContext`**

```tsx
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../../contexts/AuthContext';
import Profile from '../../components/Profile';
import { describe, it, expect } from 'vitest';

describe('Profile Component', () => {
  it('shows the user name when logged in', () => {
    const mockUser = { uid: '123', email: 'test@example.com', name: 'Test User' };

    render(
      <AuthProvider value={{ currentUser: mockUser }}>
        <Profile />
      </AuthProvider>
    );

    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
  });

  it('shows a sign-in button when logged out', () => {
    render(
      <AuthProvider value={{ currentUser: null }}>
        <Profile />
      </AuthProvider>
    );

    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });
});
```

---

By following these guidelines, you will help maintain the quality and stability of the Unity Collective platform. Thank you for your contributions! ✊🏿
