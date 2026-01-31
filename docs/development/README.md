# Development Documentation

This directory contains development guides, data management strategies, and testing documentation for the Unity Collective platform.

## Documents

### [MOCK_DATA_PACKAGE_SUMMARY.md](./MOCK_DATA_PACKAGE_SUMMARY.md)
Comprehensive guide to the centralized mock data system. Includes:
- Mock data structure and organization
- Available mock data modules (businesses, products, offers, events, messages, stats)
- How to use mock data in components
- File locations and structure

### [DATA_SWITCHING_SUMMARY.md](./DATA_SWITCHING_SUMMARY.md)
Guide for switching between mock data and Firebase data sources. Covers:
- Environment variable configuration
- Data source switching mechanism
- Development vs. production workflows
- Testing strategies

### [AUTOMATED_TESTING_SUMMARY.md](./AUTOMATED_TESTING_SUMMARY.md)
Overview of the automated testing infrastructure. Includes:
- Unit testing with Vitest
- End-to-end testing with Playwright
- Test coverage and results
- Running tests locally and in CI/CD

## Related Documentation

- [Features Documentation](../features/) - Individual feature documentation
- [Refactoring Documentation](../refactoring/) - Code refactoring efforts
- [Project Management](../project-management/) - Project status and summaries

## Quick Start

### Using Mock Data
```bash
# Set environment variable
export VITE_USE_MOCK_DATA=true

# Start development server
pnpm run dev
```

### Running Tests
```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e
```

---

*Last Updated: January 30, 2026*
