import { ref } from 'vue'
import { recentActivitiesData } from '@/constants/dashboardActivities'

export function useDashboardData() {
  const recentActivities = ref(recentActivitiesData)

  return {
    recentActivities,
  }
}
