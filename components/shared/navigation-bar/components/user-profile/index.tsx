import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserProfileProps {
  userName: string;
  onLogout: () => void;
}

export default function UserProfile({ userName, onLogout }: UserProfileProps) {
  const fallbackText = userName.charAt(0);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium max-w-[150px] truncate hidden sm:block">
        {userName}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarFallback>{fallbackText}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-medium leading-none">{userName}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <Button
            variant="ghost"
            className="w-full justify-start px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
