import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type Language = 'en' | 'zh-tw';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language, isManual?: boolean) => void;
  t: (key: string) => string;
  getLocalizedPath: (path: string) => string;
}

// Keep your translations as-is (trimmed here only for brevity in editing).
// Replace this whole object with your original full translations from the old file.
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'header.write': 'Write',
    'header.login': 'Login',
    'header.admin': 'Admin',
    'header.logout': 'Logout',

    // Index page
    'hero.title': 'Stories that',
    'hero.highlight': 'inspire',
    'hero.description':
      'A curated collection of thoughts on design, technology, culture, and the art of mindful living.',
    'section.featured': 'Featured',
    'section.latest': 'Latest Posts',
    'posts.loading': 'Loading posts...',
    'posts.empty.auth': 'No posts yet. Start writing your first story!',
    'posts.empty.guest': 'No posts yet. Check back later!',
    'posts.create': 'Create your first post →',
    'pagination.page': 'Page',
    'pagination.of': 'of',
    'pagination.posts': 'posts total',

    // Footer
    'footer.copyright': '© 2024 The Journal. Powered by Supabase.',

    // Blog Post
    'post.back': 'Back to all posts',
    'post.delete': 'Delete',
    'post.notfound': 'Post not found',
    'post.author': 'Author',

    // Auth
    'auth.welcome': 'Welcome back',
    'auth.create': 'Create account',
    'auth.forgot': 'Forgot password',
    'auth.login.desc': 'Login with email or name',
    'auth.signup.desc': 'Sign up to get started',
    'auth.forgot.desc': 'Enter your email to reset password',
    'auth.email': 'Email',
    'auth.emailOrName': 'Email or name',
    'auth.name': 'Name',
    'auth.password': 'Password',
    'auth.selectAvatar': 'Select avatar',
    'auth.noAvatars': 'No avatars available',
    'auth.loginBtn': 'Login',
    'auth.signupBtn': 'Sign up',
    'auth.sendReset': 'Send reset email',
    'auth.forgotLink': 'Forgot password?',
    'auth.backToLogin': 'Back to login',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.signupNow': 'Sign up now',
    'auth.loginNow': 'Login now',
    'auth.processing': 'Processing...',

    // Validation
    'validation.emailOrName': 'Please enter email or name',
    'validation.email': 'Please enter a valid email',
    'validation.name': 'Name must be at least 2 characters',
    'validation.password': 'Password must be at least 6 characters',
    'validation.avatar': 'Please select an avatar',

    // Toast messages
    'toast.sendFailed': 'Send failed',
    'toast.resetSent': 'Reset email sent',
    'toast.resetSentDesc': 'Please check your email to reset password.',
    'toast.loginFailed': 'Login failed',
    'toast.userNotFound': 'User not found.',
    'toast.fetchUserFailed': 'Failed to fetch user data.',
    'toast.invalidCredentials': 'Invalid email/name or password.',
    'toast.loginSuccess': 'Login successful',
    'toast.welcomeBack': 'Welcome back!',
    'toast.signupFailed': 'Sign up failed',
    'toast.emailExists': 'This email is already registered.',
    'toast.signupSuccess': 'Sign up successful',
    'toast.confirmEmail': 'Please check your email to confirm.',
    'toast.postDeleted': 'Post deleted',
    'toast.postDeletedDesc': 'The post has been removed from your blog.',
    'toast.deleteError': 'Error',
    'toast.deleteFailed': 'Failed to delete post. Please try again.',
    'toast.postPublished': 'Post published!',
    'toast.postPublishedDesc': 'Your new post is now live on the blog.',
    'toast.publishError': 'Error',
    'toast.publishFailed': 'Failed to publish post. Please try again.',
    'toast.postUpdated': 'Post updated!',
    'toast.nowPublished': 'Your post is now published.',
    'toast.nowDraft': 'Your post is now a draft.',
    'toast.changesSaved': 'Your changes have been saved.',
    'toast.updateError': 'Error',
    'toast.updateFailed': 'Failed to update post. Please try again.',

    // 404
    'notfound.title': '404',
    'notfound.message': 'Oops! Page not found',
    'notfound.back': 'Return to Home',

    // Language
    'language.switch': 'Switch language',
  },

  'zh-tw': {
    // Header
    'header.write': '撰寫',
    'header.login': '登入',
    'header.admin': '管理員',
    'header.logout': '登出',

    // Index page
    'hero.title': '啟發人心的',
    'hero.highlight': '故事',
    'hero.description': '精選關於設計、科技、文化和生活藝術的思考集錦。',
    'section.featured': '精選',
    'section.latest': '最新文章',
    'posts.loading': '載入中...',
    'posts.empty.auth': '還沒有文章，開始撰寫您的第一篇故事吧！',
    'posts.empty.guest': '還沒有文章，請稍後再來！',
    'posts.create': '建立您的第一篇文章 →',
    'pagination.page': '第',
    'pagination.of': '頁，共',
    'pagination.posts': '篇文章',

    // Footer
    'footer.copyright': '© 2024 The Journal。由 Supabase 提供技術支援。',

    // Blog Post
    'post.back': '返回所有文章',
    'post.delete': '刪除',
    'post.notfound': '找不到文章',
    'post.author': '作者',

    // Auth
    'auth.welcome': '歡迎回來',
    'auth.create': '建立帳號',
    'auth.forgot': '忘記密碼',
    'auth.login.desc': '使用電子郵件或名稱登入',
    'auth.signup.desc': '註冊新帳號以開始使用',
    'auth.forgot.desc': '輸入您的電子郵件以重設密碼',
    'auth.email': '電子郵件',
    'auth.emailOrName': '電子郵件或名稱',
    'auth.name': '名稱',
    'auth.password': '密碼',
    'auth.selectAvatar': '選擇頭像',
    'auth.noAvatars': '沒有可用的頭像',
    'auth.loginBtn': '登入',
    'auth.signupBtn': '註冊',
    'auth.sendReset': '發送重設郵件',
    'auth.forgotLink': '忘記密碼？',
    'auth.backToLogin': '返回登入',
    'auth.noAccount': '還沒有帳號？',
    'auth.hasAccount': '已經有帳號？',
    'auth.signupNow': '立即註冊',
    'auth.loginNow': '立即登入',
    'auth.processing': '處理中...',

    // Validation
    'validation.emailOrName': '請輸入電子郵件或名稱',
    'validation.email': '請輸入有效的電子郵件地址',
    'validation.name': '名稱至少需要 2 個字元',
    'validation.password': '密碼至少需要 6 個字元',
    'validation.avatar': '請選擇一個頭像',

    // Toast messages
    'toast.sendFailed': '發送失敗',
    'toast.resetSent': '重設郵件已發送',
    'toast.resetSentDesc': '請檢查您的電子郵件以重設密碼。',
    'toast.loginFailed': '登入失敗',
    'toast.userNotFound': '找不到此使用者名稱。',
    'toast.fetchUserFailed': '無法取得使用者資料。',
    'toast.invalidCredentials': '電子郵件/名稱或密碼錯誤，請重試。',
    'toast.loginSuccess': '登入成功',
    'toast.welcomeBack': '歡迎回來！',
    'toast.signupFailed': '註冊失敗',
    'toast.emailExists': '此電子郵件已被註冊，請使用其他郵件或直接登入。',
    'toast.signupSuccess': '註冊成功',
    'toast.confirmEmail': '請檢查您的電子郵件以確認帳號。',
    'toast.postDeleted': '文章已刪除',
    'toast.postDeletedDesc': '該文章已從您的部落格移除。',
    'toast.deleteError': '錯誤',
    'toast.deleteFailed': '刪除文章失敗，請重試。',
    'toast.postPublished': '文章已發布！',
    'toast.postPublishedDesc': '您的新文章現已上線。',
    'toast.publishError': '錯誤',
    'toast.publishFailed': '發布文章失敗，請重試。',
    'toast.postUpdated': '文章已更新！',
    'toast.nowPublished': '您的文章現已發布。',
    'toast.nowDraft': '您的文章現為草稿。',
    'toast.changesSaved': '您的更改已儲存。',
    'toast.updateError': '錯誤',
    'toast.updateFailed': '更新文章失敗，請重試。',

    // 404
    'notfound.title': '404',
    'notfound.message': '糟糕！找不到頁面',
    'notfound.back': '返回首頁',

    // Language
    'language.switch': '切換語言',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 用這個 key 存放「語言偏好」(en/zh-tw)，一旦存在就永遠以它為準
const PREF_LANG_KEY = 'userManualLanguage';

// Detect browser language
const detectBrowserLanguage = (): Language => {
  const browserLang =
    navigator.language || (navigator as any).userLanguage || 'en';

  // 你的原邏輯：任何 zh* 都導到 zh-tw
  if (browserLang.toLowerCase().startsWith('zh')) {
    return 'zh-tw';
  }

  return 'en';
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine language from URL
  const getLanguageFromPath = (pathname: string): Language => {
    if (pathname.startsWith('/zh-tw')) return 'zh-tw';
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(() =>
    getLanguageFromPath(location.pathname)
  );

  const [hasInitialized, setHasInitialized] = useState(false);

  const currentLangFromPath = useMemo(
    () => getLanguageFromPath(location.pathname),
    [location.pathname]
  );

  // 初次載入：若 localStorage 沒有偏好 -> 用瀏覽器偵測並導一次 -> 寫入偏好（達成「只第一次」）
  // 若 localStorage 有偏好 -> 永遠以偏好為準（尊重使用者手動切換）
  useEffect(() => {
    if (hasInitialized) return;

    const stored = localStorage.getItem(PREF_LANG_KEY) as Language | null;
    const storedLang: Language | null =
      stored === 'en' || stored === 'zh-tw' ? stored : null;

    const targetLang = storedLang ?? detectBrowserLanguage();

    const currentPath = location.pathname;
    let newPath = currentPath;

    if (targetLang === 'zh-tw') {
      if (!currentPath.startsWith('/zh-tw')) {
        newPath = '/zh-tw' + (currentPath === '/' ? '' : currentPath);
      }
    } else {
      if (currentPath.startsWith('/zh-tw')) {
        newPath = currentPath.replace('/zh-tw', '') || '/';
      }
    }

    // 需要導頁才導；導頁用 replace 避免歷史紀錄污染
    if (newPath !== currentPath) {
      navigate(newPath, { replace: true });
    }

    // 關鍵：如果原本沒有偏好（第一次進站），把偵測結果寫入 -> 之後不再自動切
    if (!storedLang) {
      localStorage.setItem(PREF_LANG_KEY, targetLang);
    }

    setLanguageState(targetLang);
    setHasInitialized(true);
  }, [hasInitialized, location.pathname, navigate]);

  // 後續路徑變化時，同步 language state
  useEffect(() => {
    if (!hasInitialized) return;
    if (currentLangFromPath !== language) {
      setLanguageState(currentLangFromPath);
    }
  }, [currentLangFromPath, hasInitialized, language]);

  // 手動切換：寫入偏好，之後永遠以此為準
  const setLanguage = (lang: Language, isManual: boolean = true) => {
    if (isManual) {
      localStorage.setItem(PREF_LANG_KEY, lang);
    }

    const currentPath = location.pathname;
    let newPath: string;

    if (lang === 'zh-tw') {
      newPath = currentPath.startsWith('/zh-tw')
        ? currentPath
        : '/zh-tw' + (currentPath === '/' ? '' : currentPath);
    } else {
      newPath = currentPath.startsWith('/zh-tw')
        ? currentPath.replace('/zh-tw', '') || '/'
        : currentPath;
    }

    navigate(newPath);
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  const getLocalizedPath = (path: string): string => {
    if (language === 'zh-tw') {
      return '/zh-tw' + (path === '/' ? '' : path);
    }
    return path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLocalizedPath }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

