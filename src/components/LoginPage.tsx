import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field"
import type { ApiResponse, LoginResponseData } from "@/types"

export default function LoginPage({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [trustDevice, setTrustDevice] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          expired: trustDevice ? "none" : undefined,
        }),
      })

      const data = (await response.json()) as ApiResponse<LoginResponseData>

      if (data.success && data.data) {
        localStorage.setItem("auth_token", data.data.token)
        onLoginSuccess(data.data.token)
      } else {
        setError(data.error || "登录失败")
      }
    } catch {
      setError("网络错误,请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen memphis-pattern relative flex items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="memphis-shape memphis-shape--circle -left-24 -top-24"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
        />
        <motion.div
          className="memphis-shape memphis-shape--triangle top-16 right-[-32px]"
          animate={{ rotate: [-10, 12, -10] }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
        />
        <motion.div
          className="memphis-shape memphis-shape--stripe bottom-[-180px] left-1/2 -translate-x-1/2"
          animate={{ rotate: [0, 6, -6, 0] }}
          transition={{ repeat: Infinity, duration: 26, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="memphis-panel relative px-10 py-12 backdrop-blur-xl">
          <span className="memphis-chip absolute -top-5 left-12 shadow-[0_6px_0_rgba(36,17,61,0.15)]">Memphis Mode</span>

          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-black uppercase tracking-[0.4em] text-foreground">Alle</h1>
            <p className="mx-auto mt-4 max-w-sm text-sm text-muted-foreground">
              以孟菲斯式的律动整理验证码与重要链接，色块与几何构成的灵感空间正等待你的登录。
            </p>
            <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-primary" />
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 mt-10 space-y-6">
            <FieldGroup className="space-y-5">
              <Field>
                <FieldLabel htmlFor="username" className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  用户名
                </FieldLabel>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="请输入用户名"
                  required
                  disabled={loading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  密码
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="请输入密码"
                  required
                  disabled={loading}
                />
              </Field>

              <Field orientation="horizontal" className="items-center justify-between rounded-2xl border-2 border-border bg-card px-4 py-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="trustDevice"
                    checked={trustDevice}
                    onCheckedChange={(checked) => setTrustDevice(checked === true)}
                    disabled={loading}
                  />
                  <FieldLabel htmlFor="trustDevice" className="cursor-pointer select-none text-sm font-semibold text-foreground">
                    信任此设备（Token 永不过期）
                  </FieldLabel>
                </div>
                <span className="hidden text-xs font-medium text-muted-foreground md:block">让灵感留存更久</span>
              </Field>
            </FieldGroup>

            {error && <FieldError className="rounded-xl border-2 border-destructive bg-destructive/10 px-3 py-2 text-center text-sm font-medium text-destructive">{error}</FieldError>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "登录中..." : "进入孟菲斯空间"}
            </Button>
          </form>
        </div>
      </motion.div>
    </main>
  )
}
