# FEATURE-5: Cơ sở dữ liệu Hoạt động

## Tổng quan

Cơ sở dữ liệu toàn diện hơn 60 hoạt động được tuyển chọn trên 10 danh mục riêng biệt, mỗi hoạt động có mô tả song ngữ, ước tính thời lượng, yêu cầu năng lượng và siêu dữ liệu theo ngữ cảnh.

## Cấu trúc Cơ sở dữ liệu

**Vị trí:** [website/lib/actionsDatabase.ts](../website/lib/actionsDatabase.ts)

### Danh mục (10 tổng số)

1. **Work** - 5 hoạt động
2. **Exercise** - 5 hoạt động
3. **Learning** - 5 hoạt động
4. **Relaxation** - 5 hoạt động
5. **Social** - 5 hoạt động
6. **Creative** - 6 hoạt động
7. **Entertainment** - 6 hoạt động
8. **Health** - 6 hoạt động
9. **Household** - 6 hoạt động
10. **Mindfulness** - 6 hoạt động

**Tổng: Hơn 60 hoạt động**

## Schema Hoạt động

```typescript
interface Action {
  title: {
    vi: string;
    en: string;
  };
  description: {
    vi: string;
    en: string;
  };
  duration: number;        // tính bằng phút
  energy: number;          // thang điểm 1-10
  times: string[];         // thời gian tối ưu trong ngày
  locations?: string[];    // vị trí phù hợp
  mood?: string[];         // có lợi cho tâm trạng
}
```

## Hoạt động Mẫu theo Danh mục

### 1. Công việc & Năng suất
- Deep Work Session (60 phút, năng lượng: 8)
- Quick Email Check (15 phút, năng lượng: 4)
- Short Task Sprint (30 phút, năng lượng: 6)
- Meeting Preparation (20 phút, năng lượng: 5)
- Planning Session (45 phút, năng lượng: 6)

### 2. Thể dục & Thể thao
- Cardio Workout (30 phút, năng lượng: 7)
- Yoga Session (30 phút, năng lượng: 4)
- Quick Stretches (10 phút, năng lượng: 2)
- Strength Training (60 phút, năng lượng: 8)
- Walking Break (20 phút, năng lượng: 3)
- HIIT Workout (20 phút, năng lượng: 9)

### 3. Học tập & Giáo dục
- Online Course Module (45 phút, năng lượng: 6)
- Book Reading (30 phút, năng lượng: 4)
- Skill Practice (60 phút, năng lượng: 7)
- Tutorial Video (20 phút, năng lượng: 5)
- Language Learning (30 phút, năng lượng: 6)

### 4. Thư giãn & Nghỉ ngơi
- Meditation (15 phút, năng lượng: 2)
- Power Nap (20 phút, năng lượng: 1)
- Breathing Exercise (10 phút, năng lượng: 2)
- Warm Bath (30 phút, năng lượng: 2)
- Listen to Music (20 phút, năng lượng: 2)
- Gentle Stretching (15 phút, năng lượng: 2)

### 5. Xã hội & Quan hệ
- Phone Call Friend (15 phút, năng lượng: 4)
- Coffee Chat (45 phút, năng lượng: 5)
- Video Call (30 phút, năng lượng: 5)
- Text Catch-up (10 phút, năng lượng: 3)
- Community Activity (60 phút, năng lượng: 6)

### 6. Sáng tạo & Sở thích
- Journaling (20 phút, năng lượng: 3)
- Drawing/Sketching (45 phút, năng lượng: 5)
- Photography (60 phút, năng lượng: 6)
- Music Practice (30 phút, năng lượng: 6)
- Creative Writing (60 phút, năng lượng: 7)
- Crafts/DIY (90 phút, năng lượng: 6)

### 7. Giải trí
- Watch Movie (120 phút, năng lượng: 2)
- Gaming Session (60 phút, năng lượng: 4)
- Read Fiction (45 phút, năng lượng: 3)
- Social Media (15 phút, năng lượng: 2)
- Listen to Podcast (30 phút, năng lượng: 2)
- Solve Puzzle (30 phút, năng lượng: 5)

### 8. Sức khỏe & Chăm sóc sức khỏe
- Meal Prep (60 phút, năng lượng: 6)
- Hydration Break (5 phút, năng lượng: 1)
- Eye Rest Exercise (10 phút, năng lượng: 1)
- Posture Check (5 phút, năng lượng: 2)
- Healthy Snack (10 phút, năng lượng: 2)
- Dental Care (15 phút, năng lượng: 2)

### 9. Gia đình & Công việc nhà
- Quick Cleanup (15 phút, năng lượng: 4)
- Deep Cleaning (60 phút, năng lượng: 7)
- Laundry (30 phút, năng lượng: 4)
- Organize Space (45 phút, năng lượng: 5)
- Declutter Session (30 phút, năng lượng: 5)
- Plant Care (20 phút, năng lượng: 3)

### 10. Tỉnh thức & Thiền định
- Gratitude Practice (10 phút, năng lượng: 2)
- Mindful Walking (20 phút, năng lượng: 3)
- Body Scan (15 phút, năng lượng: 2)
- Loving-Kindness Meditation (15 phút, năng lượng: 2)
- Mindful Eating (20 phút, năng lượng: 2)
- Digital Detox (60 phút, năng lượng: 3)

## Các trường Siêu dữ liệu

### Thời lượng
- Phạm vi: 5-240 phút
- Giúp lọc theo thời gian khả dụng
- Ước tính thực tế để hoàn thành

### Mức Năng lượng
- Thang điểm: 1-10
- 1-3: Năng lượng thấp (nghỉ ngơi, thụ động)
- 4-6: Năng lượng vừa phải (hoạt động tiêu chuẩn)
- 7-10: Năng lượng cao (công việc đòi hỏi)

### Thời gian trong Ngày
- `morning` - Tốt nhất vào buổi sáng
- `afternoon` - Phù hợp cho buổi chiều
- `evening` - Tốt cho buổi tối
- `night` - Phù hợp đêm muộn
- `any` - Thời gian linh hoạt

### Vị trí
- `home` - Có thể làm ở nhà
- `office` - Phù hợp nơi làm việc
- `outdoors` - Yêu cầu không gian ngoài trời
- `cafe` - Thân thiện với quán cà phê
- `transit` - Khi di chuyển
- `any` - Độc lập vị trí

### Lợi ích Tâm trạng
- `stressed` - Giúp giảm căng thẳng
- `tired` - Tốt cho năng lượng thấp
- `bored` - Chống buồn chán
- `anxious` - Giảm lo lắng
- `motivated` - Tận dụng động lực
- `happy` - Nâng cao tâm trạng tích cực

## Nguyên tắc Tuyển chọn

1. **Thời lượng Thực tế** - Dựa trên yêu cầu thời gian thực tế
2. **Tùy chọn Đa dạng** - Bao phủ nhiều sở thích và nhu cầu
3. **Khả năng Tiếp cận** - Hầu hết không yêu cầu thiết bị đặc biệt
4. **Sức hấp dẫn Phổ quát** - Áp dụng được cho nhiều nhóm đối tượng
5. **Tập trung Sức khỏe** - Thúc đẩy lối sống khỏe mạnh, cân bằng
6. **Tính Thực tiễn** - Các hoạt động mọi người thực sự làm

## Triển khai Kỹ thuật

**Định nghĩa Kiểu:**
```typescript
type Interest = 'work' | 'exercise' | 'learning' | 'relaxation' |
                'social' | 'creative' | 'entertainment' | 'health' |
                'household' | 'mindfulness';
```

**Cấu trúc Export:**
```typescript
export const actionsDatabase: Record<Interest, Action[]>
```

**Sử dụng:**
- Được import bởi component trang chính
- Lọc theo tùy chọn người dùng
- Chấm điểm bằng thuật toán đề xuất
- Hiển thị trong kết quả

## Cải tiến Tương lai

- [ ] Hoạt động do người dùng đóng góp
- [ ] Hoạt động theo mùa (ngày lễ, thời tiết)
- [ ] Mức độ khó
- [ ] Vật liệu/thiết bị yêu cầu
- [ ] Ước tính lượng calo đốt cháy
- [ ] Hoạt động xã hội (đơn lẻ vs nhóm)
- [ ] Gắn thẻ trong nhà vs ngoài trời
- [ ] Chỉ báo chi phí (miễn phí, $, $$, $$$)
- [ ] Phù hợp độ tuổi
- [ ] Ghi chú khả năng tiếp cận
- [ ] Đề xuất hoạt động liên quan
- [ ] Theo dõi hoàn thành hoạt động
- [ ] Yêu thích hoạt động cá nhân
- [ ] Tạo hoạt động tùy chỉnh
- [ ] Chia sẻ hoạt động giữa người dùng
