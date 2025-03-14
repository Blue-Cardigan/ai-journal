import React from 'react';
import { Text, TextProps } from 'react-native';
import { useColorScheme } from 'react-native';

interface ThemedTextProps extends TextProps {
  variant?: 'body' | 'title' | 'subtitle';
}

const ThemedText: React.FC<ThemedTextProps> = ({ children, style, variant = 'body', ...props }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const variantStyles = {
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    title: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 18,
      lineHeight: 26,
    },
  };

  return (
    <Text
      style={[
        {
          color: isDark ? '#ECEDEE' : '#11181C',
        },
        variantStyles[variant],
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default ThemedText;
