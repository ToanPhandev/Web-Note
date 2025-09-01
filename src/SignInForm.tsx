"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            let toastTitle = "";
            if (error.message.includes("Invalid password")) {
              toastTitle = "Mật khẩu không hợp lệ. Vui lòng thử lại.";
            } else {
              toastTitle =
                flow === "signIn"
                  ? "Không thể đăng nhập, bạn có muốn đăng ký không?"
                  : "Không thể đăng ký, bạn có muốn đăng nhập không?";
            }
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <input
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          name="password"
          placeholder="Mật khẩu"
          required
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          type="submit"
          disabled={submitting}
        >
          {flow === "signIn" ? "Đăng nhập" : "Đăng ký"}
        </button>
        <div className="text-center text-sm text-gray-600">
          <span>
            {flow === "signIn"
              ? "Chưa có tài khoản? "
              : "Đã có tài khoản? "}
          </span>
          <button
            type="button"
            className="text-blue-600 hover:underline font-medium cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Đăng ký ngay" : "Đăng nhập ngay"}
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center my-4">
        <hr className="w-full border-gray-300" />
        <span className="px-2 text-gray-500">hoặc</span>
        <hr className="w-full border-gray-300" />
      </div>
      <button
        className="w-full px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
        onClick={() => void signIn("anonymous")}
      >
        Đăng nhập ẩn danh
      </button>
    </div>
  );
}
