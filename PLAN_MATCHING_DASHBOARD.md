# Implementation Plan: Synchronizing Admin Allocations with Member Experience

## 1. Overview
The goal is to create a seamless one-to-one mapping between administrative actions (allocations) and the member's application experience. When an admin "allocates" a resource, task, or project to a member or group, the member's dashboard should intelligently reflect these changes.

## 2. Core Mapping Logic

| Admin Module | Admin Action (Allocation) | Member Experience (Mapping) |
| :--- | :--- | :--- |
| **Resources** | Upload and assign to `Group` or `Public` | Dashboard: "Resources for You" (Filtered by Group) |
| **Tasks/Duties** | Assign duty to a specific `Member` | Dashboard: "Assignments for You" (Filtered by User ID) |
| **Projects** | Mark Project as `Public` or assign `Team` | Dashboard: "Church Progress" or "My Project Tasks" |
| **Programs** | Mark Program as `Featured` | Dashboard: Top-level Banner/Featured Event |
| **Communication** | Send Targeted Message/Notification | Dashboard: New Message Indicator / Notification Bell |

## 3. Proposed Enhancements

### Phase 1: Resource & Program Visibility (The "Curation" Layer)
*   **Admin Side:** Add a `featured` boolean to the Programs model. Add a `visibility` toggle to Resources (Individual vs Group vs Public).
*   **Member Side:** Update the `Home.vue` to prioritize "Featured" programs in the list and ensure resources strictly match the member's group or are marked public.

### Phase 2: Project Transparency (The "Involvement" Layer)
*   **Admin Side:** Enable a "Publish Progress" toggle for projects (e.g., Building Fund, Outreach).
*   **Member Side:** Add a "Church Projects" section to the member dashboard. If a member is part of a project team, they see their specific sub-tasks; otherwise, they see a high-level progress bar of public projects.

### Phase 3: Financial Alignment (The "Impact" Layer)
*   **Admin Side:** Define "Fundraising Goals" for specific projects.
*   **Member Side:** Instead of just seeing their own giving, members see how their contribution impacts a specific "Admin-allocated" fund (e.g., "70% of Building Fund Goal Reached").

## 4. Technical Strategy

### 4.1. Backend API Alignment
*   Ensure `/api/dashboard` (used by `memberDashboardStore`) respects the user's `tenantId` and `group`.
*   Implement `GET /api/projects/public` for non-admin users.

### 4.2. Frontend Component Sync
*   **Shared Constants:** Ensure `status` and `category` constants are shared between `AdminLayout` and `MemberLayout` to avoid UI discrepancies.
*   **Real-time Feedback:** Use the `notificationStore` to trigger dashboard refreshes when an admin makes a new allocation.

## 5. Success Metrics
*   Members can immediately see duties assigned to them on their home screen.
*   Members only see resources relevant to their specific ministry group.
*   The "Upcoming Service" card accurately reflects the current "Active" service set by the admin.

---
**Status:** Ready for Review
**Lead Developer:** Gemini CLI
