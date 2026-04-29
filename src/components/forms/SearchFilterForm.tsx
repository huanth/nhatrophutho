"use client";

import { useMemo } from "react";
import { Button, Slider } from "@heroui/react";
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

  const wards = useMemo(() => {
    if (!filters.district) return [];
    const district = phuThoData.districts.find(
      (d) => d.code === filters.district
    );
    return district?.wards || [];
  }, [filters.district]);

  const handleDistrictChange = (value: string) => {
    setFilter("district", value || undefined);
    setFilter("ward", undefined);
  };

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
          className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">Tất cả</option>
          {Object.entries(ROOM_TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* District */}
      <div className={compact ? "w-44" : "w-full"}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Huyện/TP</label>
        <select
          value={filters.district || ""}
          onChange={(e) => handleDistrictChange(e.target.value)}
          className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">Tất cả khu vực</option>
          {phuThoData.districts.map((district) => (
            <option key={district.code} value={district.code}>{district.name}</option>
          ))}
        </select>
      </div>

      {/* Ward */}
      <div className={compact ? "w-44" : "w-full"}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Xã/Phường</label>
        <select
          value={filters.ward || ""}
          onChange={(e) => setFilter("ward", e.target.value || undefined)}
          disabled={!filters.district}
          className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
        >
          <option value="">Tất cả</option>
          {wards.map((ward) => (
            <option key={ward.code} value={ward.code}>{ward.name}</option>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div className={compact ? "w-44" : "w-full"}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Khoảng giá</label>
        <select
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
          className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">Tất cả</option>
          {PRICE_RANGES.map((range, index) => (
            <option key={index} value={index}>{range.label}</option>
          ))}
        </select>
      </div>

      {/* Area (non-compact only) */}
      {!compact && (
        <div className="w-full px-1 py-2">
          <Slider
            label="Diện tích (m²)"
            step={5}
            minValue={10}
            maxValue={100}
            defaultValue={[10, 100]}
            formatOptions={{ style: "unit", unit: "meter" }}
            size="sm"
            classNames={{
              label: "text-sm text-slate-600 dark:text-slate-400",
            }}
            onChange={(value) => {
              if (Array.isArray(value)) {
                setFilter("minArea", value[0]);
                setFilter("maxArea", value[1]);
              }
            }}
          />
        </div>
      )}

      {/* Actions */}
      <div className={compact ? "flex gap-2" : "flex gap-2 w-full mt-2"}>
        <Button
          color="primary"
          className="font-semibold shadow-lg shadow-sky-500/25 flex-1"
          size={compact ? "md" : "sm"}
          startContent={<Icon icon="mdi:magnify" />}
          onPress={handleSearch}
        >
          Tìm kiếm
        </Button>
        <Button
          variant="flat"
          size={compact ? "md" : "sm"}
          onPress={resetFilters}
          isIconOnly={compact}
          startContent={!compact && <Icon icon="mdi:refresh" />}
        >
          {compact ? <Icon icon="mdi:refresh" className="text-lg" /> : "Xóa"}
        </Button>
      </div>
    </div>
  );
}
