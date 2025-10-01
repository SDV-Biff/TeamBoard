import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(username, password)) {
      toast({
        title: 'Connexion réussie !',
        description: 'Bienvenue sur TeamBoard.',
        duration: 5000,
        className: 'bg-success text-success-foreground border-success',
      });
      navigate('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Échec de connexion',
        description: 'Nom d\'utilisateur ou mot de passe incorrect.',
        duration: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-xl animate-fade-in">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-20 h-20 flex items-center justify-center">
            <img src={logo} alt="TeamBoard Logo" className="w-full h-full object-contain" />
          </div>
          <CardTitle className="text-3xl font-bold">Bienvenue</CardTitle>
          <CardDescription className="text-base">
            Connectez-vous pour gérer vos tâches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base font-medium">
              Se connecter
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => navigate('/signup')}
              >
                Créer un compte
              </Button>
            </p>
          </div>
          
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2 text-foreground">Comptes de démonstration :</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><span className="font-medium">Admin:</span> admin / admin123</p>
              <p><span className="font-medium">John:</span> john / john123</p>
              <p><span className="font-medium">Jane:</span> jane / jane123</p>
              <p><span className="font-medium">Bob:</span> bob / bob123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
