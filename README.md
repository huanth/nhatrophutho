# Nhà Trọ Phú Thọ

Nền tảng tìm kiếm và đăng tin cho thuê phòng trọ số 1 tại Phú Thọ. Dự án được xây dựng với các công nghệ hiện đại nhất nhằm mang lại trải nghiệm mượt mà cho cả người đi thuê và người cho thuê.

## 🚀 Công nghệ sử dụng
- **Framework**: Next.js 16 (App Router)
- **UI/Styling**: Tailwind CSS v4, HeroUI v3 (React Aria Components)
- **State Management**: Zustand
- **Database/Backend**: Firebase (Firestore, Storage, Authentication)
- **Deployment**: Firebase Hosting / Vercel
- **Mobile**: Tích hợp sẵn Capacitor (sẵn sàng chuyển thành App iOS/Android)

## 📦 Cài đặt dự án

### Yêu cầu hệ thống
- Node.js v20.x trở lên
- Trình quản lý package: npm, yarn, hoặc pnpm

### Cài đặt
1. Clone dự án về máy:
```bash
git clone https://github.com/huanth/nhatrophutho.git
cd nhatrophutho
```

2. Cài đặt các thư viện:
```bash
npm install
```

3. Cấu hình biến môi trường:
Đổi tên file `.env.example` thành `.env.local` (nếu có) hoặc tạo file `.env.local` mới và thêm cấu hình Firebase:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Chạy dự án (Development)
```bash
npm run dev
```
Mở trình duyệt tại [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 🛠 Lệnh thông dụng

- `npm run dev`: Chạy server dev (với Turbopack)
- `npm run build`: Đóng gói ứng dụng cho production
- `npm run start`: Chạy server production sau khi build
- `npm run mobile`: Build static files và đồng bộ sang Capacitor (Android/iOS)

## 🌟 Chức năng chính
- **Tìm kiếm**: Tìm phòng trọ theo huyện/xã, loại phòng, mức giá, diện tích.
- **Đăng bài (Chủ trọ)**: Tạo và quản lý danh sách phòng trọ cho thuê. Tải ảnh lên Firebase Storage.
- **Đánh dấu phòng**: Tính năng lưu phòng trọ yêu thích (Sắp ra mắt).
- **Quản lý (Admin)**: Quản lý người dùng, duyệt/ẩn các bài đăng vi phạm.

## 📱 Mobile App (Capacitor)
Dự án được cấu hình để build thành ứng dụng Mobile native thông qua Capacitor. Khi chạy `npm run mobile`, Next.js sẽ xuất static HTML ra thư mục `out/` và tự động đồng bộ sang project Android/iOS.
