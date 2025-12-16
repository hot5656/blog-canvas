import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PenLine, Loader2 } from "lucide-react";

const passwordSchema = z
  .object({
    password: z.string().min(6, { message: "密碼至少需要 6 個字元" }),
    confirmPassword: z.string().min(6, { message: "確認密碼至少需要 6 個字元" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "兩次輸入的密碼不一致",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const navigate = useNavigate();
  const { toast } = useToast();

  // 1. 進頁面時解析 URL hash，並用 access_token / refresh_token 建立 session
  useEffect(() => {
    const hash = window.location.hash.startsWith("#") ? window.location.hash.substring(1) : window.location.hash;

    const hashParams = new URLSearchParams(hash);
    const type = hashParams.get("type");
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");

    if (type !== "recovery" || !accessToken || !refreshToken) {
      toast({
        title: "請從郵件中的連結進入",
        description: "如需重設密碼，請點擊郵件中的重設連結。",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const initSession = async () => {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        toast({
          title: "連結已失效或無效",
          description: error.message,
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      setIsSessionReady(true);
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        console.log("Password recovery token validated");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const validateForm = () => {
    try {
      passwordSchema.parse({ password, confirmPassword });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { password?: string; confirmPassword?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === "password") fieldErrors.password = err.message;
          if (err.path[0] === "confirmPassword") fieldErrors.confirmPassword = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSessionReady) {
      toast({
        title: "連結尚未驗證完成",
        description: "請稍候片刻再試一次。",
        variant: "destructive",
      });
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast({
          title: "密碼重設失敗",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "密碼重設成功",
          description: "請使用新密碼登入。",
        });
        await supabase.auth.signOut();
        navigate("/auth");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-4 py-8">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/70 text-slate-100 shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-300">
            <PenLine className="h-4 w-4 text-emerald-400" />
            安全密碼重設
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">重設你的密碼</CardTitle>
          <CardDescription className="text-sm text-slate-300">
            請輸入新密碼，並妥善保管。系統將會自動更新並登出所有已登入裝置。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">新密碼</Label>
              <Input
                id="password"
                type="password"
                placeholder="請輸入至少 6 個字元的安全密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-slate-700 bg-slate-900/60 text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
              />
              {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">確認新密碼</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="再輸入一次新密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-slate-700 bg-slate-900/60 text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
              />
              {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword}</p>}
            </div>

            <Button
              type="submit"
              className="flex w-full items-center justify-center gap-2 bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
              disabled={isSubmitting || !isSessionReady}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  送出中…
                </>
              ) : (
                "更新密碼並登入"
              )}
            </Button>

            <p className="mt-2 text-center text-xs text-slate-400">
              若你並未請求重設密碼，請立即重新登入並變更帳號安全設定。
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
