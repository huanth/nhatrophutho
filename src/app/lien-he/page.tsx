import { Icon } from "@iconify/react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const metadata = {
  title: "Liên hệ",
  description: "Liên hệ với Nhà Trọ Phú Thọ - Hỗ trợ tìm phòng trọ và đăng tin",
};

export default function ContactPage() {
  const contacts = [
    { icon: "mdi:phone", label: "Điện thoại", value: "0123 456 789", href: "tel:0123456789" },
    { icon: "mdi:email", label: "Email", value: "info@nhatrophutho.com", href: "mailto:info@nhatrophutho.com" },
    { icon: "mdi:facebook", label: "Facebook", value: "fb.com/nhatrophutho", href: "#" },
    { icon: "mdi:map-marker", label: "Địa chỉ", value: "TP. Việt Trì, Phú Thọ", href: "#" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 sm:py-20 bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              <span className="gradient-text">Liên hệ</span> với chúng tôi
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Bạn cần hỗ trợ tìm phòng trọ hoặc đăng tin? Liên hệ ngay!
            </p>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contacts.map((c) => (
                <a key={c.label} href={c.href}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-lg transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-100 to-emerald-100 dark:from-sky-900/30 dark:to-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon icon={c.icon} className="text-2xl text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{c.label}</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{c.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
