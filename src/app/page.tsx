"use client";

import Link from "next/link";
import { Button, Card, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import RoomCard, { RoomCardSkeleton } from "@/components/ui/RoomCard";
import SearchFilterForm from "@/components/forms/SearchFilterForm";
import phuThoData from "@/data/phu-tho-locations.json";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getFeaturedRooms } from "@/lib/firebase/firestore";
import type { Room } from "@/types/room";

// Stats data
const stats = [
  { icon: "mdi:home-group", value: "500+", label: "Phòng trọ" },
  { icon: "mdi:map-marker-radius", value: "13", label: "Khu vực" },
  { icon: "mdi:account-group", value: "1,000+", label: "Người dùng" },
  { icon: "mdi:handshake", value: "200+", label: "Chủ trọ" },
];

// Popular districts
const popularDistricts = [
  { code: "227", name: "TP. Việt Trì", rooms: 150, icon: "mdi:city-variant" },
  { code: "228", name: "TX. Phú Thọ", rooms: 80, icon: "mdi:domain" },
  { code: "237", name: "Lâm Thao", rooms: 45, icon: "mdi:home-city" },
  { code: "233", name: "Phù Ninh", rooms: 35, icon: "mdi:home-variant" },
  { code: "230", name: "Đoan Hùng", rooms: 25, icon: "mdi:home-modern" },
  { code: "235", name: "Cẩm Khê", rooms: 20, icon: "mdi:home" },
];

export default function HomePage() {
  const router = useRouter();
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const rooms = await getFeaturedRooms(6);
        setFeaturedRooms(rooms);
      } catch (error) {
        console.error("Error loading featured rooms:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleSearch = () => {
    router.push("/tim-phong");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-sky-200/30 dark:bg-sky-900/20 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-emerald-200/30 dark:bg-emerald-900/20 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sky-100/20 dark:bg-sky-900/10 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
            <div className="text-center max-w-3xl mx-auto">
              {/* Badge */}
              <Chip
                variant="flat"
                color="primary"
                size="sm"
                className="mb-6 gap-1"
              >
                <span className="flex items-center gap-1">
                  <Icon icon="mdi:sparkles" className="text-sm" />
                  Nền tảng tìm trọ #1 Phú Thọ
                </span>
              </Chip>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
                Tìm{" "}
                <span className="gradient-text">nhà trọ</span>{" "}
                tại Phú Thọ
                <br className="hidden sm:block" />
                chưa bao giờ{" "}
                <span className="relative inline-block">
                  dễ hơn
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8C50 2 150 2 198 8" stroke="url(#grad)" strokeWidth="4" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="200" y2="0">
                        <stop stopColor="#0ea5e9" />
                        <stop offset="1" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
                Hàng trăm phòng trọ giá rẻ, tiện ích đầy đủ tại tất cả các
                huyện, thành phố trong tỉnh Phú Thọ. Kết nối trực tiếp với chủ
                nhà trọ.
              </p>

              {/* Search Box */}
              <div className="glass rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto shadow-xl shadow-sky-500/5">
                <SearchFilterForm onSearch={handleSearch} compact />
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-10">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                      <Icon
                        icon={stat.icon}
                        className="text-xl text-sky-600 dark:text-sky-400"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== FEATURED ROOMS ===== */}
        <section className="py-16 sm:py-20 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Phòng trọ{" "}
                  <span className="gradient-text">mới nhất</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Các phòng trọ vừa được đăng gần đây
                </p>
              </div>
              <Button
                as={Link}
                href="/tim-phong"
                variant="flat"
                color="primary"
                endContent={<Icon icon="mdi:arrow-right" />}
              >
                Xem tất cả
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <RoomCardSkeleton key={i} />
                  ))
                : featuredRooms.length > 0
                ? featuredRooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))
                : /* Demo cards khi chưa có data */
                  Array.from({ length: 6 }).map((_, i) => (
                    <Card
                      key={i}
                      className="overflow-hidden border border-slate-200 dark:border-slate-700 group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="aspect-[4/3] bg-gradient-to-br from-sky-100 to-emerald-100 dark:from-sky-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                        <Icon
                          icon="mdi:home"
                          className="text-5xl text-sky-300 dark:text-sky-700"
                        />
                      </div>
                      <Card.Content className="px-4 pt-3 pb-3">
                        <p className="price-tag text-lg">
                          {(1.5 + i * 0.5).toFixed(1)} triệu/tháng
                        </p>
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-1">
                          Phòng trọ mẫu #{i + 1} - Khu vực{" "}
                          {popularDistricts[i]?.name || "Việt Trì"}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <Icon icon="mdi:map-marker" className="text-sky-500" />
                          <span>
                            {popularDistricts[i]?.name || "TP. Việt Trì"},{" "}
                            Phú Thọ
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
                            <Icon icon="mdi:ruler-square" className="text-emerald-500" />
                            {15 + i * 3}m²
                          </span>
                          <Icon icon="mdi:wifi" className="text-sm text-slate-400" />
                          <Icon icon="mdi:air-conditioner" className="text-sm text-slate-400" />
                        </div>
                      </Card.Content>
                    </Card>
                  ))}
            </div>
          </div>
        </section>

        {/* ===== POPULAR AREAS ===== */}
        <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Khu vực{" "}
                <span className="gradient-text">phổ biến</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                Khám phá phòng trọ tại các khu vực được tìm kiếm nhiều nhất
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularDistricts.map((district) => (
                <Link
                  key={district.code}
                  href={`/tim-phong?district=${district.code}`}
                  className="group"
                >
                  <Card className="text-center p-4 border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100 dark:from-sky-900/30 dark:to-emerald-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Icon
                        icon={district.icon}
                        className="text-2xl text-sky-600 dark:text-sky-400"
                      />
                    </div>
                    <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {district.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {district.rooms}+ phòng
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA FOR LANDLORDS ===== */}
        <section className="py-16 sm:py-20 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 to-emerald-600 p-8 sm:p-12 lg:p-16">
              {/* Background decoration */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 blur-2xl translate-y-1/2 -translate-x-1/2" />
              </div>

              <div className="relative flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                    Bạn là chủ nhà trọ?
                  </h2>
                  <p className="text-sky-100 text-lg mb-6 max-w-xl">
                    Đăng tin cho thuê phòng trọ hoàn toàn miễn phí. Tiếp cận
                    hàng nghìn người đang tìm kiếm phòng trọ tại Phú Thọ.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    <Button
                      as={Link}
                      href="/dang-ky"
                      size="lg"
                      className="bg-white text-sky-700 font-bold shadow-xl hover:shadow-2xl transition-shadow"
                      startContent={<Icon icon="mdi:pencil-plus" />}
                    >
                      Đăng phòng miễn phí
                    </Button>
                    <Button
                      as={Link}
                      href="/ve-chung-toi"
                      size="lg"
                      variant="bordered"
                      className="text-white border-white/50 hover:bg-white/10"
                    >
                      Tìm hiểu thêm
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:flex items-center justify-center">
                  <div className="w-48 h-48 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Icon
                      icon="mdi:home-plus"
                      className="text-7xl text-white/80"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Cách thức{" "}
                <span className="gradient-text">hoạt động</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                Chỉ 3 bước đơn giản để tìm được phòng trọ ưng ý
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  icon: "mdi:magnify",
                  title: "Tìm kiếm",
                  desc: "Lọc phòng trọ theo khu vực, giá cả, diện tích và tiện ích phù hợp với nhu cầu.",
                },
                {
                  step: "02",
                  icon: "mdi:image-search",
                  title: "Xem chi tiết",
                  desc: "Xem ảnh thật, thông tin đầy đủ và đánh giá từ người thuê trước.",
                },
                {
                  step: "03",
                  icon: "mdi:phone-in-talk",
                  title: "Liên hệ chủ trọ",
                  desc: "Gọi điện hoặc nhắn tin trực tiếp cho chủ nhà trọ để xem phòng.",
                },
              ].map((item) => (
                <div key={item.step} className="relative text-center group">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-sky-100 to-emerald-100 dark:from-sky-900/30 dark:to-emerald-900/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon
                      icon={item.icon}
                      className="text-3xl text-sky-600 dark:text-sky-400"
                    />
                  </div>
                  <span className="text-xs font-bold text-sky-500 tracking-wider uppercase">
                    Bước {item.step}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

