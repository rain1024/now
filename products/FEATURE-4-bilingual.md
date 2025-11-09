# FEATURE-4: Hỗ trợ Song ngữ (i18n)

## Tổng quan

Hỗ trợ quốc tế hóa đầy đủ với chuyển đổi liền mạch giữa ngôn ngữ Tiếng Việt và Tiếng Anh trên toàn bộ ứng dụng.

## Câu chuyện Người dùng

**Là một người dùng**, tôi muốn sử dụng ứng dụng bằng ngôn ngữ ưa thích của mình, để tôi có thể hiểu và tương tác với nó một cách thoải mái hơn.

## Ngôn ngữ Được hỗ trợ

1. **Tiếng Việt (vi)** - Mặc định
2. **Tiếng Anh (en)**

## Chi tiết Tính năng

### Công cụ Chuyển đổi Ngôn ngữ

**Vị trí:** Góc trên bên phải (vị trí cố định)

**Phần tử UI:**
- Nút hiển thị lựa chọn thay thế hiện tại ("EN" khi Tiếng Việt, "VI" khi Tiếng Anh)
- Nhấp để chuyển đổi ngôn ngữ
- Chuyển đổi ngay lập tức mà không cần tải lại trang
- Phản hồi trực quan khi di chuột

### Phạm vi Dịch

**Bao phủ 100% trên:**

1. **Giao diện Chính**
   - Tiêu đề và phụ đề trang
   - Nhãn và placeholder biểu mẫu
   - Văn bản nút
   - Tiêu đề phần
   - Văn bản trợ giúp

2. **Phần tử Biểu mẫu**
   - "Time Available" / "Thời gian"
   - "Energy Level" / "Năng lượng"
   - "Mood" / "Tâm trạng"
   - "Location" / "Bối cảnh"
   - "Time of Day" / "Thời gian trong ngày"
   - "Interests" / "Sở thích"

3. **Tùy chọn Tâm trạng**
   - Happy / Vui vẻ
   - Stressed / Căng thẳng
   - Tired / Mệt mỏi
   - Motivated / Hăng khởi
   - Bored / Buồn chán
   - Anxious / Lo lắng

4. **Tùy chọn Vị trí**
   - Home / Nhà
   - Office / Văn phòng
   - Outdoors / Ngoài trời
   - Cafe / Quán cà phê
   - Transit / Di chuyển

5. **Thời gian trong Ngày**
   - Early Morning / Sáng sớm
   - Morning / Buổi sáng
   - Afternoon / Buổi chiều
   - Evening / Buổi tối
   - Late Night / Đêm muộn

6. **Danh mục**
   - Work / Công việc
   - Exercise / Thể dục
   - Learning / Học tập
   - Relaxation / Thư giãn
   - Social / Giao lưu
   - Creative / Sáng tạo
   - Entertainment / Giải trí
   - Health / Sức khỏe
   - Household / Nhà cửa
   - Mindfulness / Tâm linh

7. **Cơ sở dữ liệu Hoạt động**
   - Hơn 60 hoạt động với tiêu đề bằng cả hai ngôn ngữ
   - Mô tả được dịch
   - Diễn đạt phù hợp với bối cảnh

8. **Modal**
   - Modal đăng nhập (tất cả văn bản)
   - Modal đăng ký (tất cả văn bản)
   - Modal phản hồi (tất cả văn bản)
   - Thông báo thành công/lỗi

9. **Xác thực**
   - Nhãn biểu mẫu đăng nhập
   - Nhãn biểu mẫu đăng ký
   - Thông báo xác thực
   - Hiển thị hồ sơ người dùng

10. **Hệ thống Phản hồi**
    - Nhãn đánh giá
    - Placeholder bình luận
    - Nút gửi
    - Thông báo thành công

## Triển khai Kỹ thuật

**Component:** [website/components/LanguageSwitcher.tsx](../website/components/LanguageSwitcher.tsx)

**Quản lý Trạng thái:**
```typescript
const [currentLang, setCurrentLang] = useState<Language>('vi');
```

**Các đối tượng Dịch:**
Nằm trong các component dưới dạng đối tượng:
```typescript
const translations = {
  vi: {
    title: "Tiêu đề",
    description: "Mô tả"
  },
  en: {
    title: "Title",
    description: "Description"
  }
};
```

**Hàm Chuyển đổi:**
```typescript
function toggleLanguage() {
  setCurrentLang(currentLang === 'vi' ? 'en' : 'vi');
}
```

## Cấu trúc Dữ liệu

### Cơ sở dữ liệu Hoạt động
Hoạt động được lưu trữ với cả hai ngôn ngữ:
```typescript
{
  title: {
    vi: "Thiền định 15 phút",
    en: "15-minute Meditation"
  },
  description: {
    vi: "Thiền định để giảm căng thẳng và tập trung",
    en: "Meditate to reduce stress and improve focus"
  }
}
```

## Trải nghiệm Người dùng

### Duy trì Ngôn ngữ
- **Hiện tại:** Ngôn ngữ đặt lại khi làm mới trang
- **Tương lai:** Lưu tùy chọn trong localStorage

### Cập nhật Thời gian thực
Tất cả các phần tử UI cập nhật ngay lập tức khi chuyển đổi ngôn ngữ:
- Nội dung trang
- Nhãn biểu mẫu
- Văn bản nút
- Nội dung modal
- Đề xuất hoạt động
- Thông báo lỗi

### Không Tải lại Trang
- Chuyển đổi mượt mà
- Không trạng thái tải
- Duy trì đầu vào người dùng
- Bảo toàn trạng thái biểu mẫu

## Chỉ số Thành công

- Độ chính xác dịch: 100%
- Bao phủ: 100% văn bản hướng đến người dùng
- Thời gian chuyển đổi: < 100ms
- Không có bản dịch bị hỏng
- Thuật ngữ nhất quán

## Cải tiến Tương lai

- [ ] Ngôn ngữ bổ sung (Trung, Nhật, Hàn, Tây Ban Nha, Pháp)
- [ ] Phát hiện ngôn ngữ từ cài đặt trình duyệt
- [ ] Tùy chọn ngôn ngữ duy trì (localStorage)
- [ ] Hỗ trợ RTL cho Ả Rập/Do Thái
- [ ] Hệ thống quản lý dịch
- [ ] Dịch cộng đồng
- [ ] Kiểm tra A/B các cách diễn đạt khác nhau
- [ ] Lệnh giọng nói bằng ngôn ngữ bản địa
- [ ] Định dạng ngày/giờ bản địa hóa
- [ ] Bản địa hóa tiền tệ (nếu cần)
- [ ] Biến thể khu vực (ví dụ: Tiếng Anh UK vs Mỹ)
