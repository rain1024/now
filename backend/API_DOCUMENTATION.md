# Django REST API Documentation

## Overview
This is a Django REST API that replaces the Node.js server.js implementation. It provides the same endpoints and functionality with a proper database backend.

## Setup

### 1. Install Dependencies
```bash
cd /Users/anhv/projects/now/backend
uv sync
```

### 2. Run Migrations
```bash
uv run python manage.py migrate
```

### 3. Load Initial Data
```bash
uv run python manage.py load_initial_data
```

### 4. Start the Server
```bash
uv run python manage.py runserver 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### 1. User Signup
**POST** `/api/signup`

Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "userId": "1762669261014"
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields
- `400 Bad Request` - Password must be at least 6 characters
- `400 Bad Request` - Email already exists

---

### 2. User Login
**POST** `/api/login`

Authenticate a user.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "admin"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "name": "Admin",
    "email": "admin@example.com",
    "createdAt": "2025-11-09T00:00:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing email or password
- `401 Unauthorized` - Invalid email or password

---

### 3. Submit Feedback
**POST** `/api/feedback`

Submit new feedback.

**Request:**
```json
{
  "name": "Anonymous",
  "ratings": {
    "design": 5,
    "idea": 4,
    "usefulness": 5
  },
  "comments": "Great app!",
  "language": "en"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "id": "1762669267856"
}
```

**Error Responses:**
- `400 Bad Request` - Missing required ratings
- `400 Bad Request` - Invalid JSON

---

### 4. Get All Feedbacks
**GET** `/api/feedbacks`

Retrieve all feedbacks.

**Response (200 OK):**
```json
[
  {
    "id": "1762669267856",
    "name": "Test Feedback",
    "ratings": {
      "design": 5,
      "idea": 4,
      "usefulness": 5
    },
    "comments": "Great app!",
    "timestamp": "2025-11-09T06:21:07.856719Z",
    "language": "en"
  },
  {
    "id": "1762664892691",
    "name": "Anonymous",
    "ratings": {
      "design": 2,
      "idea": 3,
      "usefulness": 4
    },
    "comments": "thiếu nút login",
    "timestamp": "2025-11-09T05:08:12.686000Z",
    "language": "vi"
  }
]
```

---

### 5. Get Feedback Statistics
**GET** `/api/stats`

Get aggregated feedback statistics.

**Response (200 OK):**
```json
{
  "total": 2,
  "averages": {
    "design": "3.50",
    "idea": "3.50",
    "usefulness": "4.50"
  }
}
```

---

## Configuration

### CORS Settings
The API is configured to allow requests from:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

To modify CORS settings, edit `/Users/anhv/projects/now/backend/config/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
```

### Database
The API uses SQLite database located at:
`/Users/anhv/projects/now/backend/db.sqlite3`

## Models

### User Model
- `id` (CharField) - Primary key, timestamp-based
- `name` (CharField) - User's full name
- `email` (EmailField) - Unique email address
- `password` (CharField) - Password (plaintext for development)
- `created_at` (DateTimeField) - Account creation timestamp

### Feedback Model
- `id` (CharField) - Primary key, timestamp-based
- `name` (CharField) - Submitter's name (default: "Anonymous")
- `ratings_json` (TextField) - JSON string of ratings
- `comments` (TextField) - Feedback comments
- `timestamp` (DateTimeField) - Submission timestamp
- `language` (CharField) - Language code (default: "en")

## Management Commands

### Load Initial Data
```bash
uv run python manage.py load_initial_data
```

Loads users from `/Users/anhv/projects/now/data/users.json` and feedbacks from `/Users/anhv/projects/now/data/feedbacks.json`.

## Testing

### Using curl

**Test signup:**
```bash
curl -X POST http://localhost:8000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"testpass"}'
```

**Test login:**
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin"}'
```

**Test submit feedback:**
```bash
curl -X POST http://localhost:8000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","ratings":{"design":5,"idea":4,"usefulness":5},"comments":"Great!","language":"en"}'
```

**Test get feedbacks:**
```bash
curl -X GET http://localhost:8000/api/feedbacks
```

**Test get stats:**
```bash
curl -X GET http://localhost:8000/api/stats
```

## Migration from Node.js

The Django API maintains the same:
- Endpoint URLs
- Request/Response formats
- Data structures
- Validation rules
- Error messages

Your frontend application should work without any changes, just update the API URL from port 3000 to 8000.

## Production Considerations

**Security Warning:** This implementation stores passwords in plaintext to match the original Node.js behavior. For production:

1. Use Django's built-in User model with password hashing
2. Implement JWT or session-based authentication
3. Enable HTTPS
4. Use environment variables for sensitive settings
5. Switch to PostgreSQL or MySQL
6. Set `DEBUG = False` in production
7. Configure proper `ALLOWED_HOSTS`
