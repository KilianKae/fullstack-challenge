# Meeting Form Modal Implementation Plan

## Overview
Implement a modal form that allows users to create meetings with proper validation. The modal will be triggered by a "Create Meeting" button on the home page.

## Requirements
- Add a "Create Meeting" button that opens a modal form
- Form fields: Title, Start Time, End Time, Description (optional)
- Validation: Required fields and endTime must be after startTime
- Display appropriate error messages for validation failures

---

## Implementation Tasks

### 1. Frontend - Create Meeting Form Modal Component

**File to create:** `client/app/components/CreateMeetingModal.tsx`

**Description:** Create a new modal component that contains the meeting creation form.

**Requirements:**
- Use Material UI Dialog/Modal component for the modal
- Include form fields:
  - **Title** (text input, required)
  - **Start Time** (date-time picker, required)
  - **End Time** (date-time picker, required)
  - **Description** (textarea, optional)
- Implement form validation:
  - All required fields must be filled
  - End time must be after start time
  - Display error messages below invalid fields
- Include "Cancel" and "Create Meeting" buttons
- Handle loading state while creating meeting
- Display error state if meeting creation fails
- Close modal on successful creation or cancel

**Technical Notes:**
- Consider using Material UI's `@mui/x-date-pickers` for date-time inputs (already in dependencies based on glob results)
- Use controlled form inputs with React state
- Props needed:
  - `open: boolean` - controls modal visibility
  - `onClose: () => void` - callback to close modal
  - `onSubmit: (meeting: Omit<Meeting, "id">) => Promise<void>` - callback to create meeting

**Example validation logic:**
```typescript
const validateForm = () => {
  const errors: Record<string, string> = {};

  if (!title.trim()) {
    errors.title = "Title is required";
  }

  if (!startTime) {
    errors.startTime = "Start time is required";
  }

  if (!endTime) {
    errors.endTime = "End time is required";
  }

  if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
    errors.endTime = "End time must be after start time";
  }

  return errors;
};
```

---

### 2. Frontend - Update Header Component

**File to modify:** `client/app/components/header.tsx`

**Current state:**
- Header already has infrastructure for drawer (unused `drawerOpen` state and `handleCreateMeeting` function)
- Only displays Bliro logo

**Changes needed:**
1. Add "Create Meeting" button to the Toolbar
2. Import and integrate the CreateMeetingModal component
3. Connect modal state management:
   - Use existing `drawerOpen` state or rename to `modalOpen`
   - Add button click handler to open modal
   - Pass `onCreateMeeting` prop to modal

**Implementation details:**
```typescript
// Add button to Toolbar with icon
<Button
  variant="contained"
  onClick={() => setDrawerOpen(true)}
  sx={{
    width: '161px',
    height: '40px',
    paddingLeft: '16px',
    paddingRight: '16px',
    borderRadius: '4px',
    gap: '8px',
    textTransform: 'none',
  }}
  startIcon={
    <img
      src="/arrow-up-right-square.svg"
      alt=""
      style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }}
    />
  }
>
  Create Meeting
</Button>

// Add modal component
<CreateMeetingModal
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  onSubmit={handleCreateMeeting}
/>
```

**Design specifications (from Figma):**
- Width: 161px
- Height: 40px
- Padding: 16px (left and right)
- Border radius: 4px
- Gap: 8px (for spacing between icon and text)
- Color: #F26835 (already set as primary theme color in `client/app/layout.tsx:13`)
- Icon: Use `/arrow-up-right-square.svg` from `client/public/` directory
- Icon styling: Apply white filter to match button text color (filter: 'brightness(0) invert(1)')
- Position: Right side of the header
- Note: The color #F26835 is already configured as the primary color in the theme, so using `variant="contained"` will automatically apply this color

---

### 3. Frontend - Update Meeting Model (Optional)

**File to modify:** `client/app/models/Meeting.ts`

**Current state:**
```typescript
export interface Meeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
}
```

**Optional changes:**
If description field is to be persisted:
1. Add optional `description?: string` field to Meeting interface
2. This change should match the backend model if description is supported

**Note:** Review backend model to determine if description field already exists or needs to be added.

---

### 4. Backend - Verify/Update Meeting Model

**File to check:** `server/src/models/meeting.ts`

**Current state:**
```typescript
export interface IMeeting extends Document {
  title: string;
  startTime: Date;
  endTime: Date;
}
```

**Action required:**
- **If description/note field is desired:** Add optional `description` field to schema
- **If not needed:** No changes required, can omit description from frontend form

**If adding description:**
```typescript
const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  description: { type: String, required: false }, // Add this line
});
```

---

### 5. Backend - Update Validation

**File to check:** `server/src/validators/meeting.ts`

**Action required:**
- Verify existing validation rules cover:
  - Required fields (title, startTime, endTime)
  - endTime is after startTime
- Add description field validation if implementing description feature
- Ensure validation error messages are user-friendly

**Example validation (if not already implemented):**
```typescript
// Ensure endTime > startTime
if (new Date(endTime) <= new Date(startTime)) {
  throw new Error("End time must be after start time");
}
```

---

### 6. Testing Checklist

After implementation, verify the following:

**Functional Testing:**
- [ ] "Create Meeting" button is visible on home page header
- [ ] Clicking button opens the modal
- [ ] Modal displays all form fields correctly
- [ ] Form validation works:
  - [ ] Empty title shows error
  - [ ] Empty start time shows error
  - [ ] Empty end time shows error
  - [ ] End time before start time shows error
  - [ ] Valid form submits successfully
- [ ] Cancel button closes modal without creating meeting
- [ ] Successful creation closes modal and refreshes meeting list
- [ ] Error state is displayed if API call fails

**UI/UX Testing:**
- [ ] Modal is centered and properly sized
- [ ] Form fields are properly aligned and labeled
- [ ] Error messages are clearly visible
- [ ] Date-time pickers are user-friendly
- [ ] Loading state is shown during submission
- [ ] Modal can be closed by clicking outside or pressing Escape
- [ ] Form is cleared when modal is reopened

**Accessibility:**
- [ ] All form fields have proper labels
- [ ] Error messages are associated with fields
- [ ] Modal can be navigated with keyboard
- [ ] Focus is properly managed when modal opens/closes

---

## Files Summary

### Files to Create:
1. `client/app/components/CreateMeetingModal.tsx` - New modal form component

### Files to Modify:
1. `client/app/components/header.tsx` - Add button and integrate modal
2. `client/app/models/Meeting.ts` - (Optional) Add description field
3. `server/src/models/meeting.ts` - (Optional) Add description field to schema
4. `server/src/validators/meeting.ts` - Verify/update validation logic

### Files to Review:
1. `server/src/controllers/meetingController.ts` - Ensure controller handles new fields
2. `server/src/services/meetingService.ts` - Verify service layer supports changes

---

## Technical Dependencies

- Material UI Dialog/Modal components
- Material UI Form components (TextField, Button)
- Material UI Date Pickers (`@mui/x-date-pickers`)
- Existing `createMeeting` service function
- Existing `Meeting` interface

---

## Implementation Order

1. **Start with frontend modal component** - Create `CreateMeetingModal.tsx` with all form logic
2. **Update header** - Integrate modal into header component
3. **Test frontend flow** - Verify modal opens, form validates, closes correctly
4. **Review backend** - Check if description field or additional validation is needed
5. **Update backend if needed** - Add description field and validation
6. **End-to-end testing** - Test complete flow from button click to meeting creation

---

## Notes and Considerations

- The header component already has unused state (`drawerOpen`) and handler (`handleCreateMeeting`) that suggest partial implementation existed
- **Color #F26835 is already defined** as the primary theme color in `client/app/layout.tsx:13`, so the "Create Meeting" button will automatically use this color with `variant="contained"`
- Button styling matches Figma specifications: 161px width, 40px height, 16px padding, 4px border radius
- Consider whether description/note field should be:
  - Required or optional
  - Stored in database or omitted
  - Displayed in meeting list view
- Date-time picker library is already available in the project
- Ensure timezone handling is consistent between frontend and backend
- Consider adding date-time format validation
- Error handling should cover both validation errors and API errors
- Consider adding success notification/toast after meeting creation

---

## Questions to Resolve

1. Should the description/note field be implemented?
   - If yes, should it be required or optional?
   - Should it be displayed in the meeting list view?
2. Should there be any additional business rules?
   - Minimum meeting duration?
   - Maximum meeting duration?
   - Restrict meetings to business hours?
3. Should the form remember the last used values?
4. Should there be a "Create Another" option after successful creation?
