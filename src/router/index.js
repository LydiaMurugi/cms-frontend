import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'

const routes = [
  // ==========================================
  // PUBLIC ROUTES
  // ==========================================
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { 
      requiresAuth: false,
      title: 'Login - Church Management'
    },
  },

  // ==========================================
  // ADMIN ROUTES
  // ==========================================
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { 
      requiresAuth: true, 
      requiresAdmin: true 
    },
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { 
          title: 'Admin Dashboard',
          icon: 'mdi-view-dashboard',
        },
      },
      {
        path: 'register',
        name: 'MemberRegistration',
        component: () => import('@/views/admin/MemberRegistration.vue'),
        meta: { 
          title: 'Member Registration',
          icon: 'mdi-account-plus',
        },
      },
      {
        path: 'members',
        name: 'MemberDirectory',
        component: () => import('@/views/admin/MemberDirectory.vue'),
        meta: { 
          title: 'Member Directory',
          icon: 'mdi-account-group',
        },
      },
      {
        path: 'finances',
        name: 'AdminFinancials',
        component: () => import('@/views/admin/Financials.vue'),
        meta: { 
          title: 'Financial Management',
          icon: 'mdi-cash-multiple',
        },
      },
      {
        path: 'reports',
        name: 'FinancialReports',
        component: () => import('@/views/admin/FinancialReports.vue'),
        meta: { 
          title: 'Financial Reports',
          icon: 'mdi-chart-line',
        },
      },
      {
        path: 'projects',
        name: 'ProjectBoard',
        component: () => import('@/views/admin/ProjectBoard.vue'),
        meta: { 
          title: 'Project Board',
          icon: 'mdi-clipboard-list',
        },
      },
      {
        path: 'projects/:id',
        name: 'AdminProjectDetails',
        component: () => import('@/views/admin/ProjectDetails.vue'),
        meta: {
          title: 'Project Details',
          requiresAuth: true,
          requiresAdmin: true,
          showInNav: false,
        },
      },
      {
        path: 'tasks',
        name: 'AdminTasks',
        component: () => import('@/views/admin/Tasks.vue'),
        meta: {
          title: 'Tasks & Duties',
          icon: 'mdi-checklist',
          requiresAuth: true,
          requiresAdmin: true,
        }
      },
      {
        path: 'resources',
        name: 'Resources',
        component: () => import('@/views/admin/ResourceUpload.vue'),
        meta: { 
          title: 'Resources',
          icon: 'mdi-file-multiple',
        },
      },
      {
        path: 'communication',
        name: 'CommunicationCenter',
        component: () => import('@/views/admin/AdminCommunicationCenter.vue'),
        meta: { 
          title: 'Communication Center',
          icon: 'mdi-chat-multiple',
        }, 
      },  
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('@/views/admin/AdminSettings.vue'),
        meta: { 
          title: 'Settings',
          icon: 'mdi-cog',
        },
      },
      {
        path: 'profile',
        name: 'AdminProfile',
        component: () => import('@/views/member/Profile.vue'),
        meta: { 
          title: 'My Profile',
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: 'notifications',
        name: 'AdminNotifications',
        component: () => import('@/views/member/Notifications.vue'),
        meta: { 
          title: 'Notifications',
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: 'style-guide',
        name: 'AdminStyleGuide',
        component: () => import('@/views/admin/StyleGuide.vue'),
        meta: { 
          title: 'Style Guide',
          icon: 'mdi-palette',
        },
      },
    ],
  },

  // ==========================================
  // MEMBER ROUTES
  // ==========================================
  {
    path: '/member',
    component: () => import('@/layouts/MemberLayout.vue'),
    meta: { 
      requiresAuth: true 
    },
    redirect: '/member/home',
    children: [
      {
        path: 'home',
        name: 'MemberHome',
        component: () => import('@/views/member/Home.vue'),
        meta: { 
          title: 'Home',
          icon: 'mdi-home',
        },
      },
      {
        path: 'contribute',
        name: 'MemberContribute',
        component: () => import('@/views/member/MemberContribute.vue'),
        meta: { 
          title: 'Give',
          icon: 'mdi-gift',
        },
      },
      {
        path: 'events',
        name: 'EventCalendar',
        component: () => import('@/views/member/EventCalendar.vue'),
        meta: { 
          title: 'Event Calendar',
          icon: 'mdi-calendar',
        },
      },
      {
        path: 'events/:id',
        name: 'EventDetails',
        component: () => import('@/views/member/EventDetails.vue'),
        meta: { 
          title: 'Event Details',
          showInNav: false,
        },
      },
      {
        path: 'resources',
        name: 'MemberResources',
        component: () => import('@/views/member/Resources.vue'),
        meta: { 
          title: 'Resources Library',
          icon: 'mdi-library-outline',
        },
      },
      {
        path: 'profile',
        name: 'MemberProfile',
        component: () => import('@/views/member/Profile.vue'),
        meta: { 
          title: 'My Profile',
          icon: 'mdi-account',
        },
      },
      {
        path: 'contribution-history',
        name: 'ContributionHistory',
        component: () => import('@/views/member/ContributionHistory.vue'),
        meta: { 
          title: 'Contribution History',
          icon: 'mdi-history',
        },
      },
      {
        path: 'notifications',
        name: 'MemberNotifications',
        component: () => import('@/views/member/Notifications.vue'),
        meta: { 
          title: 'Notifications',
          icon: 'mdi-bell-outline',
        },
      },
    ],
  },

  // ==========================================
  // ROOT REDIRECT
  // ==========================================
  {
    path: '/',
    redirect: () => {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return '/login'
      if (authStore.isAdmin) return '/admin/dashboard'
      return '/member/home'
    },
  },

  // ==========================================
  // 404 FALLBACK
  // ==========================================
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { 
      title: '404 - Page Not Found'
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Restore auth from localStorage if needed
  if (!authStore.isAuthenticated && !authStore.checked) {
    await authStore.checkAuth()
  }

  // Set page title
  document.title = to.meta.title || 'Church Management System'

  // Redirect unauthenticated users to login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // Redirect non-admins away from admin routes
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next('/member/home')
  }

  // Redirect authenticated users away from login
  if (to.path === '/login' && authStore.isAuthenticated) {
    return next(authStore.isAdmin ? '/admin/dashboard' : '/member/home')
  }

  next()
})

router.afterEach((to, from) => {
  console.log(`📍 Navigated to: ${to.path}`)
})

export default router