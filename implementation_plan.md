# 🏠 Nhà Trọ Phú Thọ - Nền tảng Tìm kiếm Nhà trọ

## Mô tả dự án

Xây dựng nền tảng tìm kiếm nhà trọ khu vực Phú Thọ với kiến trúc **Monorepo**, hỗ trợ cả **Web (SEO chuẩn)** và **Mobile App (Android/iOS qua Capacitor)**.

### Các quyết định đã chốt

| Quyết định | Lựa chọn |
|------------|----------|
| Kiến trúc | **Monorepo** - Web SSR (SEO) + Mobile Static Export (Capacitor) |
| Phân quyền | **Chủ trọ tự đăng bài**, Admin duyệt |
| Tìm kiếm MVP | **Bộ lọc cơ bản** (Giá, Diện tích, Huyện/Xã) dùng Firestore queries |

---

## Tech Stack

| Thành phần | Công nghệ | Ghi chú |
|------------|-----------|---------|
| Framework | **Next.js 15** (App Router) | Turbopack, TypeScript strict |
| UI Library | **HeroUI v3** (@heroui/react) | Xây trên Tailwind CSS v4 |
| Styling | **Tailwind CSS v4** | CSS-first config |
| Backend/DB | **Firebase** (Firestore, Auth, Storage) | Serverless, realtime |
| Mobile | **Capacitor 6** | Build Android & iOS từ web |
| Language | **TypeScript 5+** | Strict mode |
| Validation | **Zod** | Schema validation |
| State | **Zustand** | Client state nhẹ gọn |
| Location Data | **provinces.open-api.vn** + Static JSON | Dữ liệu huyện/xã Phú Thọ |

---

## Kiến trúc Monorepo

```
d:\projects\nhatrophutho\
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (public)/               # Route group: Trang công khai (SEO)
│   │   │   ├── page.tsx            # Trang chủ - Hero + Tìm kiếm nhanh
│   │   │   ├── tim-phong/          # Danh sách phòng trọ (có filter)
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx    # Chi tiết phòng trọ
│   │   │   ├── ve-chung-toi/
│   │   │   │   └── page.tsx        # Giới thiệu
│   │   │   └── lien-he/
│   │   │       └── page.tsx        # Liên hệ
│   │   ├── (auth)/                 # Route group: Đăng nhập/Đăng ký
│   │   │   ├── dang-nhap/
│   │   │   │   └── page.tsx
│   │   │   └── dang-ky/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/            # Route group: Chủ trọ (Protected)
│   │   │   ├── layout.tsx          # Dashboard layout + sidebar
│   │   │   ├── quan-ly/
│   │   │   │   ├── page.tsx        # Danh sách bài đăng của tôi
│   │   │   │   └── tao-bai/
│   │   │   │       └── page.tsx    # Tạo bài đăng mới
│   │   │   └── ho-so/
│   │   │       └── page.tsx        # Hồ sơ cá nhân
│   │   ├── (admin)/                # Route group: Admin (Protected)
│   │   │   ├── layout.tsx
│   │   │   └── admin/
│   │   │       ├── page.tsx        # Dashboard thống kê
│   │   │       ├── duyet-bai/
│   │   │       │   └── page.tsx    # Duyệt bài chờ
│   │   │       └── quan-ly-user/
│   │   │           └── page.tsx    # Quản lý tài khoản
│   │   ├── api/                    # API Routes (Webhooks only)
│   │   ├── layout.tsx              # Root Layout
│   │   ├── globals.css             # Tailwind v4 + HeroUI theme
│   │   └── providers.tsx           # HeroUIProvider + AuthProvider
│   ├── components/
│   │   ├── ui/                     # Wrapper components trên HeroUI
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── RoomCard.tsx
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── RoomPostForm.tsx
│   │   │   └── SearchFilterForm.tsx
│   │   └── layouts/
│   │       ├── PublicLayout.tsx
│   │       └── DashboardLayout.tsx
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── config.ts           # Firebase client config
│   │   │   ├── admin.ts            # Firebase Admin SDK (server-only)
│   │   │   ├── auth.ts             # Auth helpers
│   │   │   ├── firestore.ts        # Firestore CRUD helpers
│   │   │   └── storage.ts          # Storage upload helpers
│   │   ├── hooks/
│   │   │   ├── useAuth.ts          # Auth state hook
│   │   │   ├── useRooms.ts         # Room listing hook
│   │   │   └── useFilters.ts       # Filter state hook
│   │   ├── utils.ts                # Helpers (format giá, slug, etc.)
│   │   ├── validators.ts           # Zod schemas
│   │   └── constants.ts            # Constants (Phú Thọ districts data)
│   ├── stores/
│   │   └── filterStore.ts          # Zustand store cho filters
│   ├── types/
│   │   ├── room.ts                 # Room type definitions
│   │   ├── user.ts                 # User type definitions
│   │   └── filter.ts               # Filter type definitions
│   └── data/
│       └── phu-tho-locations.json  # Dữ liệu tĩnh huyện/xã Phú Thọ
├── public/
│   ├── images/
│   ├── icons/
│   └── og-image.png               # Open Graph image cho SEO
├── capacitor/                      # Cấu hình Capacitor
│   └── capacitor.config.ts
├── android/                        # (Auto-generated) Android project
├── ios/                            # (Auto-generated) iOS project
├── next.config.ts                  # Next.js config (SSR mặc định)
├── next.config.mobile.ts           # Next.js config (Static export cho Mobile)
├── tailwind.config.ts              # Tailwind + HeroUI plugin
├── firebase.json                   # Firebase hosting/rules config
├── firestore.rules                 # Firestore Security Rules
├── storage.rules                   # Storage Security Rules
├── .env.local                      # Environment variables
├── package.json
└── tsconfig.json
```

---

## Firestore Database Schema

### Collection: `rooms` (Bài đăng phòng trọ)

```typescript
interface Room {
  id: string;                    // Auto-generated
  title: string;                 // "Phòng trọ giá rẻ gần trường ĐH Hùng Vương"
  slug: string;                  // "phong-tro-gia-re-gan-truong-dh-hung-vuong"
  description: string;           // Mô tả chi tiết
  price: number;                 // Giá thuê (VND/tháng)
  area: number;                  // Diện tích (m²)
  address: string;               // Địa chỉ đầy đủ
  district: string;              // Huyện/Thành phố (code)
  districtName: string;          // Tên huyện hiển thị
  ward: string;                  // Xã/Phường (code)
  wardName: string;              // Tên xã hiển thị
  images: string[];              // URLs ảnh (Firebase Storage)
  amenities: string[];           // Tiện ích: "wifi", "dieu_hoa", "nong_lanh"...
  roomType: 'phong_tro' | 'nha_nguyen_can' | 'chung_cu_mini';
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  ownerId: string;               // UID chủ trọ
  ownerName: string;             // Tên hiển thị chủ trọ
  ownerPhone: string;            // SĐT liên hệ
  createdAt: Timestamp;
  updatedAt: Timestamp;
  viewCount: number;             // Lượt xem
}
```

### Collection: `users`

```typescript
interface UserProfile {
  uid: string;                   // Firebase Auth UID
  email: string;
  displayName: string;
  phone: string;
  role: 'user' | 'landlord' | 'admin';  // Vai trò
  avatarUrl: string;
  createdAt: Timestamp;
  roomCount: number;             // Số bài đã đăng (landlord)
}
```

### Collection: `favorites` (Phòng yêu thích)

```typescript
interface Favorite {
  userId: string;
  roomId: string;
  createdAt: Timestamp;
}
```

---

## Firestore Security Rules (Quan trọng)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    function isAdmin() {
      return isSignedIn() && request.auth.token.role == 'admin';
    }
    function isLandlord() {
      return isSignedIn() && request.auth.token.role == 'landlord';
    }

    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isOwner(userId);
    }

    // Rooms collection
    match /rooms/{roomId} {
      // Anyone can read APPROVED rooms
      allow read: if resource.data.status == 'approved' || isAdmin() || isOwner(resource.data.ownerId);
      // Landlords can create (status defaults to 'pending')
      allow create: if isLandlord() && request.resource.data.status == 'pending';
      // Owner can update their own rooms (except status field)
      allow update: if isOwner(resource.data.ownerId) && !('status' in request.resource.data)
                    || isAdmin();
      // Only admin can delete
      allow delete: if isAdmin();
    }

    // Favorites collection
    match /favorites/{favId} {
      allow read, write: if isOwner(resource.data.userId);
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## Proposed Changes (Thay đổi theo Phase)

### Phase 1: Project Setup & Architecture (~30 phút)

#### [NEW] `package.json`
- Khởi tạo Next.js 15 với TypeScript, Tailwind CSS v4
- Cài đặt dependencies: `@heroui/react`, `firebase`, `zustand`, `zod`
- Scripts: `dev`, `build`, `build:mobile`, `cap:sync`

#### [NEW] `next.config.ts`
- Cấu hình Next.js App Router, image domains (Firebase Storage)
- SSR mode mặc định cho Web

#### [NEW] `next.config.mobile.ts`
- Static export mode (`output: 'export'`) cho Capacitor build

#### [NEW] `tailwind.config.ts`
- Tích hợp `@heroui/theme` plugin
- Custom color palette cho brand NhaTroPhúThọ

#### [NEW] `src/app/globals.css`
- Import Tailwind CSS v4 + HeroUI styles
- Custom theme tokens (màu brand, font chữ)

#### [NEW] `src/app/providers.tsx`
- HeroUIProvider + custom AuthProvider wrapper

#### [NEW] `src/app/layout.tsx`
- Root layout với metadata SEO, Google Fonts (Inter), providers

---

### Phase 2: Firebase Backend Setup (~20 phút)

#### [NEW] `src/lib/firebase/config.ts`
- Firebase client initialization (Firestore, Auth, Storage)

#### [NEW] `src/lib/firebase/admin.ts`
- Firebase Admin SDK (server-side only, cho custom claims)

#### [NEW] `src/lib/firebase/auth.ts`
- Helpers: signIn, signUp, signOut, onAuthStateChanged

#### [NEW] `src/lib/firebase/firestore.ts`
- CRUD: getRooms, getRoomBySlug, createRoom, updateRoom
- Query builders cho filters (price range, area, district)

#### [NEW] `src/lib/firebase/storage.ts`
- Upload ảnh phòng trọ, resize, generate thumbnail URL

#### [NEW] `firestore.rules`
- Security rules như đã thiết kế ở trên

#### [NEW] `storage.rules`
- Rules cho Firebase Storage (chỉ landlord upload, giới hạn file size)

---

### Phase 3: Authentication (~20 phút)

#### [NEW] `src/lib/hooks/useAuth.ts`
- Custom hook quản lý auth state (user, loading, role)

#### [NEW] `src/app/(auth)/dang-nhap/page.tsx`
- Form đăng nhập (Email/Password + Google Sign-In)
- UI HeroUI: Card, Input, Button, Divider

#### [NEW] `src/app/(auth)/dang-ky/page.tsx`
- Form đăng ký với lựa chọn role (Người tìm trọ / Chủ nhà trọ)

#### [NEW] `src/components/forms/LoginForm.tsx`
- Client component với validation Zod

#### [NEW] `src/components/forms/RegisterForm.tsx`
- Client component với role selection

---

### Phase 4: Core Pages & Components (~60 phút) ⭐ QUAN TRỌNG NHẤT

#### [NEW] `src/components/ui/Navbar.tsx`
- Navigation responsive (Desktop: full menu, Mobile: hamburger)
- Logo, Search shortcut, Auth buttons, Dark mode toggle

#### [NEW] `src/components/ui/Footer.tsx`
- Footer với links, thông tin liên hệ, social icons

#### [NEW] `src/components/ui/RoomCard.tsx`
- Card hiển thị phòng trọ: ảnh, giá, diện tích, địa chỉ, tiện ích
- Hover effects, skeleton loading, favorite button

#### [NEW] `src/components/ui/SearchBar.tsx`
- Thanh tìm kiếm nhanh trên hero section

#### [NEW] `src/components/forms/SearchFilterForm.tsx`
- Bộ lọc: Loại phòng, Khoảng giá, Diện tích, Huyện/Xã
- Dropdown cascading: chọn Huyện → load danh sách Xã

#### [NEW] `src/data/phu-tho-locations.json`
- Dữ liệu tĩnh 13 huyện/thành phố + 148 xã/phường của Phú Thọ

#### [NEW] `src/app/(public)/page.tsx` - **TRANG CHỦ**
- Hero section với ảnh nền Phú Thọ + search bar
- Thống kê nhanh (số phòng, số khu vực)
- Phòng trọ nổi bật (mới nhất, nhiều xem nhất)
- Khu vực phổ biến (cards theo huyện)
- CTA cho chủ trọ đăng bài

#### [NEW] `src/app/(public)/tim-phong/page.tsx` - **TÌM PHÒNG**
- Layout 2 cột: Filter sidebar + Room grid
- Responsive: Mobile filter drawer, Desktop sidebar
- Pagination / Infinite scroll
- Sort: Mới nhất, Giá thấp→cao, Giá cao→thấp

#### [NEW] `src/app/(public)/tim-phong/[slug]/page.tsx` - **CHI TIẾT**
- Image gallery (swiper)
- Thông tin chi tiết: giá, diện tích, tiện ích, mô tả
- Thông tin chủ trọ + nút Gọi/Nhắn tin
- Phòng tương tự (related rooms)
- SEO: generateMetadata dynamic

---

### Phase 5: Chủ trọ Dashboard (~30 phút)

#### [NEW] `src/app/(dashboard)/layout.tsx`
- Dashboard layout: sidebar + content area
- Protected route (redirect nếu chưa login hoặc không phải landlord)

#### [NEW] `src/app/(dashboard)/quan-ly/page.tsx`
- Danh sách bài đăng của chủ trọ
- Status badges (Chờ duyệt, Đã duyệt, Bị từ chối)
- Actions: Sửa, Ẩn, Xóa

#### [NEW] `src/app/(dashboard)/quan-ly/tao-bai/page.tsx`
- Form đăng bài phòng trọ đầy đủ
- Upload multiple ảnh (drag & drop)
- Chọn tiện ích (checkboxes)
- Chọn vị trí (Huyện → Xã cascading)

#### [NEW] `src/components/forms/RoomPostForm.tsx`
- Multi-step form hoặc single page form
- Preview trước khi gửi

---

### Phase 6: Admin Dashboard (~25 phút)

#### [NEW] `src/app/(admin)/layout.tsx`
- Admin layout với sidebar navigation
- Protected: chỉ role admin

#### [NEW] `src/app/(admin)/admin/page.tsx`
- Thống kê: Tổng phòng, Chờ duyệt, Người dùng mới
- Charts đơn giản (có thể dùng recharts hoặc HeroUI charts)

#### [NEW] `src/app/(admin)/admin/duyet-bai/page.tsx`
- Danh sách bài chờ duyệt
- Preview bài đăng + Nút Duyệt/Từ chối

#### [NEW] `src/app/(admin)/admin/quan-ly-user/page.tsx`
- Bảng danh sách users
- Thay đổi role, disable account

---

### Phase 7: Capacitor Mobile Build (~15 phút)

#### [NEW] `capacitor/capacitor.config.ts`
- App ID: `com.nhatrophutho.app`
- webDir: `out`
- Android scheme: `https`

#### Scripts bổ sung trong `package.json`
```json
{
  "build:mobile": "NEXT_CONFIG_FILE=next.config.mobile.ts next build",
  "cap:sync": "npx cap sync",
  "cap:android": "npx cap open android",
  "cap:ios": "npx cap open ios",
  "mobile": "npm run build:mobile && npm run cap:sync"
}
```

---

## SEO Strategy

| Yếu tố | Triển khai |
|---------|-----------|
| **Title Tags** | Dynamic metadata cho mỗi trang (`generateMetadata`) |
| **Meta Description** | Mô tả cụ thể theo khu vực + loại phòng |
| **Open Graph** | OG image, title, description cho mỗi bài đăng |
| **Structured Data** | JSON-LD cho `RealEstateListing` schema |
| **Sitemap** | Auto-generated `sitemap.xml` từ danh sách phòng |
| **Robots** | `robots.txt` chuẩn |
| **URL Slug** | Vietnamese-friendly slugs (`/tim-phong/phong-tro-gia-re-viet-tri`) |
| **Heading Structure** | Mỗi trang 1 `<h1>`, heading hierarchy chuẩn |
| **Performance** | Next.js Image optimization, lazy loading |
| **Mobile-First** | Responsive design, Core Web Vitals tối ưu |

---

## UI/UX Design Direction

### Color Palette (Brand NhaTroPhúThọ)

| Token | Color | Usage |
|-------|-------|-------|
| Primary | `#0EA5E9` (Sky Blue) | CTA buttons, links, highlights |
| Secondary | `#10B981` (Emerald) | Success, available rooms |
| Accent | `#F59E0B` (Amber) | Price tags, warnings |
| Background | `#F8FAFC` (Light) / `#0F172A` (Dark) | Page bg |
| Surface | `#FFFFFF` / `#1E293B` | Cards, modals |

### Typography
- **Heading**: Inter (Google Fonts) - Bold/Semibold
- **Body**: Inter - Regular/Medium
- **Price/Numbers**: Tabular numbers (`font-variant-numeric: tabular-nums`)

### Key UI Patterns
- **Glassmorphism** cho hero section search bar
- **Skeleton loading** cho room cards
- **Smooth page transitions** (Next.js App Router)
- **Dark mode** toggle (HeroUI built-in)
- **Toast notifications** cho actions (HeroUI Sonner)

---

## Verification Plan

### Automated Tests
```bash
# Build check
npm run build

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Mobile build check
npm run build:mobile
```

### Manual Verification
1. **Web**: Truy cập localhost → kiểm tra tất cả các trang
2. **SEO**: Lighthouse audit score ≥ 90
3. **Responsive**: Test trên Chrome DevTools (Mobile/Tablet/Desktop)
4. **Auth Flow**: Đăng ký → Đăng nhập → Đăng bài → Duyệt bài
5. **Mobile**: `npx cap sync` → mở Android Studio → chạy emulator

### Browser Testing
- Dùng browser tool để kiểm tra giao diện từng trang
- Screenshot so sánh responsive breakpoints

---

> [!IMPORTANT]
> **Yêu cầu trước khi bắt đầu**: Bạn cần tạo một Firebase project tại [console.firebase.google.com](https://console.firebase.google.com) và cung cấp thông tin config (API Key, Project ID, etc.) để tôi cấu hình vào `.env.local`. Nếu chưa có, tôi sẽ tạo file `.env.local.example` với placeholder.

> [!NOTE]
> Dự án sẽ được khởi tạo tại `d:\projects\nhatrophutho\`. Thời gian ước tính toàn bộ: **~3-4 giờ** code liên tục. Tôi sẽ thực hiện từng Phase và báo cáo tiến độ.
