"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, Chip, CardContent } from "@heroui/react";
import { Icon } from "@iconify/react";
import { formatPrice, formatArea, timeAgo } from "@/lib/utils";
import { ROOM_TYPE_LABELS, type Room } from "@/types/room";

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <Link href={`/tim-phong/${room.slug}`} className="block group">
      <Card
        className="overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-sky-500/5 transition-all duration-300 group-hover:-translate-y-1"
        shadow="sm"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {room.images?.[0] ? (
            <Image
              src={room.images[0]}
              alt={room.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
              <Icon
                icon="mdi:image-off"
                className="text-4xl text-slate-400 dark:text-slate-500"
              />
            </div>
          )}

          {/* Room type badge */}
          <Chip
            size="sm"
            variant="secondary"
            className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-medium"
          >
            {ROOM_TYPE_LABELS[room.roomType]}
          </Chip>

          {/* Image count */}
          {room.images?.length > 1 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
              <Icon icon="mdi:image-multiple" className="text-sm" />
              <span>{room.images.length}</span>
            </div>
          )}
        </div>

        <CardContent className="px-4 pt-3 pb-2 gap-1.5">
          {/* Price */}
          <p className="price-tag text-lg">
            {formatPrice(room.price)}
          </p>

          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
            {room.title}
          </h3>

          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Icon icon="mdi:map-marker" className="text-sky-500 flex-shrink-0" />
            <span className="truncate">
              {room.wardName}{room.districtName ? `, ${room.districtName}` : ""}
            </span>
          </div>

          {/* Area + amenities */}
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
              <Icon icon="mdi:ruler-square" className="text-emerald-500" />
              {formatArea(room.area)}
            </span>
            {room.amenities?.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-xs text-slate-500 dark:text-slate-400"
              >
                {amenity === "wifi" && <Icon icon="mdi:wifi" className="text-sm" />}
                {amenity === "dieu_hoa" && <Icon icon="mdi:air-conditioner" className="text-sm" />}
                {amenity === "nong_lanh" && <Icon icon="mdi:water-thermometer" className="text-sm" />}
              </span>
            ))}
          </div>
        </Card.Content>

        <Card.Footer className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {timeAgo(room.createdAt)}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Icon icon="mdi:eye" />
            <span>{room.viewCount || 0}</span>
          </div>
        </Card.Footer>
      </Card>
    </Link>
  );
}

// Skeleton loading card
export function RoomCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-slate-200 dark:border-slate-700">
      <div className="aspect-[4/3] skeleton" />
      <Card.Content className="px-4 pt-3 pb-2 gap-2">
        <div className="h-5 w-24 skeleton rounded" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-3 w-1/2 skeleton rounded" />
      </Card.Content>
      <Card.Footer className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700/50">
        <div className="h-3 w-20 skeleton rounded" />
      </Card.Footer>
    </Card>
  );
}

