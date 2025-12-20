import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen onboarding (in real app, this would be persisted)
    const hasSeenOnboarding = localStorage.getItem('repondia_onboarding_complete');
    
    if (hasSeenOnboarding) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/onboarding', { replace: true });
    }
  }, [navigate]);

  return null;
};

export default Index;
