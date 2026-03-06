import { ref, computed } from 'vue'

export function useMemberFilters(memberStore) {
  const searchQuery = ref('')
  const selectedGroup = ref('All Groups')
  const statusFilter = ref('All')
  const showAdvancedFilters = ref(false)

  const filteredMembers = computed(() => {
    return memberStore.members.filter(member => {
      const matchesGroup =
        selectedGroup.value === 'All Groups' ||
        member.group === selectedGroup.value

      const matchesStatus =
        statusFilter.value === 'All' ||
        member.status === statusFilter.value

      return matchesGroup && matchesStatus
    })
  })

  const getStatusColor = status => {
    switch (status) {
      case 'Active':
        return 'success'
      case 'Inactive':
        return 'error'
      case 'Pending':
        return 'warning'
      default:
        return 'grey'
    }
  }

  const resetFilters = () => {
    searchQuery.value = ''
    selectedGroup.value = 'All Groups'
    statusFilter.value = 'All'
  }

  const editMember = member => {
    console.log('Editing member:', member.name)
  }

  return {
    searchQuery,
    selectedGroup,
    statusFilter,
    showAdvancedFilters,
    filteredMembers,
    getStatusColor,
    resetFilters,
    editMember,
  }
}
