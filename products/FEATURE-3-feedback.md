# FEATURE-3: Hệ thống Thu thập Phản hồi

## Tổng quan

Cơ chế phản hồi toàn diện cho phép người dùng đánh giá và bình luận về thiết kế, ý tưởng và tính hữu ích của ứng dụng.

## Câu chuyện Người dùng

**Là một người dùng**, tôi muốn cung cấp phản hồi về ứng dụng, để các nhà phát triển có thể cải thiện sản phẩm dựa trên trải nghiệm của tôi.

## Chi tiết Tính năng

### Modal Phản hồi

**Kích hoạt:** Nhấp nút "Góp ý" (Feedback) ở góc trên bên trái

**Các trường Đầu vào:**

1. **Tên** (Tùy chọn)
   - Đầu vào văn bản
   - Mặc định là "Anonymous" nếu để trống
   - Cho phép người dùng ẩn danh

2. **Đánh giá Thiết kế** (Bắt buộc, 1-5)
   - Đánh giá dựa trên nút trực quan
   - Đánh giá chất lượng UI/UX
   - Lựa chọn tương tác với phản hồi trực quan

3. **Đánh giá Ý tưởng** (Bắt buộc, 1-5)
   - Đánh giá khái niệm cốt lõi/đề xuất giá trị
   - Giao diện trực quan giống như đánh giá thiết kế

4. **Đánh giá Tính hữu ích** (Bắt buộc, 1-5)
   - Đánh giá tính tiện dụng thực tế
   - Đo lường giá trị thực tế

5. **Bình luận Chi tiết** (Tùy chọn)
   - Textarea cho phản hồi định tính
   - Suy nghĩ người dùng mở
   - Giới hạn ký tự: Không có (sử dụng hợp lý được mong đợi)

### Thang Đánh giá

**1 Sao:** Kém / Không hài lòng
**2 Sao:** Dưới trung bình / Cần cải thiện
**3 Sao:** Trung bình / Chấp nhận được
**4 Sao:** Tốt / Hài lòng
**5 Sao:** Xuất sắc / Rất hài lòng

### Luồng Gửi

1. Người dùng mở modal phản hồi
2. Điền đánh giá (bắt buộc) và các trường tùy chọn
3. Nhấp "Gửi góp ý" (Submit Feedback)
4. Xác thực: Tất cả 3 đánh giá phải được chọn
5. Dữ liệu được gửi đến API endpoint
6. Hiển thị thông báo thành công
7. Biểu mẫu đặt lại
8. Modal tự động đóng sau 2 giây

### Cấu trúc Dữ liệu

```json
{
  "id": "timestamp-based-id",
  "name": "User Name or Anonymous",
  "ratings": {
    "design": 5,
    "idea": 4,
    "usefulness": 5
  },
  "comments": "Optional user feedback text...",
  "timestamp": "2025-11-09T05:00:00.000Z",
  "language": "vi"
}
```

## Các endpoint API

### Gửi Phản hồi
**Endpoint:** `POST /api/feedback`

**Request:**
```json
{
  "name": "John Doe",
  "ratings": {
    "design": 5,
    "idea": 4,
    "usefulness": 5
  },
  "comments": "Great app!",
  "timestamp": "ISO-8601",
  "language": "vi"
}
```

**Response:**
```json
{
  "success": true,
  "id": "1234567890"
}
```

### Lấy Thống kê
**Endpoint:** `GET /api/stats`

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

## Triển khai Kỹ thuật

**Component:** [website/components/FeedbackModal.tsx](../website/components/FeedbackModal.tsx)

**Các route API:**
- [website/app/api/feedback/route.ts](../website/app/api/feedback/route.ts)
- [website/app/api/stats/route.ts](../website/app/api/stats/route.ts)

**Lưu trữ Dữ liệu:** [data/feedbacks.json](../data/feedbacks.json)

**Các tính năng Chính:**
- Quản lý trạng thái React
- Xác thực biểu mẫu
- Tích hợp API với fetch
- Xử lý thành công/lỗi
- Hỗ trợ song ngữ

## Tính năng UI/UX

### Thiết kế Trực quan
- Overlay modal với backdrop blur
- Bố cục dựa trên card
- Thiết kế biểu mẫu sạch sẽ, tối giản
- Nút đánh giá tương tác
- Hoạt ảnh mượt mà

### Trải nghiệm Người dùng
- Phản hồi trực quan rõ ràng khi chọn
- Nút đánh giá làm nổi bật khi di chuột
- Đánh giá đã chọn vẫn được làm nổi bật
- Thông báo thành công sau khi gửi
- Biểu mẫu tự động đặt lại sau khi thành công
- Modal nhấp bên ngoài để đóng

### Khả năng Tiếp cận
- Điều hướng bàn phím
- Quản lý focus
- Nhãn ARIA (sẽ được thêm)
- Hỗ trợ trình đọc màn hình (sẽ được cải thiện)

## Phân tích & Thông tin chi tiết

### Các chỉ số Theo dõi
- Tổng số lượt gửi phản hồi
- Đánh giá trung bình mỗi danh mục
- Tần suất phản hồi theo thời gian
- Gửi ẩn danh so với có tên
- Phân bố ưu tiên ngôn ngữ

### Bảng điều khiển (Tương lai)
Hiện tại thống kê chỉ khả dụng qua API. Bảng điều khiển tương lai sẽ hiển thị:
- Xu hướng đánh giá theo thời gian
- Chủ đề phản hồi phổ biến
- Phân tích cảm xúc người dùng
- Ưu tiên cải thiện

## Quy tắc Xác thực

1. **Tất cả đánh giá bắt buộc:** Phải chọn 1-5 cho cả ba danh mục
2. **Tên tùy chọn:** Mặc định là "Anonymous"
3. **Bình luận tùy chọn:** Không có độ dài tối thiểu hoặc tối đa
4. **Ngăn chặn trùng lặp:** Không có (người dùng có thể gửi nhiều lần)

## Chỉ số Thành công

- Tỷ lệ gửi phản hồi > 5%
- Đánh giá trung bình > 3.5/5
- Tỷ lệ hoàn thành bình luận > 30%
- Tỷ lệ thành công API > 99%

## Cải tiến Tương lai

- [ ] Component đánh giá sao thay vì nút
- [ ] Phản hồi cụ thể theo danh mục (theo tính năng)
- [ ] Đính kèm ảnh chụp màn hình
- [ ] Tích hợp báo cáo lỗi
- [ ] Thông báo email cho admin
- [ ] Hiển thị phản hồi công khai (tùy chọn)
- [ ] Tính năng trả lời phản hồi
- [ ] Bình chọn/thích phản hồi
- [ ] Bảng điều khiển phân tích
- [ ] Xuất phản hồi sang CSV
- [ ] Tích hợp với trình theo dõi vấn đề
