import { useTheme } from '@/context/theme-context';

/**
 * 自定义Hook，提供主题相关的实用函数
 */
export const useThemeUtils = () => {
  const { resolvedTheme } = useTheme();
  
  /**
   * 根据当前主题返回相应的CSS类名
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
    getThemeClass,
    getThemeStyles,
    isDarkTheme,
    isLightTheme,
    currentTheme: resolvedTheme
  };
};