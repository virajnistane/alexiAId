# Access Token Creation - Usage Guide

This guide explains how to create and use Scenario Access Tokens (SAT) for embedding private ToughTongue AI scenarios.

## Overview

Access tokens allow you to securely embed private scenarios in iframes with short-lived credentials (1-24 hours).

## Backend API (Server-Side)

### 1. Import the Client

```typescript
import { createAccessToken } from "@/app/api/ttai/client";
```

### 2. Create an Access Token

```typescript
const token = await createAccessToken({
  scenario_id: "scenario_abc123",
  duration_hours: 4, // Optional: 1-24 hours, default is 1
  email: "user@example.com", // Optional: for org context use *@ORG-ID.toughtongueai.com
});

console.log(token);
// {
//   access_token: "sat_xxxxxx",
//   expires_at: "2024-01-15T14:30:00Z",
//   scenario_id: "scenario_abc123"
// }
```

## Frontend API Route

### POST /api/access-token

Create a short-lived access token for embedding scenarios.

**Request Body:**
```json
{
  "scenario_id": "scenario_abc123",
  "duration_hours": 4,
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "access_token": "sat_xxxxxx",
  "expires_at": "2024-01-15T14:30:00Z",
  "scenario_id": "scenario_abc123"
}
```

**Example Usage:**

```typescript
const response = await fetch("/api/access-token", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    scenario_id: "scenario_abc123",
    duration_hours: 4,
  }),
});

const token = await response.json();
```

## Using Access Tokens in Embed URLs

### Option 1: Using buildEmbedUrl Helper

```typescript
import { buildEmbedUrl } from "@/lib/ttai/client";

// Create token first (via API route)
const tokenResponse = await fetch("/api/access-token", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ scenario_id: "scenario_abc123" }),
});
const { access_token } = await tokenResponse.json();

// Build embed URL with token
const embedUrl = buildEmbedUrl({
  scenarioId: "scenario_abc123",
  accessToken: access_token,
  background: "black",
  userName: "John Doe",
});

// Use in iframe
<iframe src={embedUrl} />
```

### Option 2: Direct URL Construction

```typescript
const url = `https://embed.toughtongueai.com/scenario_abc123?sat=${access_token}&bg=black&userName=John`;
```

## Parameters

### createAccessToken Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `scenario_id` | string | ✅ Yes | - | The scenario ID to create token for |
| `duration_hours` | number | ❌ No | 1 | Token validity (1-24 hours) |
| `email` | string | ❌ No | - | User email (for org context: `*@ORG-ID.toughtongueai.com`) |

### buildEmbedUrl Options

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `scenarioId` | string | ✅ Yes | The scenario ID |
| `accessToken` | string | ❌ No | Scenario Access Token (SAT) |
| `background` | string | ❌ No | "black", "white", or "transparent" |
| `userName` | string | ❌ No | User's display name |
| `userEmail` | string | ❌ No | User's email |
| `promptUserInfo` | boolean | ❌ No | Prompt for user info if userName not provided |
| `dynamicVariables` | object | ❌ No | Dynamic variables for scenario |

## Use Cases

### 1. Private Scenario Access
```typescript
// For users who need temporary access to private scenarios
const token = await createAccessToken({
  scenario_id: "private_scenario_123",
  duration_hours: 8,
});
```

### 2. Organization Context
```typescript
// For organization-specific scenarios
const token = await createAccessToken({
  scenario_id: "org_scenario_456",
  duration_hours: 12,
  email: "*@myorg-id.toughtongueai.com",
});
```

### 3. Time-Limited Access
```typescript
// For demos or trial sessions
const token = await createAccessToken({
  scenario_id: "demo_scenario_789",
  duration_hours: 1, // Expires in 1 hour
});
```

## Best Practices

1. **Token Expiration**: Choose appropriate duration based on use case
   - Short sessions (demos): 1-2 hours
   - Full sessions (coaching): 4-8 hours
   - Extended access (multi-day): 24 hours

2. **Security**:
   - Always create tokens server-side
   - Don't expose your API key to the client
   - Tokens are short-lived by design

3. **Error Handling**:
   ```typescript
   try {
     const token = await createAccessToken({ scenario_id: "abc123" });
   } catch (error) {
     console.error("Failed to create token:", error);
     // Handle error appropriately
   }
   ```

4. **Token Reuse**:
   - Cache tokens until expiration
   - Create new tokens when needed
   - Don't create multiple tokens for the same scenario unnecessarily

## Example: Complete Flow

```typescript
"use client";

import { useState, useEffect } from "react";
import { buildEmbedUrl } from "@/lib/ttai/client";

export function PrivateScenarioEmbed({ scenarioId }: { scenarioId: string }) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function createToken() {
      try {
        const response = await fetch("/api/access-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenario_id: scenarioId,
            duration_hours: 4,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create access token");
        }

        const { access_token } = await response.json();

        const url = buildEmbedUrl({
          scenarioId,
          accessToken: access_token,
          background: "black",
        });

        setEmbedUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }

    createToken();
  }, [scenarioId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!embedUrl) {
    return <div>Loading...</div>;
  }

  return (
    <iframe
      src={embedUrl}
      className="w-full h-screen"
      allow="microphone"
    />
  );
}
```

## API Reference

For more details, see the official documentation:
https://docs.toughtongueai.com/api-reference/endpoints/utilities/create-access-token
