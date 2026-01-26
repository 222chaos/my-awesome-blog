from app.crud.user import (
    get_user, get_user_by_username, get_user_by_email, get_users,
    create_user, update_user, delete_user, authenticate_user,
    get_password_hash, verify_password, get_authors_with_article_count
)

from app.crud.article import (
    get_article, get_article_by_slug, get_articles,
    create_article, update_article, delete_article,
    increment_view_count, get_featured_articles, get_related_articles,
    get_articles_with_categories_and_tags, get_popular_articles
)

from app.crud.comment import (
    get_comment, get_comments_by_article, get_comments_by_author,
    get_replies, create_comment, update_comment, delete_comment,
    approve_comment
)

from app.crud.category import (
    get_category, get_category_by_slug, get_category_by_name, get_categories,
    create_category, update_category, delete_category,
    get_categories_with_article_count
)

from app.crud.tag import (
    get_tag, get_tag_by_slug, get_tag_by_name, get_tags,
    create_tag, update_tag, delete_tag,
    get_tags_with_article_count
)

from app.crud.friend_link import (
    get_friend_link, get_friend_links, create_friend_link,
    update_friend_link, delete_friend_link
)

from app.crud.portfolio import (
    get_portfolio, get_portfolios, create_portfolio,
    update_portfolio, delete_portfolio
)

from app.crud.timeline_event import (
    get_timeline_event, get_timeline_events, create_timeline_event,
    update_timeline_event, delete_timeline_event
)

from app.crud.subscription import (
    get_subscription, get_subscriptions, create_subscription,
    update_subscription, delete_subscription, get_subscribers_count
)

from app.crud.image import (
    get_image, get_images, create_image,
    update_image, delete_image
)

from app.crud.typewriter_content import (
    get_typewriter_content,
    get_typewriter_contents,
    get_active_typewriter_contents,
    create_typewriter_content,
    update_typewriter_content,
    delete_typewriter_content,
    deactivate_typewriter_content,
)

