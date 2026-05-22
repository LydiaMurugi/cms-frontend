<template>
  <v-container fluid class="fill-height bg-background">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="5">
        <BaseCard elevation="0" rounded="md" class="pa-0 border-thin bg-white overflow-hidden">
          <v-tabs v-model="activeTab" bg-color="white" color="primary" grow density="comfortable" class="border-b">
            <v-tab value="single" class="text-caption font-weight-bold">
              <v-icon icon="mdi-email-send-outline" start size="18" />
              Send Invite
            </v-tab>
            <v-tab value="bulk" class="text-caption font-weight-bold">
              <v-icon icon="mdi-account-multiple-plus-outline" start size="18" />
              Bulk Upload
            </v-tab>
          </v-tabs>

          <v-window v-model="activeTab" class="pa-8">
            <!-- Single Registration Tab (Invite) -->
            <v-window-item value="single">
              <div v-if="!inviteSent">
                <div class="mb-6">
                  <h1 class="text-h5 font-weight-bold text-primary mb-1">
                    Invite New Member
                  </h1>
                  <p class="text-caption text-grey-darken-1">
                    The member will receive an email to set up their password and activate their account.
                  </p>
                </div>

                <v-form
                  ref="form"
                  v-model="isFormValid"
                  @submit.prevent="handleRegister"
                >
                  <v-row dense>
                    <v-col cols="12" sm="6">
                      <BaseInput
                        v-model="formData.firstName"
                        label="First Name"
                        placeholder="e.g. John"
                        :rules="[rules.required]"
                        prepend-inner-icon="mdi-account-outline"
                      />
                    </v-col>

                    <v-col cols="12" sm="6">
                      <BaseInput
                        v-model="formData.lastName"
                        label="Last Name"
                        placeholder="e.g. Doe"
                        :rules="[rules.required]"
                        prepend-inner-icon="mdi-account-outline"
                      />
                    </v-col>

                    <v-col cols="12">
                      <BaseInput
                        v-model="formData.email"
                        label="Email Address"
                        placeholder="john.doe@email.com"
                        type="email"
                        :rules="[rules.required, rules.email]"
                        prepend-inner-icon="mdi-email-outline"
                      />
                    </v-col>

                    <v-col cols="12">
                      <BaseInput
                        v-model="formData.phone"
                        label="Phone Number (Optional)"
                        placeholder="+254..."
                        prepend-inner-icon="mdi-phone-outline"
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-select
                        v-model="formData.group"
                        :items="availableGroups"
                        label="Assign Group"
                        variant="outlined"
                        density="comfortable"
                        rounded="md"
                        color="primary"
                        prepend-inner-icon="mdi-account-group-outline"
                        :rules="[rules.required]"
                      />
                    </v-col>
                  </v-row>

                  <BaseButton
                    type="submit"
                    color="primary"
                    block
                    size="large"
                    class="mt-6"
                    rounded="md"
                    :loading="loading"
                    :disabled="!isFormValid"
                    prepend-icon="mdi-send"
                  >
                    Send Invitation Link
                  </BaseButton>
                </v-form>
              </div>

              <!-- Success State / Invite Sent -->
              <div v-else class="text-center py-6">
                <v-avatar color="success-lighten-5" size="80" rounded="md" class="mb-4">
                  <v-icon icon="mdi-email-check-outline" color="success" size="48" />
                </v-avatar>
                <h2 class="text-h5 font-weight-bold text-success mb-2">Invitation Sent!</h2>
                <p class="text-body-2 text-grey-darken-1 mb-8">
                  We've sent an invitation to <strong>{{ formData.email }}</strong>. <br>
                  They can activate their account by following the link in their inbox.
                </p>

                <div class="d-flex flex-column gap-2">
                  <BaseButton block color="primary" variant="tonal" @click="resetInviteFlow">
                    Invite Another Member
                  </BaseButton>
                  <BaseButton block variant="text" color="medium-emphasis" to="/admin/members">
                    Go to Directory
                  </BaseButton>
                </div>
              </div>
            </v-window-item>

            <!-- Bulk Upload Tab -->
            <v-window-item value="bulk">
              <div v-if="!bulkResult">
                <div class="text-center mb-6">
                  <v-avatar color="secondary-lighten-5" size="56" rounded="md" class="mb-3">
                    <v-icon
                      icon="mdi-file-upload"
                      size="28"
                      color="secondary"
                    />
                  </v-avatar>
                  <h1 class="text-h5 font-weight-bold text-secondary">
                    Bulk Registration
                  </h1>
                  <p class="text-caption text-grey-darken-1">
                    Upload a CSV file to send invitations to multiple members at once.
                  </p>
                </div>

                <div class="pa-6 border-dashed border-thin rounded-md text-center bg-grey-lighten-5 mb-6">
                  <v-file-input
                    v-model="csvFile"
                    label="Select CSV File"
                    accept=".csv"
                    variant="outlined"
                    prepend-icon="mdi-file-delimited"
                    rounded="md"
                    density="comfortable"
                    color="secondary"
                    show-size
                    hide-details
                    class="mb-4"
                  />
                  <div class="text-tiny text-grey mb-4">
                    Expected columns: firstName, lastName, email, phone, group
                  </div>
                  <BaseButton 
                    variant="text" 
                    color="primary" 
                    size="small" 
                    prepend-icon="mdi-download"
                    class="font-weight-bold"
                    @click="downloadTemplate"
                  >
                    Download Template
                  </BaseButton>
                </div>

                <v-expand-transition>
                  <div v-if="uploadingBulk" class="mb-6">
                    <div class="d-flex justify-space-between text-tiny font-weight-bold mb-1">
                      <span>Processing invites...</span>
                      <span>{{ bulkProgress }}%</span>
                    </div>
                    <v-progress-linear
                      v-model="bulkProgress"
                      color="secondary"
                      height="8"
                      rounded="pill"
                      striped
                    />
                  </div>
                </v-expand-transition>

                <BaseButton
                  color="secondary"
                  block
                  size="large"
                  rounded="md"
                  :loading="uploadingBulk"
                  :disabled="!csvFile"
                  @click="handleBulkUpload"
                >
                  Process Bulk Invites
                </BaseButton>
              </div>

              <!-- Bulk Result Summary -->
              <div v-else class="text-center py-4">
                <v-avatar :color="bulkResult.failed.length === 0 ? 'success-lighten-5' : 'warning-lighten-5'" size="64" rounded="md" class="mb-4">
                  <v-icon :icon="bulkResult.failed.length === 0 ? 'mdi-check-all' : 'mdi-alert-circle-outline'" 
                          :color="bulkResult.failed.length === 0 ? 'success' : 'warning'" size="32" />
                </v-avatar>
                <h2 class="text-h6 font-weight-bold mb-2">Processing Complete</h2>
                
                <v-row dense class="mb-6 mt-4">
                  <v-col cols="6">
                    <div class="pa-3 bg-success-lighten-5 rounded-md border-thin">
                      <div class="text-h5 font-weight-bold text-success">{{ bulkResult.success.length }}</div>
                      <div class="text-tiny text-success font-weight-bold text-uppercase">Invites Sent</div>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="pa-3 bg-error-lighten-5 rounded-md border-thin">
                      <div class="text-h5 font-weight-bold text-error">{{ bulkResult.failed.length }}</div>
                      <div class="text-tiny text-error font-weight-bold text-uppercase">Failed</div>
                    </div>
                  </v-col>
                </v-row>

                <div v-if="bulkResult.failed.length > 0" class="text-left mb-6">
                  <div class="text-tiny font-weight-bold text-grey-darken-1 text-uppercase mb-2">Error Details</div>
                  <div class="max-height-200 overflow-y-auto border-thin rounded-md pa-2 bg-grey-lighten-5">
                    <div v-for="(fail, i) in bulkResult.failed" :key="i" class="text-tiny text-error mb-1">
                      • {{ fail.member.email }}: {{ fail.error }}
                    </div>
                  </div>
                </div>

                <div class="d-flex flex-column gap-2">
                  <BaseButton block color="primary" variant="tonal" to="/admin/members">
                    Go to Directory
                  </BaseButton>
                  <BaseButton block variant="text" color="medium-emphasis" @click="bulkResult = null; csvFile = null">
                    Upload Another File
                  </BaseButton>
                </div>
              </div>
            </v-window-item>
          </v-window>
        </BaseCard>
      </v-col>
    </v-row>

    <!-- Success Snackbar -->
    <v-snackbar v-model="snackbar" color="success" timeout="3000" rounded="md" elevation="0">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useMemberStore } from '@/stores/memberStore'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const memberStore = useMemberStore()
const authStore = useAuthStore()
const router = useRouter()

const activeTab = ref('single')
const csvFile = ref(null)
const uploadingBulk = ref(false)
const bulkProgress = ref(0)
const bulkResult = ref(null)
const inviteSent = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')

const form = ref(null)
const isFormValid = ref(false)
const loading = ref(false)

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  group: '',
})

const availableGroups = computed(() => memberStore.groups)

const rules = {
  required: value => !!value || 'Field is required.',
  email: value => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Invalid e-mail.'
  },
}

const handleRegister = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      first_name: formData.firstName, // Snake case alias
      last_name: formData.lastName,   // Snake case alias
      name: `${formData.firstName} ${formData.lastName}`,
      adminName: `${formData.firstName} ${formData.lastName}`, // Church registration alias
      email: formData.email,
      adminEmail: formData.email, // Church registration alias
      phone: formData.phone,
      group: formData.group,
      role: 'member',
      status: 'Pending',
      tenantId: authStore.tenantId,
      tenant_id: authStore.tenantId, // Snake case alias
      sendInvite: true // Backend generates token and sends email
    }

    const res = await memberStore.addMember(payload)
    
    if (res.success) {
      inviteSent.value = true
      snackbarText.value = 'Invitation sent successfully!'
      snackbar.value = true
    } else {
      console.error('Registration failed:', res.error)
      alert(res.error || 'Failed to send invite.')
    }
  } catch (err) {
    console.error(err)
    alert('Failed to send invite. Check if email exists.')
  } finally {
    loading.value = false
  }
}

const parseCSV = (text) => {
  const lines = text.split('\n')
  const headers = lines[0].toLowerCase().split(',').map(h => h.trim())
  
  return lines.slice(1)
    .filter(line => line.trim() !== '')
    .map(line => {
      const values = line.split(',').map(v => v.trim())
      const entry = {}
      headers.forEach((header, i) => {
        entry[header] = values[i]
      })
      return entry
    })
}

const handleBulkUpload = async () => {
  if (!csvFile.value) return
  
  uploadingBulk.value = true
  bulkProgress.value = 0
  
  try {
    const file = Array.isArray(csvFile.value) ? csvFile.value[0] : csvFile.value
    const text = await file.text()
    const parsedData = parseCSV(text)
    
    if (parsedData.length === 0) {
      alert('CSV file is empty or invalid.')
      return
    }

    const membersToInvite = parsedData.map(data => ({
      firstName: data.firstname || '',
      lastName: data.lastname || '',
      first_name: data.firstname || '',
      last_name: data.lastname || '',
      name: `${data.firstname || ''} ${data.lastname || ''}`.trim(),
      adminName: `${data.firstname || ''} ${data.lastname || ''}`.trim(),
      email: data.email,
      adminEmail: data.email,
      phone: data.phone || '',
      group: data.group || 'General',
      role: 'member',
      status: 'Pending',
      tenantId: authStore.tenantId,
      tenant_id: authStore.tenantId,
      sendInvite: true
    }))

    const results = { success: [], failed: [] }
    for (let i = 0; i < membersToInvite.length; i++) {
      const res = await memberStore.addMember(membersToInvite[i])
      if (res.success) {
        results.success.push(res.member)
      } else {
        results.failed.push({ member: membersToInvite[i], error: res.error })
      }
      bulkProgress.value = Math.round(((i + 1) / membersToInvite.length) * 100)
    }

    bulkResult.value = results
    snackbarText.value = `Bulk upload complete: ${results.success.length} invited.`
    snackbar.value = true
  } catch (err) {
    console.error('Bulk upload error:', err)
    alert('An error occurred during file processing.')
  } finally {
    uploadingBulk.value = false
  }
}

const downloadTemplate = () => {
  const csvContent = "data:text/csv;charset=utf-8,firstName,lastName,email,phone,group\nJohn,Doe,john@example.com,254700000000,Youth Ministry"
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", "member_upload_template.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const resetInviteFlow = () => {
  inviteSent.value = false
  formData.firstName = ''
  formData.lastName = ''
  formData.email = ''
  formData.phone = ''
  formData.group = ''
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.border-dashed {
  border-style: dashed !important;
}

.border-b {
  border-bottom: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.text-tiny {
  font-size: 0.65rem;
}

.gap-2 { gap: 8px; }

.max-height-200 {
  max-height: 200px;
}
</style>
