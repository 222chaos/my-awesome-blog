from app.crud.user import (
    get_user, get_user_by_username, get_user_by_email, get_users,
    create_user, update_user, delete_user, authenticate_user,
    get_password_hash, verify_password
)

from app.crud.article import (
    get_article, get_article_by_slug, get_articles,
    create_article, update_article, delete_article,
    increment_view_count
)

from app.crud.comment import (
    get_comment, get_comments_by_article, get_comments_by_author,
    get_replies, create_comment, update_comment, delete_comment,
    approve_comment
)