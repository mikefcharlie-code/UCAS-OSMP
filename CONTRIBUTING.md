# Contributing to UCAS-OSMP

Thank you for your interest in contributing to the **Uncrewed & Unmanned Aircraft Open Source Management Platform (UCAS-OSMP)**! 

Whether you are designing telemetry schemas, implementing ground control interfaces, or integrating hardware protocols (MAVLink, ROS 2), your contributions are welcome.

---

## 📌 Project Status

UCAS-OSMP is currently in the **Architecture & Specification Phase (Phase 1)**:
- Core telemetry data models and interface boundaries are being finalized.
- We are actively gathering feedback from drone operators, robotics researchers, and software engineers on key requirements.
- Large architectural changes and Requests for Comments (RFCs) are especially encouraged at this stage before implementation locks down.

---

## 💡 How to Propose Features & RFCs

Before writing significant code, please propose your idea so the community can discuss architecture and design trade-offs:

1. **Check Existing Discussions & Issues**: Search open and closed issues/discussions to verify your proposal has not already been addressed.
2. **Open an Issue / Feature Request**:
   - Use a clear and descriptive title (e.g., `[RFC] Telemetry Ingestion Layer via WebSockets`).
   - Describe the problem, user story, or operational gap.
   - Outline the proposed technical solution and alternatives considered.
   - Note any impacts on hardware compatibility (e.g., PX4, ArduPilot) or protocol performance.

---

## 🔄 Issue & Pull Request Workflow

### 1. Issues & Bug Reports
- Open a GitHub Issue for bugs, feature requests, or documentation improvements.
- Provide reproduction steps, environment details (OS, flight controller model, simulation setup), and expected vs. actual behavior.

### 2. Branching Convention
Create a branch off `main` using standard prefixes:
- `feature/<feature-name>` for new capabilities
- `fix/<bug-name>` for bug fixes
- `docs/<topic>` for documentation updates
- `rfc/<proposal-name>` for architecture proposals and specs

### 3. Commit Guidelines
We follow conventional commit formatting:
- `feat: <description>` (e.g., `feat: add MAVLink message parser for battery status`)
- `fix: <description>` (e.g., `fix: resolve coordinate transform jitter in 3D visualizer`)
- `docs: <description>` (e.g., `docs: update flight safety protocol guidelines`)
- `refactor: <description>`

Keep commit messages concise and imperative.

### 4. Pull Request (PR) Checklist
When opening a Pull Request:
1. Ensure your branch is rebased on the latest `main`.
2. Reference related issue(s) (e.g., `Closes #12`).
3. Include a concise summary of changes and verification steps (unit tests, simulation logs, or manual tests).
4. Verify all automated CI checks and linting pass.
5. Request review from maintainers. We aim to review PRs promptly and constructively.

---

## ⚖️ Code of Conduct & Open Collaboration
We are committed to providing a respectful, harassment-free environment for all contributors. Please communicate constructively and treat fellow contributors with respect.
