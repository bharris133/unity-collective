# Contributing to Unity Collective

First off, thank you for considering contributing to the Unity Collective platform. It’s people like you that make this project a powerful tool for community empowerment. Your contributions are valuable and will help us build a stronger, more resilient platform for Black-owned businesses and community members.

This document provides a set of guidelines for contributing to the project. These are mostly guidelines, not strict rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by the [Unity Collective Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

There are many ways to contribute, from writing code and documentation to reporting bugs and suggesting new features.

### **Reporting Bugs**

If you find a bug, please ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/bharris133/unity-collective/issues). If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/bharris133/unity-collective/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample or an executable test case** demonstrating the expected behavior that is not occurring.

### **Suggesting Enhancements**

If you have an idea for a new feature or an enhancement to an existing one, please open an issue with the "enhancement" label. Provide a clear and detailed explanation of the feature, including why it would be beneficial to the platform and its users.

### **Your First Code Contribution**

Unsure where to begin contributing to Unity Collective? You can start by looking through these `good first issue` and `help wanted` issues:

-   **Good first issues** - issues which should only require a few lines of code, and a test or two.
-   **Help wanted issues** - issues which should be a bit more involved than `good first issue` issues.

## Pull Request Process

1.  **Fork the repository** and create your branch from `main`.
2.  **Set up your local environment** by following the `SETUP.md` guide.
3.  **Make your changes**. Ensure your code adheres to the coding standards outlined below.
4.  **Add tests** for your changes. We have a high standard for test coverage, and all new features must be accompanied by tests.
5.  **Ensure all tests pass** by running `pnpm test`.
6.  **Update the documentation**. If you've changed APIs, update the documentation.
7.  **Commit your changes** using a descriptive commit message.
8.  **Push your branch** to your fork and **submit a pull request** to the `main` branch of the Unity Collective repository.
9.  **Wait for review**. A maintainer will review your PR, provide feedback, and merge it if it meets the contribution guidelines.

## Coding Standards

### **General**

-   **Code Style**: We use Prettier for automatic code formatting. Please ensure you have it configured in your editor or run `pnpm format` before committing.
-   **Comments**: Write clear and concise comments to explain complex logic. Avoid redundant comments.

### **TypeScript**

-   **Use explicit types**. Avoid using `any` wherever possible.
-   **Define types** in the `src/types` directory and import them where needed.
-   **Use interfaces** for public APIs and type aliases for simpler types.

### **React**

-   **Functional Components**: Use functional components with hooks. Avoid class components.
-   **Component Design**: Keep components small and focused on a single responsibility. Extract complex logic into custom hooks.
-   **State Management**: Use React Context for global state and `useState` or `useReducer` for local component state.

### **Testing**

-   **Write tests for all new features**. Use React Testing Library to write tests that simulate user behavior.
-   **Aim for high test coverage**. Use `pnpm test --coverage` to check your coverage.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
