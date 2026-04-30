"use client";

import { useMemo } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useFilterStore } from "@/stores/filterStore";
import phuThoData from "@/data/phu-tho-locations.json";
import { ROOM_TYPE_LABELS, PRICE_RANGES, type RoomType } from "@/types/room";

interface SearchFilterFormProps {
  onSearch?: () => void;
  compact?: boolean;
}

export default function SearchFilterForm({
  onSearch,
  compact = false,
}: SearchFilterFormProps) {
  const { filters, setFilter, resetFilters } = useFilterStore();

  const wards = phuThoData.wards;

  // Find the currently selected price range index
  const selectedPriceIndex = useMemo(() => {
    if (filters.minPrice === undefined && filters.maxPrice === undefined) return "";
    const idx = PRICE_RANGES.findIndex(
      (r) => r.min === filters.minPrice && r.max === filters.maxPrice
    );
    return idx >= 0 ? String(idx) : "";
  }, [filters.minPrice, filters.maxPrice]);

  const handleSearch = () => {
    onSearch?.();
  };

  return (
    <div
      className={`${
        compact
          ? "flex flex-wrap items-end gap-3"
          : "flex flex-col gap-4"
      }`}
    >
      {/* Room type */}
      <div className={compact ? "w-40" : "w-full"}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Loại phòng</label>
        <select
          value={filters.roomType || ""}
          onChange={(e) => setFilter("roomType", e.target.value as RoomType || undefined)}
          className="form-control"
        >
          <option value="">Tất cả</option>
          {Object.entries(ROOM_TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Ward */}
      <div className={compact ? "w-44" : "w-full"}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Khu vực</label>
        <select
          value={filters.ward || ""}
          onChange={(e) => setFilter("ward", e.target.value || undefined)}
          className="form-control"
        >
          <option value="">Tất cả khu vực</option>
          {wards.map((ward) => (
            <option key={ward.name} value={ward.name}>{ward.name}</option>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div className={compact ? "w-44" : "w-full"}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Khoảng giá</label>
        <select
          value={selectedPriceIndex}
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              const range = PRICE_RANGES[parseInt(val)];
              setFilter("minPrice", range.min);
              setFilter("maxPrice", range.max);
            } else {
              setFilter("minPrice", undefined);
              setFilter("maxPrice", undefined);
            }
          }}
          className="form-control"
        >
          <option value="">Tất cả</option>
          {PRICE_RANGES.map((range, index) => (
            <option key={index} value={index}>{range.label}</option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className={compact ? "flex gap-2" : "flex gap-2 w-full mt-2"}>
        <Button
          className="font-semibold shadow-lg shadow-sky-500/25 flex-1"
          size={compact ? "md" : "sm"}
          onPress={handleSearch}
        >
          <Icon icon="mdi:magnify" />
          Tìm kiếm
        </Button>
        <Button
          variant="secondary"
          size={compact ? "md" : "sm"}
          onPress={resetFilters}
          isIconOnly={compact}
        >
          {compact ? <Icon icon="mdi:refresh" className="text-lg" /> : "Xóa"}
        </Button>
      </div>
    </div>
  );
}
