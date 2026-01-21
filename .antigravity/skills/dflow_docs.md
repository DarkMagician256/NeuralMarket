# DFlow API Mastery

## Specification
Base URL: `https://prediction-markets-api.dflow.net`

### Endpoints

#### GET /events
Fetch market events.
- Query Params:
  - `category`: string (e.g., "Crypto", "Politics")
  - `status`: string (e.g., "Active")
- Response: JSON array of event objects with `ticker`, `title`, `expiration`.

#### POST /orders
Submit a new order.
- Body:
  - `ticker`: string
  - `side`: "YES" | "NO"
  - `amount`: number
  - `price`: number
  - `signature`: string (Signed by user wallet)

#### WS /ws
WebSocket endpoint for real-time updates.
- Channels: `orderbook:{ticker}`, `trades:{ticker}`
- Message format: JSON with `type`, `data`.

## Client Implementation
Use a strictly typed TypeScript client. Authenticate requests requiring permissions using HMAC signature or Proxy via backend.
