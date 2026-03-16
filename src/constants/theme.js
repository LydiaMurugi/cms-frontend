// Ancient Scroll & Mid-Brown Theme Constants
export const lightTheme = {
  dark: false,
  colors: {
    // Primary Mid-Brown
    primary:    '#795548',
    'on-primary': '#FFFFFF',
    
    // Muted Brown
    secondary:  '#A1887F',
    'on-secondary': '#FFFFFF',
    
    // Background & Surfaces
    background: '#F4ECE1',   // Cream / Parchment
    surface:    '#FAF6F0',   // Lighter Cream
    'on-background': '#3E2723', // Dark Brown Text
    'on-surface': '#3E2723',
    
    // Semantic Colors (Earthy variants)
    error:      '#B03A2E',
    info:       '#5D4037',
    success:    '#4E6E5D',   // Muted Sage
    warning:    '#A67C52',   // Ochre
  },
  variables: {
    'font-size-base': '16px',
    'border-radius':  '4px', // Standardized flat radius
  },
}

export const darkTheme = {
  dark: true,
  colors: {
    background: '#2C231E',   // Dark Wood
    surface:    '#3E322B',
    primary:    '#D7CCC8',   // Light Parchment Text
    secondary:  '#A1887F',
    error:      '#E57373',
    info:       '#BCAAA4',
    success:    '#A5D6A7',
    warning:    '#FFF59D',
  },
  variables: {
    'font-size-base': '16px',
    'border-radius':  '4px',
  },
}

// Default component configurations - Flat Design
export const themeDefaults = {
  VBtn: {
    color: 'primary',
    variant: 'flat',
    rounded: 'md',
    class: 'text-none font-weight-bold', // Spread out text feel
  },
  VCard: {
    elevation: 0,
    rounded: 'md',
    border: true,
    class: 'border-thin',
  },
  VTextField: {
    variant: 'outlined',
    density: 'comfortable',
    color: 'primary',
    rounded: 'md',
  },
  VSelect: {
    variant: 'outlined',
    density: 'comfortable',
    color: 'primary',
    rounded: 'md',
  },
  VChip: {
    rounded: 'md',
  }
}
