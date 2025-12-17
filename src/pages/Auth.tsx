import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PenLine, Loader2, Check } from 'lucide-react';

const loginSchema = z.object({
  identifier: z.string().trim().min(1, { message: '請輸入電子郵件或名稱' }),
  password: z.string().min(6, { message: '密碼至少需要 6 個字元' }),
});

const signupSchema = z.object({
  email: z.string().trim().email({ message: '請輸入有效的電子郵件地址' }),
  name: z.string().trim().min(2, { message: '名稱至少需要 2 個字元' }),
  password: z.string().min(6, { message: '密碼至少需要 6 個字元' }),
});

type AuthMode = 'login' | 'signup' | 'forgot';

interface AvatarOption {
  name: string;
  url: string;
}

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [identifier, setIdentifier] = useState(''); // email or name for login
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [avatarOptions, setAvatarOptions] = useState<AvatarOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; email?: string; name?: string; password?: string; avatar?: string }>({});

  const { signIn, signUp, resetPassword, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Fetch avatars from author-avatars bucket
  useEffect(() => {
    const fetchAvatars = async () => {
      setIsLoadingAvatars(true);
      try {
        const { data, error } = await supabase.storage
          .from('author-avatars')
          .list('', { limit: 100 });

        if (error) {
          console.error('Error fetching avatars:', error);
          return;
        }

        if (data) {
          const avatars = data
            .filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
            .map(file => ({
              name: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
              url: `https://ukloaaccuetocrkxsdlv.supabase.co/storage/v1/object/public/author-avatars/${file.name}`
            }));
          setAvatarOptions(avatars);
        }
      } catch (error) {
        console.error('Error fetching avatars:', error);
      } finally {
        setIsLoadingAvatars(false);
      }
    };

    if (mode === 'signup') {
      fetchAvatars();
    }
  }, [mode]);

  useEffect(() => {
    const isRecoveryUrl = location.hash.includes('type=recovery') || 
                         location.search.includes('type=recovery');
    if (isRecoveryUrl) return;

    if (user && !isLoading) {
      navigate('/');
    }
  }, [user, isLoading, navigate, location.hash, location.search]);

  const validateForm = () => {
    try {
      if (mode === 'forgot') {
        z.string().trim().email({ message: '請輸入有效的電子郵件地址' }).parse(identifier);
      } else if (mode === 'login') {
        loginSchema.parse({ identifier, password });
      } else {
        signupSchema.parse({ email, name, password });
        if (!selectedAvatar) {
          setErrors(prev => ({ ...prev, avatar: '請選擇一個頭像' }));
          return false;
        }
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: typeof errors = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof typeof errors;
          if (field) fieldErrors[field] = err.message;
          else if (mode === 'forgot' || mode === 'login') fieldErrors.identifier = err.message;
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
        const { error } = await resetPassword(identifier);
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
        // Check if identifier is email or name
        const isEmail = identifier.includes('@');
        let loginEmail = identifier;

        if (!isEmail) {
          // Find user by name in profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('name', identifier)
            .maybeSingle();

          if (profileError || !profile) {
            toast({
              title: '登入失敗',
              description: '找不到此使用者名稱。',
              variant: 'destructive',
            });
            setIsSubmitting(false);
            return;
          }

          // Get email from auth.users via the user id
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', profile.id)
            .maybeSingle();

          if (userError || !userData?.email) {
            toast({
              title: '登入失敗',
              description: '無法取得使用者資料。',
              variant: 'destructive',
            });
            setIsSubmitting(false);
            return;
          }

          loginEmail = userData.email;
        }

        const { error } = await signIn(loginEmail, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: '登入失敗',
              description: '電子郵件/名稱或密碼錯誤，請重試。',
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
        // Signup with name and avatar
        const { error, user: newUser } = await signUp(email, password, name, selectedAvatar);
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
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
                ? '使用電子郵件或名稱登入'
                : mode === 'signup'
                ? '註冊新帳號以開始使用'
                : '輸入您的電子郵件以重設密碼'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'login' || mode === 'forgot' ? (
                <div className="space-y-2">
                  <Label htmlFor="identifier">
                    {mode === 'forgot' ? '電子郵件' : '電子郵件或名稱'}
                  </Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder={mode === 'forgot' ? 'your@email.com' : 'guest'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.identifier && (
                    <p className="text-sm text-destructive">{errors.identifier}</p>
                  )}
                </div>
              ) : (
                <>
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
                  <div className="space-y-2">
                    <Label htmlFor="name">名稱</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="您的名稱"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>
                </>
              )}

              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <Label htmlFor="password">密碼</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="kkk999 for guest"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>
              )}

              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label>選擇頭像</Label>
                  {isLoadingAvatars ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : avatarOptions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">沒有可用的頭像</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {avatarOptions.map((avatar) => (
                        <button
                          key={avatar.url}
                          type="button"
                          onClick={() => setSelectedAvatar(avatar.url)}
                          className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                            selectedAvatar === avatar.url
                              ? 'border-primary ring-2 ring-primary/30'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={avatar.url}
                            alt={avatar.name}
                            className="w-full aspect-square object-cover"
                          />
                          {selectedAvatar === avatar.url && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <Check className="h-6 w-6 text-primary" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.avatar && (
                    <p className="text-sm text-destructive">{errors.avatar}</p>
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
