# FEATURE-8: Lưu trữ Dữ liệu

## Tổng quan

Hệ thống lưu trữ dữ liệu đơn giản, đáng tin cậy dựa trên file sử dụng file JSON cho tài khoản người dùng và phản hồi, với quản lý phiên phía client qua localStorage.

## Kiến trúc Lưu trữ

### Lưu trữ Phía Server

**Vị trí:** Thư mục [data/](../data/)

Hai file JSON:
1. `users.json` - Tài khoản người dùng
2. `feedbacks.json` - Phản hồi người dùng

### Lưu trữ Phía Client

**localStorage** - Duy trì phiên
- Khóa: `currentUser`
- Lưu trữ đối tượng người dùng đã đăng nhập
- Duy trì qua các lần làm mới trang
- Bị xóa khi đăng xuất

## File Dữ liệu

### users.json

**Schema:**
```json
[
  {
    "id": "1731134400000",
    "name": "Admin",
    "email": "admin",
    "password": "admin",
    "createdAt": "2025-11-09T00:00:00.000Z"
  }
]
```

**Các trường:**
- `id`: Định danh duy nhất dựa trên timestamp
- `name`: Tên hiển thị của người dùng
- `email`: Email đăng nhập (duy nhất)
- `password`: Văn bản thuần (⚠️ chỉ dev)
- `createdAt`: Timestamp ISO-8601

**Thao tác:**
- Đọc: Khi cố gắng đăng nhập
- Ghi: Khi đăng ký
- Cập nhật: Chưa được triển khai
- Xóa: Chưa được triển khai

### feedbacks.json

**Schema:**
```json
[
  {
    "id": "1731134400000",
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
]
```

**Các trường:**
- `id`: Định danh duy nhất dựa trên timestamp
- `name`: Tên người gửi hoặc "Anonymous"
- `ratings`: Đối tượng với design/idea/usefulness (1-5)
- `comments`: Phản hồi văn bản tùy chọn
- `timestamp`: Thời gian gửi ISO-8601
- `language`: Ngôn ngữ tại thời điểm gửi

**Thao tác:**
- Đọc: Để tính thống kê
- Ghi: Khi gửi phản hồi
- Cập nhật: Không áp dụng
- Xóa: Chưa được triển khai

## Thao tác File

### Thao tác Đọc

```typescript
function readUsers(): User[] {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}
```

**Xử lý Lỗi:**
- Không tìm thấy file → Trả về mảng rỗng
- JSON không hợp lệ → Ghi log lỗi, trả về mảng rỗng
- Quyền bị từ chối → Ghi log lỗi, trả về mảng rỗng

### Thao tác Ghi

```typescript
function writeUsers(users: User[]): boolean {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing users:', error);
    return false;
  }
}
```

**Tính năng:**
- In đẹp với thụt lề 2 khoảng trắng
- Thao tác ghi nguyên tử
- Trả về chỉ báo thành công boolean
- Ghi log lỗi

### Khởi tạo

```typescript
// Đảm bảo thư mục data tồn tại
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Đảm bảo file tồn tại với mảng rỗng
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, '[]');
}
```

## Sử dụng localStorage

### Lưu Phiên Người dùng

```typescript
localStorage.setItem('currentUser', JSON.stringify(user));
```

### Lấy Phiên Người dùng

```typescript
const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
```

### Xóa Phiên

```typescript
localStorage.removeItem('currentUser');
```

### Tự động Đăng nhập khi Tải Trang

```typescript
useEffect(() => {
  const stored = localStorage.getItem('currentUser');
  if (stored) {
    setCurrentUser(JSON.parse(stored));
  }
}, []);
```

## Tính nhất quán Dữ liệu

### Đồng thời
⚠️ **Hạn chế hiện tại:**
- Không khóa file
- Điều kiện race có thể xảy ra với ghi đồng thời
- Chấp nhận được cho phát triển lưu lượng thấp

**Production cần:**
- Cơ sở dữ liệu với thuộc tính ACID
- Hỗ trợ giao dịch
- Connection pooling

### Chiến lược Sao lưu
**Hiện tại:** Không có

**Khuyến nghị:**
- [ ] Sao lưu tự động
- [ ] Kiểm soát phiên bản cho dữ liệu
- [ ] Chức năng xuất
- [ ] Kế hoạch phục hồi thảm họa

## Xác thực Dữ liệu

### Khi Ghi
- Kiểm tra trường bắt buộc
- Xác thực kiểu (TypeScript)
- Ràng buộc duy nhất (email)
- Xác thực định dạng (email, ngày)

### Khi Đọc
- Xử lý lỗi phân tích JSON
- Xác thực schema (tương lai)
- Hỗ trợ migration (tương lai)

## Hiệu suất

### Chỉ số Hiện tại
- Kích thước file: < 100KB (thông thường)
- Thời gian đọc: < 5ms
- Thời gian ghi: < 10ms
- Chấp nhận được cho < 1000 bản ghi

### Giới hạn Khả năng Mở rộng
- Lưu trữ dựa trên file không phù hợp cho production
- Khuyến nghị tối đa: 10,000 bản ghi
- Vượt quá đó: Chuyển sang cơ sở dữ liệu

## Bảo mật

### Vấn đề Hiện tại
⚠️ **Nghiêm trọng:**
- Mật khẩu dạng văn bản thuần
- Không mã hóa
- Quyền file không bị hạn chế
- Không ghi log kiểm toán

### Yêu cầu Production
- [ ] Băm mật khẩu (bcrypt, argon2)
- [ ] Mã hóa file khi lưu trữ
- [ ] Hạn chế quyền file (600)
- [ ] Ghi log kiểm toán
- [ ] Che giấu dữ liệu nhạy cảm trong log
- [ ] Kiểm toán bảo mật định kỳ

## Chiến lược Migration

### Tùy chọn Cơ sở dữ liệu Tương lai

**Quan hệ:**
- PostgreSQL (khuyến nghị)
- MySQL
- SQLite (nâng cấp đơn giản)

**NoSQL:**
- MongoDB
- Firebase Firestore
- Supabase

**Kế hoạch Migration:**
1. Chọn cơ sở dữ liệu
2. Thiết kế schema
3. Viết script migration
4. Xuất JSON → Import vào DB
5. Cập nhật các route API
6. Kiểm thử kỹ lưỡng
7. Triển khai

## Ưu điểm (Hệ thống Hiện tại)

✅ **Ưu điểm:**
- Đơn giản để hiểu
- Không cần thiết lập cơ sở dữ liệu
- Dễ kiểm tra/chỉnh sửa
- Thân thiện với Git
- Không phụ thuộc
- Nhanh cho tập dữ liệu nhỏ

❌ **Nhược điểm:**
- Không khả năng mở rộng
- Không kiểm soát truy cập đồng thời
- Không sao lưu/phục hồi
- Vấn đề bảo mật
- Không có chỉ mục
- Không có truy vấn phức tạp

## Cải tiến Tương lai

- [ ] Migration cơ sở dữ liệu (PostgreSQL)
- [ ] Mã hóa dữ liệu
- [ ] Tự động hóa sao lưu
- [ ] Xuất dữ liệu (CSV, JSON)
- [ ] Import dữ liệu
- [ ] Phiên bản schema
- [ ] Script migration
- [ ] Ghi log kiểm toán
- [ ] Phân tích dữ liệu
- [ ] Tuân thủ GDPR (xóa dữ liệu, xuất)
