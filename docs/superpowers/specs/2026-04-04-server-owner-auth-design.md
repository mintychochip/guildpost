# Server Owner Auth & Dashboard — Design Spec

## Overview

Add authentication so server owners can create accounts, claim their servers, and manage them via a dashboard. Built on existing Supabase Auth SSR setup.

## Auth Providers

- **Google OAuth** — primary
- **GitHub OAuth** — secondary
- **Email + password** — fallback

All via Supabase Auth. OAuth callbacks handled by Supabase at `/auth/callback`.

## Pages

### `/login`
- Clean minimal page with:
  - "PvP Index" branding
  - Google OAuth button (primary)
  - GitHub OAuth button (secondary)
  - Divider with "or"
  - Email + password form (collapsible or below divider)
- After successful auth, redirect to `/dashboard`
- Link: "Don't have an account? Sign up" toggles to signup mode (same page, different heading)

### `/dashboard`
- Protected route (requires auth)
- Shows list of servers owned by current user
- Each server card has **Edit** and **Delete** actions
- **Submit New Server** button → `/submit`
- Empty state: "You haven't submitted any servers yet" with CTA to submit
- If user is logged in, header nav shows "Dashboard" and "Logout" instead of "Submit"

### `/submit` (modified)
- Now requires login
- If not logged in, redirect to `/login?redirect=/submit`
- After submit, the server is linked to the current user's `owner_id`

### `/profile` (optional)
- Can defer — merge into dashboard if needed

## Data Model

### `servers` table changes
Add column:
- `owner_id` (UUID, references `auth.users`, nullable, set after claiming)

### New `profiles` table (if needed for display name, avatar)
- `id` (UUID, primary key, references `auth.users`)
- `display_name` (text)
- `avatar_url` (text)
- `created_at` (timestamptz)

## API Changes

### `POST /api/submit`
- Requires auth session
- Set `owner_id` on the new server record

### `PATCH /api/servers/[id]`
- Requires auth
- Verify `owner_id` matches current user
- Allow updating: name, description, version, tags

### `DELETE /api/servers/[id]`
- Requires auth
- Verify `owner_id` matches current user

## Auth Protection

### Middleware (`middleware.ts`)
- Protect `/dashboard`, `/submit`, `/profile`
- Redirect unauthenticated users to `/login?redirect=<path>`

### Server Component Data Fetching
- Dashboard: query `servers` filtered by `owner_id = supabase.auth.getUser()`

## Component Inventory

### `LoginForm`
- Email/password fields
- Submit button with loading state
- Error display
- Toggles between signin/signup

### `OAuthButtons`
- Google button with Google icon
- GitHub button with GitHub icon
- Loading state on click

### `DashboardServerCard`
- Extends existing ServerCard with owner actions
- Edit button → `/dashboard/edit/[id]` or inline edit
- Delete button with confirmation dialog

### `UserMenu`
- Avatar + display name dropdown
- Links: Dashboard, Profile, Logout

## Implementation Order

1. Set up Supabase OAuth providers (Google + GitHub app credentials in `.env`)
2. Create `middleware.ts` with auth protection
3. Build `/login` page with OAuth + email forms
4. Add `profiles` table migration
5. Build `/dashboard` page with server list
6. Update `/submit` to require auth and set `owner_id`
7. Add edit/delete API routes with ownership check
8. Add `UserMenu` to header nav
9. Wire up logout

## Out of Scope (v1)

- Server claiming (owners can only add new servers, not claim existing)
- Email verification flows
- Password reset
- Profile customization beyond OAuth avatar/name
