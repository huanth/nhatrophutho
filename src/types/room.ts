// Room type definitions
export type RoomType = "phong_tro" | "nha_nguyen_can" | "chung_cu_mini";
export type RoomStatus = "pending" | "approved" | "rejected" | "hidden";

export interface Room {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  area: number;
  address: string;
  district: string;
  districtName: string;
  ward: string;
  wardName: string;
  images: string[];
  amenities: string[];
  roomType: RoomType;
  status: RoomStatus;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
}

export interface RoomFormData {
  title: string;
  description: string;
  price: number;
  area: number;
  address: string;
  district: string;
  districtName: string;
  ward: string;
  wardName: string;
  images: string[];
  amenities: string[];
  roomType: RoomType;
  ownerPhone: string;
}

export interface RoomFilters {
  district?: string;
  ward?: string;
  roomType?: RoomType;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  sortBy?: "newest" | "price_asc" | "price_desc";
}

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  phong_tro: "Phòng trọ",
  nha_nguyen_can: "Nhà nguyên căn",
  chung_cu_mini: "Chung cư mini",
};

export const ROOM_STATUS_LABELS: Record<RoomStatus, string> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Bị từ chối",
  hidden: "Đã ẩn",
};

export const AMENITIES = [
  { key: "wifi", label: "Wifi", icon: "mdi:wifi" },
  { key: "dieu_hoa", label: "Điều hòa", icon: "mdi:air-conditioner" },
  { key: "nong_lanh", label: "Nóng lạnh", icon: "mdi:water-thermometer" },
  { key: "tu_lanh", label: "Tủ lạnh", icon: "mdi:fridge" },
  { key: "may_giat", label: "Máy giặt", icon: "mdi:washing-machine" },
  { key: "giu_xe", label: "Giữ xe", icon: "mdi:motorbike" },
  { key: "bep", label: "Bếp", icon: "mdi:stove" },
  { key: "ban_cong", label: "Ban công", icon: "mdi:balcony" },
  { key: "tu_do", label: "Tự do giờ giấc", icon: "mdi:clock-outline" },
  { key: "an_ninh", label: "An ninh", icon: "mdi:shield-check" },
  { key: "cho_nuoi_pet", label: "Cho nuôi pet", icon: "mdi:paw" },
  { key: "trang_bi_noi_that", label: "Nội thất", icon: "mdi:sofa" },
];

export const PRICE_RANGES = [
  { label: "Dưới 1 triệu", min: 0, max: 1000000 },
  { label: "1 - 2 triệu", min: 1000000, max: 2000000 },
  { label: "2 - 3 triệu", min: 2000000, max: 3000000 },
  { label: "3 - 5 triệu", min: 3000000, max: 5000000 },
  { label: "Trên 5 triệu", min: 5000000, max: 50000000 },
];
