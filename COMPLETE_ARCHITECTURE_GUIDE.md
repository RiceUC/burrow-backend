# 📚 COMPLETE ARCHITECTURE GUIDE - Journal Feature

**Rangkuman Lengkap: Backend + Frontend Integration dengan Contoh Real**

---

## 🗺️ COMPLETE FLOW - Journal Feature

```
┌─────────────────────────────────────────────────────────────────────────┐
│ FRONTEND (Android/Kotlin)                                              │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ JournalListScreen (UI)                                           │   │
│ │ ├─ Display: List of journals                                    │   │
│ │ └─ Events: User click + button, swipe delete, edit              │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                            ↓ (User Interaction)                        │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ JournalViewModel (Logic - sama seperti Controller)              │   │
│ │ ├─ State Management: StateFlow (reactive)                       │   │
│ │ ├─ fetchJournals(userId)                                        │   │
│ │ ├─ addJournal(userId, content, mood)                            │   │
│ │ ├─ updateJournal(journalId, content, mood)                      │   │
│ │ └─ deleteJournal(journalId)                                     │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                            ↓ (Call API)                                │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ JournalRepository (Bridge to API)                               │   │
│ │ ├─ createJournal(request)                                       │   │
│ │ ├─ getJournals(userId)                                          │   │
│ │ ├─ updateJournal(journalId, request)                            │   │
│ │ └─ deleteJournal(journalId)                                     │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                            ↓ (HTTP Request)                            │
└─────────────────────────────────────────────────────────────────────────┘
                            ↓ (Network)
┌─────────────────────────────────────────────────────────────────────────┐
│ BACKEND (Node.js/Express)                                              │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ Routes (Routing)                                                │   │
│ │ ├─ POST /api/journals → createJournal                           │   │
│ │ ├─ GET /api/journals/user/:userId → getJournalsByUser          │   │
│ │ ├─ GET /api/journals/single/:id → getJournalById               │   │
│ │ ├─ PATCH /api/journals/:id → updateJournal                     │   │
│ │ └─ DELETE /api/journals/:id → deleteJournal                    │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                            ↓ (Route Matching)                          │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ Middleware (Auth Middleware)                                    │   │
│ │ ├─ Extract JWT token dari header                               │   │
│ │ ├─ Verify token validity                                       │   │
│ │ └─ Inject user_id ke req.user                                  │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                            ↓ (Request Processing)                      │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ Controller (journal-controller.ts)                              │   │
│ │ ├─ createJournal(req, res, next)                               │   │
│ │ ├─ getJournalsByUser(req, res, next)                           │   │
│ │ ├─ getJournalById(req, res, next)                              │   │
│ │ ├─ updateJournal(req, res, next)                               │   │
│ │ └─ deleteJournal(req, res, next)                               │   │
│ │                                                                 │   │
│ │ Responsibility:                                                 │   │
│ │ ├─ Extract data dari req.body & req.params                    │   │
│ │ ├─ Call service layer                                         │   │
│ │ └─ Return response (status + data)                            │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                            ↓ (Call Service)                            │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ Service (journal-service.ts)                                    │   │
│ │ ├─ create(request)                                             │   │
│ │ ├─ getById(journalId)                                          │   │
│ │ ├─ getByUserId(userId)                                         │   │
│ │ ├─ update(journalId, userId, updateData)                       │   │
│ │ └─ delete(journalId, userId)                                   │   │
│ │                                                                 │   │
│ │ Responsibility:                                                 │   │
│ │ ├─ Validate data (gunakan validation layer)                   │   │
│ │ ├─ Business logic (check ownership, etc)                       │   │
│ │ ├─ Database operations (Prisma)                                │   │
│ │ └─ Error handling                                              │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                            ↓ (Validate & Process)                      │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ Validation (journal-validation.ts)                              │   │
│ │ ├─ CREATE schema:                                              │   │
│ │ │  ├─ user_id: number                                          │   │
│ │ │  ├─ content: string                                          │   │
│ │ │  └─ mood: enum (happy, sad, tired, angry)                   │   │
│ │ └─ UPDATE schema:                                              │   │
│ │    ├─ content: string (optional)                               │   │
│ │    └─ mood: enum (optional)                                    │   │
│ │                                                                 │   │
│ │ Technology: Zod (TypeScript schema validation)                 │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                            ↓ (Validate Schema)                         │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ Prisma Client (ORM - Database Layer)                            │   │
│ │ ├─ prisma.journal.create()                                     │   │
│ │ ├─ prisma.journal.findUnique()                                 │   │
│ │ ├─ prisma.journal.findMany()                                   │   │
│ │ ├─ prisma.journal.update()                                     │   │
│ │ └─ prisma.journal.delete()                                     │   │
│ │                                                                 │   │
│ │ Model (from prisma/schema.prisma):                              │   │
│ │ ├─ journal_id (int, PK)                                        │   │
│ │ ├─ user_id (int, FK)                                           │   │
│ │ ├─ content (string)                                            │   │
│ │ ├─ mood (enum: happy, sad, tired, angry)                       │   │
│ │ └─ created_at (datetime)                                       │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                            ↓ (SQL Query)                               │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ PostgreSQL Database                                             │   │
│ │ ├─ journals table (actual storage)                              │   │
│ │ ├─ users table (related data)                                   │   │
│ │ └─ Relationships enforced via FK                                │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                            ↓ (Data)                                    │
└─────────────────────────────────────────────────────────────────────────┘
                            ↓ (HTTP Response)
┌─────────────────────────────────────────────────────────────────────────┐
│ FRONTEND (Receive & Update UI)                                         │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ Response:                                                       │   │
│ │ {                                                               │   │
│ │   "status": 201,                                               │   │
│ │   "message": "Journal berhasil dibuat",                         │   │
│ │   "data": {                                                     │   │
│ │     "journal_id": 1,                                            │   │
│ │     "user_id": 7,                                              │   │
│ │     "content": "Hari ini menyenangkan",                         │   │
│ │     "mood": "happy",                                            │   │
│ │     "created_at": "2025-12-16T..."                              │   │
│ │   }                                                             │   │
│ │ }                                                               │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                            ↓                                            │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ ViewModel (Update State)                                        │   │
│ │ ├─ _journals.value = newList                                   │   │
│ │ └─ Emit via StateFlow                                          │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                            ↓ (StateFlow Emission)                      │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ UI (Reactive Update)                                            │   │
│ │ ├─ Observe: val journals by viewModel.journals.collectAsState()│   │
│ │ └─ Render: LaunchedEffect(journals) { ... }                    │   │
│ └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 REAL EXAMPLE: CREATE JOURNAL

### **STEP 1: User Interaction (Frontend)**

```kotlin
// JournalEntryScreen.kt
Button(
    onClick = {
        viewModel.addJournal(
            userId = 7,
            content = "Hari ini sangat menyenangkan",
            mood = MoodType.HAPPY,
            onComplete = { navController.popBackStack() }
        )
    }
)
```

---

### **STEP 2: ViewModel Processing (Frontend)**

```kotlin
// JournalViewModel.kt
fun addJournal(
    userId: Int,
    content: String,
    mood: MoodType,
    onComplete: () -> Unit = {}
) {
    _isSaving.value = true  // Show loading
    
    viewModelScope.launch {  // Non-blocking coroutine
        val request = JournalRequest(
            user_id = userId,
            content = content,
            mood = mood.name.lowercase()  // Convert HAPPY → happy
        )

        journalRepository.createJournal(request)
            .onSuccess { journal ->
                // Update list
                _journals.value = _journals.value + listOf(journal)
                _isSaving.value = false
                onComplete()  // Navigate back
            }
            .onFailure { e ->
                Log.e("JournalVM", "Error: ${e.message}")
                _isSaving.value = false
            }
    }
}
```

**What happens:**
- ViewModel is like Controller (menerima user action, process logic)
- StateFlow is reactive (UI auto-update when data changes)
- viewModelScope.launch is Coroutine (async, non-blocking)
- onComplete callback sequencing (action setelah API berhasil)

---

### **STEP 3: Repository Call (Frontend)**

```kotlin
// JournalRepository.kt
suspend fun createJournal(request: JournalRequest): Result<Journal> {
    return try {
        val response = apiService.createJournal(request)
        Result.success(response)
    } catch (e: Exception) {
        Result.failure(e)
    }
}
```

**What happens:**
- Repository is bridge layer (talk to API)
- Wraps API response in Result type
- Handle error gracefully

---

### **STEP 4: API Call (Network)**

```kotlin
// ApiService.kt (Retrofit)
@POST("api/journals")
suspend fun createJournal(
    @Body request: JournalRequest
): Journal
```

**HTTP Request sent:**
```
POST http://localhost:3000/api/journals HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
    "user_id": 7,
    "content": "Hari ini sangat menyenangkan",
    "mood": "happy"
}
```

---

### **STEP 5: Backend Routing**

```typescript
// src/routes/private-api.ts
privateRouter.post('/journals', createJournal)

// Expanded:
POST /api/journals → createJournal controller function
```

**What happens:**
- Express matches route
- Auth middleware verify token (already done)
- Call controller function

---

### **STEP 6: Backend Controller**

```typescript
// src/controllers/journal-controller.ts
export async function createJournal(
    req: Request, 
    res: Response, 
    next: NextFunction
) {
    try {
        const { content, mood } = req.body
        const userId = (req as any).user.user_id  // From auth middleware

        const request: CreateJournalRequest = {
            user_id: userId,
            content,
            mood
        }

        const journal = await JournalService.create(request)

        res.status(201).json({
            status: 201,
            message: "Journal berhasil dibuat",
            data: journal
        })
    } catch (error) {
        next(error)  // Pass to error middleware
    }
}
```

**What happens:**
- Extract data from request
- Extract userId from JWT token (injected by middleware)
- Call service layer
- Return response

---

### **STEP 7: Backend Service (Business Logic)**

```typescript
// src/services/journal-service.ts
static async create(request: CreateJournalRequest): Promise<Journal> {
    // 1. VALIDATE
    const validated = Validation.validate(
        JournalValidation.CREATE, 
        request
    )
    
    // 2. BUSINESS LOGIC
    const journal = await prismaClient.journal.create({
        data: {
            user_id: validated.user_id,
            content: validated.content,
            mood: validated.mood  // Already lowercase from frontend
        }
    })
    
    // 3. RETURN
    return journal
}
```

**What happens:**
- Validate using Zod schema
- Create record di database via Prisma
- Return new journal

---

### **STEP 8: Validation Layer**

```typescript
// src/validations/journal-validation.ts
static readonly CREATE: ZodType = z.object({
    user_id: z.number().int().positive(),
    content: z.string().min(1, "Content cannot be empty"),
    mood: z.enum(["happy", "sad", "tired", "angry"])
})
```

**Schema validation:**
- user_id: number, positive
- content: string, not empty
- mood: must be one of enum values

---

### **STEP 9: Database Model & Storage**

```prisma
// prisma/schema.prisma
model Journal {
    journal_id Int       @id @default(autoincrement())
    user_id    Int
    content    String
    mood       String    // Could use enum type, but String works
    created_at DateTime  @default(now())
    
    // Relation
    user       User      @relation(fields: [user_id], references: [user_id])
}
```

**Prisma Client executes:**
```sql
INSERT INTO journals (user_id, content, mood, created_at)
VALUES (7, 'Hari ini sangat menyenangkan', 'happy', NOW())
RETURNING *;
```

---

### **STEP 10: Response Back to Frontend**

```json
{
    "status": 201,
    "message": "Journal berhasil dibuat",
    "data": {
        "journal_id": 1,
        "user_id": 7,
        "content": "Hari ini sangat menyenangkan",
        "mood": "happy",
        "created_at": "2025-12-16T02:00:00.000Z"
    }
}
```

---

### **STEP 11: Frontend Receives & Updates**

```kotlin
// Back in JournalRepository.onSuccess
journalRepository.createJournal(request)
    .onSuccess { journal →
        // Update StateFlow
        _journals.value = _journals.value + listOf(journal)
        _isSaving.value = false
        onComplete()
    }

// ViewModel StateFlow emits
// LaunchedEffect in screen detects change
// Screen re-renders with new journal in list
```

---

## 🏗️ ARCHITECTURE COMPONENTS BREAKDOWN

### **FRONTEND COMPONENTS:**

#### **1. View (Composable/Screen)**
```kotlin
// JournalListScreen.kt
@Composable
fun JournalListScreen(
    viewModel: JournalViewModel,
    userId: Int,
    onAdd: () -> Unit,
    onEdit: (Int) -> Unit
) {
    val journals by viewModel.journals.collectAsState(initial = emptyList())
    val isSaving by viewModel.isSaving.collectAsState()
    
    // Render UI based on state
}
```
**Purpose:** Display UI, handle user interactions

#### **2. ViewModel (Logic)**
```kotlin
// JournalViewModel.kt
class JournalViewModel(
    private val journalRepository: JournalRepository
) : ViewModel() {
    private val _journals = MutableStateFlow<List<Journal>>(emptyList())
    val journals: StateFlow<List<Journal>> = _journals.asStateFlow()
    
    fun fetchJournals(userId: Int) { ... }
    fun addJournal(...) { ... }
    fun updateJournal(...) { ... }
    fun deleteJournal(...) { ... }
}
```
**Purpose:** 
- Manage state (what to display)
- Handle business logic (what to do)
- Bridge between View and Repository

#### **3. Repository (Data Access)**
```kotlin
// JournalRepository.kt
class JournalRepository(
    private val apiService: ApiService
) {
    suspend fun createJournal(request: JournalRequest): Result<Journal> { ... }
    suspend fun getJournals(userId: Int): Result<List<Journal>> { ... }
    suspend fun updateJournal(...): Result<Journal> { ... }
    suspend fun deleteJournal(...): Result<Unit> { ... }
}
```
**Purpose:** 
- Talk to backend API
- Handle network errors
- Transform data if needed

---

### **BACKEND COMPONENTS:**

#### **1. Routes**
```typescript
// src/routes/private-api.ts
privateRouter.post('/journals', createJournal)
privateRouter.get('/journals/user/:userId', getJournalsByUser)
privateRouter.get('/journals/single/:id', getJournalById)
privateRouter.put('/journals/:id', updateJournal)
privateRouter.delete('/journals/:id', deleteJournal)
```
**Purpose:** Map HTTP requests to controller functions

#### **2. Middleware (Auth)**
```typescript
// src/middlewares/auth-middleware.ts
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]
    
    if (!token) {
        return res.status(401).json({ errors: "Token required" })
    }
    
    try {
        const user = verifyToken(token)
        (req as any).user = user  // Inject user into request
        next()
    } catch {
        res.status(401).json({ errors: "jwt expired" })
    }
}
```
**Purpose:**
- Verify JWT token
- Protect routes (only authenticated users can access)
- Inject user data into request

#### **3. Controller (HTTP Handler)**
```typescript
// src/controllers/journal-controller.ts
export async function createJournal(
    req: Request, 
    res: Response, 
    next: NextFunction
) {
    try {
        const { content, mood } = req.body
        const userId = (req as any).user.user_id
        
        const request: CreateJournalRequest = { user_id: userId, content, mood }
        const journal = await JournalService.create(request)
        
        res.status(201).json({
            status: 201,
            message: "Journal berhasil dibuat",
            data: journal
        })
    } catch (error) {
        next(error)
    }
}
```
**Purpose:**
- Extract request data
- Call service
- Return response

#### **4. Service (Business Logic)**
```typescript
// src/services/journal-service.ts
export class JournalService {
    static async create(request: CreateJournalRequest): Promise<Journal> {
        // Validate
        const validated = Validation.validate(
            JournalValidation.CREATE, 
            request
        )
        
        // Create in database
        const journal = await prismaClient.journal.create({
            data: {
                user_id: validated.user_id,
                content: validated.content,
                mood: validated.mood
            }
        })
        
        return journal
    }
    
    static async getById(journalId: Int): Promise<Journal> {
        const journal = await prismaClient.journal.findUnique({
            where: { journal_id: journalId }
        })
        if (!journal) throw new ResponseError(404, "Journal not found")
        return journal
    }
    
    static async getByUserId(userId: Int): Promise<Journal[]> {
        return await prismaClient.journal.findMany({
            where: { user_id: userId }
        })
    }
    
    static async update(
        journalId: Int, 
        userId: Int, 
        updateData: Partial<Journal>
    ): Promise<Journal> {
        // Check ownership
        const journal = await this.getById(journalId)
        if (journal.user_id !== userId) {
            throw new ResponseError(403, "Not your journal")
        }
        
        // Update
        return await prismaClient.journal.update({
            where: { journal_id: journalId },
            data: updateData
        })
    }
    
    static async delete(journalId: Int, userId: Int): Promise<void> {
        // Check ownership
        const journal = await this.getById(journalId)
        if (journal.user_id !== userId) {
            throw new ResponseError(403, "Not your journal")
        }
        
        // Delete
        await prismaClient.journal.delete({
            where: { journal_id: journalId }
        })
    }
}
```
**Purpose:**
- Validate input (using validation schema)
- Implement business rules (check ownership, etc)
- Talk to database via Prisma
- Return data or errors

#### **5. Validation (Schema & Rules)**
```typescript
// src/validations/journal-validation.ts
export class JournalValidation {
    static readonly CREATE: ZodType = z.object({
        user_id: z.number().int().positive("User ID must be positive"),
        content: z.string().min(1, "Content cannot be empty"),
        mood: z.enum(
            ["happy", "sad", "tired", "angry"],
            { message: "Mood harus salah satu dari: happy, sad, tired, angry" }
        )
    })
    
    static readonly UPDATE: ZodType = z.object({
        content: z.string().min(1, "Content cannot be empty").optional(),
        mood: z.enum(["happy", "sad", "tired", "angry"]).optional()
    })
}
```
**Purpose:**
- Define schema (what data is valid)
- Validate at service level (before database operation)
- Provide clear error messages

#### **6. Models (Data Structure)**

**Database Model (Prisma Schema):**
```prisma
model Journal {
    journal_id Int       @id @default(autoincrement())
    user_id    Int
    content    String
    mood       String
    created_at DateTime  @default(now())
    
    user       User      @relation(fields: [user_id], references: [user_id])
}
```

**Request Model (Data sent from frontend):**
```typescript
// src/models/journal-model.ts
interface CreateJournalRequest {
    user_id: number
    content: string
    mood: string  // "happy", "sad", etc
}

interface JournalUpdateRequest {
    content?: string
    mood?: string
}
```

**Response Model (Data returned to frontend):**
```typescript
interface Journal {
    journal_id: number
    user_id: number
    content: string
    mood: string
    created_at: Date
}
```

**Purpose:** Define structure for data flowing through system

#### **7. Database (PostgreSQL)**
```sql
-- Actual table in PostgreSQL
CREATE TABLE journals (
    journal_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    content TEXT NOT NULL,
    mood VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Persistent data storage

---

## 📊 DATA FLOW COMPARISON

### **Frontend: View ← ViewModel ← Repository ← API**

```
User clicks button
    ↓
ViewModel.addJournal() called
    ↓
Repository.createJournal() called
    ↓
ApiService.createJournal() sends HTTP POST
    ↓
Response received
    ↓
ViewModel._journals.value updated
    ↓
StateFlow emits
    ↓
View observes and re-renders
```

### **Backend: Routes → Middleware → Controller → Service → Database**

```
HTTP POST /api/journals received
    ↓
Route matching: '/journals' → createJournal handler
    ↓
Auth middleware: verify JWT token
    ↓
Controller.createJournal(req, res, next)
    ├─ Extract data from req.body
    ├─ Extract userId from req.user (from middleware)
    └─ Call service
    ↓
Service.create(request)
    ├─ Validate with Zod schema
    ├─ Call Prisma
    └─ Return result
    ↓
Prisma executes SQL
    ↓
Database creates record
    ↓
Database returns new journal
    ↓
Service returns journal
    ↓
Controller returns HTTP response (201)
```

---

## 🔐 SECURITY LAYER

### **Authentication (Verify User):**
```typescript
// authMiddleware checks JWT token
// Extract user_id from token payload
(req as any).user = { user_id: 7, username: "kiara001" }
```

### **Authorization (Check Ownership):**
```typescript
// In service.update()
const journal = await this.getById(journalId)
if (journal.user_id !== userId) {
    throw new ResponseError(403, "Not your journal")
}
```

**Flow:**
```
Request → JWT token valid? (Authentication)
        ↓
        Journal belongs to user? (Authorization)
        ↓
        Allowed → Process
        ↓
        Not allowed → 403 Forbidden
```

---

## 🎯 SETUP CHECKLIST

### **Backend Setup:**
```bash
# 1. Initialize
npm install

# 2. Setup database (di-run setiap ada perubahan schema)
npx prisma migrate dev --name "init"

# 3. Generate Prisma Client (untuk ngobrol sama database)
npx prisma generate

# 4. Run server
npm run dev
```

### **Database Setup:**
```
1. Schema defined di prisma/schema.prisma
2. Migration creates tables di PostgreSQL
3. Prisma Client generated di generated/prisma
4. Models auto-mapped (prisma.journal, prisma.user, etc)
```

### **Frontend Setup:**
```kotlin
// 1. ViewModel with StateFlow
class JournalViewModel : ViewModel() {
    private val _journals = MutableStateFlow<List<Journal>>(emptyList())
    val journals: StateFlow<List<Journal>> = _journals.asStateFlow()
}

// 2. Repository with API
class JournalRepository(apiService: ApiService) { ... }

// 3. Screen with Compose
@Composable
fun JournalListScreen(viewModel: JournalViewModel) {
    val journals by viewModel.journals.collectAsState()
}
```

---

## 🎓 UNTUK UJIAN - SAMPAIKAN:

**"Architecture Burrow Backend + Frontend:**

**1. Frontend (Android/Kotlin) - MVVM Pattern:**
- View (Composable): Display UI
- ViewModel: Logic + StateFlow (reactive state)
- Repository: API communication
- Model: Data class

**2. Backend (Node.js) - MVC Pattern:**
- Routes: HTTP endpoint mapping
- Middleware: Auth & validation
- Controller: Request handler
- Service: Business logic
- Validation: Zod schema
- Model: Database schema (Prisma)

**3. Data Flow:**
- Frontend: User action → ViewModel → Repository → API call
- Backend: HTTP request → Middleware → Controller → Service → Database
- Response: Database → Service → Controller → HTTP response → ViewModel → UI update

**4. Key Concepts:**
- StateFlow: Reactive state management (replaces LiveData)
- Coroutines: Async operations (non-blocking)
- Prisma: ORM untuk database abstraction
- JWT: Token-based authentication
- Validation: Zod schema validation

**5. Security:**
- Authentication: JWT token verification di middleware
- Authorization: Check ownership di service layer
- Error handling: ResponseError untuk consistent error format

**6. Journal Feature Specific:**
- Create: POST /api/journals (need token)
- Read: GET /api/journals/user/:userId (check ownership)
- Update: PATCH /api/journals/:id (check ownership)
- Delete: DELETE /api/journals/:id (check ownership)

**7. Validation Example:**
- Frontend: Mood must be lowercase + one of enum
- Backend: Zod validates same rules
- Database: Store as string

**8. Why Two Models:**
- Database model: Define schema (Prisma)
- Request model: Define what client sends
- Response model: Define what server returns
- All three ensure type safety & validation"

---

**Semoga jelas sekarang! Ini adalah complete picture untuk ujian kamu!** 🚀
