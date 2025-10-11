# Language Switching - Testing Guide

## Quick Start

1. **Start the development server**:
```bash
npm run dev
```

2. **Access the application**:
- The root URL will automatically redirect to the default language (English)
- Visit: `http://localhost:3000`
- You'll be redirected to: `http://localhost:3000/en`

## Testing Language Switching

### Via UI
1. Navigate to any page in the application
2. Look for the **language switcher icon** (🌐) in the top navigation bar
3. Click the icon to open the language dropdown
4. Select any of the 20 available languages
5. The page will reload with the selected language

### Via URL
You can directly access any language by changing the URL:

- English: `http://localhost:3000/en/dashboard`
- Spanish: `http://localhost:3000/es/dashboard`
- Chinese: `http://localhost:3000/zh/dashboard`
- Hindi: `http://localhost:3000/hi/dashboard`
- French: `http://localhost:3000/fr/dashboard`
- Arabic: `http://localhost:3000/ar/dashboard`
- Bengali: `http://localhost:3000/bn/dashboard`
- Russian: `http://localhost:3000/ru/dashboard`
- Portuguese: `http://localhost:3000/pt/dashboard`
- Indonesian: `http://localhost:3000/id/dashboard`
- Urdu: `http://localhost:3000/ur/dashboard`
- German: `http://localhost:3000/de/dashboard`
- Japanese: `http://localhost:3000/ja/dashboard`
- Swahili: `http://localhost:3000/sw/dashboard`
- Marathi: `http://localhost:3000/mr/dashboard`
- Telugu: `http://localhost:3000/te/dashboard`
- Turkish: `http://localhost:3000/tr/dashboard`
- Tamil: `http://localhost:3000/ta/dashboard`
- Vietnamese: `http://localhost:3000/vi/dashboard`
- Korean: `http://localhost:3000/ko/dashboard`

## What to Check

### ✅ Top Navigation Bar
The following elements should be translated:
- Search bar placeholder text
- "New" button
- Create dropdown (Task, Project, Doc, List View, Workspace)
- Status indicators (Synced/Offline)
- Focus mode tooltip
- Upgrade button
- Notifications label
- User menu items (Profile, Settings, Keyboard shortcuts, Billing, Team, Invite users, Log out)

### ✅ Language Switcher
- Located next to the theme toggle in the top bar
- Shows a globe/languages icon (🌐)
- Displays all 20 languages with native names
- Currently selected language is highlighted
- Clicking a language switches the entire UI

### ✅ RTL Languages (Arabic & Urdu)
For Arabic (`/ar`) and Urdu (`/ur`):
- Text should display correctly in native script
- Layout should remain functional (full RTL support requires additional CSS)

### ✅ Navigation Persistence
- Switching languages maintains your current page
- Example: `/en/dashboard` → `/es/dashboard`
- All query parameters and state are preserved

## Testing Checklist

- [ ] Root URL redirects to `/en` (default language)
- [ ] Language switcher appears in top navigation
- [ ] Clicking language switcher shows all 20 languages
- [ ] Languages display with both native and English names
- [ ] Currently selected language is visually highlighted
- [ ] Switching language updates URL with new locale code
- [ ] All top bar text updates to selected language
- [ ] Page functionality remains intact after language switch
- [ ] Direct URL access with locale code works (e.g., `/fr/dashboard`)
- [ ] Invalid locale codes show 404 (e.g., `/invalid/dashboard`)

## Common Issues & Solutions

### Issue: Middleware or routing errors
**Solution**: 
```bash
# Clear Next.js cache and rebuild
rm -rf .next
npm run dev
```

### Issue: Translations not loading
**Solution**: 
- Verify the translation file exists: `src/i18n/messages/{locale}.json`
- Check JSON syntax is valid
- Restart the dev server

### Issue: Language switcher not visible
**Solution**: 
- Ensure you're on a page that includes the TopBar component
- Check that the dashboard layout is being used
- Verify the component import is correct

### Issue: Build errors with next-intl
**Solution**: 
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## API Routes

**Important**: API routes (under `/api/`) are NOT localized and remain accessible without a locale prefix:
- ✅ Correct: `http://localhost:3000/api/tasks`
- ❌ Incorrect: `http://localhost:3000/en/api/tasks`

## Browser Testing

Test in multiple browsers to ensure compatibility:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on macOS)
- [ ] Mobile browsers (Chrome Mobile, Safari Mobile)

## Deployment Notes

When deploying to production:

1. **Build the application**:
```bash
npm run build
```

2. **Test the production build locally**:
```bash
npm run start
```

3. **Verify all languages work** in production mode

4. **Check bundle sizes** - each language adds ~2-3KB

## Performance Testing

Monitor performance with language switching:
- Initial page load time
- Language switch transition time
- Memory usage with multiple language switches
- Network requests (should only load active language)

## Accessibility Testing

- [ ] Screen readers announce language changes
- [ ] Keyboard navigation works in language switcher
- [ ] Color contrast meets WCAG standards in all languages
- [ ] Focus indicators are visible

## Next Steps

After verifying the basic implementation:

1. **Add more translation keys** as you build new features
2. **Test with real users** who speak these languages
3. **Gather feedback** on translation quality
4. **Consider professional translation** for production use
5. **Add analytics** to track language usage
6. **Implement language preference** persistence in user settings

## Support

For issues or questions:
1. Check `LANGUAGE_SWITCHING.md` for detailed documentation
2. Review next-intl documentation: https://next-intl-docs.vercel.app/
3. Check the browser console for error messages
