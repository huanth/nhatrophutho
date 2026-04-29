import { Icon } from "@iconify/react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const metadata = {
  title: "Về chúng tôi",
  description: "Nhà Trọ Phú Thọ - Nền tảng kết nối người tìm trọ và chủ nhà trọ tại Phú Thọ",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 sm:py-20 bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Về <span className="gradient-text">Nhà Trọ Phú Thọ</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Chúng tôi là nền tảng kết nối người tìm phòng trọ với chủ nhà trọ tại tỉnh Phú Thọ.
              Sứ mệnh của chúng tôi là giúp mọi người tìm được nơi ở phù hợp một cách nhanh chóng, minh bạch và tiện lợi.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "mdi:target", title: "Sứ mệnh", desc: "Kết nối nhanh chóng người tìm trọ với hàng trăm phòng trọ chất lượng trên toàn tỉnh Phú Thọ." },
                { icon: "mdi:eye-check", title: "Tầm nhìn", desc: "Trở thành nền tảng tìm kiếm nhà trọ số 1 tại Phú Thọ, mở rộng ra các tỉnh lân cận." },
                { icon: "mdi:heart", title: "Giá trị", desc: "Minh bạch thông tin, dễ sử dụng, miễn phí cho người thuê, hỗ trợ tận tình cho chủ trọ." },
              ].map((item) => (
                <div key={item.title} className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100 dark:from-sky-900/30 dark:to-emerald-900/30 flex items-center justify-center mb-4">
                    <Icon icon={item.icon} className="text-3xl text-sky-600 dark:text-sky-400" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
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
