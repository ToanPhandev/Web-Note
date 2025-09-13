import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthActions } from "@convex-dev/auth/react"
import { useState } from "react"
import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { signIn } = useAuthActions()
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn")
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {flow === "signIn" ? "Đăng nhập" : "Đăng ký"}
          </CardTitle>
          <CardDescription>
            Hãy điền email bên dưới để đăng nhập vào tài khoản của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setSubmitting(true)
              const formData = new FormData(e.target as HTMLFormElement)
              formData.set("flow", flow)
              void signIn("password", formData).catch((error) => {
                let toastTitle = ""
                if (error.message.includes("Invalid password")) {
                  toastTitle = "Mật khẩu không hợp lệ. Vui lòng thử lại."
                } else {
                  toastTitle =
                    flow === "signIn"
                      ? "Không thể đăng nhập, bạn có muốn đăng ký không?"
                      : "Không thể đăng ký, bạn có muốn đăng nhập không?"
                }
                toast.error(toastTitle)
                setSubmitting(false)
              })
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mật Khẩu</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 .986-3.122 3.7-5.486 7.042-6.25"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.582 8.418A10.028 10.028 0 0121.542 12c-1.274 4.057-5.064 7-9.542 7a10.028 10.028 0 01-2.082-.25"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.93 4.93l14.14 14.14"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={submitting}
              >
                {flow === "signIn" ? "Đăng nhập" : "Đăng ký"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => void signIn("anonymous")}
              >
                Đăng nhập ẩn danh
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
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
        </CardContent>
      </Card>
    </div>
  )
}
