## Fix Console Errors - Placeholder Images & Chunk Loading

### Issues
1. **DNS errors for placeholder images** - `via.placeholder.com` service failing
2. **Missing local placeholder image** - `/assets/placeholder.jpg` doesn't exist
3. **Next.js chunk loading errors** - Turbopack build issue
4. **Articles page navigation errors**

### Solutions

#### 1. Create Local Placeholder Image
- Create a simple placeholder image at `frontend/public/assets/placeholder.jpg`
- Use a gradient or solid color design matching the tech theme
- This will serve as fallback when no cover image exists

#### 2. Update Backend Seed Data (Optional)
- Replace external `via.placeholder.com` URLs in `seed_test_data.py` with local placeholder references
- Or use data URIs/embedded SVG placeholders
- This prevents DNS issues in future test data

#### 3. Restart Frontend Dev Server
- Stop and restart the Next.js dev server to clear Turbopack cache
- This should resolve chunk loading errors
- Use: `npm run dev` in frontend directory

#### 4. Verify API Connectivity
- Ensure backend server is running on port 8989
- Check that API endpoints return proper responses
- Test `/articles` endpoint specifically

### Implementation Order
1. Create local placeholder image
2. Update seed data (optional but recommended)
3. Restart dev servers (frontend & backend if needed)