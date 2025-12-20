import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Calendar, MessageSquare, Bell, ChartBar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingSlide } from '@/components/onboarding/OnboardingSlide';

const slides = [
  {
    icon: <Phone className="h-16 w-16 text-primary" strokeWidth={1.5} />,
    subtitle: 'Never Miss a Call',
    title: 'Capture Every Request',
    description: 'Automatically detect reservation requests from missed calls and voicemails. No customer left behind.',
  },
  {
    icon: <Calendar className="h-16 w-16 text-primary" strokeWidth={1.5} />,
    subtitle: 'Streamlined Booking',
    title: 'Manage Reservations',
    description: 'Accept or decline requests with a single tap. Keep your tables organized and your customers happy.',
  },
  {
    icon: <MessageSquare className="h-16 w-16 text-primary" strokeWidth={1.5} />,
    subtitle: 'Unified Messaging',
    title: 'All Chats in One Place',
    description: 'WhatsApp, SMS, and calls — view all customer communications in a single, easy-to-read thread.',
  },
  {
    icon: <Bell className="h-16 w-16 text-primary" strokeWidth={1.5} />,
    subtitle: 'Stay Informed',
    title: 'Real-Time Notifications',
    description: 'Get instant alerts for new requests. Respond quickly and provide exceptional service.',
  },
  {
    icon: <ChartBar className="h-16 w-16 text-primary" strokeWidth={1.5} />,
    subtitle: 'Insights & Analytics',
    title: 'Grow Your Business',
    description: 'Track acceptance rates, response times, and customer trends to optimize your operations.',
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Skip button */}
      <div className="flex justify-end p-4">
        <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
          Skip
        </Button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <OnboardingSlide
            key={currentSlide}
            {...slides[currentSlide]}
            index={currentSlide}
          />
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="px-8 pb-12">
        {/* Progress dots */}
        <div className="mb-8 flex justify-center gap-2">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted-foreground/30'
              }`}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Action button */}
        <Button
          onClick={handleNext}
          size="xl"
          className="w-full"
        >
          {isLastSlide ? 'Get Started' : 'Continue'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
