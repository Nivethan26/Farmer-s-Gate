import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import type { RootState } from '@/store';
import { login } from '@/store/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout } from 'lucide-react';
import { toast } from 'sonner';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useAppSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const stateBefore = isAuthenticated;
    dispatch(login({ email, password }));
    
    // Check if login was successful by checking state after dispatch
    setTimeout(() => {
      const stateAfter = isAuthenticated;
      if (!stateBefore && stateAfter) {
        toast.success(t('auth.loginSuccess'));
      } else if (!stateAfter) {
        toast.error(t('auth.invalidCredentials'));
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary p-3">
              <Sprout className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-poppins">{t('auth.loginTitle')}</CardTitle>
          <CardDescription>{t('auth.loginDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('common.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@agrilink.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('common.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {t('auth.loginButton')}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>• Buyer: buyer@agrilink.lk / buyer123</p>
              <p>• Seller: seller@agrilink.lk / seller123</p>
              <p>• Admin: admin@agrilink.lk / admin123</p>
              <p>• Agent: agent@agrilink.lk / agent123</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
