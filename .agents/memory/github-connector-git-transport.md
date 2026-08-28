---
name: GitHub connector and Git transport
description: Distinguishes GitHub connector REST authorization from local Git transport authentication.
---

The GitHub connector can authorize GitHub REST API calls without exposing credentials, but that authorization does not automatically authenticate the workspace's local `git push` command.

**Why:** An authorized connector successfully accessed GitHub REST endpoints while HTTPS Git pushes continued to fail for missing credentials. Large multi-file uploads through the connector proxy also proved unreliable.

**How to apply:** For branch pushes, prefer Replit's Git/version-control authentication flow. Use the connector for normal GitHub API operations, not as an assumed credential source for Git CLI transport.