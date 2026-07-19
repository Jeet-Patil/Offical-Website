# Implementation Plan: Join DESOC Recruitment Feature

## Overview
Adding a recruitment feature to the DESOC website with a third CTA button in the Hero section, a "Recruitment" navbar item with OPEN badge, and a full recruitment page with multi-section form.

---

## Changes to Existing Files

### 1. `src/components/Hero.jsx` — Add third CTA button
- Add a new "🚀 Join DESOC" button next to "About us" and "GENESIS" buttons (lines 83–100)
- Use the same gradient style as the GENESIS button (`linear-gradient(135deg, #970233 0%, #c41e5c 100%)`)
- Add hover effect: scale to 1.02, darker gradient (`#800125` to `#a41650`), box-shadow glow
- Add `cursor-pointer` and match existing animation (`animate-fadeInUp`)
- Navigate to `/recruitment` on click

### 2. `src/components/Navbar.jsx` — Add Recruitment menu item
- Add `{ name: 'Recruitment', path: '/recruitment', type: 'route' }` to `menuItems` array (after Genesis or near the end)
- Add an `isRecruitmentOpen` constant (set to `true` for now) to control the OPEN badge
- Render a small red "OPEN" badge (`bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full`) next to "Recruitment" when open
- The badge should be positioned relative to the text, using flex gap and items-center on the parent

### 3. `src/App.jsx` — Add recruitment route
- Import `RecruitmentPage` from `./pages/RecruitmentPage`
- Add route: `<Route path="/recruitment" element={<RecruitmentPage />} />`

---

## New File: `src/pages/RecruitmentPage.jsx`

### Structure
Following the existing page pattern (GenesisPage style):
- Imports: `Navbar`, `Footer`, `useState`, `useEffect`, `Link`
- Dark gradient background (same as RegistrationPage)
- `max-w-7xl mx-auto` content container
- Responsive padding

### Hero Section
- "Join DESOC" heading
- Subtitle text (as specified)
- "Apply Now" button at top (primary CTA, opens form)

### Form Structure
The form will be a multi-section form with the following sections. All sections are always visible (not stepped), using a card-based layout.

**Form State (single `formData` object):**
```js
{
  // Section 1 - Personal Details
  fullName: '',
  email: '',
  mobile: '',
  yearOfStudy: '',
  branch: '',

  // Section 2 - Role Selection
  roles: [], // array of selected roles
  preferredRole: '',
  secondPreference: '',

  // Section 3 - Skills
  skills: [], // array of selected skills
  otherSkills: '',

  // Section 4 - Experience
  previousClubExperience: '',
  hackathonsParticipated: '',
  eventsOrganized: '',
  leadershipExperience: '',

  // Section 5 - Portfolio
  github: '',
  linkedin: '',
  portfolioWebsite: '',
  resumeFile: null,
  additionalPortfolioLink: '',

  // Section 6 - Short Answer
  whyJoinDesoc: '',
  whySelectYou: '',
  valueYouBring: '',
  projectProud: '',
  teamChallenge: '',

  // Section 7 - Availability
  hoursPerWeek: '',
  weekendAvailability: '',

  // Section 8 - Declaration
  declarationAccepted: false,
}
```

### Form Sections (Cards)

**Card style:** `rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-[0_18px_40px_rgba(0,0,0,0.45),0_0_24px_rgba(220,38,38,0.12)]`

**Section 1 – Personal Details**
- Grid layout: 2 columns on sm+
- Fields: Full Name, Email ID, Mobile Number (10-digit), Year of Study (text input), Branch (text input)

**Section 2 – Role Selection**
- Checkboxes for all roles (2 columns grid)
- Dropdowns for Preferred Role and Second Preference (populated from the same role list)

**Section 3 – Skills**
- Checkbox grid (2-3 columns)
- "Others" text input appears when "Others" is checked

**Section 4 – Experience**
- 4 textareas with placeholder questions as labels

**Section 5 – Portfolio**
- Text inputs for GitHub, LinkedIn, Portfolio Website
- File upload for Resume
- Additional portfolio link

**Section 6 – Short Answer**
- 5 textareas with specific placeholders

**Section 7 – Availability**
- Dropdown for hours (1-5, 5-10, 10-15, 15+)
- Radio/checkbox for weekend availability

**Section 8 – Declaration**
- Single checkbox
- Submit button (styled like registration page: gradient, rounded-full, hover glow)

### Validation
- Client-side validation for required fields
- Email format regex
- Mobile number 10-digit
- Declaration must be accepted
- Error messages shown below each field in red

### Submit Handler
- `handleSubmit` async function
- Currently logs to console (with full payload) — ready for API integration
- Shows loading state during "submission"
- On success, shows success confirmation screen (similar to RegistrationPage)

### UI/UX Details
- Labels: `block text-gray-200 text-sm font-semibold mb-2`
- Inputs: `w-full bg-black/35 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500 transition-colors`
- Error inputs: `border-red-500` instead of `border-white/15`
- Checkboxes styled with custom CSS (hidden native, styled box with checkmark SVG)
- Submit button: `bg-linear-to-r from-red-700 to-red-600 text-white font-bold uppercase tracking-wider rounded-full hover:from-red-600 hover:to-red-500 hover:shadow-[0_0_28px_rgba(220,38,38,0.35)] hover:scale-[1.02] transition-all duration-300`

---

## File Summary

| File | Action |
|------|--------|
| `src/components/Hero.jsx` | Edit — add 3rd CTA button |
| `src/components/Navbar.jsx` | Edit — add Recruitment menu item + OPEN badge |
| `src/App.jsx` | Edit — add recruitment route |
| `src/pages/RecruitmentPage.jsx` | **New** — full recruitment page with form |

---

## Implementation Order

1. Add route to `App.jsx`
2. Edit `Navbar.jsx` to add Recruitment menu item with OPEN badge
3. Edit `Hero.jsx` to add third CTA button
4. Create `RecruitmentPage.jsx` with the full form

---

## Key Design Decisions

- **Existing design language preserved** — no redesign, only additions
- **CSS animations used** (not Framer Motion) — matches existing codebase pattern
- **Single-page form** — all sections visible, scroll-based, not multi-step modal
- **Form state isolated** — easy to swap `handleSubmit` for real API call
- **OPEN badge on navbar** — hardcoded `true` now, can be made dynamic later
- **File upload uses native input type="file"** — consistent with RegistrationPage pattern