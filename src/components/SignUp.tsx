import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { storage } from '@/utils/localStorage';
import logo from '@/assets/logo.png';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation du format email
    if (!validateEmail(email)) {
      toast({
        variant: 'destructive',
        title: 'Email invalide',
        description: 'Veuillez entrer une adresse email valide.',
        duration: 5000,
      });
      return;
    }

    // Validation du mot de passe
    if (!validatePassword(password)) {
      toast({
        variant: 'destructive',
        title: 'Mot de passe faible',
        description: 'Le mot de passe doit contenir au moins 6 caractères.',
        duration: 5000,
      });
      return;
    }

    // Vérification de la correspondance des mots de passe
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas.',
        duration: 5000,
      });
      return;
    }

    // Vérification si l'email existe déjà
    const allUsers = storage.getUsers();
    const emailExists = allUsers.some((user) => user.username === email);
    if (emailExists) {
      toast({
        variant: 'destructive',
        title: 'Compte existant',
        description: 'Un compte avec cet email existe déjà.',
        duration: 5000,
      });
      return;
    }

    // Créer et sauvegarder le nouvel utilisateur
    const newUser = {
      id: String(Date.now()),
      username: email,
      password: password,
      name: name,
    };

    storage.saveUser(newUser);

    // Succès
    toast({
      title: 'Compte créé !',
      description: 'Vous pouvez maintenant vous connecter.',
      duration: 5000,
      className: 'bg-success text-success-foreground border-success',
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-xl animate-fade-in">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-20 h-20 flex items-center justify-center">
            <img src={logo} alt="TeamBoard Logo" className="w-full h-full object-contain" />
          </div>
          <CardTitle className="text-3xl font-bold">Créer un compte</CardTitle>
          <CardDescription className="text-base">
            Rejoignez TeamBoard pour gérer vos tâches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                type="text"
                placeholder="Entrez votre nom complet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe (min. 6 caractères)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirmez votre mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1 h-11 text-base font-medium"
              >
                Annuler
              </Button>
              <Button type="submit" className="flex-1 h-11 text-base font-medium">
                S'inscrire
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Vous avez déjà un compte ?{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => navigate('/')}
              >
                Se connecter
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
