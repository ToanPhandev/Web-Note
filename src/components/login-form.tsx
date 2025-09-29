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
import { useNavigate } from "react-router-dom"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { signIn } = useAuthActions()
  const navigate = useNavigate()
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn")
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handlePasswordSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      formData.set("flow", flow)
      await signIn("password", formData)
      navigate("/Homepage")
    } catch (error: any) {
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
    } finally {
      setSubmitting(false)
    }
  }

  const handleAnonymousSignIn = async () => {
    setSubmitting(true)
    try {
      await signIn("anonymous")
      navigate("/Homepage")
    } catch (error) {
      toast.error("Không thể đăng nhập ẩn danh.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl dark:text-white">
            {flow === "signIn" ? "Đăng nhập" : "Đăng ký"}
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Hãy điền email bên dưới để đăng nhập vào tài khoản của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSignIn}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="dark:text-white">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={submitting}
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="dark:text-white">Mật Khẩu</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline dark:text-gray-400"
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
                    disabled={submitting}
                    className="dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={submitting}
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
                className="w-full dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                onClick={handleAnonymousSignIn}
                disabled={submitting}
              >
                Đăng nhập ẩn danh
              </Button>
            </div>
            <div className="mt-4 text-center text-sm dark:text-gray-400">
              <span>
                {flow === "signIn"
                  ? "Chưa có tài khoản? "
                  : "Đã có tài khoản? "}
              </span>
              <button
                type="button"
                className="text-blue-600 hover:underline font-medium cursor-pointer dark:text-blue-400"
                onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                disabled={submitting}
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
