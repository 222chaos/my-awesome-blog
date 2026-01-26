from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, users, articles, comments, typewriter_contents,
    categories, tags, friend_links, portfolio, timeline_events,
    statistics, subscriptions, images
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(articles.router, prefix="/articles", tags=["articles"])
api_router.include_router(comments.router, prefix="/comments", tags=["comments"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(tags.router, prefix="/tags", tags=["tags"])
api_router.include_router(friend_links.router, prefix="/friend-links", tags=["friend-links"])
api_router.include_router(portfolio.router, prefix="/portfolio", tags=["portfolio"])
api_router.include_router(timeline_events.router, prefix="/timeline-events", tags=["timeline-events"])
api_router.include_router(statistics.router, prefix="/stats", tags=["statistics"])
api_router.include_router(subscriptions.router, prefix="/subscriptions", tags=["subscriptions"])
api_router.include_router(images.router, prefix="/images", tags=["images"])
api_router.include_router(typewriter_contents.router, prefix="/typewriter-contents", tags=["typewriter-contents"])