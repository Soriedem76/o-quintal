// src/App.jsx
import { UserProvider, useUser } from './lib/UserContext';
import AuthScreen from './components/Auth/AuthScreen';
import MuralApp from './components/Mural/MuralApp';

function AppFlow() {
  const { user } = useUser();
  if (!user) return <AuthScreen />;
  return <MuralApp />;
}

export default function App() {
  return (
    <UserProvider>
      <AppFlow />
    </UserProvider>
  );
}
