# Call Time Feature Implementation

## Overview
This document describes the implementation of the Call Time feature for job applications in the Allure platform. The feature allows jobs to require applicants to select specific time slots for call times/auditions.

## Files Modified

### 1. `/src/types/job.ts`
**Changes:**
- Added `AvailableTime` interface for individual time slots within a call time slot
- Added `CallTimeSlot` interface for call time slot data structure
- Updated `DetailedRole` interface to include:
  - `call_time_enabled: boolean` - Flag indicating if call time is required
  - `call_time_slots?: CallTimeSlot[]` - Optional array of available call time slots

### 2. `/src/components/jobs/CallTimeSelector.tsx` (NEW)
**Purpose:** Dedicated component for selecting call time slots and times

**Features:**
- Groups slots by date for better organization
- Shows availability count (available/total)
- Expandable slots to reveal available times
- Visual indication of:
  - Selected slot and time (golden highlight)
  - Fully booked times (grayed out and disabled)
  - Available times (clickable)
- Responsive grid layout for time selection
- Error message display
- Informational banner explaining call time requirement

**Props:**
```typescript
interface CallTimeSelectorProps {
  slots: CallTimeSlot[];           // Available call time slots
  selectedSlotId: number | null;   // Currently selected slot ID
  selectedTime: string | null;     // Currently selected time (HH:MM)
  onSlotChange: (slotId: number, time: string) => void; // Callback when selection changes
  error?: string;                  // Error message to display
}
```

### 3. `/src/components/jobs/JobApplicationModal.tsx`
**Changes:**

#### Imports:
- Added `CallTimeSelector` component
- Added `CallTimeSlot` type import

#### State Management:
```typescript
const [selectedCallTimeSlotId, setSelectedCallTimeSlotId] = useState<number | null>(null);
const [selectedCallTime, setSelectedCallTime] = useState<string | null>(null);
const [callTimeError, setCallTimeError] = useState<string>("");
```

#### Validation:
- Enhanced `validateForm()` to check if call time is selected when `call_time_enabled` is true
- Shows error message if call time is not selected

#### Form Submission:
- Appends `call_time_slot_id` and `selected_time` to FormData when call time is enabled
- Appends `approved_payment_terms: "true"` to FormData

#### Error Handling:
- Detects call time specific errors from backend
- Sets `callTimeError` state for display in CallTimeSelector
- Shows toast notification for all errors

#### UI Integration:
- Renders CallTimeSelector component before conditions when `call_time_enabled` is true
- Marked as required field with asterisk
- Only shows if slots are available

## API Integration

### Request Format
When submitting an application for a role with call time enabled, the following fields are sent:

```
POST /api/jobs/{jobId}/roles/{roleId}/apply

FormData:
- profile_id: number (user's profile ID)
- approved_payment_terms: "true" (string)
- call_time_slot_id: number (selected slot ID)
- selected_time: string (HH:MM format, e.g., "14:30")
- responses: JSON string (array of condition responses)
- media_* files (if applicable)
```

### Response Handling

**Success Response:**
```json
{
  "status": "success",
  "message": "Application submitted successfully"
}
```

**Error Responses:**
The implementation handles various backend error scenarios:

1. **Missing Call Time Data:**
   - Error message contains "call time", "slot", or "time"
   - Sets error in CallTimeSelector component

2. **Fully Booked Time:**
   - Frontend prevents selection (grayed out)
   - Backend validates and returns error if somehow submitted

3. **Invalid Slot/Time:**
   - Backend validates slot belongs to role
   - Backend validates time is within slot's available times

4. **Already Applied:**
   - Backend returns specific error message
   - Frontend shows toast notification

## User Experience

### When Call Time is Enabled:

1. **Modal Opens:**
   - Blue info banner explains call time requirement
   - Call Time section appears at top of form (before conditions)

2. **Slot Selection:**
   - Slots grouped by date
   - Each slot shows:
     - Date (e.g., "Mon, Dec 1, 2025")
     - Time range (e.g., "9:00 AM - 5:00 PM")
     - Interval duration (e.g., "30 min intervals")
     - Availability count (e.g., "8/12" with color coding)
   - Click to expand and see available times

3. **Time Selection:**
   - Grid of time buttons (3-4 columns responsive)
   - Available times: White background, hoverable
   - Booked times: Gray, strikethrough, disabled
   - Selected time: Golden highlight with shadow

4. **Validation:**
   - Submit button checks if call time is selected
   - Shows error message if missing
   - Prevents submission until selected

5. **Submission:**
   - Includes call time data in application
   - Success: Clears form and closes modal
   - Error: Shows specific error message

### When Call Time is Disabled:
- No changes to existing flow
- Call Time section not rendered
- Only conditions and optional documents shown

## Error Messages

The implementation handles these error scenarios:

1. **No slot selected:** "Please select a call time slot and time"
2. **Backend errors:** Display exact message from backend
3. **Network errors:** "An error occurred while submitting your application"

## Styling & Design

- **Consistent Theme:** Uses golden accent color (#c49a47) matching app theme
- **Dark Mode:** Full support with appropriate color variants
- **Transitions:** Smooth animations (200-300ms duration)
- **Accessibility:** Proper ARIA labels and keyboard navigation
- **Responsive:** Mobile-first grid layout adapts to screen size
- **Visual Hierarchy:** Clear separation between sections

## Backend API Contract

The implementation assumes the backend API:

### GET /api/jobs/{jobId}
Returns job details including roles with call time data:

```typescript
{
  status: "success",
  data: {
    // ... job fields
    roles: [
      {
        id: number,
        name: string,
        // ... other role fields
        call_time_enabled: boolean,
        call_time_slots: [
          {
            id: number,
            role_id: number,
            date: "YYYY-MM-DD",
            start_time: "HH:MM",
            end_time: "HH:MM",
            interval_minutes: number,
            capacity: number,
            available_times: [
              {
                time: "HH:MM",
                is_fully_booked: boolean
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### POST /api/jobs/{jobId}/roles/{roleId}/apply
Accepts FormData with call time fields when enabled:
- Validates `call_time_slot_id` belongs to the role
- Validates `selected_time` exists in slot's available_times
- Validates time is not fully booked
- Returns appropriate error messages for validation failures

## Testing Recommendations

1. **Unit Tests:**
   - CallTimeSelector component rendering
   - Time selection and state updates
   - Fully booked time handling
   - Error message display

2. **Integration Tests:**
   - Modal with call time enabled
   - Form submission with call time data
   - Error handling for missing call time
   - Backend error response handling

3. **E2E Tests:**
   - Complete application flow with call time
   - Different slot and time selections
   - Validation and error scenarios
   - Success submission

## Future Enhancements

Potential improvements:
1. Time zone support and display
2. Slot capacity warnings (e.g., "Only 2 spots left")
3. Filtering by date range
4. "Notify me" feature for fully booked slots
5. Calendar view for slot selection
6. Batch slot updates via WebSocket
7. Waitlist functionality

## Summary

The Call Time feature is now fully integrated into the job application flow:
- ✅ Type-safe implementation with TypeScript
- ✅ Reusable CallTimeSelector component
- ✅ Seamless integration with existing modal
- ✅ Comprehensive validation
- ✅ Robust error handling
- ✅ Beautiful, accessible UI
- ✅ Production-ready code

The implementation follows existing codebase patterns and design system, ensuring consistency and maintainability.
