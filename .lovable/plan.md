

# Partners Page + Admin Header Upgrade

## Overview
Replicate the AXO OS partner management system in Kings OS and upgrade the admin header with week/date display and notification bell.

## Database

**New `partners` table:**
- `id` (uuid, PK), `org_id` (uuid, NOT NULL), `company_name` (text), `contact_name` (text), `email` (text), `phone` (text), `partner_type` (text, default 'builder'), `service_zone` (text, default 'core'), `status` (text, default 'active'), `last_contacted_at` (timestamptz), `next_action_date` (date), `next_action_note` (text), `total_referrals` (int, default 0), `total_converted` (int, default 0), `notes` (text), `photo_url` (text), `created_at` (timestamptz, default now()), `updated_at` (timestamptz, default now())

**RLS Policies:** Same org-based pattern as leads (read/update/delete for authenticated where `org_id = get_user_org_id()`, public insert blocked).

## Files to Create

1. **`src/hooks/admin/usePartnersData.ts`** — React Query hook with `useQuery`/`useMutation` for partners CRUD. Exports `Partner` type, `PARTNER_TYPES`, `PARTNER_STATUSES`, `PARTNER_PIPELINE_STAGES`, `PARTNER_STAGE_CONFIG` constants.

2. **`src/pages/admin/Partners.tsx`** — Main page with list/board toggle, search, type/status filters, mini stats bar (active count, at-risk count, total referrals). List view uses `PartnerListItem`, board view uses `PartnerPipelineBoard`.

3. **`src/components/admin/PartnerListItem.tsx`** — List row with avatar (initials + status dot), company info, type badge, referral count, quick-action phone/email buttons. Shows at-risk styling for partners without contact >30 days.

4. **`src/components/admin/PartnerPipelineBoard.tsx`** — Horizontal scrollable Kanban with columns per pipeline stage (Prospect → Contacted → Meeting Scheduled → Trial/First Job → Active → Inactive). Each card shows avatar, company, type badge, referral count.

5. **`src/components/admin/PartnerDetailPanel.tsx`** — Full-screen detail view (replaces list when partner selected). Header with avatar + badges, quick-action bar (Call/SMS/Email), stats row, tabbed content (General/Notes), edit mode with inline form, delete with confirmation.

6. **`src/components/admin/PartnerControlModal.tsx`** — Quick-action modal from board view. Shows partner summary, contact info, advance pipeline button, view details link.

7. **`src/components/admin/NewPartnerDialog.tsx`** — Zod-validated form dialog for creating partners (company, contact, phone, email, type, optional stage selector, notes).

## Files to Modify

8. **`src/components/admin/AdminLayout.tsx`** — Upgrade header to 3-column grid layout:
   - Left: sidebar trigger + page title
   - Center: `WEEK {n} · {month day}` (calculated from current date)
   - Right: notification bell (Popover with lead alerts from `leads` table — new leads without contact in 24h) + logout button

9. **`src/components/admin/AdminSidebar.tsx`** — Add Partners nav item (`Handshake` icon, `/admin/partners`).

10. **`src/App.tsx`** — Add lazy import for `Partners` page and route `/admin/partners`.

## Notification System
The notification bell queries leads where `status = 'new'` and `created_at < now() - 24h` (no contact). Shows count badge, popover with clickable items linking to `/admin/leads`. Lightweight — no separate notifications table needed.

## Technical Notes
- All partner data uses `org_id = get_user_org_id()` pattern consistent with existing leads/referrals
- Pipeline stages: prospect → contacted → meeting_scheduled → trial_first_job → active → inactive → churned
- At-risk detection: active partner with `last_contacted_at` > 30 days ago
- UI language: English (consistent with Kings OS, not Portuguese like AXO OS)
- `date-fns` already available in the project for date formatting

