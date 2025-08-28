import { Button } from "@/components/ui/button";
import { Home, Search, Bell, Calendar, Settings } from "lucide-react";

export function MobileNav() {
  return (
    <nav className="md:hidden bg-card border-t border-border px-4 py-2 fixed bottom-0 left-0 right-0 z-30">
      <div className="flex items-center justify-around">
        <Button
          variant="ghost"
          className="flex flex-col items-center space-y-1 py-2 text-primary"
          data-testid="mobile-nav-notes"
        >
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Notas</span>
        </Button>

        <Button
          variant="ghost"
          className="flex flex-col items-center space-y-1 py-2 text-muted-foreground"
          data-testid="mobile-nav-search"
        >
          <Search className="w-5 h-5" />
          <span className="text-xs">Buscar</span>
        </Button>

        <Button
          variant="ghost"
          className="flex flex-col items-center space-y-1 py-2 text-muted-foreground relative"
          data-testid="mobile-nav-reminders"
        >
          <Bell className="w-5 h-5" />
          <span className="text-xs">Lembretes</span>
          <div className="absolute -top-1 right-3 w-2 h-2 bg-destructive rounded-full"></div>
        </Button>

        <Button
          variant="ghost"
          className="flex flex-col items-center space-y-1 py-2 text-muted-foreground"
          data-testid="mobile-nav-calendar"
        >
          <Calendar className="w-5 h-5" />
          <span className="text-xs">Calendário</span>
        </Button>

        <Button
          variant="ghost"
          className="flex flex-col items-center space-y-1 py-2 text-muted-foreground"
          data-testid="mobile-nav-settings"
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs">Mais</span>
        </Button>
      </div>
    </nav>
  );
}
