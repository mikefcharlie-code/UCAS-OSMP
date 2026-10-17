# Security Policy

The UCAS-OSMP team takes the security of autonomous, uncrewed, and unmanned systems seriously. Security vulnerabilities in flight control, telemetry streams, and fleet command interfaces can have critical safety and operational implications.

---

## 🔒 Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

### Preferred Reporting Method
If you discover a security issue or potential exploit, report it through **GitHub Private Vulnerability Reporting**:
1. Navigate to the [Security Advisories tab](https://github.com/mikefcharlie-code/UCAS-OSMP/security/advisories) of the repository.
2. Click **Report a vulnerability**.
3. Fill in the details, including reproduction steps, affected protocols/components, and impact assessment.

### Alternative Reporting
If private vulnerability reporting is unavailable, email the maintainer directly at:
- **Contact:** `mike.f.charlie@gmail.com`
- **Subject:** `[SECURITY] UCAS-OSMP Vulnerability Report - <Brief Summary>`

We will acknowledge receipt of your report within 48 hours and work with you to understand and address the issue responsibly.

---

## ⚠️ Sensitive Information to Avoid Posting Publicly

To protect operational safety and infrastructure, contributors must never post the following in public issues, PRs, comments, or commit history:

1. **Authentication & Credentials:**
   - API tokens, JWT secrets, OAuth client secrets, or gateway passwords.
   - Ground station access tokens and operator authorization keys.

2. **Live Flight & Telemetry Data:**
   - Real-time or private telemetry feeds containing sensitive operational routes, geofence coordinates, or vehicle identifiers.
   - Raw flight controller logs with embedded private network addresses, Wi-Fi/cellular credentials, or operator IDs.

3. **Active Exploit Details:**
   - Proof-of-concept (PoC) exploit scripts demonstrating link hijacking, remote flight controller takeover, or fail-safe bypasses before a patch has been coordinated.

4. **Network & Infrastructure Topologies:**
   - Internal IP addresses, private VPN configurations, or unsecured radio/datalink frequencies used in field operations.

---

## 🛡️ Scope & Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| `main`  | :white_check_mark: |

During Phase 1 (Architecture & Specification), security disclosures focus primarily on protocol design, authentication schemas, and initial interface implementations.
