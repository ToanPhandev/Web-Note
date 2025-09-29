import React from "react";
import { SparklesText } from "./ui/sparkles-text";
import { Link } from "react-router-dom";
import { useTheme } from "./theme-provider";
import { Sun, Moon } from "lucide-react";

export function HomePage() {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4 transition-colors duration-500">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </button>
      </div>
      <div className="text-center">
        <SparklesText
          text="Ghi Chú"
          className="text-7xl mb-6 text-gray-900 dark:text-white"
          colors={{ first: "#9E7AFF", second: "#FE8BBB" }}
          sparklesCount={15}
        />

        <p className="text-gray-600 dark:text-gray-300 text-xl mb-8 max-w-md mx-auto">
          Lưu trữ ghi chú của bạn một cách an toàn và dễ dàng truy cập từ mọi
          nơi.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/Signin"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        <FeatureCard
          icon="✨"
          title="Dễ sử dụng"
          description="Giao diện đơn giản, thân thiện với người dùng."
        />
        <FeatureCard
          icon="🔒"
          title="An toàn"
          description="Bảo mật dữ liệu với hệ thống xác thực mạnh mẽ."
        />
        <FeatureCard
          icon="📱"
          title="Đa nền tảng"
          description="Truy cập từ máy tính, điện thoại hoặc máy tính bảng."
        />
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}