import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import type { ApiResponse, LoginResponseData } from "@/types";

export default function LoginPage({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          expired: trustDevice ? "none" : undefined,
        }),
      });

      const data = (await response.json()) as ApiResponse<LoginResponseData>;

      if (data.success && data.data) {
        localStorage.setItem("auth_token", data.data.token);
        onLoginSuccess(data.data.token);
      } else {
        setError(data.error || "登录失败");
      }
    } catch {
      setError("网络错误,请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-[8%] left-[10%] w-28 h-28 rounded-full border-[8px] border-[var(--memphis-pink)]"
          animate={{
            rotate: 360,
            scale: [1, 1.15, 1],
          }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          style={{ opacity: 0.5 }}
        />

        <motion.div
          className="absolute top-[15%] right-[8%]"
          animate={{ rotate: [0, 180, 360] }}
          transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
          style={{ opacity: 0.6 }}
        >
          <div
            className="w-0 h-0"
            style={{
              borderLeft: "50px solid transparent",
              borderRight: "50px solid transparent",
              borderBottom: "90px solid var(--memphis-cyan)",
            }}
          />
        </motion.div>

        <motion.div
          className="absolute bottom-[12%] left-[12%] w-36 h-4"
          style={{
            background: "repeating-linear-gradient(90deg, var(--memphis-yellow) 0, var(--memphis-yellow) 15px, transparent 15px, transparent 30px)",
            opacity: 0.6,
          }}
          animate={{ x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute bottom-[20%] right-[10%] w-24 h-24"
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            background: "linear-gradient(135deg, var(--memphis-purple), var(--memphis-pink))",
            boxShadow: "8px 8px 0 rgba(0,0,0,0.15)",
            opacity: 0.55,
          }}
          animate={{
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.12, 1],
          }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 32, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative w-full max-w-lg z-10"
      >
        <div className="memphis-card bg-card/95 backdrop-blur-md rounded-3xl px-10 py-12 shadow-2xl">
          <motion.div
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--memphis-pink)] to-[var(--memphis-purple)] border-[5px] border-foreground shadow-[8px_8px_0_var(--memphis-cyan)]"
            whileHover={{ scale: 1.08, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-5xl font-black text-white">A</span>
          </motion.div>

          <h1 className="mb-2 text-center text-4xl font-black uppercase tracking-widest text-foreground">
            ALLE
          </h1>
          <p className="mb-8 text-center text-sm font-medium text-muted-foreground">
            复古孟菲斯设计 · 登录系统
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username" className="text-sm font-bold uppercase tracking-wide">
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
                  className="rounded-xl border-[3px] border-border shadow-[4px_4px_0_var(--memphis-yellow)] transition-all focus:shadow-[6px_6px_0_var(--memphis-yellow)] focus:translate-x-[-2px] focus:translate-y-[-2px]"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password" className="text-sm font-bold uppercase tracking-wide">
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
                  className="rounded-xl border-[3px] border-border shadow-[4px_4px_0_var(--memphis-cyan)] transition-all focus:shadow-[6px_6px_0_var(--memphis-cyan)] focus:translate-x-[-2px] focus:translate-y-[-2px]"
                />
              </Field>

              <Field orientation="horizontal" className="items-center gap-3">
                <Checkbox
                  id="trustDevice"
                  checked={trustDevice}
                  onCheckedChange={(checked) => setTrustDevice(checked === true)}
                  disabled={loading}
                  className="border-[3px] data-[state=checked]:bg-[var(--memphis-pink)] data-[state=checked]:border-[var(--memphis-purple)]"
                />
                <FieldLabel htmlFor="trustDevice" className="cursor-pointer select-none text-sm font-semibold">
                  信任此设备（Token 永不过期）
                </FieldLabel>
              </Field>
            </FieldGroup>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border-[3px] border-destructive bg-destructive/10 px-4 py-3"
              >
                <FieldError className="font-semibold">{error}</FieldError>
              </motion.div>
            )}

            <Button
              type="submit"
              className="memphis-btn w-full rounded-xl bg-gradient-to-r from-[var(--memphis-pink)] to-[var(--memphis-purple)] py-6 text-base font-black uppercase tracking-wider text-white hover:from-[var(--memphis-purple)] hover:to-[var(--memphis-pink)]"
              disabled={loading}
            >
              {loading ? (
                <motion.span
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  登录中...
                </motion.span>
              ) : (
                "登录"
              )}
            </Button>
          </form>
        </div>
      </motion.section>
    </main>
  );
}
