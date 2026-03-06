import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Church Management Theme
const ChurchTheme = {
  dark: false,
  colors: {
    // Primary Brand Colors
    primary: '#2C3E50',      // Deep Navy - Trust & Leadership
    secondary: '#16A085',    // Emerald/Teal - Growth & Life
    accent: '#8E44AD',       // Purple - Spiritual/Royal
    
    // Semantic Colors
    error: '#C0392B',        // Red - Urgent/Errors
    info: '#2980B9',         // Blue - Information
    success: '#27AE60',      // Green - Financial Success/Completed
    warning: '#F39C12',      // Orange - Pending/Warnings
    
    // UI Colors
    background: '#F4F7F6',   // Light Grey - Main Background
    surface: '#FFFFFF',      // White - Cards/Surfaces
    
    // Additional Semantic Colors (Custom)
    tithe: '#27AE60',        // Green - Financial contributions
    pending: '#F39C12',      // Orange - Awaiting action
    inactive: '#95A5A6',     // Grey - Inactive members
    completed: '#2C3E50',    // Navy - Completed tasks
  },
}

// Optional: Dark mode theme for future
const ChurchThemeDark = {
  dark: true,
  colors: {
    primary: '#3498DB',
    secondary: '#1ABC9C',
    accent: '#9B59B6',
    error: '#E74C3C',
    info: '#3498DB',
    success: '#2ECC71',
    warning: '#F39C12',
    background: '#1E1E1E',
    surface: '#2C2C2C',
  },
}

export default createVuetify({
  components,
  directives,
  
  theme: {
    defaultTheme: 'ChurchTheme',
    themes: {
      ChurchTheme,
      ChurchThemeDark,
    },
    variations: {
      colors: ['primary', 'secondary'],
      lighten: 3,
      darken: 3,
    },
  },
  
  // Default component configurations
  defaults: {
    VBtn: {
      color: 'primary',
      variant: 'elevated',
      rounded: 'md',
    },
    VCard: {
      elevation: 2,
      rounded: 'lg',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VDataTable: {
      density: 'comfortable',
    },
  },
  
  // Icon configuration
  icons: {
    defaultSet: 'mdi',
  },
})