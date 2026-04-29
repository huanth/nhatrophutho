import Link from "next/link";
import { Icon } from "@iconify/react";

const footerLinks = {
  product: [
    { href: "/tim-phong", label: "Tìm phòng trọ" },
    { href: "/dang-ky", label: "Đăng phòng" },
    { href: "/ve-chung-toi", label: "Về chúng tôi" },
    { href: "/lien-he", label: "Liên hệ" },
  ],
  areas: [
    { href: "/tim-phong?district=227", label: "TP. Việt Trì" },
    { href: "/tim-phong?district=228", label: "TX. Phú Thọ" },
    { href: "/tim-phong?district=237", label: "Huyện Lâm Thao" },
    { href: "/tim-phong?district=233", label: "Huyện Phù Ninh" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 shadow-lg shadow-sky-500/25">
                <Icon icon="mdi:home-search" className="text-white text-2xl" />
              </div>
              <div>
                <p className="font-bold text-lg gradient-text">NhàTrọ</p>
                <p className="text-[10px] text-slate-500 -mt-1">Phú Thọ</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Nền tảng tìm kiếm nhà trọ, phòng trọ #1 tại Phú Thọ. Kết nối
              người tìm trọ với chủ nhà trọ nhanh chóng, minh bạch.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-sky-900/30 dark:hover:text-sky-400 transition-colors"
                aria-label="Facebook"
              >
                <Icon icon="mdi:facebook" className="text-lg" />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-sky-900/30 dark:hover:text-sky-400 transition-colors"
                aria-label="Zalo"
              >
                <Icon icon="simple-icons:zalo" className="text-lg" />
              </a>
              <a
                href="tel:0123456789"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-sky-900/30 dark:hover:text-sky-400 transition-colors"
                aria-label="Điện thoại"
              >
                <Icon icon="mdi:phone" className="text-lg" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wider">
              Dịch vụ
            </h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wider">
              Khu vực
            </h3>
            <ul className="space-y-2">
              {footerLinks.areas.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wider">
              Liên hệ
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Icon icon="mdi:map-marker" className="text-sky-500 mt-0.5 flex-shrink-0" />
                <span>TP. Việt Trì, Tỉnh Phú Thọ</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Icon icon="mdi:phone" className="text-sky-500 flex-shrink-0" />
                <a href="tel:0123456789" className="hover:text-sky-600">
                  0123 456 789
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Icon icon="mdi:email" className="text-sky-500 flex-shrink-0" />
                <a href="mailto:info@nhatrophutho.com" className="hover:text-sky-600">
                  info@nhatrophutho.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} NhàTrọ Phú Thọ. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <Link href="#" className="hover:text-sky-600">
              Điều khoản
            </Link>
            <Link href="#" className="hover:text-sky-600">
              Bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
