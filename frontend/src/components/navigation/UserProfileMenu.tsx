import Link from 'next/link';
import { User, UserCircle, LayoutDashboard, FileText, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useThemedClasses } from '@/hooks/useThemedClasses';

interface UserProfileMenuProps {
  mounted: boolean;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ mounted }) => {
  const { resolvedTheme, themedClasses } = useThemedClasses();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="glass" 
          size="sm" 
          className="flex items-center justify-center text-foreground p-2 w-9 h-9 hover:bg-tech-cyan/20 transition-all duration-200 hover:scale-105"
          aria-label="用户菜单"
        >
          <User className="h-5 w-5 text-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={`w-56 ${themedClasses.dropdownBgClass} ${themedClasses.dropdownShadowClass} z-[200]`}
      >
        <DropdownMenuLabel 
          className={`text-sm font-semibold py-2 px-2 ${mounted && resolvedTheme === 'dark' ? 'text-foreground/80' : 'text-gray-900'}`}
        >
          我的账户
        </DropdownMenuLabel>
        <DropdownMenuSeparator className={themedClasses.separatorClass} />
        
        <Link href="/profile">
          <DropdownMenuItem className={`group cursor-pointer py-3 ${themedClasses.dropdownItemClass}`}>
            <UserCircle className="h-4 w-4 mr-3 text-tech-cyan group-hover:scale-110 transition-transform" />
            <span className={`${themedClasses.textColorClass} transition-colors`}>个人资料</span>
          </DropdownMenuItem>
        </Link>
        
        <DropdownMenuItem className={`group cursor-pointer py-3 ${themedClasses.dropdownItemClass}`}>
          <LayoutDashboard className="h-4 w-4 mr-3 text-tech-cyan group-hover:scale-110 transition-transform" />
          <span className={`${themedClasses.textColorClass} transition-colors`}>仪表板</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className={`group cursor-pointer py-3 ${themedClasses.dropdownItemClass}`}>
          <FileText className="h-4 w-4 mr-3 text-tech-cyan group-hover:scale-110 transition-transform" />
          <span className={`${themedClasses.textColorClass} transition-colors`}>文章管理</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className={themedClasses.separatorClass} />
        
        <DropdownMenuItem className={`group cursor-pointer py-3 ${themedClasses.dropdownItemClass}`}>
          <Settings className="h-4 w-4 mr-3 text-tech-cyan group-hover:scale-110 transition-transform" />
          <span className={`${themedClasses.textColorClass} transition-colors`}>设置</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className={themedClasses.separatorClass} />
        
        <DropdownMenuItem className={`group cursor-pointer py-3 ${mounted && resolvedTheme === 'dark' ? 'focus:bg-red-500/20 hover:bg-red-500/30' : 'focus:bg-red-100 hover:bg-red-100'}`}>
          <LogOut className="h-4 w-4 mr-3 text-red-500 group-hover:scale-110 transition-transform" />
          <span className={`group-hover:text-red-600 transition-colors ${mounted && resolvedTheme === 'dark' ? 'text-foreground/90' : 'text-gray-800'}`}>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;