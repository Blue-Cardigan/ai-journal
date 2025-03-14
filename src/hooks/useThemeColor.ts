import { useColorScheme } from 'react-native';

export function useThemeColor(props: { light?: string; dark?: string }, colorName?: string) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return theme === 'light' ? '#000' : '#fff';
} 