# FEATURE-7: Kiến trúc API

## Tổng quan

RESTful API được xây dựng với Next.js 15 App Router, cung cấp chức năng backend thông qua các trình xử lý route dựa trên file với an toàn kiểu TypeScript.

## Cấu trúc API

**Vị trí:** [website/app/api/](../website/app/api/)

### Các endpoint

| Phương thức | Endpoint | Mô tả |
|--------|----------|-------------|
| POST | `/api/signup` | Đăng ký người dùng mới |
| POST | `/api/login` | Xác thực người dùng |
| POST | `/api/feedback` | Gửi phản hồi |
| GET | `/api/stats` | Lấy thống kê phản hồi |

## Trình xử lý Route

### 1. API Đăng ký
**File:** [website/app/api/signup/route.ts](../website/app/api/signup/route.ts)

**Request:**
```typescript
POST /api/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123"
}
```

**Response (Thành công):**
```json
{
  "success": true,
  "userId": "1731134400000"
}
```

**Response (Lỗi):**
```json
{
  "error": "Email already exists"
}
```

**Xác thực:**
- Tất cả các trường bắt buộc
- Email phải duy nhất
- Mật khẩu tối thiểu 6 ký tự

### 2. API Đăng nhập
**File:** [website/app/api/login/route.ts](../website/app/api/login/route.ts)

**Request:**
```typescript
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure123"
}
```

**Response (Thành công):**
```json
{
  "success": true,
  "user": {
    "id": "1731134400000",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-11-09T00:00:00.000Z"
  }
}
```

**Response (Lỗi):**
```json
{
  "error": "Invalid email or password"
}
```

**Bảo mật:**
- Mật khẩu không được trả về trong response
- Khớp email/mật khẩu đơn giản
- Không giới hạn tốc độ (TODO cho production)

### 3. API Phản hồi
**File:** [website/app/api/feedback/route.ts](../website/app/api/feedback/route.ts)

**Request:**
```typescript
POST /api/feedback
Content-Type: application/json

{
  "name": "John Doe",
  "ratings": {
    "design": 5,
    "idea": 4,
    "usefulness": 5
  },
  "comments": "Great app!",
  "timestamp": "2025-11-09T05:00:00.000Z",
  "language": "vi"
}
```

**Response:**
```json
{
  "success": true,
  "id": "1731134400000"
}
```

**Xác thực:**
- Tất cả đánh giá (design, idea, usefulness) bắt buộc
- Đánh giá phải từ 1-5
- Tên mặc định là "Anonymous" nếu trống

### 4. API Thống kê
**File:** [website/app/api/stats/route.ts](../website/app/api/stats/route.ts)

**Request:**
```typescript
GET /api/stats
```

**Response:**
```json
{
  "total": 42,
  "averages": {
    "design": "4.52",
    "idea": "4.33",
    "usefulness": "4.67"
  }
}
```

**Tính toán:**
- Đọc tất cả phản hồi từ JSON
- Tính trung bình cho mỗi danh mục đánh giá
- Trả về tổng số và trung bình làm tròn 2 chữ số thập phân

## Triển khai Kỹ thuật

### Mẫu Trình xử lý Route Next.js

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Process request
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error message' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  // Handle GET request
  return NextResponse.json({ data: 'response' });
}
```

### Thao tác Hệ thống File

**Thao tác Đọc:**
```typescript
function readUsers(): User[] {
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(data);
}
```

**Thao tác Ghi:**
```typescript
function writeUsers(users: User[]): boolean {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  return true;
}
```

### Đường dẫn Dữ liệu

Các route API sử dụng đường dẫn tương đối để truy cập thư mục data:
```typescript
const USERS_FILE = path.join(process.cwd(), '..', 'data', 'users.json');
const FEEDBACKS_FILE = path.join(process.cwd(), '..', 'data', 'feedbacks.json');
```

## Xử lý Lỗi

### Mã trạng thái HTTP

- `200` - Thành công (GET)
- `201` - Đã tạo (POST thành công)
- `400` - Yêu cầu không hợp lệ (lỗi xác thực)
- `401` - Không được phép (đăng nhập thất bại)
- `404` - Không tìm thấy
- `500` - Lỗi Server nội bộ

### Định dạng Response Lỗi

```typescript
{
  "error": "Thông báo lỗi có thể đọc được"
}
```

## Cấu hình CORS

Hiện tại: **Không có hạn chế CORS** (chỉ cùng nguồn gốc)

Tương lai: Có thể cần CORS nếu frontend/backend được tách biệt

## An toàn Kiểu

### Interface TypeScript

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

interface Feedback {
  id: string;
  name: string;
  ratings: {
    design: number;
    idea: number;
    usefulness: number;
  };
  comments: string;
  timestamp: string;
  language: string;
}

interface Stats {
  total: number;
  averages: {
    design: string;
    idea: string;
    usefulness: string;
  };
}
```

## Cân nhắc Hiệu suất

### Hiện tại
- I/O file đồng bộ
- Không có bộ nhớ cache
- Phân tích JSON trực tiếp
- Kích thước dữ liệu nhỏ có thể chấp nhận được

### Tối ưu hóa Tương lai
- [ ] Thao tác file bất đồng bộ
- [ ] Bộ nhớ cache trong RAM
- [ ] Di chuyển cơ sở dữ liệu (PostgreSQL, MongoDB)
- [ ] Giới hạn tốc độ
- [ ] Nén response
- [ ] Phiên bản API
- [ ] Cân nhắc GraphQL

## Cân nhắc Bảo mật

### Triển khai Hiện tại
⚠️ **Chỉ dành cho phát triển:**
- Lưu trữ mật khẩu văn bản thuần
- Không làm sạch đầu vào
- Không bảo vệ SQL injection (N/A - JSON)
- Không bảo vệ XSS
- Không có token CSRF
- Không có token xác thực

### Yêu cầu Production
- [ ] Băm mật khẩu (bcrypt)
- [ ] Xác thực JWT
- [ ] Xác thực & làm sạch đầu vào
- [ ] Giới hạn tốc độ
- [ ] Chỉ HTTPS
- [ ] Header bảo mật
- [ ] Chính sách CORS
- [ ] Ghi log yêu cầu
- [ ] Dịch vụ ghi log lỗi

## Kiểm thử

### Kiểm thử Thủ công
- Bộ sưu tập Postman/Insomnia
- Tab network của công cụ dev trình duyệt
- Kiểm thử tích hợp frontend

### Kiểm thử Tự động Tương lai
- [ ] Unit test (Jest/Vitest)
- [ ] Integration test
- [ ] E2E test (Playwright/Cypress)
- [ ] Load testing
- [ ] Tài liệu API (Swagger/OpenAPI)

## Giám sát

### Triển khai Tương lai
- [ ] Ghi log yêu cầu
- [ ] Theo dõi lỗi (Sentry)
- [ ] Giám sát hiệu suất
- [ ] Phân tích API
- [ ] Giám sát uptime
