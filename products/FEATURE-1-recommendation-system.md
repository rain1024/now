# FEATURE-1: Hệ thống Đề xuất Hành động Thông minh

## Tổng quan

Tính năng cốt lõi của DỰ ÁN NOW - một thuật toán thông minh phân tích bối cảnh người dùng và đề xuất các hành động được cá nhân hóa từ cơ sở dữ liệu hơn 60 hoạt động.

## Câu chuyện Người dùng

**Là một người dùng**, tôi muốn nhận được các đề xuất hành động được cá nhân hóa dựa trên tình huống hiện tại của tôi, để tôi có thể đưa ra quyết định tốt hơn về cách sử dụng thời gian của mình.

## Chi tiết Tính năng

### Các tham số Đầu vào

1. **Thời gian Khả dụng** (5-240 phút)
   - Đầu vào thanh trượt với hiển thị theo thời gian thực
   - Giúp lọc hoạt động theo thời lượng
   - Mặc định: 30 phút

2. **Mức Năng lượng** (thang điểm 1-10)
   - Thanh trượt trực quan từ "Kiệt sức" đến "Tràn đầy năng lượng"
   - Khớp hoạt động với yêu cầu năng lượng
   - Khớp linh hoạt (±3 mức)

3. **Tâm trạng Hiện tại** (6 tùy chọn)
   - Happy (Vui vẻ)
   - Stressed (Căng thẳng)
   - Tired (Mệt mỏi)
   - Motivated (Hăng khởi)
   - Bored (Buồn chán)
   - Anxious (Lo lắng)

4. **Vị trí** (5 tùy chọn)
   - Home (Nhà)
   - Office (Văn phòng)
   - Outdoors (Ngoài trời)
   - Cafe (Quán cà phê)
   - Transit (Di chuyển)

5. **Thời gian trong Ngày** (5 khoảng)
   - Early Morning (Sáng sớm)
   - Morning (Buổi sáng)
   - Afternoon (Buổi chiều)
   - Evening (Buổi tối)
   - Late Night (Đêm muộn)

6. **Sở thích Cá nhân** (Chọn nhiều từ 10 danh mục)
   - Work & Productivity
   - Exercise & Fitness
   - Learning & Education
   - Relaxation & Rest
   - Social & Relationships
   - Creative & Hobbies
   - Entertainment
   - Health & Wellness
   - Household & Chores
   - Mindfulness & Meditation

### Thuật toán Đề xuất

Hệ thống sử dụng thuật toán tính điểm với logic sau:

```typescript
Score Calculation:
1. Base score: 100 points
2. Time fit bonus: +50 if duration matches available time
3. Energy match bonus: +30 if energy level matches (±3 tolerance)
4. Mood bonus: +20 for mood-specific activities
5. Location match: +15 if location fits
6. Time of day match: +10 if timing is optimal
7. Interest match: +25 if category is selected
```

**Ví dụ Tính điểm:**
- Hoạt động: "Thiền định 15 phút"
- Người dùng có: 20 phút, mức năng lượng 3, tâm trạng căng thẳng, ở nhà, buổi tối
- Điểm: 100 (cơ bản) + 50 (thời gian) + 30 (năng lượng) + 20 (giảm căng thẳng) + 15 (nhà) + 10 (tối) = 225 điểm

### Kết quả Đầu ra

- Top 5 hoạt động được đề xuất
- Sắp xếp theo điểm phù hợp
- Hiển thị bao gồm:
  - Tiêu đề hoạt động (song ngữ)
  - Mô tả (song ngữ)
  - Thời lượng ước tính
  - Nhãn danh mục
  - Chỉ số yêu cầu năng lượng

## Triển khai Kỹ thuật

**Vị trí:** [website/app/page.tsx](../website/app/page.tsx)

**Các hàm Chính:**
- `getRecommendations()` - Công cụ đề xuất chính
- `calculateScore()` - Thuật toán tính điểm
- Lọc và sắp xếp hoạt động

**Nguồn dữ liệu:** [website/lib/actionsDatabase.ts](../website/lib/actionsDatabase.ts)

## UI/UX

- Bố cục biểu mẫu sạch sẽ, trực quan
- Hiển thị giá trị theo thời gian thực trên thanh trượt
- Thẻ danh mục trực quan
- Hiển thị kết quả có hoạt ảnh
- Cuộn mượt đến kết quả
- Xử lý trạng thái rỗng

## Chỉ số Thành công

- Người dùng nhận được ít nhất 3 đề xuất phù hợp
- Thuật toán chạy trong < 100ms
- 90%+ mức độ hài lòng của người dùng với các đề xuất (từ phản hồi)

## Cải tiến Tương lai

- [ ] Machine learning để cải thiện đề xuất theo thời gian
- [ ] Đề xuất dựa trên thời tiết
- [ ] Tích hợp lịch cho đề xuất nhận biết thời gian
- [ ] Học sở thích người dùng
- [ ] Theo dõi hoàn thành hoạt động
- [ ] Giải thích đề xuất ("Tại sao chúng tôi đề xuất điều này")
