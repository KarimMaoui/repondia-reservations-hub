import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Building2, 
  Clock, 
  Phone, 
  Mail, 
  MapPin,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Users,
  Palette
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { restaurant } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface SettingsItemProps {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}

function SettingsItem({ icon: Icon, label, sublabel, onClick, variant = 'default' }: SettingsItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
    >
      <div className={cn(
        "p-2.5 rounded-xl",
        variant === 'danger' ? "bg-destructive/10" : "bg-muted"
      )}>
        <Icon className={cn(
          "h-5 w-5",
          variant === 'danger' ? "text-destructive" : "text-muted-foreground"
        )} />
      </div>
      <div className="flex-1">
        <p className={cn(
          "font-medium",
          variant === 'danger' ? "text-destructive" : "text-foreground"
        )}>
          {label}
        </p>
        {sublabel && (
          <p className="text-sm text-muted-foreground">{sublabel}</p>
        )}
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  );
}

export default function Profile() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 glass border-b border-border/50">
          <div className="flex items-center gap-3 px-4 py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Settings</h1>
          </div>
        </div>

        {/* Restaurant Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4 p-5 card-elevated"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{restaurant.name}</h2>
              <p className="text-sm text-muted-foreground">Premium Partner</p>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{restaurant.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{restaurant.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{restaurant.openingHours}</span>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4">
            Edit Restaurant Info
          </Button>
        </motion.div>

        {/* Settings Sections */}
        <div className="mt-6">
          <h3 className="px-4 mb-2 text-sm font-semibold text-secondary">Preferences</h3>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border-y border-border/50 divide-y divide-border/50"
          >
            <SettingsItem
              icon={Bell}
              label="Notifications"
              sublabel="Push, email, and SMS alerts"
            />
            <SettingsItem
              icon={Clock}
              label="Opening Hours"
              sublabel="Set your availability"
            />
            <SettingsItem
              icon={Users}
              label="Capacity Settings"
              sublabel={`${restaurant.averageCapacity} seats available`}
            />
            <SettingsItem
              icon={Palette}
              label="Appearance"
              sublabel="Theme and display options"
            />
          </motion.div>
        </div>

        <div className="mt-6">
          <h3 className="px-4 mb-2 text-sm font-semibold text-secondary">Support</h3>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border-y border-border/50 divide-y divide-border/50"
          >
            <SettingsItem
              icon={HelpCircle}
              label="Help Center"
              sublabel="FAQs and support articles"
            />
            <SettingsItem
              icon={Shield}
              label="Privacy & Security"
              sublabel="Data protection settings"
            />
          </motion.div>
        </div>

        <div className="mt-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border-y border-border/50"
          >
            <SettingsItem
              icon={LogOut}
              label="Sign Out"
              variant="danger"
            />
          </motion.div>
        </div>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground pb-8">
          Repondia v1.0.0
        </p>
      </div>
    </AppLayout>
  );
}
