import { Wallet, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-gold">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">WealthTracker</h1>
              <p className="text-xs text-muted-foreground">Manage your wealth</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="ml-2 h-10 w-10 rounded-full bg-gradient-gold flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">JD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
