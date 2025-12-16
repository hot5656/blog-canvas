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
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleRecoverySession = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get("type");
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      console.log('ResetPassword: type =', type, 'hasAccessToken =', !!accessToken);

      // If no recovery token in URL, redirect to auth page
      if (type !== "recovery" || !accessToken) {
        toast({
          title: "請從郵件中的連結進入",
          description: "如需重設密碼，請點擊郵件中的重設連結。",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Clear any existing session first (local only to not affect other tabs)
      console.log('ResetPassword: Clearing existing local session...');
      await supabase.auth.signOut({ scope: 'local' });

      // Set the recovery session from URL tokens
      if (accessToken && refreshToken) {
        console.log('ResetPassword: Setting recovery session...');
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('Failed to set recovery session:', error);
          toast({
            title: "連結無效或已過期",
            description: "請重新申請密碼重設。",
            variant: "destructive",
          });
          navigate("/auth");
        } else {
          console.log('ResetPassword: Recovery session set successfully');
        }
      }
    };

    handleRecoverySession();

    // Listen for auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log('ResetPassword auth event:', event);
    });

    return () => subscription.unsubscribe();
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <PenLine className="h-5 w-5" />
            </div>
            <span className="font-serif text-2xl font-semibold tracking-tight">The Journal</span>
          </div>
        </div>

        <Card className="shadow-elevated">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl">重設密碼</CardTitle>
            <CardDescription>請輸入您的新密碼</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">新密碼</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">確認新密碼</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    處理中...
                  </>
                ) : (
                  "重設密碼"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="text-primary font-medium hover:underline underline-offset-4"
              >
                返回登入
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
