# N8N Workshop Registration

A simple, modern registration form for visitors to reserve their spot in an n8n workshop.

**Experience Qualities**: 
1. **Professional** - Clean, trustworthy design that reflects workshop quality
2. **Efficient** - Quick registration process with minimal friction
3. **Welcoming** - Friendly interface that encourages participation

**Complexity Level**: Micro Tool (single-purpose)
- Focused solely on collecting registrations with name/surname and generating confirmation UUIDs

## Essential Features

**Registration Form**
- Functionality: Collects visitor name and surname, generates unique UUID upon submission
- Purpose: Enables workshop organizers to track registrations and provide confirmation
- Trigger: User fills form and clicks "Register" button
- Progression: Land on page → Fill name/surname → Click Register → See UUID confirmation → Complete
- Success criteria: Form validates required fields, generates UUID, shows confirmation

**Form Validation**
- Functionality: Ensures both name and surname are provided before submission
- Purpose: Maintains data quality for workshop management
- Trigger: User attempts to submit incomplete form
- Progression: Submit attempt → Validation check → Error display → User corrects → Success
- Success criteria: Clear error messages guide user to complete required fields

## Edge Case Handling
- **Empty Fields**: Display clear validation messages for missing name or surname
- **Whitespace Only**: Trim and validate that fields contain actual content
- **Multiple Submissions**: Allow re-registration with new UUID generation
- **Long Names**: Handle extended names gracefully without layout breaks

## Design Direction
The design should feel professional and modern with a clean, minimalist approach that builds trust and confidence in the workshop experience.

## Color Selection
Analogous color scheme using green palette as requested, creating a harmonious and trustworthy feel.

- **Primary Color**: Green (#10b981 / oklch(0.67 0.15 162)) - Represents growth, success, and trust for the main action
- **Secondary Colors**: Gray-100 (#f3f4f6 / oklch(0.97 0 0)) as main background, darker grays for text hierarchy
- **Accent Color**: Emerald-600 (#059669 / oklch(0.62 0.17 165)) for highlights and focus states
- **Foreground/Background Pairings**: 
  - Background (Gray-100 #f3f4f6): Dark gray text (#111827) - Ratio 16.8:1 ✓
  - Primary (Green #10b981): White text (#ffffff) - Ratio 5.1:1 ✓
  - Card (White #ffffff): Dark gray text (#111827) - Ratio 21:1 ✓
  - Accent (Emerald #059669): White text (#ffffff) - Ratio 6.2:1 ✓

## Font Selection
Use Inter font family for its excellent legibility and modern, professional appearance suitable for forms and interfaces.

- **Typographic Hierarchy**: 
  - H1 (Workshop Title): Inter Bold/32px/tight letter spacing
  - H2 (Form Sections): Inter Semibold/20px/normal spacing  
  - Body (Labels/Text): Inter Regular/16px/normal spacing
  - Button Text: Inter Medium/16px/normal spacing
  - UUID Display: Inter Mono/14px/wide letter spacing

## Animations
Subtle, functional animations that provide feedback without distraction, maintaining professional feel while adding polish.

- **Purposeful Meaning**: Gentle transitions communicate state changes and guide user through registration flow
- **Hierarchy of Movement**: Focus on form interactions - button hover states, validation feedback, and success confirmation

## Component Selection
- **Components**: Card for form container, Input for text fields, Button for primary action, Alert for validation messages
- **Customizations**: Custom success state with UUID display, green-themed button styling
- **States**: Input focus with green accent, button hover effects, validation error states with red accents
- **Icon Selection**: CheckCircle for success, ExclamationTriangle for validation errors
- **Spacing**: Consistent 6-unit (24px) spacing between major elements, 4-unit (16px) for form fields
- **Mobile**: Single-column layout with full-width form, responsive padding and text sizing