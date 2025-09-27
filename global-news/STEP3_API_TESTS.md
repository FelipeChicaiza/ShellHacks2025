# Step 3 API Test Commands

Test these endpoints to verify Step 3 is working:

## Test Agent Status

```bash
curl http://localhost:3000/api/agents
```

## Test News Processing

```bash
curl http://localhost:3000/api/news
```

## Test Specific City News

```bash
curl "http://localhost:3000/api/news?city=miami&limit=5"
```

## Trigger News Processing

```bash
curl -X POST http://localhost:3000/api/news
```

## Expected Responses

### /api/agents

```json
{
  "agents": [
    {
      "name": "Loop Agent",
      "type": "loop",
      "status": "active",
      "tasksCompleted": 15,
      "isActive": true
    },
    {
      "name": "Summarizer Agent",
      "type": "summarizer",
      "status": "active",
      "tasksCompleted": 25
    },
    {
      "name": "Fact-Check Agent",
      "type": "fact-checker",
      "status": "active",
      "tasksCompleted": 25
    }
  ]
}
```

### /api/news

```json
{
  "articles": [
    {
      "id": "unique-id",
      "title": "News Title",
      "summary": "AI-generated summary...",
      "credibilityScore": 66,
      "factCheckStatus": "verified",
      "source": "BBC News",
      "publishedAt": "2025-09-27T07:08:32.000Z"
    }
  ],
  "totalCount": 5,
  "processingTime": "4.2s"
}
```
