# Tests Unitaires - TeamBoard

Ce projet utilise **Vitest** et **React Testing Library** pour les tests unitaires.

## Installation

Les dépendances de test sont déjà installées :
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

## Configuration

- **vitest.config.ts** : Configuration principale de Vitest
- **src/test/setup.ts** : Configuration globale des tests (mocks, cleanup)
- **src/test/test-utils.tsx** : Utilitaires de test personnalisés avec providers

## Scripts disponibles

```bash
# Lancer les tests en mode watch
npm run test

# Interface graphique pour les tests
npm run test:ui

# Lancer les tests une seule fois
npm run test:run

# Lancer les tests avec coverage
npm run test:coverage
```

## Structure des tests

### Tests unitaires créés

1. **utils/localStorage.test.ts**
   - Tests des fonctions de stockage local
   - Gestion des tâches et utilisateurs
   - Gestion des erreurs

2. **contexts/AuthContext.test.tsx**
   - Tests du contexte d'authentification
   - Login/logout
   - Persistance des données utilisateur
   - Hook useAuth

3. **contexts/TaskContext.test.tsx**
   - Tests du contexte de gestion des tâches
   - CRUD des tâches (Create, Read, Update, Delete)
   - Synchronisation avec localStorage
   - Hook useTasks

4. **components/TaskCard.test.tsx**
   - Tests du composant TaskCard
   - Affichage des informations de tâche
   - Actions (édition, suppression)
   - Drag & drop (mock)

5. **components/Login.test.tsx**
   - Tests du composant de connexion
   - Validation des formulaires
   - Navigation après connexion
   - Gestion des erreurs

### Patterns de test utilisés

#### Mocking
- **localStorage** : Mock global dans setup.ts
- **React Router** : Mock de useNavigate
- **Context hooks** : Mock des hooks personnalisés
- **External libraries** : Mock de @dnd-kit pour le drag & drop

#### Test Utilities
- **render** : Fonction personnalisée avec tous les providers
- **screen** : Queries pour trouver les éléments
- **fireEvent/userEvent** : Simulation d'interactions utilisateur
- **waitFor** : Attendre les updates asynchrones

#### Types de tests
- **Unit tests** : Fonctions et composants isolés
- **Integration tests** : Interactions entre composants et contexts
- **User interaction tests** : Simulation des actions utilisateur

## Exemples d'usage

### Test simple d'un composant
```typescript
import { render, screen } from '@/test/test-utils';
import MyComponent from '@/components/MyComponent';

it('should render component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### Test avec interaction utilisateur
```typescript
import { render, screen, fireEvent } from '@/test/test-utils';

it('should handle click', () => {
  const mockClick = vi.fn();
  render(<Button onClick={mockClick}>Click me</Button>);
  
  fireEvent.click(screen.getByRole('button'));
  expect(mockClick).toHaveBeenCalled();
});
```

### Test avec mock
```typescript
vi.mock('@/utils/api', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'test' }),
}));
```

## Bonnes pratiques

1. **Arrange, Act, Assert** : Structure claire des tests
2. **Descriptive names** : Noms de tests explicites
3. **Clean mocks** : Nettoyer les mocks entre les tests
4. **Test behavior** : Tester le comportement, pas l'implémentation
5. **Accessibility** : Utiliser les queries par rôle/label

## Couverture de test

Les tests couvrent :
- ✅ Utilitaires (localStorage)
- ✅ Contexts (Auth, Task)
- ✅ Composants critiques (Login, TaskCard)
- ✅ Hooks personnalisés
- ✅ Gestion d'erreurs

## Extension possible

Pour ajouter d'autres tests :
1. Créer le fichier `.test.ts` ou `.test.tsx`
2. Importer les utilitaires depuis `@/test/test-utils`
3. Suivre les patterns existants
4. Ajouter les mocks nécessaires

## Debugging

Pour débugger les tests :
```bash
# Mode debug avec UI
npm run test:ui

# Output détaillé
npm run test -- --reporter=verbose

# Test spécifique
npm run test -- LoginComponent
```