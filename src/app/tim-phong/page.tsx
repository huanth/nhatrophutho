"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import RoomCard, { RoomCardSkeleton } from "@/components/ui/RoomCard";
import SearchFilterForm from "@/components/forms/SearchFilterForm";
import { useFilterStore } from "@/stores/filterStore";
import { getRooms } from "@/lib/firebase/firestore";
import type { Room } from "@/types/room";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

export default function TimPhongPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { filters } = useFilterStore();
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const loadRooms = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setLastDoc(null);
      } else {
        setLoadingMore(true);
      }

      const result = await getRooms(filters, reset ? undefined : lastDoc || undefined);
      
      if (reset) {
        setRooms(result.rooms);
      } else {
        setRooms((prev) => [...prev, ...result.rooms]);
      }
      
      setLastDoc(result.lastVisible);
      setHasMore(result.rooms.length === 12);
    } catch (error) {
      console.error("Error loading rooms:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, lastDoc]);

  useEffect(() => {
    loadRooms(true);
  }, [filters]);

  const handleSearch = () => {
    loadRooms(true);
    onClose();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Tìm <span className="gradient-text">phòng trọ</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {rooms.length > 0
                ? `Tìm thấy ${rooms.length}+ phòng trọ tại Phú Thọ`
                : "Tìm kiếm phòng trọ phù hợp với bạn"}
            </p>
          </div>

          {/* Mobile filter button */}
          <Button
            className="lg:hidden"
            variant="flat"
            startContent={<Icon icon="mdi:filter-variant" />}
            onPress={onOpen}
          >
            Bộ lọc
          </Button>
        </div>

        <div className="flex gap-6">
          {/* Desktop sidebar filter */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Icon icon="mdi:filter-variant" className="text-sky-500" />
                Bộ lọc tìm kiếm
              </h3>
              <SearchFilterForm onSearch={handleSearch} />
            </div>
          </aside>

          {/* Room grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <RoomCardSkeleton key={i} />
                ))}
              </div>
            ) : rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <Icon icon="mdi:home-search" className="text-4xl text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Không tìm thấy phòng trọ
                </h3>
                <p className="text-sm text-slate-500 mb-4 max-w-sm">
                  Thử thay đổi bộ lọc hoặc mở rộng khu vực tìm kiếm để xem
                  thêm kết quả.
                </p>
                <Button
                  variant="flat"
                  color="primary"
                  onPress={() => {
                    useFilterStore.getState().resetFilters();
                  }}
                  startContent={<Icon icon="mdi:refresh" />}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>

                {/* Load more */}
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <Button
                      variant="flat"
                      color="primary"
                      isLoading={loadingMore}
                      onPress={() => loadRooms(false)}
                      startContent={!loadingMore && <Icon icon="mdi:plus" />}
                    >
                      Xem thêm
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Mobile filter drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
          <div className="relative bg-white dark:bg-slate-900 rounded-t-2xl w-full max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-full duration-300">
            <div className="sticky top-0 bg-white dark:bg-slate-900 z-10 px-4 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <Icon icon="mdi:filter-variant" className="text-sky-500 text-xl" />
                <span>Bộ lọc tìm kiếm</span>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors">
                <Icon icon="mdi:close" className="text-xl" />
              </button>
            </div>
            <div className="p-4 pb-8">
              <SearchFilterForm onSearch={handleSearch} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
