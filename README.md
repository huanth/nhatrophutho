# Nhà Trọ Phú Thọ (NTPT)

Nền tảng tìm kiếm và đăng tin cho thuê phòng trọ số 1 tại Phú Thọ. Dự án được xây dựng với kiến trúc hiện đại, hiệu năng cao và sẵn sàng chuyển đổi thành ứng dụng di động.

## 🚀 Công nghệ sử dụng

Dự án sử dụng bộ công nghệ (Tech Stack) hiện đại nhất năm 2025-2026:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI/Styling**: 
  - [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first configuration)
  - [HeroUI v3](https://heroui.com/) (Rebranding của NextUI, dựa trên React Aria Components)
  - [Iconify](https://iconify.design/) cho hệ thống icon đa dạng
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Lightweight & Fast)
- **Backend-as-a-Service**: [Firebase](https://firebase.google.com/)
  - **Firestore**: Cơ sở dữ liệu NoSQL với hệ thống Index tối ưu.
  - **Authentication**: Google Login & Email/Password.
  - **Storage**: Lưu trữ hình ảnh phòng trọ.
- **Mobile Foundation**: [Capacitor](https://capacitorjs.com/) cho phép đóng gói thành App Native iOS/Android.

## 📦 Cài đặt dự án

### Yêu cầu hệ thống
- Node.js v20.x trở lên
- Firebase CLI (`npm install -g firebase-tools`)

### Các bước cài đặt
1. **Clone & Install**:
   ```bash
   git clone https://github.com/huanth/nhatrophutho.git
   cd nhatrophutho
   npm install
   ```

2. **Cấu hình Firebase**:
   Tạo file `.env.local` và điền thông số từ Firebase Console:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=xxx
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
   NEXT_PUBLIC_FIREBASE_APP_ID=xxx
   ```

3. **Khởi tạo Firestore**:
   Deploy rules và indexes:
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only firestore:indexes
   ```

### Chạy dự án (Development)
```bash
npm run dev
```
Mở [http://localhost:3000](http://localhost:3000) để trải nghiệm.

## 🌟 Chức năng chính

- 🏠 **Tìm kiếm thông minh**: Lọc theo xã/phường tại Phú Thọ, khoảng giá, loại phòng.
- 📝 **Đăng tin chuyên nghiệp**: Form đăng bài tối ưu, hỗ trợ upload nhiều ảnh, tự động tạo slug SEO.
- 🛡️ **Hệ thống Admin**: 
  - Duyệt bài đăng (Pending -> Approved/Rejected).
  - Quản lý người dùng và vai trò (Chủ nhà/Người tìm trọ/Admin).
- 🔔 **Thông báo thời gian thực**: Nhận thông báo khi bài đăng được duyệt hoặc có tin mới.
- 🌓 **Chế độ tối (Dark Mode)**: Tối ưu cho trải nghiệm người dùng ban đêm.

## 📱 Mobile App (Capacitor)
Dự án hỗ trợ Hybrid App. Để build bản mobile:
```bash
npm run mobile
```
Lệnh này sẽ export static HTML và đồng bộ vào thư mục `android/` hoặc `ios/`.

## 🛠 Lệnh thông dụng
- `npm run lint`: Kiểm tra lỗi code và format.
- `npm run build`: Build production tối ưu nhất.
- `firebase deploy`: Deploy toàn bộ lên Firebase Hosting.

---
*Phát triển bởi đội ngũ Nhà Trọ Phú Thọ - 2026*
