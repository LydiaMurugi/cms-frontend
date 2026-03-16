/**
 * Automatically registers all Vue components in the `src/components/base` directory.
 * Components will be registered using their filename (e.g., BaseButton.vue -> BaseButton).
 */

export default {
  install(app) {
    const components = import.meta.glob('../components/base/*.vue', { eager: true })

    Object.entries(components).forEach(([path, definition]) => {
      // Get the component name from the filename
      const componentName = path
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')

      // Register the component globally
      app.component(componentName, definition.default)
    })
  }
}
