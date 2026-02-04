## Fix Articles Page API Error

**Problem**: Frontend sends `category_id` and `tag_id` to `/api/v1/articles/`, but backend endpoint doesn't accept these parameters.

**Solution**: Update backend endpoint to support category and tag filtering:
- Modify `read_articles()` in [backend/app/api/v1/endpoints/articles.py](e:\project\my-awesome-blog\backend\app\api\v1\endpoints\articles.py)
- Add `category_id` and `tag_id` query parameters
- Pass these to `crud.get_articles_with_categories_and_tags()`

## Fix Albums Page API Error

**Problem**: Backend portfolio endpoint returns incompatible data structure for the frontend Album type.

**Solution 1** (Recommended): Create dedicated albums endpoint in backend:
- Create new endpoint `/api/v1/albums` that returns Album-compatible data
- Transform portfolio data to include coverImage (featured_image), date (created_at), images count

**Solution 2** (Alternative): Transform data in frontend API route:
- Modify [frontend/src/app/api/albums/route.ts](e:\project\my-awesome-blog\frontend\src\app\api\albums\route.ts)
- Map Portfolio fields to Album fields (title→title, featured_image→coverImage, created_at→date)

## Implementation Steps

1. Update [backend/app/api/v1/endpoints/articles.py](e:\project\my-awesome-blog\backend\app\api\v1\endpoints\articles.py):
   - Add `category_id` and `tag_id` parameters to `read_articles()`
   - Pass these to CRUD function

2. Create [backend/app/api/v1/endpoints/albums.py](e:\project\my-awesome-blog\backend\app\api\v1\endpoints\albums.py):
   - New endpoint `/api/v1/albums` that transforms portfolio data
   - Returns Album-compatible JSON structure

3. Register albums router in [backend/app/api/v1/router.py](e:\project\my-awesome-blog\backend\app\api\v1\router.py)

4. Update [frontend/src/app/api/albums/route.ts](e:\project\my-awesome-blog\frontend\src\app\api\albums\route.ts):
   - Change endpoint from `/portfolios` to `/albums`
   - Remove data transformation (backend now handles it)