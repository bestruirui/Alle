import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="w-full max-w-md"
      >
        <motion.div 
          className="bg-card rounded-2xl shadow-xl p-8 border border-border/50"
          initial={{ boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)" }}
          animate={{ boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.15)" }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-foreground mb-8 text-center tracking-tight">Alle</h1>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FieldGroup>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Field>
                  <FieldLabel htmlFor="username">用户名</FieldLabel>
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Field>
                  <FieldLabel htmlFor="password">密码</FieldLabel>
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Field orientation="horizontal">
                  <Checkbox
                    id="trustDevice"
                    checked={trustDevice}
                    onCheckedChange={(checked) => setTrustDevice(checked === true)}
                    disabled={loading}
                  />
                  <FieldLabel htmlFor="trustDevice" className="cursor-pointer select-none">
                    信任此设备（Token 永不过期）
                  </FieldLabel>
                </Field>
              </motion.div>
            </FieldGroup>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, height: 0 }}
                    animate={{ opacity: 1, scale: 1, height: "auto" }}
                    exit={{ opacity: 0, scale: 0.95, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FieldError>{error}</FieldError>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button 
                type="submit" 
                className="w-full rounded-xl shadow-sm hover:shadow-md transition-all duration-200" 
                disabled={loading}
              >
                <motion.span
                  animate={loading ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
                  transition={loading ? { repeat: Infinity, duration: 1.5 } : {}}
                >
                  {loading ? "登录中..." : "登录"}
                </motion.span>
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </main>
  );
}