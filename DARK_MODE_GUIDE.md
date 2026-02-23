# Dark Mode Implementation Guide

## Overview
This hospital management system now has comprehensive dark mode support with consistent styling across all components.

## Features

### 1. **Automatic Theme Detection**
- System preference detection
- Manual theme toggle
- Theme persistence across sessions

### 2. **Consistent Color Palette**
- Background: `#0a0f1e` (dark) / `#ffffff` (light)
- Card Background: `#1e293b` (dark) / `#ffffff` (light)
- Text: `#f1f5f9` (dark) / `#1e293b` (light)
- Borders: `#334155` (dark) / `#e2e8f0` (light)

### 3. **Enhanced Components**
All UI components have been updated with dark mode support:
- Cards and containers
- Forms and inputs
- Tables and data grids
- Modals and dialogs
- Buttons and badges
- Alerts and notifications
- Navigation elements
- Charts and graphs

## Usage

### Using Dark Mode Utilities

```typescript
import {
  getDarkCardBg,
  getDarkText,
  getDarkMutedText,
  getDarkBorder,
  getDarkHoverBg,
  getColorBg,
  getColorText,
  getBadgeStyle,
  getButtonStyle
} from '../utils/darkModeUtils';

// Example: Card with dark mode support
<div className={`${getDarkCardBg()} ${getDarkBorder()} rounded-lg p-4`}>
  <h3 className={getDarkText()}>Title</h3>
  <p className={getDarkMutedText()}>Description</p>
</div>

// Example: Colored background with dark mode
<div className={getColorBg('blue')}>
  <span className={getColorText('blue')}>Blue text</span>
</div>

// Example: Badge with dark mode
<span className={getBadgeStyle('success')}>Success</span>

// Example: Button with dark mode
<button className={getButtonStyle('primary')}>Click me</button>
```

### Manual Dark Mode Classes

You can also use Tailwind's dark mode classes directly:

```tsx
<div className="bg-white dark:bg-slate-900">
  <p className="text-gray-900 dark:text-gray-100">Text</p>
</div>
```

## Theme Configuration

The theme can be configured in `src/services/ThemeService.tsx`:

```typescript
const themeConfigs: Record<Theme, ThemeConfig> = {
  dark: {
    name: 'dark',
    displayName: 'Dark',
    description: 'Elegant dark theme',
    isDark: true,
    colors: {
      primary: '#3b82f6',
      secondary: '#1e293b',
      accent: '#334155',
      background: '#0a0f1e',
      foreground: '#f1f5f9',
      card: '#1e293b',
      border: '#334155',
      muted: '#64748b',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    }
  }
};
```

## CSS Variables

Dark mode uses CSS custom properties for dynamic theming:

```css
.dark {
  --color-background: #0a0f1e;
  --color-foreground: #f1f5f9;
  --color-card: #1e293b;
  --color-border: #334155;
  --color-muted: #64748b;
}
```

## Best Practices

### 1. **Always Use Dark Mode Classes**
```tsx
// ✅ Good
<div className="bg-white dark:bg-slate-900">

// ❌ Bad
<div className="bg-white">
```

### 2. **Use Utility Functions**
```tsx
// ✅ Good
<div className={getDarkCardBg()}>

// ❌ Bad
<div className="bg-white">
```

### 3. **Test Both Themes**
Always test your components in both light and dark modes to ensure proper contrast and readability.

### 4. **Use Semantic Colors**
```tsx
// ✅ Good
<div className={getColorBg('blue')}>

// ❌ Bad
<div className="bg-blue-50">
```

### 5. **Maintain Contrast Ratios**
Ensure text has sufficient contrast against backgrounds:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

## Color Palette

### Primary Colors
- **Blue**: Primary actions, links
- **Green**: Success states, positive actions
- **Red**: Errors, destructive actions
- **Yellow**: Warnings, cautions
- **Purple**: Special features, premium content
- **Orange**: Alerts, important information

### Neutral Colors
- **Gray**: Text, borders, backgrounds
- **Slate**: Dark mode backgrounds

## Accessibility

The dark mode implementation follows WCAG 2.1 Level AA guidelines:
- Sufficient color contrast
- Focus indicators
- Keyboard navigation support
- Screen reader compatibility

## Troubleshooting

### Theme Not Applying
1. Check if `ThemeProvider` wraps your app
2. Verify `dark` class is on `<html>` element
3. Clear browser cache and localStorage

### Inconsistent Colors
1. Use utility functions from `darkModeUtils.ts`
2. Check CSS specificity
3. Ensure Tailwind dark mode is enabled

### Performance Issues
1. Minimize CSS-in-JS usage
2. Use CSS variables for dynamic theming
3. Leverage Tailwind's JIT compiler

## Future Enhancements

- [ ] Custom theme builder
- [ ] Theme presets (medical, corporate, etc.)
- [ ] Per-component theme overrides
- [ ] Automatic contrast adjustment
- [ ] Theme scheduling (auto-switch based on time)

## Support

For issues or questions about dark mode implementation, please refer to:
- Theme Service: `src/services/ThemeService.tsx`
- Dark Mode Utilities: `src/utils/darkModeUtils.ts`
- Global Styles: `src/index.css`


## Recent Improvements (Latest Update)

### Enhanced CSS Coverage
Added comprehensive dark mode CSS rules to ensure consistency across all components:

1. **Automatic Background Conversion**
   - All `bg-white` elements automatically convert to `#1e293b` in dark mode
   - Gray backgrounds (50, 100, 200) properly mapped to dark equivalents
   - Colored backgrounds use transparency for better dark mode appearance

2. **Improved Text Contrast**
   - All gray text colors enhanced for better readability
   - Colored text (red, green, blue, etc.) adjusted for optimal contrast
   - Black text automatically converts to light gray in dark mode

3. **Enhanced Component Styling**
   - Cards: Consistent `#1e293b` background with `#334155` borders
   - Headers: Proper dark backgrounds and borders
   - Forms: Dark input backgrounds with visible borders
   - Shadows: Adjusted opacity for dark mode visibility

4. **Better Hover States**
   - All hover states properly styled for dark mode
   - Consistent hover backgrounds across components
   - Smooth transitions maintained

5. **Focus Indicators**
   - Clear focus outlines using primary color
   - Proper contrast for keyboard navigation
   - Consistent across all interactive elements

### CSS Variable Enhancements
Added comprehensive CSS variables in ThemeService:
- `--sidebar`: Sidebar background color
- `--sidebar-foreground`: Sidebar text color
- `--sidebar-accent`: Sidebar hover/active state
- `--topbar`: Top navigation bar background
- `--popover`: Dropdown and modal backgrounds
- `--input-background`: Form input backgrounds
- `--muted-foreground`: Secondary text color

### Testing Recommendations
1. **Visual Testing**: Check all major screens in dark mode
2. **Contrast Testing**: Use browser DevTools to verify contrast ratios
3. **Interactive Testing**: Test all buttons, forms, and interactive elements
4. **Navigation Testing**: Verify sidebar and navigation styling
5. **Modal Testing**: Check dialogs, dropdowns, and popovers

### Known Limitations
- Print styles force light mode for better printing
- Some third-party components may need additional styling
- Label printer components maintain white backgrounds for printing

### Performance Notes
- CSS variables applied once on theme change
- Minimal runtime overhead with class-based approach
- Theme preference cached in localStorage
- Hot module replacement works seamlessly with theme changes
