// Utility functions

// Format price in Vietnamese
export function formatPrice(price: number): string {
  if (price >= 1000000) {
    const millions = price / 1000000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)} triệu/tháng`;
  }
  return `${new Intl.NumberFormat("vi-VN").format(price)} đ/tháng`;
}

// Format price short
export function formatPriceShort(price: number): string {
  if (price >= 1000000) {
    const millions = price / 1000000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}tr`;
  }
  return `${(price / 1000).toFixed(0)}k`;
}

// Generate slug from Vietnamese title
export function generateSlug(title: string): string {
  const vietnameseMap: Record<string, string> = {
    à: "a", á: "a", ạ: "a", ả: "a", ã: "a",
    â: "a", ầ: "a", ấ: "a", ậ: "a", ẩ: "a", ẫ: "a",
    ă: "a", ằ: "a", ắ: "a", ặ: "a", ẳ: "a", ẵ: "a",
    è: "e", é: "e", ẹ: "e", ẻ: "e", ẽ: "e",
    ê: "e", ề: "e", ế: "e", ệ: "e", ể: "e", ễ: "e",
    ì: "i", í: "i", ị: "i", ỉ: "i", ĩ: "i",
    ò: "o", ó: "o", ọ: "o", ỏ: "o", õ: "o",
    ô: "o", ồ: "o", ố: "o", ộ: "o", ổ: "o", ỗ: "o",
    ơ: "o", ờ: "o", ớ: "o", ợ: "o", ở: "o", ỡ: "o",
    ù: "u", ú: "u", ụ: "u", ủ: "u", ũ: "u",
    ư: "u", ừ: "u", ứ: "u", ự: "u", ử: "u", ữ: "u",
    ỳ: "y", ý: "y", ỵ: "y", ỷ: "y", ỹ: "y",
    đ: "d",
    À: "a", Á: "a", Ạ: "a", Ả: "a", Ã: "a",
    Â: "a", Ầ: "a", Ấ: "a", Ậ: "a", Ẩ: "a", Ẫ: "a",
    Ă: "a", Ằ: "a", Ắ: "a", Ặ: "a", Ẳ: "a", Ẵ: "a",
    È: "e", É: "e", Ẹ: "e", Ẻ: "e", Ẽ: "e",
    Ê: "e", Ề: "e", Ế: "e", Ệ: "e", Ể: "e", Ễ: "e",
    Ì: "i", Í: "i", Ị: "i", Ỉ: "i", Ĩ: "i",
    Ò: "o", Ó: "o", Ọ: "o", Ỏ: "o", Õ: "o",
    Ô: "o", Ồ: "o", Ố: "o", Ộ: "o", Ổ: "o", Ỗ: "o",
    Ơ: "o", Ờ: "o", Ớ: "o", Ợ: "o", Ở: "o", Ỡ: "o",
    Ù: "u", Ú: "u", Ụ: "u", Ủ: "u", Ũ: "u",
    Ư: "u", Ừ: "u", Ứ: "u", Ự: "u", Ử: "u", Ữ: "u",
    Ỳ: "y", Ý: "y", Ỵ: "y", Ỷ: "y", Ỹ: "y",
    Đ: "d",
  };

  let slug = title.toLowerCase();
  for (const [key, value] of Object.entries(vietnameseMap)) {
    slug = slug.replaceAll(key, value);
  }

  slug = slug
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${slug}-${Date.now().toString(36)}`;
}

// Format date
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "Chưa cập nhật";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Ngày không hợp lệ";
  
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

// Time ago
export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  return formatDate(dateString);
}

// Format area
export function formatArea(area: number): string {
  return `${area}m²`;
}

// Classnames utility
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
