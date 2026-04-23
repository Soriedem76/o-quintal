// src/App.jsx
import { UserProvider, useUser } from './lib/UserContext';
import { QuintalProvider, useQuintal } from './lib/QuintalContext';
import AuthScreen from './components/Auth/AuthScreen';
import QuintalSelect from './components/Auth/QuintalSelect';
import MuralApp from './components/Mural/MuralApp';

function AppFlow() {
  const { user } = useUser();
  const { quintalId } = useQuintal();

  if (!user) return <AuthScreen />;
  if (!quintalId) return <QuintalSelect user={user} />;
  return <MuralApp />;
}

export default function App() {
  return (
    <UserProvider>
      <QuintalProvider>
        <AppFlow />
      </QuintalProvider>
    </UserProvider>
  );
}
