# REST API Plan for WineLog

## 1. Overview

This REST API is designed for WineLog, a web application for tracking wine and mead production. The API follows RESTful principles and uses Supabase for authentication and database operations. All endpoints require authentication unless otherwise specified.

**Base URL:** `/api/v1`

**Content-Type:** `application/json`

## 2. Resources

| Resource | Database Table | Description |
|----------|---------------|-------------|
| Templates | `templates`, `template_stages` | Pre-defined wine/mead production templates with stages |
| Batches | `batches` | User's wine/mead production batches |
| Batch Stages | `batch_stages` | Progress tracking for each stage of a batch |
| Notes | `notes` | User notes documenting actions and observations |
| Ratings | `ratings` | User ratings for completed batches (1-5 stars) |

## 3. Authentication Endpoints

### 3.1 Register User

**POST** `/api/v1/auth/register`

Creates a new user account with email verification.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123"
}
```

**Success Response (201 Created):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "email_confirmed": false,
    "created_at": "2025-01-15T10:30:00Z"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_at": "2025-02-14T10:30:00Z"
  },
  "message": "Link weryfikacyjny został wysłany na podany adres e-mail."
}
```

**Error Responses:**
- `400 Bad Request` - Invalid email format or password policy violation
```json
{
  "error": "Nieprawidłowy format e-mail.",
  "code": "INVALID_EMAIL"
}
```
```json
{
  "error": "Hasło musi zawierać co najmniej 8 znaków, w tym wielką literę, małą literę, cyfrę i znak specjalny.",
  "code": "WEAK_PASSWORD"
}
```
- `409 Conflict` - Email already registered
```json
{
  "error": "Ten adres e-mail jest już zarejestrowany.",
  "code": "EMAIL_EXISTS"
}
```

**Validation Rules:**
- Email: Must be valid RFC 5322 format
- Password: Min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special char (!@#$%^&*)

---

### 3.2 Login

**POST** `/api/v1/auth/login`

Authenticates user and creates session (30 days).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123"
}
```

**Success Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "email_confirmed": true,
    "created_at": "2025-01-15T10:30:00Z"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_at": "2025-02-14T10:30:00Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials
```json
{
  "error": "Nieprawidłowy e-mail lub hasło.",
  "code": "INVALID_CREDENTIALS"
}
```

---

### 3.3 Logout

**POST** `/api/v1/auth/logout`

Ends user session.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200 OK):**
```json
{
  "message": "Wylogowano pomyślnie."
}
```

---

### 3.4 Refresh Session

**POST** `/api/v1/auth/refresh`

Refreshes access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "refresh_token"
}
```

**Success Response (200 OK):**
```json
{
  "access_token": "new_jwt_token",
  "refresh_token": "new_refresh_token",
  "expires_at": "2025-02-14T10:30:00Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or expired refresh token

---

### 3.5 Request Password Reset

**POST** `/api/v1/auth/password-reset`

Sends password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Link do resetowania hasła został wysłany na podany adres e-mail."
}
```

---

### 3.6 Delete Account

**DELETE** `/api/v1/auth/account`

Permanently deletes user account and all associated data.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "password": "SecureP@ss123"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Konto zostało usunięte pomyślnie."
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid password
- `403 Forbidden` - Session expired

---

## 4. Template Endpoints

Templates are read-only for authenticated users.

### 4.1 List Templates

**GET** `/api/v1/templates`

Returns all available production templates.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `type` (optional): Filter by batch type (`red_wine`, `white_wine`, `rose_wine`, `fruit_wine`, `mead`)

**Success Response (200 OK):**
```json
{
  "templates": [
    {
      "id": "uuid",
      "name": "Wino czerwone",
      "type": "red_wine",
      "version": 1,
      "created_at": "2025-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "name": "Miód pitny trójniak",
      "type": "mead",
      "version": 1,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 5
}
```

---

### 4.2 Get Template Details

**GET** `/api/v1/templates/{template_id}`

Returns detailed template with all stages.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "Wino czerwone",
  "type": "red_wine",
  "version": 1,
  "created_at": "2025-01-01T00:00:00Z",
  "stages": [
    {
      "id": "uuid",
      "position": 1,
      "name": "preparation",
      "description": "Przygotowanie nastawu",
      "instructions": "Wybierz dojrzałe winogrona czerwone...",
      "materials": ["Winogrona czerwone (15-20 kg)", "Prasa lub tłuczek", "Fermentator"],
      "days_min": 1,
      "days_max": 2,
      "created_at": "2025-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "position": 2,
      "name": "press_or_maceration",
      "description": "Ewentualne tłoczenie lub maceracja",
      "instructions": "Jeśli wybrałeś macerację...",
      "materials": ["Prasa", "Sitko", "Termometr"],
      "days_min": 1,
      "days_max": 7,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

**Error Responses:**
- `404 Not Found` - Template not found

---

## 5. Batch Endpoints

### 5.1 Create Batch

**POST** `/api/v1/batches`

Creates a new wine/mead batch from a template.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "template_id": "uuid",
  "name": "Wino czerwone #1"
}
```

**Note:** `name` is optional. If not provided, system generates default name in format "[Type] #N".

**Success Response (201 Created):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "template_id": "uuid",
  "name": "Wino czerwone #1",
  "type": "red_wine",
  "status": "active",
  "started_at": "2025-01-15",
  "completed_at": null,
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z",
  "current_stage": {
    "id": "uuid",
    "position": 1,
    "name": "preparation",
    "description": "Przygotowanie nastawu"
  },
  "stages": [
    {
      "id": "uuid",
      "batch_id": "uuid",
      "template_stage_id": "uuid",
      "position": 1,
      "name": "preparation",
      "started_at": "2025-01-15",
      "completed_at": null
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request` - Invalid template_id or name too long
```json
{
  "error": "Nazwa nastawu może mieć maksymalnie 100 znaków.",
  "code": "NAME_TOO_LONG"
}
```
- `404 Not Found` - Template not found

**Validation Rules:**
- `template_id`: Must be valid UUID and exist in templates
- `name`: Max 100 characters (if provided)

---

### 5.2 List Batches

**GET** `/api/v1/batches`

Returns user's batches with filtering.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `status` (optional): Filter by status (`active`, `archived`) - default: `active`
- `type` (optional): Filter by type (`red_wine`, `white_wine`, `rose_wine`, `fruit_wine`, `mead`)
- `sort` (optional): Sort field (`created_at`, `started_at`, `name`) - default: `created_at`
- `order` (optional): Sort order (`asc`, `desc`) - default: `desc`

**Success Response (200 OK):**
```json
{
  "batches": [
    {
      "id": "uuid",
      "template_id": "uuid",
      "name": "Wino czerwone #1",
      "type": "red_wine",
      "status": "active",
      "started_at": "2025-01-15",
      "completed_at": null,
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z",
      "current_stage": {
        "position": 2,
        "name": "press_or_maceration",
        "description": "Ewentualne tłoczenie lub maceracja"
      },
      "latest_note": {
        "id": "uuid",
        "action": "Rozpoczęto macerację",
        "created_at": "2025-01-15T12:00:00Z"
      },
      "rating": null
    }
  ],
  "total": 3
}
```

---

### 5.3 Get Batch Details

**GET** `/api/v1/batches/{batch_id}`

Returns detailed batch information with all stages and notes timeline.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200 OK):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "template_id": "uuid",
  "name": "Wino czerwone #1",
  "type": "red_wine",
  "status": "active",
  "started_at": "2025-01-15",
  "completed_at": null,
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z",
  "template": {
    "id": "uuid",
    "name": "Wino czerwone",
    "type": "red_wine"
  },
  "stages": [
    {
      "id": "uuid",
      "batch_id": "uuid",
      "template_stage_id": "uuid",
      "position": 1,
      "name": "preparation",
      "description": "Przygotowanie nastawu",
      "instructions": "Wybierz dojrzałe winogrona...",
      "materials": ["Winogrona czerwone", "Prasa"],
      "days_min": 1,
      "days_max": 2,
      "started_at": "2025-01-15",
      "completed_at": "2025-01-16",
      "status": "completed"
    },
    {
      "id": "uuid",
      "batch_id": "uuid",
      "template_stage_id": "uuid",
      "position": 2,
      "name": "press_or_maceration",
      "description": "Ewentualne tłoczenie lub maceracja",
      "instructions": "Jeśli wybrałeś macerację...",
      "materials": ["Prasa", "Sitko"],
      "days_min": 1,
      "days_max": 7,
      "started_at": "2025-01-16",
      "completed_at": null,
      "status": "in_progress"
    }
  ],
  "current_stage_position": 2,
  "notes": [
    {
      "id": "uuid",
      "batch_id": "uuid",
      "stage_id": "uuid",
      "stage_name": "preparation",
      "action": "Zakup 18kg winogron",
      "observations": "Winogrona dojrzałe, dobrej jakości",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "rating": null
}
```

**Error Responses:**
- `404 Not Found` - Batch not found or doesn't belong to user

---

### 5.4 Update Batch

**PATCH** `/api/v1/batches/{batch_id}`

Updates batch name (only editable field in MVP).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "name": "Wino z własnych winogron 2025"
}
```

**Success Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "Wino z własnych winogron 2025",
  "updated_at": "2025-01-16T09:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Name too long or empty
- `404 Not Found` - Batch not found

**Validation Rules:**
- `name`: Required, max 100 characters

---

### 5.5 Complete Batch

**POST** `/api/v1/batches/{batch_id}/complete`

Marks batch as completed and moves to archive.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{}
```

**Success Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "Wino czerwone #1",
  "status": "archived",
  "completed_at": "2025-06-15",
  "message": "Nastaw został przeniesiony do archiwum."
}
```

**Error Responses:**
- `404 Not Found` - Batch not found
- `409 Conflict` - Batch already completed

---

### 5.6 Delete Batch

**DELETE** `/api/v1/batches/{batch_id}`

Permanently deletes batch and all associated data (notes, ratings, stages).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200 OK):**
```json
{
  "message": "Nastaw został usunięty pomyślnie."
}
```

**Error Responses:**
- `404 Not Found` - Batch not found

---

## 6. Batch Stage Endpoints

### 6.1 Advance to Next Stage

**POST** `/api/v1/batches/{batch_id}/stages/advance`

Advances batch to next stage, marking current stage as completed.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "note": {
    "action": "Zakończono macerację",
    "observations": "Kolor głęboki, aromat intensywny"
  }
}
```

**Note:** `note` is optional. If provided, creates a note for the completed stage.

**Success Response (200 OK):**
```json
{
  "previous_stage": {
    "id": "uuid",
    "position": 2,
    "name": "press_or_maceration",
    "completed_at": "2025-01-23"
  },
  "current_stage": {
    "id": "uuid",
    "batch_id": "uuid",
    "template_stage_id": "uuid",
    "position": 3,
    "name": "primary_fermentation",
    "description": "Fermentacja burzliwa",
    "instructions": "Dodaj drożdże winne...",
    "materials": ["Drożdże winne", "Pożywka"],
    "days_min": 5,
    "days_max": 10,
    "started_at": "2025-01-23",
    "completed_at": null
  },
  "note": {
    "id": "uuid",
    "action": "Zakończono macerację",
    "observations": "Kolor głęboki, aromat intensywny",
    "created_at": "2025-01-23T14:30:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Already at final stage
```json
{
  "error": "Nastaw jest już na ostatnim etapie.",
  "code": "FINAL_STAGE"
}
```
- `404 Not Found` - Batch not found

**Business Logic:**
- Sequential progression only (no skipping stages)
- Automatically marks previous stage as completed
- Sets started_at for new stage to current date
- Cannot go backwards

---

### 6.2 Get Current Stage Details

**GET** `/api/v1/batches/{batch_id}/stages/current`

Returns detailed information about current stage.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200 OK):**
```json
{
  "id": "uuid",
  "batch_id": "uuid",
  "template_stage_id": "uuid",
  "position": 2,
  "name": "press_or_maceration",
  "description": "Ewentualne tłoczenie lub maceracja",
  "instructions": "Jeśli wybrałeś macerację, codziennie mieszaj masę...",
  "materials": ["Prasa lub tłuczek", "Sitko", "Fermentator", "Termometr"],
  "days_min": 1,
  "days_max": 7,
  "started_at": "2025-01-16",
  "completed_at": null,
  "days_elapsed": 7,
  "notes": [
    {
      "id": "uuid",
      "action": "Codzienne mieszanie masy",
      "observations": "Temperatura 22°C",
      "created_at": "2025-01-20T10:00:00Z"
    }
  ]
}
```

**Error Responses:**
- `404 Not Found` - Batch not found

---

## 7. Note Endpoints

### 7.1 Create Note

**POST** `/api/v1/batches/{batch_id}/notes`

Creates a new note for the batch (attached to current stage).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "action": "Zlewanie z nad osadu",
  "observations": "Osad około 1cm, wino klarowne"
}
```

**Success Response (201 Created):**
```json
{
  "id": "uuid",
  "batch_id": "uuid",
  "stage_id": "uuid",
  "user_id": "uuid",
  "action": "Zlewanie z nad osadu",
  "observations": "Osad około 1cm, wino klarowne",
  "created_at": "2025-01-20T10:30:00Z",
  "stage": {
    "position": 4,
    "name": "secondary_fermentation"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation failed
```json
{
  "error": "Pole 'działanie' może mieć maksymalnie 200 znaków.",
  "code": "ACTION_TOO_LONG"
}
```
```json
{
  "error": "Pole 'obserwacje' może mieć maksymalnie 200 znaków.",
  "code": "OBSERVATIONS_TOO_LONG"
}
```
- `404 Not Found` - Batch not found

**Validation Rules:**
- `action`: Required, max 200 characters
- `observations`: Optional, max 200 characters
- `created_at`: Auto-generated, cannot be modified in MVP

---

### 7.2 List Notes

**GET** `/api/v1/batches/{batch_id}/notes`

Returns all notes for a batch in chronological order.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `sort` (optional): Sort order (`asc`, `desc`) - default: `desc` (newest first)
- `stage_id` (optional): Filter by specific stage

**Success Response (200 OK):**
```json
{
  "notes": [
    {
      "id": "uuid",
      "batch_id": "uuid",
      "stage_id": "uuid",
      "action": "Zlewanie z nad osadu",
      "observations": "Osad około 1cm",
      "created_at": "2025-01-20T10:30:00Z",
      "stage": {
        "position": 4,
        "name": "secondary_fermentation",
        "description": "Fermentacja cicha"
      }
    },
    {
      "id": "uuid",
      "batch_id": "uuid",
      "stage_id": "uuid",
      "action": "Dodanie drożdży",
      "observations": "Fermentacja rozpoczęta po 18h",
      "created_at": "2025-01-16T09:00:00Z",
      "stage": {
        "position": 3,
        "name": "primary_fermentation",
        "description": "Fermentacja burzliwa"
      }
    }
  ],
  "total": 15
}
```

**Error Responses:**
- `404 Not Found` - Batch not found

---

### 7.3 Update Note

**PATCH** `/api/v1/batches/{batch_id}/notes/{note_id}`

Updates existing note (action and/or observations).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "action": "Zlewanie z nad osadu - drugie",
  "observations": "Osad około 1cm, wino bardzo klarowne"
}
```

**Success Response (200 OK):**
```json
{
  "id": "uuid",
  "batch_id": "uuid",
  "stage_id": "uuid",
  "action": "Zlewanie z nad osadu - drugie",
  "observations": "Osad około 1cm, wino bardzo klarowne",
  "created_at": "2025-01-20T10:30:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Validation failed (character limit exceeded)
- `404 Not Found` - Note or batch not found

**Validation Rules:**
- `action`: Max 200 characters
- `observations`: Max 200 characters
- At least one field must be provided

**Note:** No edit timestamp in MVP. `created_at` remains unchanged.

---

### 7.4 Delete Note

**DELETE** `/api/v1/batches/{batch_id}/notes/{note_id}`

Permanently deletes note (no confirmation in MVP for speed).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200 OK):**
```json
{
  "message": "Notatka została usunięta pomyślnie."
}
```

**Error Responses:**
- `404 Not Found` - Note or batch not found

---

## 8. Rating Endpoints

### 8.1 Add or Update Rating

**PUT** `/api/v1/batches/{batch_id}/rating`

Adds or updates rating for completed batch (1-5 stars).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "rating": 4
}
```

**Success Response (200 OK):**
```json
{
  "batch_id": "uuid",
  "user_id": "uuid",
  "rating": 4,
  "created_at": "2025-06-20T15:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid rating value
```json
{
  "error": "Ocena musi być liczbą od 1 do 5.",
  "code": "INVALID_RATING"
}
```
- `403 Forbidden` - Batch not completed
```json
{
  "error": "Można ocenić tylko zakończony nastaw.",
  "code": "BATCH_NOT_COMPLETED"
}
```
- `404 Not Found` - Batch not found

**Validation Rules:**
- `rating`: Required, integer between 1 and 5
- Batch must have status `archived`

---

### 8.2 Get Rating

**GET** `/api/v1/batches/{batch_id}/rating`

Returns rating for a batch.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200 OK):**
```json
{
  "batch_id": "uuid",
  "user_id": "uuid",
  "rating": 4,
  "created_at": "2025-06-20T15:00:00Z"
}
```

**Error Responses:**
- `404 Not Found` - Rating or batch not found
```json
{
  "error": "Nie znaleziono oceny dla tego nastawu.",
  "code": "RATING_NOT_FOUND"
}
```

---

## 9. Dashboard Endpoint

### 9.1 Get Dashboard Data

**GET** `/api/v1/dashboard`

Returns aggregated dashboard data (active batches summary, quick stats).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200 OK):**
```json
{
  "active_batches": [
    {
      "id": "uuid",
      "name": "Wino czerwone #1",
      "type": "red_wine",
      "started_at": "2025-01-15",
      "current_stage": {
        "position": 4,
        "name": "secondary_fermentation",
        "description": "Fermentacja cicha",
        "days_elapsed": 12
      },
      "latest_note": {
        "action": "Zlewanie z nad osadu",
        "created_at": "2025-01-20T10:30:00Z"
      }
    }
  ],
  "archived_batches_count": 3,
  "total_notes": 45
}
```

---

## 10. Authentication & Authorization

### 10.1 Authentication Mechanism

**Method:** JWT (JSON Web Tokens) via Supabase Auth

**Implementation:**
- Supabase handles token generation, validation, and refresh
- Access tokens expire after 1 hour
- Refresh tokens valid for 30 days (with activity)
- Session automatically refreshes when active

**Token Structure:**
- Access Token: JWT containing user_id, email, role
- Refresh Token: Secure random token stored in database

**Header Format:**
```
Authorization: Bearer {access_token}
```

### 10.2 Authorization Rules

**Row Level Security (RLS):**

1. **Templates & Template Stages:**
   - All authenticated users: `SELECT` only
   - Read-only system data

2. **Batches:**
   - Users can only access their own batches
   - Policy: `user_id = auth.uid()`
   - Operations: `SELECT`, `INSERT`, `UPDATE`, `DELETE`

3. **Batch Stages:**
   - Users can access stages through their batches
   - Policy: `EXISTS (SELECT 1 FROM batches WHERE batches.id = batch_stages.batch_id AND batches.user_id = auth.uid())`
   - Operations: `SELECT`, `INSERT`, `UPDATE`, `DELETE`

4. **Notes:**
   - Users can only access their own notes
   - Policy: `user_id = auth.uid()`
   - Operations: `SELECT`, `INSERT`, `UPDATE`, `DELETE`

5. **Ratings:**
   - Users can only access their own ratings
   - Policy: `user_id = auth.uid()`
   - Operations: `SELECT`, `INSERT`, `UPDATE`, `DELETE`

### 10.3 Session Management

- **Duration:** 30 days with activity
- **Inactivity:** Automatic logout after 30 days of no activity
- **Refresh:** Automatic token refresh on API calls when token near expiration
- **Logout:** Invalidates both access and refresh tokens

### 10.4 Security Measures

1. **Rate Limiting:**
   - Authentication endpoints: 5 requests per minute per IP
   - Other endpoints: 100 requests per minute per user
   - Burst allowance: 20 requests

2. **Password Policy:**
   - Minimum 8 characters
   - At least 1 uppercase letter
   - At least 1 lowercase letter
   - At least 1 digit
   - At least 1 special character (!@#$%^&*)
   - Stored hashed with bcrypt (handled by Supabase)

3. **Email Verification:**
   - Soft verification (users can use app before verifying)
   - Verification link valid for 7 days
   - No functionality restrictions for unverified users in MVP

4. **HTTPS Only:**
   - All API communication must use HTTPS in production
   - HTTP Strict Transport Security (HSTS) enabled

5. **CORS Policy:**
   - Allowed origins: Application domain only
   - Credentials: Included
   - Methods: GET, POST, PATCH, PUT, DELETE
   - Headers: Authorization, Content-Type

---

## 11. Validation Rules

### 11.1 User Registration
- Email: Valid RFC 5322 format
- Password: Min 8 chars, uppercase, lowercase, digit, special char

### 11.2 Batches
- Name: Max 100 characters, optional (auto-generated if empty)
- Type: Must be valid enum value
- Template ID: Must exist and be valid UUID

### 11.3 Notes
- Action: Required, max 200 characters
- Observations: Optional, max 200 characters
- Date: Auto-generated, not editable

### 11.4 Ratings
- Rating: Required, integer 1-5
- Batch must have status `archived`

### 11.5 Stage Progression
- Can only advance sequentially
- Cannot skip stages
- Cannot go backwards
- Automatically marks previous stage as complete

---

## 12. Error Handling

### 12.1 Standard Error Response Format

```json
{
  "error": "Human-readable error message in Polish",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific field error details"
  }
}
```

### 12.2 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PATCH, PUT, DELETE |
| 201 | Created | Successful POST creating resource |
| 400 | Bad Request | Validation error, invalid input |
| 401 | Unauthorized | Invalid or missing authentication |
| 403 | Forbidden | Valid auth but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource conflict (duplicate, state error) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | Temporary service unavailable |

### 12.3 Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_EMAIL` | Email format invalid |
| `WEAK_PASSWORD` | Password doesn't meet policy |
| `EMAIL_EXISTS` | Email already registered |
| `INVALID_CREDENTIALS` | Wrong email or password |
| `SESSION_EXPIRED` | Session token expired |
| `NAME_TOO_LONG` | Name exceeds max length |
| `ACTION_TOO_LONG` | Action field exceeds 200 chars |
| `OBSERVATIONS_TOO_LONG` | Observations exceed 200 chars |
| `INVALID_RATING` | Rating not between 1-5 |
| `BATCH_NOT_COMPLETED` | Operation requires completed batch |
| `FINAL_STAGE` | Already at final stage |
| `RESOURCE_NOT_FOUND` | Requested resource not found |
| `RATE_LIMIT_EXCEEDED` | Too many requests |

### 12.4 Validation Error Details

For validation errors (400), include field-specific details:

```json
{
  "error": "Błąd walidacji danych.",
  "code": "VALIDATION_ERROR",
  "details": {
    "name": "Nazwa nastawu może mieć maksymalnie 100 znaków.",
    "action": "Pole 'działanie' jest wymagane."
  }
}
```

---

## 13. Business Logic Implementation

### 13.1 Batch Creation
1. Validate template exists
2. Generate default name if not provided: `[Type Name] #N`
   - N = count of user's batches of that type + 1
3. Create batch record with status `active`
4. Create batch_stage records for all template stages
5. Set first stage as started (started_at = today)
6. Return batch with current stage info

### 13.2 Stage Advancement
1. Verify batch belongs to user (RLS)
2. Check not already at final stage
3. Get current stage position
4. Mark current stage as completed (completed_at = today)
5. Find next stage by position
6. Mark next stage as started (started_at = today)
7. If note provided, create note for completed stage
8. Update batch updated_at timestamp
9. Return previous and new current stage

### 13.3 Batch Completion
1. Verify batch belongs to user
2. Check batch status is `active`
3. Set status to `archived`
4. Set completed_at to today
5. Update updated_at timestamp
6. Batch remains accessible in archive
7. Return updated batch

### 13.4 Default Name Generation Logic
```
Type Mapping:
- red_wine → "Wino czerwone"
- white_wine → "Wino białe"
- rose_wine → "Wino różowe"
- fruit_wine → "Wino owocowe"
- mead → "Miód pitny"

Algorithm:
1. Get type from template
2. Count user's existing batches of that type
3. Format: "{Type Name} #{count + 1}"
4. Example: "Wino czerwone #3"
```

### 13.5 Note Association
- Notes automatically associate with current batch stage
- Stage context preserved even after advancing stages
- Notes display with stage information for context

### 13.6 Rating Rules
- Only for archived batches
- One rating per user per batch (upsert logic)
- Can be updated anytime after batch completion
- Cannot be deleted, only changed

---

## 14. Performance Considerations

### 14.1 Pagination
Not implemented in MVP (simple list for all resources).
Planned for future iterations when user has many batches.

### 14.2 Caching Strategy
- Templates: Cache aggressively (rarely change)
  - Cache-Control: public, max-age=86400 (24h)
- Batches: No caching (user-specific, changes frequently)
- Dashboard: Short cache (60 seconds) for quick repeated access

### 14.3 Database Indexes
From schema (referenced in queries):
- `batches (user_id, status)` - List user batches by status
- `batch_stages (batch_id, template_stage_id)` - Stage lookups
- `notes (batch_id, created_at DESC)` - Notes timeline
- `template_stages (template_id, position)` - Template stage ordering
- `ratings (batch_id)` - Rating lookups

### 14.4 Query Optimization
- Use selective field loading
- Batch-related queries join only necessary related data
- Dashboard endpoint aggregates in single query where possible
- Leverage RLS for automatic authorization filtering

---

## 15. Future Enhancements (Post-MVP)

Items explicitly excluded from MVP but planned:

1. **Pagination & Filtering:**
   - Limit/offset pagination for large lists
   - Advanced filtering (date ranges, search)
   - Sorting by multiple fields

2. **Note Enhancements:**
   - Manual date editing
   - Edit timestamp tracking
   - Attachments (images, files)
   - Version history

3. **Batch Features:**
   - Clone batch
   - Custom templates
   - Custom stages
   - Restart fermentation

4. **Analytics:**
   - Statistics dashboard
   - Charts and graphs
   - Export data (JSON/CSV)

5. **Notifications:**
   - Email reminders for stages
   - Webhook support

6. **OAuth:**
   - Google login
   - Facebook login

7. **Measurements:**
   - Numeric fields in notes (temp, pH, density)
   - Calculation tools

8. **Advanced Ratings:**
   - Detailed ratings (taste, color, aroma)
   - Rating comments

---

## 16. API Versioning

**Current Version:** v1

**Strategy:** URL path versioning (`/api/v1/`)

**Deprecation Policy:**
- New versions introduced with breaking changes
- Old versions supported for minimum 6 months after new version release
- Deprecation warnings sent via response headers
- Clear migration guides provided

**Version Header:**
```
X-API-Version: 1.0.0
```

---

## 17. Development & Testing

### 17.1 Local Development
- Base URL: `http://localhost:4321/api/v1`
- Supabase local instance for development
- Mock data seeders for templates

### 17.2 Testing Requirements
- Unit tests for all business logic
- Integration tests for API endpoints
- Authentication flow tests
- RLS policy tests
- Validation tests for all inputs

### 17.3 API Documentation
- OpenAPI/Swagger specification generated from this plan
- Interactive API explorer for developers
- Code examples in JavaScript/TypeScript

---

## 18. Monitoring & Logging

### 18.1 Request Logging
- Log all API requests with:
  - Timestamp
  - User ID (if authenticated)
  - Endpoint
  - Method
  - Response status
  - Response time

### 18.2 Error Logging
- Detailed server-side error logs
- Stack traces (not exposed to clients)
- Error categorization for analysis

### 18.3 Metrics
- Request rate per endpoint
- Average response time
- Error rate
- Authentication success/failure rate
- Most used features

---

## 19. Compliance

### 19.1 GDPR Compliance
- Account deletion removes all user data
- Data export available (post-MVP)
- Privacy-first anonymous metrics
- User consent for analytics
- Right to be forgotten implemented

### 19.2 Data Retention
- Active batches: Indefinite
- Archived batches: Indefinite (user-controlled deletion)
- Deleted accounts: All data removed immediately
- Session tokens: 30 days with activity

---

## Appendix A: Enum Values

### batch_status_enum
- `active` - Nastaw w trakcie produkcji
- `archived` - Nastaw zakończony

### batch_type_enum
- `red_wine` - Wino czerwone
- `white_wine` - Wino białe
- `rose_wine` - Wino różowe
- `fruit_wine` - Wino owocowe
- `mead` - Miód pitny

### stage_name_enum
- `preparation` - Przygotowanie nastawu
- `press_or_maceration` - Ewentualne tłoczenie lub maceracja
- `separation` - Ewentualne oddzielanie
- `primary_fermentation` - Fermentacja burzliwa
- `secondary_fermentation` - Fermentacja cicha
- `clarification` - Klarowanie
- `racking` - Zlewanie z nad osadu
- `maturation` - Dojrzewanie/maturacja
- `bottling` - Butelkowanie

---

*This API plan is designed for WineLog MVP and will evolve based on user feedback and feature additions.*

