# Refactor Plan: Centralized Theme & Base UI Component Library

This plan outlines the steps to refactor the CMS frontend to use a more consistent theme and a reusable component library pattern.

## 1. Centralize Theme & Style Variables [DONE]
**Goal:** Create a single source of truth for all colors, typography, and layout variables.

- [x] **Task 1.1:** Refactor `src/plugins/vuetify.js` to extract theme objects into a dedicated `src/constants/theme.js` file.
- [x] **Task 1.2:** Implement a CSS variable system in `src/assets/styles/theme.css` that syncs with the Vuetify theme for non-Vuetify components.
- [x] **Task 1.3:** Create a global style sheet for common utility classes (spacing, typography overrides) to supplement Vuetify.

## 2. Establish Base UI Component Library [DONE]
**Goal:** Create a `src/components/base` directory for shared, low-level UI components to ensure consistency and reduce code duplication.

- [x] **Task 2.1:** Create **`BaseButton.vue`**: Wrapper for `v-btn` with pre-defined styles for primary, secondary, and ghost variants.
- [x] **Task 2.2:** Create **`BaseCard.vue`**: Wrapper for `v-card` with consistent padding, elevation, and border-radius.
- [x] **Task 2.3:** Create **`BaseInput.vue`**: Wrapper for `v-text-field` and `v-select` to standardize validation, density, and styling.
- [x] **Task 2.4:** Create **`BaseModal.vue`**: A standard dialog component for alerts and forms.
- [x] **Task 2.5:** Create **`BasePageHeader.vue`**: A consistent layout for page titles, breadcrumbs, and primary actions.

## 3. Global Component Registration [DONE]
**Goal:** Make base components available globally to avoid redundant imports.

- [x] **Task 3.1:** Create a plugin or update `main.js` to automatically register all components in `src/components/base` using `app.component()`.

## 4. Systematic Component Replacement [DONE]
**Goal:** Replace direct Vuetify calls with the new base components throughout the application.

- [x] **Task 4.1:** Identify and replace standard `v-btn` usage with `<BaseButton>`.
- [x] **Task 4.2:** Identify and replace standard `v-card` usage with `<BaseCard>`.
- [x] **Task 4.3:** Standardize form inputs using `<BaseInput>`.

## 5. Verification & Documentation [DONE]
**Goal:** Ensure the refactor is successful and documented for future development.

- [x] **Task 5.1:** Audit all views (`src/views/admin/` and `src/views/member/`) to ensure visual consistency.
- [x] **Task 5.2:** (Optional) Set up a "Style Guide" page in the admin section to showcase all base components.

---

## Implementation Sequence
1. **Foundation:** Theme centralization (1.1 - 1.3).
2. **Library Creation:** Core components (2.1 - 2.3).
3. **Global Hook:** Global registration (3.1).
4. **Migration:** Iterative replacement (4.1 - 4.3).
