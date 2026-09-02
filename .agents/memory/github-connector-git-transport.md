---
name: GitHub connector and Git transport
description: Distinguishes GitHub connector REST authorization from local Git transport authentication.
---

The GitHub connector can authorize GitHub REST API calls without exposing credentials, but that authorization does not automatically authenticate the workspace's local `git push` command.

**Why:** An authorized connector successfully accessed GitHub REST endpoints while HTTPS Git pushes continued to fail for missing credentials. Large multi-file uploads through the connector proxy also proved unreliable.

**How to apply:** For branch pushes, prefer Replit's Git/version-control authentication flow. If Git CLI transport is unavailable but the GitHub connector is authorized, the Git database REST endpoints can publish a fast-forward commit by creating blobs, a tree, a commit, and updating the branch ref with force disabled.

If connector reads succeed but every connector write returns a Cloudflare block page for `replit.com`, treat it as an edge-layer transport block rather than an OAuth failure. Do not reauthorize; preserve the local commit and retry publishing later or use configured Git transport.

Binary uploads assembled from shell-command output can be silently truncated around 61 KB even when the command reports success. Verify remote byte sizes and image decoding; keep payloads below the boundary or use binary-safe Git transport.
