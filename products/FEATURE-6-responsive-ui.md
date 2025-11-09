# FEATURE-6: UI/UX Đáp ứng

## Tổng quan

Hệ thống thiết kế hiện đại, đáp ứng được xây dựng với Tailwind CSS, đảm bảo trải nghiệm người dùng xuất sắc trên tất cả các thiết bị và kích thước màn hình.

## Hệ thống Thiết kế

### Bảng màu

**Màu Chính:**
- Primary: `#6366f1` (Indigo-500)
- Primary Dark: `#4f46e5` (Indigo-600)
- Secondary: `#8b5cf6` (Purple-500)

**Màu Chức năng:**
- Success: `#10b981` (Green-500)
- Warning: `#f59e0b` (Amber-500)
- Danger: `#ef4444` (Red-500)

**Nền:**
- Gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Gradient tím sang tím đậm tạo không gian nhập vai

### Kiểu chữ

**Font Stack:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
             'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

**Kích thước:**
- H1: 3rem (48px)
- H2: 1.8rem (28.8px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

### Hệ thống Khoảng cách

Tuân theo thang khoảng cách của Tailwind (gia tăng 4px):
- Tight: 0.5rem (8px)
- Normal: 1rem (16px)
- Relaxed: 1.5rem (24px)
- Loose: 2rem (32px)

## Điểm ngắt Đáp ứng

```css
sm: 640px   /* Mobile ngang */
md: 768px   /* Tablet dọc */
lg: 1024px  /* Tablet ngang / Desktop nhỏ */
xl: 1280px  /* Desktop */
2xl: 1536px /* Desktop lớn */
```

## Phương pháp Mobile-First

### Điều chỉnh Bố cục

**Mobile (< 768px):**
- Bố cục một cột
- Card chiều rộng đầy đủ
- Phần tử biểu mẫu xếp chồng
- Menu hamburger (nếu cần)
- Mục tiêu chạm lớn hơn (tối thiểu 44x44px)

**Tablet (768px - 1024px):**
- Bố cục lưới linh hoạt
- Modal cạnh nhau khi có không gian
- Khoảng cách được tối ưu hóa

**Desktop (> 1024px):**
- Bố cục nhiều cột
- Kích thước modal lớn hơn
- Hiệu ứng di chuột nâng cao
- Nhiều khoảng trắng hơn

## Các thành phần UI

### Card
```css
- Background: white
- Border radius: 20px
- Padding: 30px
- Shadow: 0 10px 15px rgba(0,0,0,0.1)
- Smooth transitions
```

### Nút
```css
- Primary: Nền tím, chữ trắng
- Secondary: Nền trắng, chữ tím
- Rounded: 20px border radius
- Hover: Transform translateY(-2px)
- Active: Trạng thái nhấn
```

### Modal
```css
- Overlay: rgba(0,0,0,0.5) backdrop
- Content: Card trắng với bóng
- Max width: 500px
- Max height: 80vh (có thể cuộn)
- Căn giữa
```

### Phần tử Biểu mẫu
```css
- Input/Select: 12px padding, 10px radius
- Focus: Viền tím
- Hover: Màu viền nhạt hơn
- Disabled: Bị làm xám
```

## Hoạt ảnh

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
Duration: 0.3s
```

### Slide In
```css
@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
Duration: 0.3s
```

### Fade In Down
```css
@keyframes fadeInDown {
  from { transform: translateY(-30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
Duration: 0.6s
```

### Fade In Up
```css
@keyframes fadeInUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
Duration: 0.6s
```

## Tính năng Khả năng Tiếp cận

### Triển khai Hiện tại
- Phần tử HTML ngữ nghĩa
- Hỗ trợ điều hướng bàn phím
- Chỉ báo focus
- Tuân thủ độ tương phản màu sắc (hầu hết)
- Modal nhấp bên ngoài để đóng

### Cải tiến Tương lai
- [ ] Nhãn và vai trò ARIA
- [ ] Thông báo trình đọc màn hình
- [ ] Liên kết bỏ qua đến nội dung
- [ ] Focus trap trong modal
- [ ] Chế độ tương phản cao
- [ ] Hỗ trợ chuyển động giảm
- [ ] Hướng dẫn phím tắt

## Trạng thái Tương tác

### Hiệu ứng Di chuột
- Nút: Nhấc lên nhẹ (-2px translateY)
- Card: Tăng bóng nhẹ
- Liên kết: Thay đổi màu
- Nút đánh giá: Làm nổi bật viền

### Trạng thái Hoạt động
- Nút: Diện mạo nhấn
- Đánh giá đã chọn: Nền được điền
- Danh mục đã chọn: Viền làm nổi bật
- Đầu vào biểu mẫu: Viền được focus

### Trạng thái Tải
- Hiện tại: Cảnh báo cơ bản
- Tương lai: Màn hình khung, spinner

## Thanh cuộn Tùy chỉnh

```css
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 10px;
}
```

## Tối ưu hóa Hiệu suất

### CSS
- Xóa Tailwind CSS (production)
- Nội tuyến CSS quan trọng
- CSS tùy chỉnh tối thiểu
- Module CSS cho style component

### Hoạt ảnh
- Tăng tốc phần cứng (transform, opacity)
- Sử dụng RequestAnimationFrame
- Tương tác debounced
- Tải lười hình ảnh (tương lai)

## Hỗ trợ Trình duyệt

**Đã kiểm tra và được hỗ trợ:**
- Chrome/Edge (mới nhất)
- Firefox (mới nhất)
- Safari (mới nhất)
- Mobile Safari (iOS 14+)
- Chrome Mobile (mới nhất)

**Không được tối ưu hóa cho:**
- IE11 (đã ngừng hỗ trợ)
- Trình duyệt di động rất cũ

## Chỉ số Thành công

- Hiệu suất Lighthouse: > 90
- Kiểm tra thân thiện với di động: Đạt
- Thời gian tải trang: < 3s
- First contentful paint: < 1.5s
- Cumulative layout shift: < 0.1

## Cải tiến Tương lai

- [ ] Chuyển đổi chế độ tối
- [ ] Tùy chỉnh chủ đề
- [ ] Nhiều tùy chọn hoạt ảnh hơn
- [ ] Hiệu ứng Glass morphism
- [ ] Micro-interaction
- [ ] Khung loading skeleton
- [ ] Thông báo Toast
- [ ] Chỉ báo tiến trình
- [ ] Hoạt ảnh confetti (ăn mừng)
- [ ] Hiệu ứng Parallax
