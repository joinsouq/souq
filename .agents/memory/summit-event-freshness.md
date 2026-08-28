---
name: Summit event freshness
description: Cache and compatibility guidance for the public Summit event details.
---

Public Summit details should be delivered fresh when event information changes, and the page should remain safe if a visitor momentarily receives an older payload.

**Why:** Event logistics can change close to the event date; cached data can otherwise leave the interface showing stale details or fail when the page expects a newly added field.

**How to apply:** Keep the public event response uncached for the browser and guard newly introduced optional content until the corresponding data is present.