# FEATURE-2: Hệ thống Xác thực Người dùng

## Tổng quan

Hệ thống xác thực người dùng hoàn chỉnh với đăng ký, đăng nhập, quản lý phiên và chức năng đăng xuất.

## Câu chuyện Người dùng

1. **Là người dùng mới**, tôi muốn tạo tài khoản, để tôi có thể lưu tùy chọn của mình và theo dõi lịch sử hoạt động.
2. **Là người dùng quay lại**, tôi muốn đăng nhập an toàn, để tôi có thể truy cập trải nghiệm được cá nhân hóa của mình.
3. **Là người dùng đã đăng nhập**, tôi muốn xem hồ sơ của mình và dễ dàng đăng xuất khi hoàn tất.

## Chi tiết Tính năng

### Đăng ký (Signup)

**Endpoint:** `POST /api/signup`

**Các trường Đầu vào:**
- Tên (bắt buộc, văn bản)
- Email (bắt buộc, định dạng email)
- Mật khẩu (bắt buộc, tối thiểu 6 ký tự)

**Xác thực:**
- Kiểm tra tính duy nhất của email
- Yêu cầu độ mạnh mật khẩu (≥6 ký tự)
- Tất cả các trường bắt buộc

**Luồng Thành công:**
1. Người dùng gửi biểu mẫu đăng ký
2. Server xác thực đầu vào
3. Tạo bản ghi người dùng mới
4. Trả về thông báo thành công
5. Chuyển hướng đến modal đăng nhập (trзадержка 2 giây)

**Dữ liệu Được lưu:**
```json
{
  "id": "timestamp-based-id",
  "name": "User Name",
  "email": "user@example.com",
  "password": "plaintext", // Lưu ý: Không mã hóa trong phiên bản hiện tại
  "createdAt": "ISO-8601-timestamp"
}
```

### Đăng nhập

**Endpoint:** `POST /api/login`

**Các trường Đầu vào:**
- Email (bắt buộc)
- Mật khẩu (bắt buộc)

**Luồng Xác thực:**
1. Người dùng gửi thông tin đăng nhập
2. Server xác thực với `data/users.json`
3. Nếu thành công: Trả về đối tượng người dùng (không có mật khẩu)
4. Client lưu vào localStorage
5. UI cập nhật để hiển thị trạng thái đã đăng nhập

**Quản lý Phiên:**
- Phía client với localStorage
- Khóa: `currentUser`
- Duy trì qua các lần làm mới trang
- Tự động đăng nhập khi tải trang nếu phiên tồn tại

### Hiển thị Hồ sơ Người dùng

Khi đã đăng nhập, người dùng thấy:
- Nút hồ sơ (thay thế nút đăng nhập)
- Hiển thị tên người dùng
- Chỉ báo màu xanh (trạng thái đã đăng nhập)
- Bảng thả xuống với:
  - Tên người dùng
  - Nút đăng xuất

### Đăng xuất

**Luồng:**
1. Người dùng nhấp nút đăng xuất
2. localStorage bị xóa
3. Trạng thái người dùng đặt lại về null
4. UI quay về trạng thái đã đăng xuất
5. Bảng hồ sơ đóng lại

## Người dùng Mặc định

Hệ thống bao gồm 2 người dùng được cấu hình sẵn:

1. **Tài khoản Admin**
   - Email: `admin`
   - Mật khẩu: `admin`
   - Tên: Admin

2. **Tài khoản Kiểm tra**
   - Email: `user`
   - Mật khẩu: `user`
   - Tên: User

## Triển khai Kỹ thuật

**Các thành phần:**
- [website/components/LoginModal.tsx](../website/components/LoginModal.tsx)
- [website/components/SignupModal.tsx](../website/components/SignupModal.tsx)
- [website/components/UserInfo.tsx](../website/components/UserInfo.tsx)

**Các route API:**
- [website/app/api/login/route.ts](../website/app/api/login/route.ts)
- [website/app/api/signup/route.ts](../website/app/api/signup/route.ts)

**Lưu trữ Dữ liệu:**
- [data/users.json](../data/users.json)

**Trạng thái Client:**
- React useState hook
- localStorage để duy trì

## Cân nhắc Bảo mật

### Triển khai Hiện tại
⚠️ **Bảo mật chỉ dành cho phát triển:**
- Mật khẩu lưu dạng văn bản thuần
- Không mã hóa/băm
- Khớp email/mật khẩu đơn giản
- Không bảo vệ CSRF
- Không giới hạn tốc độ

### Khuyến nghị cho Production
- [ ] Triển khai băm mật khẩu bcrypt
- [ ] Sử dụng token JWT cho quản lý phiên
- [ ] Thêm ép buộc HTTPS
- [ ] Triển khai giới hạn tốc độ
- [ ] Thêm token CSRF
- [ ] Xác minh email
- [ ] Luồng đặt lại mật khẩu
- [ ] Hỗ trợ 2FA
- [ ] Khóa tài khoản sau các lần thử thất bại

## Tính năng UI/UX

- Biểu mẫu đăng nhập/đăng ký dựa trên Modal
- Xác thực biểu mẫu với thông báo lỗi
- Thông báo thành công
- Chuyển đổi mượt mà
- Hỗ trợ song ngữ (Tiếng Việt/Tiếng Anh)
- Hỗ trợ điều hướng bàn phím
- Nhấp bên ngoài để đóng modal

## Chỉ số Thành công

- Tỷ lệ hoàn thành đăng ký > 80%
- Tỷ lệ đăng nhập thành công > 95%
- Duy trì phiên hoạt động 100%
- Không có sự cố bảo mật (trong dev)

## Cải tiến Tương lai

- [ ] Tích hợp OAuth (Google, Facebook)
- [ ] Đặt lại mật khẩu qua email
- [ ] Xác minh email
- [ ] Chỉnh sửa hồ sơ
- [ ] Tải lên avatar
- [ ] Lưu trữ tùy chọn người dùng
- [ ] Theo dõi lịch sử hoạt động
- [ ] Tính năng xã hội (bạn bè, chia sẻ)
