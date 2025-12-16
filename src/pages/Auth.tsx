import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PenLine, Loader2 } from 'lucide-react';

const authSchema = z.object({
  email: z.string().trim().email({ message: '請輸入有效的電子郵件地址' }),
  password: z.string().min(6, { message: '密碼至少需要 6 個字元' }),
});

type AuthMode = 'login' | 'signup' | 'forgot';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { signIn, signUp, resetPassword, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const sp = new URLSearchParams(location.search);

    const hasRecoveryHash =
      location.hash.includes('type=recovery') && location.hash.includes('access_token');
    const hasRecoveryQuery = sp.get('type') === 'recovery' && !!sp.get('token_hash');

    if (hasRecoveryHash || hasRecoveryQuery) return;

    if (user && !isLoading) {
      navigate('/');
    }
  }, [user, isLoading, navigate, location.hash, location.search]);

  const validateForm = () => {
    try {
      if (mode === 'forgot') {
        z.string().trim().email({ message: '請輸入有效的電子郵件地址' }).parse(email);
      } else {
        authSchema.parse({ email, password });
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === 'email' || err.path.length === 0) fieldErrors.email = err.message;
          if (err.path[0] === 'password') fieldErrors.password = err.message;
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
      if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) {
          toast({
            title: '發送失敗',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: '重設郵件已發送',
            description: '請檢查您的電子郵件以重設密碼。',
          });
          setMode('login');
        }
      } else if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: '登入失敗',
              description: '電子郵件或密碼錯誤，請重試。',
              variant: 'destructive',
            });
          } else {
            toast({
              title: '登入失敗',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: '登入成功',
            description: '歡迎回來！',
          });
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('User already registered')) {
            toast({
              title: '註冊失敗',
              description: '此電子郵件已被註冊，請使用其他郵件或直接登入。',
              variant: 'destructive',
            });
          } else {
            toast({
              title: '註冊失敗',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: '註冊成功',
            description: '請檢查您的電子郵件以確認帳號。',
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <PenLine className="h-5 w-5" />
            </div>
            <span className="font-serif text-2xl font-semibold tracking-tight">
              The Journal
            </span>
          </div>
        </div>

        <Card className="shadow-elevated">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl">
              {mode === 'login' ? '歡迎回來' : mode === 'signup' ? '建立帳號' : '忘記密碼'}
            </CardTitle>
            <CardDescription>
              {mode === 'login'
                ? '登入以管理您的部落格'
                : mode === 'signup'
                ? '註冊新帳號以開始使用'
                : '輸入您的電子郵件以重設密碼'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <Label htmlFor="password">密碼</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    處理中...
                  </>
                ) : mode === 'login' ? (
                  '登入'
                ) : mode === 'signup' ? (
                  '註冊'
                ) : (
                  '發送重設郵件'
                )}
              </Button>
            </form>

            {mode === 'login' && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setErrors({});
                  }}
                  className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4"
                >
                  忘記密碼？
                </button>
              </div>
            )}

            <div className="mt-4 text-center text-sm">
              {mode === 'forgot' ? (
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrors({});
                  }}
                  className="text-primary font-medium hover:underline underline-offset-4"
                >
                  返回登入
                </button>
              ) : (
                <>
                  <span className="text-muted-foreground">
                    {mode === 'login' ? '還沒有帳號？' : '已經有帳號？'}
                  </span>{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'login' ? 'signup' : 'login');
                      setErrors({});
                    }}
                    className="text-primary font-medium hover:underline underline-offset-4"
                  >
                    {mode === 'login' ? '立即註冊' : '立即登入'}
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
