# Unity Collective - Documentation

Welcome to the Unity Collective documentation! This directory contains comprehensive guides for setting up, developing, testing, and deploying the platform.

> **New agents and technical collaborators:** Start with the current [`handoff/README.md`](handoff/README.md) and read [`Guidelines.md`](Guidelines.md) before changing code. The handoff package is the current operational source for setup, Firebase operations, testing, deployment, and backlog. See [`HISTORICAL_DOCUMENTATION.md`](HISTORICAL_DOCUMENTATION.md) before relying on older mock-data, phase, testing, deployment, or planning material.

## 📚 Documentation Structure

### **Current Cross-Agent Handoff**

| Document | Description |
|----------|-------------|
| [Handoff Package](handoff/README.md) | Current reading order, project state, architecture, setup, Firebase operations, testing, deployment, agent instructions, and backlog |
| [Guidelines.md](Guidelines.md) | **Mandatory** coding and decision-making standard before any change |
| [Handoff Acceptance Checklist](handoff/HANDOFF_ACCEPTANCE_CHECKLIST.md) | Objective validation that a collaborator or coding agent can take over safely |
| [Historical Documentation Guide](HISTORICAL_DOCUMENTATION.md) | Explains which older documents are context only and points to their current operational replacements |

### **Setup & Installation**

Getting started with the Unity Collective platform.

| Document | Description |
|----------|-------------|
| [SETUP_CHECKLIST.md](setup/SETUP_CHECKLIST.md) | Quick setup verification checklist |
| [TROUBLESHOOTING.md](setup/TROUBLESHOOTING.md) | Common issues and solutions |

### **Development**

Guides for developing features and understanding the codebase.

| Document | Description |
|----------|-------------|
| [DEVELOPER_GUIDE.md](development/DEVELOPER_GUIDE.md) | Code structure and feature development guide |
| [CONTRIBUTING.md](development/CONTRIBUTING.md) | Guidelines for contributors |
| [DATA_SOURCE_SWITCHING_GUIDE.md](development/DATA_SOURCE_SWITCHING_GUIDE.md) | Switch between mock and Firebase data |
| [FIREBASE_SETUP_GUIDE.md](development/FIREBASE_SETUP_GUIDE.md) | Complete Firebase configuration |
| [ESLINT_GUIDE.md](development/ESLINT_GUIDE.md) | Code quality and linting best practices |
| [MOCK_DATA_PACKAGE_SUMMARY.md](development/MOCK_DATA_PACKAGE_SUMMARY.md) | Centralized mock data system overview |
| [DATA_SWITCHING_SUMMARY.md](development/DATA_SWITCHING_SUMMARY.md) | Data source switching implementation |
| [AUTOMATED_TESTING_SUMMARY.md](development/AUTOMATED_TESTING_SUMMARY.md) | Testing infrastructure overview |

### **Testing**

Testing strategies and automated test suites.

| Document | Description |
|----------|-------------|
| [TESTING_GUIDE.md](testing/TESTING_GUIDE.md) | Unit testing framework and best practices |
| [AUTOMATED_TESTING_GUIDE.md](testing/AUTOMATED_TESTING_GUIDE.md) | End-to-end testing with Playwright |
| [VISUAL_REVIEW_CHECKLIST.md](testing/VISUAL_REVIEW_CHECKLIST.md) | Manual visual review checklist |
| [TESTING_PROCEDURES_GUIDE.md](testing/TESTING_PROCEDURES_GUIDE.md) | Comprehensive testing procedures |
| [MOCK_AUTHENTICATION_GUIDE.md](testing/MOCK_AUTHENTICATION_GUIDE.md) | Test with different user roles |

### **Deployment**

Production deployment and infrastructure.

| Document | Description |
|----------|-------------|
| [DEPLOYMENT_PROCEDURES_GUIDE.md](deployment/DEPLOYMENT_PROCEDURES_GUIDE.md) | Complete deployment procedures |
| [DEPLOYMENT_GUIDE.md](deployment/DEPLOYMENT_GUIDE.md) | Production deployment instructions |

### **Architecture**

Technical architecture and API documentation.

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](architecture/ARCHITECTURE.md) | System architecture and design |
| [API_DOCUMENTATION.md](architecture/API_DOCUMENTATION.md) | Firebase Cloud Functions API reference |
| [architecture.png](architecture/architecture.png) | Architecture diagram (visual) |
| [architecture.mmd](architecture/architecture.mmd) | Architecture diagram (Mermaid source) |

### **Features**

Individual feature documentation following the agent priming standard.

| Document | Description |
|----------|-------------|
| [Features Index](features/README.md) | Complete list of feature documentation |
| [Authentication](features/authentication.md) | User authentication and authorization |
| [Business Directory](features/business-directory.md) | Business listing and search |
| [Marketplace](features/marketplace.md) | Product listing and shopping |
| [Shopping Cart](features/shopping-cart.md) | Cart management and checkout |
| [Community Offers](features/community-offers.md) | Offers and barter system |
| [Private Messaging](features/private-messaging.md) | User-to-user messaging |
| [Favorites](features/favorites.md) | Favorite businesses and products |
| [Events](features/events.md) | Community events calendar |
| [Community Hub](features/community-hub.md) | Community engagement features |
| [Homepage](features/homepage.md) | Landing page and Five Pillars |

### **Refactoring**

Code refactoring documentation and implementation summaries.

| Document | Description |
|----------|-------------|
| [Refactoring Index](refactoring/README.md) | Overview of refactoring efforts |
| [REFACTORING_RECOMMENDATIONS.md](refactoring/REFACTORING_RECOMMENDATIONS.md) | Original refactoring recommendations |
| [COMPONENTIZE_APP_JSX_PLAN.md](refactoring/COMPONENTIZE_APP_JSX_PLAN.md) | App.jsx componentization plan |
| [DATA_SERVICE_LAYER_DRAFT.md](refactoring/DATA_SERVICE_LAYER_DRAFT.md) | Data service abstraction architecture |
| [REFACTORING_IMPLEMENTATION_SUMMARY.md](refactoring/REFACTORING_IMPLEMENTATION_SUMMARY.md) | Implementation results and metrics |

### **Project Management**

Project status, summaries, and review checklists.

| Document | Description |
|----------|-------------|
| [Project Management Index](project-management/README.md) | Overview of project management docs |
| [UNITY_COLLECTIVE_STATUS_REPORT.md](project-management/UNITY_COLLECTIVE_STATUS_REPORT.md) | Current project status |
| [UNITY_COLLECTIVE_FINAL_SUMMARY.md](project-management/UNITY_COLLECTIVE_FINAL_SUMMARY.md) | Major milestones and achievements |
| [VISUAL_REVIEW_CHECKLIST_SUMMARY.md](project-management/VISUAL_REVIEW_CHECKLIST_SUMMARY.md) | Visual review checklist |

### **Internal**

Internal documentation for agent handoffs and process documentation.

| Document | Description |
|----------|-------------|
| [Internal Docs Index](internal/README.md) | Overview of internal documentation |
| [AGENT_HANDOFF_BRIEFING.md](internal/AGENT_HANDOFF_BRIEFING.md) | Agent/developer handoff briefing |
| [DOCUMENTATION_ORGANIZATION_SUMMARY.md](internal/DOCUMENTATION_ORGANIZATION_SUMMARY.md) | Documentation structure overview |
| [DOCUMENTATION_PACKAGE_SUMMARY.md](internal/DOCUMENTATION_PACKAGE_SUMMARY.md) | Complete documentation package |
| [FEATURE_DOCUMENTATION_SUMMARY.md](internal/FEATURE_DOCUMENTATION_SUMMARY.md) | Feature documentation system |
| [DOCS_README_ANALYSIS.md](internal/DOCS_README_ANALYSIS.md) | Documentation analysis and recommendations |

### **Project History**

Version history and future plans.

| Document | Description |
|----------|-------------|
| [CHANGELOG.md](CHANGELOG.md) | Version history and release notes |
| [ROADMAP.md](ROADMAP.md) | Future features and development plans |

---

## 🚀 Quick Start

1.  **New to the project or joining as an agent?** Start with [Handoff Package](handoff/README.md), then read [Guidelines.md](Guidelines.md).
2.  **Ready to develop?** Read the [Agent Operating Guide](handoff/AGENT_OPERATING_GUIDE.md), then consult historical development references only as needed.
3.  **Want to contribute?** Check [CONTRIBUTING.md](development/CONTRIBUTING.md) together with the current handoff package.
4.  **Need to test?** See [Testing and Quality](handoff/TESTING_AND_QUALITY.md) first, then historical testing guides as needed.
5.  **Deploying to production?** Follow [Deployment and Rollback](handoff/DEPLOYMENT_AND_ROLLBACK.md).
6.  **Understanding refactoring?** Check [Refactoring Index](refactoring/README.md)

---

## 🔍 Finding What You Need

### **I want to...**

-   **Set up my local environment** → [Local Setup](handoff/LOCAL_SETUP.md)
-   **Understand the code structure** → [DEVELOPER_GUIDE.md](development/DEVELOPER_GUIDE.md)
-   **Add a new feature** → [DEVELOPER_GUIDE.md](development/DEVELOPER_GUIDE.md)
-   **Use mock data for development** → [Local Setup](handoff/LOCAL_SETUP.md), then [DATA_SOURCE_SWITCHING_GUIDE.md](development/DATA_SOURCE_SWITCHING_GUIDE.md) for historical implementation context
-   **Switch between mock and Firebase** → [DATA_SOURCE_SWITCHING_GUIDE.md](development/DATA_SOURCE_SWITCHING_GUIDE.md)
-   **Run tests** → [Testing and Quality](handoff/TESTING_AND_QUALITY.md); consult historical testing guides only for background
-   **Verify UI components** → [VISUAL_REVIEW_CHECKLIST.md](testing/VISUAL_REVIEW_CHECKLIST.md)
-   **Deploy to production** → [Deployment and Rollback](handoff/DEPLOYMENT_AND_ROLLBACK.md)
-   **Understand the architecture** → [ARCHITECTURE.md](architecture/ARCHITECTURE.md)
-   **Learn about the API** → [API_DOCUMENTATION.md](architecture/API_DOCUMENTATION.md)
-   **See what's changed** → [CHANGELOG.md](CHANGELOG.md)
-   **See what's coming** → [Current State](handoff/CURRENT_STATE.md) and [Backlog](handoff/BACKLOG_AND_KNOWN_ISSUES.md); [ROADMAP.md](ROADMAP.md) is historical planning context
-   **Fix a problem** → [TROUBLESHOOTING.md](setup/TROUBLESHOOTING.md)
-   **Review refactoring work** → [Refactoring Index](refactoring/README.md)
-   **Check project status** → [Project Management Index](project-management/README.md)
-   **Learn about specific features** → [Features Index](features/README.md)

---

## 📖 Documentation Standards

All documentation in this directory follows these standards:

-   **Markdown format** for easy reading and version control
-   **Clear headings** for easy navigation
-   **Code examples** where applicable
-   **Tables** for organizing information
-   **Step-by-step instructions** for procedures
-   **Links** to related documentation

---

## 🤝 Contributing to Documentation

Found an error or want to improve the documentation? Please:

1.  Read [CONTRIBUTING.md](development/CONTRIBUTING.md)
2.  Make your changes
3.  Submit a pull request

---

✊🏿 **Unity, Strength, Empowerment.**
