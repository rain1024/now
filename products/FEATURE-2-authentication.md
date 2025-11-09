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

## Testing - Implemented

### E2E Tests with Playwright

**Test Infrastructure:**
- Playwright v1.56.1
- Multi-browser support: Chromium, Firefox, WebKit
- Mobile viewport testing: Mobile Chrome, Mobile Safari
- Auto-starting dev server
- HTML test reports with screenshots and traces

**Test Files:**
- [website/e2e/login.spec.ts](../website/e2e/login.spec.ts) - 10 test cases
- [website/e2e/signup.spec.ts](../website/e2e/signup.spec.ts) - 6 test cases
- [website/e2e/helpers.ts](../website/e2e/helpers.ts) - Common utilities
- [website/e2e/README.md](../website/e2e/README.md) - Testing documentation

### Login Feature Tests (10 tests)

1. ✓ Display login modal when clicking on 3D scene
2. ✓ Successfully login with valid credentials
3. ✓ Show error for invalid credentials
4. ✓ Show validation errors for empty fields
5. ✓ Persist login after page reload
6. ✓ Logout successfully
7. ✓ Support login with different user accounts
8. ✓ Close login modal when clicking close button
9. ✓ Handle network errors gracefully

### Signup Feature Tests (6 tests)

1. ✓ Display signup modal when clicking signup button
2. ✓ Successfully register a new user
3. ✓ Show validation errors for empty fields
4. ✓ Show error for existing email
5. ✓ Switch between signup and login modals
6. ✓ Close signup modal when clicking close button

### Test Commands

```bash
# Run all E2E tests
yarn test:e2e

# Run with UI mode (interactive)
yarn test:e2e:ui

# Run in headed mode (see browser)
yarn test:e2e:headed

# Debug tests
yarn test:e2e:debug

# View test report
yarn test:e2e:report

# Run specific test file
yarn test:e2e login.spec.ts
yarn test:e2e signup.spec.ts

# Run on specific browser
yarn test:e2e --project=chromium
yarn test:e2e --project=firefox
yarn test:e2e --project=webkit
```

### Test Coverage

**Total:** 75 tests across 5 browsers (15 tests × 5 browsers)
- **Login tests:** 50 tests (10 × 5 browsers)
- **Signup tests:** 25 tests (5 × 5 browsers)

**Coverage areas:**
- ✓ Modal display and interaction
- ✓ Form validation (client and server-side)
- ✓ Successful authentication flows
- ✓ Error handling and messages
- ✓ Session persistence (localStorage)
- ✓ Logout functionality
- ✓ Network error handling
- ✓ Cross-browser compatibility
- ✓ Mobile viewport support
- ✓ UI state transitions

## Cải tiến Tương lai

- [ ] Tích hợp OAuth (Google, Facebook)
- [ ] Đặt lại mật khẩu qua email
- [ ] Xác minh email
- [ ] Chỉnh sửa hồ sơ
- [ ] Tải lên avatar
- [ ] Lưu trữ tùy chọn người dùng
- [ ] Theo dõi lịch sử hoạt động
- [ ] Tính năng xã hội (bạn bè, chia sẻ)
