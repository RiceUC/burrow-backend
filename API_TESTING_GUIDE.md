# 📚 API TESTING GUIDE - Burrow Backend

Format lengkap untuk testing setiap endpoint dengan Postman atau PowerShell.

---

## 🔑 AUTHENTICATION ENDPOINTS

### 1. REGISTER (Create New User)

```
METHOD: POST
URL: http://localhost:3000/api/register

HEADERS:
Content-Type: application/json

BODY (JSON):
{
    "username": "kiara001",
    "password": "password123",
    "name": "Kiara Putri",
    "gender": "Female"
}

EXPECTED RESPONSE (201 Created):
{
    "data": {
        "user_id": 1,
        "username": "kiara001",
        "name": "Kiara Putri",
        "gender": "Female",
        "created_at": "2025-12-16T..."
    }
}

ERROR CASES:
- 400 Bad Request: Missing required fields
- 409 Conflict: Username already exists

VALIDATION RULES:
- username: 3-50 chars, alphanumeric + underscore
- password: 8+ chars
- name: 1+ chars
- gender: 1+ chars
```

---

### 2. LOGIN (Get Tokens)

```
METHOD: POST
URL: http://localhost:3000/api/login

HEADERS:
Content-Type: application/json

BODY (JSON):
{
    "username": "kiara001",
    "password": "password123"
}

EXPECTED RESPONSE (200 OK):
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "user_id": 1,
        "username": "kiara001",
        "name": "Kiara Putri",
        "gender": "Female"
    }
}

ERROR CASES:
- 401 Unauthorized: Invalid username or password
- 400 Bad Request: Missing username/password

NOTES:
- accessToken: Valid for 1 hour
- refreshToken: Valid for 7 days
- Save both tokens secara secure
```

---

### 3. REFRESH TOKEN (Get New Access Token)

```
METHOD: POST
URL: http://localhost:3000/api/refresh-token

HEADERS:
Content-Type: application/json

BODY (JSON):
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

EXPECTED RESPONSE (200 OK):
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

ERROR CASES:
- 401 Unauthorized: Refresh token invalid/expired
- 400 Bad Request: Missing refresh token

NOTES:
- Use saat access token sudah expired
- Refresh token tidak berubah
- Get access token baru (valid 1 jam lagi)
```

---

## 👤 USER ENDPOINTS (Protected)

⚠️ **IMPORTANT: Semua endpoint di section ini membutuhkan Authorization header dengan Bearer token!**

### 4. GET PROFILE

```
METHOD: GET
URL: http://localhost:3000/api/users/profile

HEADERS:
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                      ↑ accessToken dari login (REQUIRED!)

BODY: (empty)

EXPECTED RESPONSE (200 OK):
{
    "data": {
        "user_id": 1,
        "username": "kiara001",
        "name": "Kiara Putri",
        "gender": "Female",
        "birthdate": null,
        "default_sound_duration": null,
        "reminder_time": null,
        "created_at": "2025-12-16T..."
    }
}

ERROR CASES:
- 401 Unauthorized: No token or invalid token
- 404 Not Found: User not found
```

---

### 5. UPDATE PROFILE

```
METHOD: PUT
URL: http://localhost:3000/api/users/profile

HEADERS:
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

BODY (JSON):
{
    "name": "Kiara Putri Updated",
    "gender": "Female",
    "birthdate": "2000-01-15",
    "default_sound_duration": 300,
    "reminder_time": "22:00"
}

EXPECTED RESPONSE (200 OK):
{
    "data": {
        "user_id": 1,
        "username": "kiara001",
        "name": "Kiara Putri Updated",
        "gender": "Female",
        "birthdate": "2000-01-15T00:00:00.000Z",
        "default_sound_duration": 300,
        "reminder_time": "22:00",
        "created_at": "2025-12-16T..."
    }
}

ERROR CASES:
- 401 Unauthorized: Invalid token
- 400 Bad Request: Invalid field format

VALIDATION RULES:
- name: 1-100 chars (optional)
- gender: max 20 chars (optional)
- birthdate: valid date (optional)
- reminder_time: HH:mm format (optional)
```

---

### 6. DELETE ACCOUNT

```
METHOD: DELETE
URL: http://localhost:3000/api/users/account

HEADERS:
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

BODY: (empty)

EXPECTED RESPONSE (200 OK):
{
    "message": "Account deleted successfully"
}

ERROR CASES:
- 401 Unauthorized: Invalid token
- 404 Not Found: User not found

NOTES:
- Akan delete user dan semua data related (journals, sleep sessions)
- Tidak bisa di-undo
```

---

## 📔 JOURNAL ENDPOINTS (Protected)

### 7. CREATE JOURNAL

```
METHOD: POST
URL: http://localhost:3000/api/journals

HEADERS:
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

BODY (JSON):
{
    "content": "Hari ini sangat menyenangkan, saya berhasil menyelesaikan semua task",
    "mood": "happy"
}

EXPECTED RESPONSE (201 Created):
{
    "status": 201,
    "message": "Journal berhasil dibuat",
    "data": {
        "journal_id": 1,
        "user_id": 1,
        "content": "Hari ini sangat menyenangkan...",
        "mood": "happy",
        "created_at": "2025-12-16T02:00:00.000Z"
    }
}

ERROR CASES:
- 401 Unauthorized: Invalid token
- 400 Bad Request: Missing content or mood

MOOD VALUES (lowercase):
- happy
- sad
- tired
- angry

VALIDATION RULES:
- content: string required
- mood: must be lowercase, must match enum
```

---

### 8. GET ALL JOURNALS (User's Journals)

```
METHOD: GET
URL: http://localhost:3000/api/journals/user/7
                                            ↑ REQUIRED: user_id parameter!

HEADERS:
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

BODY: (empty)

EXPECTED RESPONSE (200 OK):
{
    "status": 200,
    "message": "Journals berhasil diambil",
    "data": [
        {
            "journal_id": 1,
            "user_id": 1,
            "content": "Hari ini menyenangkan",
            "mood": "happy",
            "created_at": "2025-12-16T..."
        },
        {
            "journal_id": 2,
            "user_id": 1,
            "content": "Hari ini sedih",
            "mood": "sad",
            "created_at": "2025-12-16T..."
        }
    ]
}

ERROR CASES:
- 401 Unauthorized: Invalid token
- 403 Forbidden: Trying to access other user's journals
- 400 Bad Request: Invalid user_id format

SECURITY:
- User hanya bisa lihat own journals
- Parameter check: userId dari URL === userId dari token
```

---

### 9. GET SINGLE JOURNAL

```
METHOD: GET
URL: http://localhost:3000/api/journals/single/1
                                         ↑ Use /single/ prefix!
                                              ↑ journal_id parameter

HEADERS:
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

BODY: (empty)

EXPECTED RESPONSE (200 OK):
{
    "status": 200,
    "message": "Journal berhasil diambil",
    "data": {
        "journal_id": 1,
        "user_id": 1,
        "content": "Hari ini sangat menyenangkan",
        "mood": "happy",
        "created_at": "2025-12-16T..."
    }
}

ERROR CASES:
- 401 Unauthorized: Invalid token
- 403 Forbidden: Journal belongs to different user
- 404 Not Found: Journal not found

SECURITY:
- User hanya bisa lihat own journals
- Data-based check: journal.user_id === token.user_id
```

---

### 10. UPDATE JOURNAL

```
METHOD: PATCH
URL: http://localhost:3000/api/journals/1
                                        ↑ journal_id

HEADERS:
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

BODY (JSON):
{
    "content": "Hari ini menjadi lebih baik dari kemarin",
    "mood": "happy"
}

EXPECTED RESPONSE (200 OK):
{
    "status": 200,
    "message": "Journal berhasil diperbarui",
    "data": {
        "journal_id": 1,
        "user_id": 1,
        "content": "Hari ini menjadi lebih baik dari kemarin",
        "mood": "happy",
        "created_at": "2025-12-16T..."
    }
}

ERROR CASES:
- 401 Unauthorized: Invalid token
- 403 Forbidden: Journal belongs to different user
- 404 Not Found: Journal not found
- 400 Bad Request: Invalid mood

VALIDATION RULES:
- content: optional (update partial ok)
- mood: optional, must be lowercase if provided
```

---

### 11. DELETE JOURNAL

```
METHOD: DELETE
URL: http://localhost:3000/api/journals/1
                                        ↑ journal_id

HEADERS:
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

BODY: (empty)

EXPECTED RESPONSE (200 OK):
{
    "status": 200,
    "message": "Journal berhasil dihapus"
}

ERROR CASES:
- 401 Unauthorized: Invalid token
- 403 Forbidden: Journal belongs to different user
- 404 Not Found: Journal not found

NOTES:
- Optimistic delete: removed from UI first, then deleted in background
- Cannot be undone
```

---

## 🛠️ TESTING DENGAN POSTMAN

### Step-by-Step:

**1. REGISTER USER:**
```
1. New request
2. Method: POST
3. URL: http://localhost:3000/api/register
4. Headers tab: Content-Type: application/json
5. Body tab: raw, JSON
6. Copy-paste register JSON
7. Send
8. Simpan response: user_id untuk step berikutnya
```

**2. LOGIN:**
```
1. New request
2. Method: POST
3. URL: http://localhost:3000/api/login
4. Headers: Content-Type: application/json
5. Body: username & password
6. Send
7. Copy: accessToken dan refreshToken
```

**3. SETUP AUTHORIZATION UNTUK PROTECTED ENDPOINTS:**
```
1. Di request yang perlu token
2. Tab: Headers
3. Add new:
   Key: Authorization
   Value: Bearer {accessToken}
4. Send
```

---

## 🛠️ TESTING DENGAN POWERSHELL

### Example Commands:

**Register:**
```powershell
$json = ConvertTo-Json @{
    username = "testuser"
    password = "password123"
    name = "Test User"
    gender = "Male"
}
Invoke-WebRequest -Uri "http://localhost:3000/api/register" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $json | Select-Object -ExpandProperty Content
```

**Login:**
```powershell
$json = ConvertTo-Json @{
    username = "testuser"
    password = "password123"
}
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/login" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $json
$response.Content | ConvertFrom-Json
```

**Create Journal (Protected):**
```powershell
$accessToken = "eyJhbGciOiJIUzI1NiIs..." # Copy dari login response

$json = ConvertTo-Json @{
    content = "Hari ini sangat menyenangkan"
    mood = "happy"
}
Invoke-WebRequest -Uri "http://localhost:3000/api/journals" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer $accessToken"} `
    -Body $json | Select-Object -ExpandProperty Content
```

---

## 📋 CHECKLIST SEBELUM TEST:

- [ ] Server running (`npm run dev`)
- [ ] Port 3000 accessible
- [ ] Database connected
- [ ] Postman/PowerShell setup benar
- [ ] Headers include `Content-Type: application/json`
- [ ] Protected endpoints include `Authorization: Bearer {token}`
- [ ] Request body JSON valid (tidak ada typo)
- [ ] Method correct (POST, GET, PATCH, DELETE)
- [ ] URL correct (tidak ada typo)

---

## 🔐 TOKEN HANDLING

### Workflow:

```
1. Register → Get user_id
   ↓
2. Login → Get accessToken + refreshToken
   ↓
3. Use accessToken untuk protected endpoints
   ├─ Add header: Authorization: Bearer {accessToken}
   ├─ Token valid 1 hour
   └─ Saat expired → use refreshToken untuk get token baru
   ↓
4. Call /refresh-token endpoint
   ├─ Send refreshToken
   ├─ Get newAccessToken
   └─ Use newAccessToken untuk lanjut request
   ↓
5. After 7 days → refreshToken expired
   └─ User harus login ulang
```

---

## 🎯 COMMON TESTING FLOW:

```
1. Create 3 test users:
   - kiara001 (Female)
   - johndoe (Male)
   - testuser (Other)

2. Login dengan masing-masing user
   → Save tokens untuk testing

3. Create journals dari berbagai users
   → Test keamanan: lihat data user lain

4. Update + Delete journals
   → Verify authorization

5. Test token refresh
   → Simulate 1 hour wait / manual expire

6. Test error cases:
   - Invalid token
   - Missing fields
   - Unauthorized access
   - Not found resources
```

---

## 📝 RESPONSE STATUS CODES:

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Login success, get data |
| 201 | Created | Register, create journal |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Token invalid/expired |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Username already taken |
| 500 | Server Error | Database error |

---

**Happy testing! Gunakan guide ini untuk ujian juga!** 🚀
