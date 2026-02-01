import { useTheme } from '@/context/theme-context';
import { useMemo } from 'react';

/**
 * 主题类接口
 */
export interface ThemedClasses {
  dropdownBgClass: string;
  dropdownItemClass: string;
  textColorClass: string;
  separatorClass: string;
  dropdownShadowClass: string;
  textClass: string;
  mutedTextClass: string;
  borderClass: string;
  cardBgClass: string;
}

/**
 * 自定义Hook，提供主题相关的类名和工具方法
 * 合并了 useThemeUtils 的功能
 */
export const useThemedClasses = () => {
  const { resolvedTheme } = useTheme();

  const themedClasses = useMemo(() => ({
    dropdownBgClass: resolvedTheme === 'dark'
      ? 'bg-slate-900/95 backdrop-blur-xl border border-slate-700/50'
      : 'bg-white/95 backdrop-blur-xl border-gray-300',
    dropdownItemClass: resolvedTheme === 'dark'
      ? 'focus:bg-tech-cyan/20 hover:bg-slate-700/30'
      : 'focus:bg-gray-100 hover:bg-gray-50',
    textColorClass: resolvedTheme === 'dark'
      ? 'text-foreground/90 group-hover:text-tech-cyan'
      : 'text-gray-800 group-hover:text-tech-cyan',
    separatorClass: resolvedTheme === 'dark'
      ? 'bg-slate-700/30'
      : 'bg-gray-200',
    dropdownShadowClass: resolvedTheme === 'dark'
      ? 'shadow-xl shadow-tech-cyan/10'
      : 'shadow-lg shadow-gray-300/30',
    // 新增通用类
    textClass: resolvedTheme === 'dark' ? 'text-foreground' : 'text-gray-800',
    mutedTextClass: resolvedTheme === 'dark' ? 'text-foreground/70' : 'text-gray-600',
    borderClass: resolvedTheme === 'dark' ? 'border-glass-border' : 'border-gray-200',
    cardBgClass: resolvedTheme === 'dark'
      ? 'bg-glass/30 backdrop-blur-xl border border-glass-border'
      : 'bg-white/80 backdrop-blur-xl border border-gray-200',
  }), [resolvedTheme]);

  /**
   * 根据当前主题返回相应的CSS类名（向后兼容 useThemeUtils）
   * 
   * @param darkClass - 深色主题时的CSS类名
   * @param lightClass - 浅色主题时的CSS类名
   * @returns 根据当前主题选择的CSS类名
   */
  const getThemeClass = (darkClass: string, lightClass: string) => {
    return resolvedTheme === 'dark' ? darkClass : lightClass;
  };

  /**
   * 根据当前主题返回相应的样式对象
   * 
   * @param darkStyles - 深色主题时的样式对象
   * @param lightStyles - 浅色主题时的样式对象
   * @returns 根据当前主题选择的样式对象
   */
  const getThemeStyles = (darkStyles: React.CSSProperties, lightStyles: React.CSSProperties) => {
    return resolvedTheme === 'dark' ? darkStyles : lightStyles;
  };

  /**
   * 判断当前是否为深色主题
   * 
   * @returns 是否为深色主题
   */
  const isDarkTheme = () => {
    return resolvedTheme === 'dark';
  };

  /**
   * 判断当前是否为浅色主题
   * 
   * @returns 是否为浅色主题
   */
  const isLightTheme = () => {
    return resolvedTheme === 'light';
  };

  return {
    resolvedTheme,
    themedClasses,
    getThemeClass,
    getThemeStyles,
    isDarkTheme,
    isLightTheme,
    currentTheme: resolvedTheme
  };
};