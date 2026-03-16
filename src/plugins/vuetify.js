import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { lightTheme, darkTheme, themeDefaults } from '@/constants/theme.js'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: lightTheme,
      dark:  darkTheme,
    },
  },
  defaults: themeDefaults,
  icons: {
    defaultSet: 'mdi',
  },
})
