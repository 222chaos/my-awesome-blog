# My Awesome Blog API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Categories API](#categories-api)
4. [Tags API](#tags-api)
5. [Articles API](#articles-api)
6. [Statistics API](#statistics-api)
7. [Friend Links API](#friend-links-api)
8. [Portfolio API](#portfolio-api)
9. [Timeline Events API](#timeline-events-api)
10. [Subscriptions API](#subscriptions-api)
11. [Images API](#images-api)

## Overview

This API provides endpoints for managing a blog platform with advanced features including categorization, tagging, portfolio display, timeline events, and more. All endpoints follow RESTful principles and return JSON responses.

Base URL: `/api/v1/`

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer {jwt_token}
```

## Categories API

### Create Category
- **POST** `/categories/`
- **Description**: Create a new category
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "string (required)",
  "slug": "string (required)",
  "description": "string (optional)"
}
```
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "name": "string",
  "slug": "string",
  "description": "string",
  "created_at": "datetime"
}
```
- **Error Responses**:
  - `400 Bad Request` - Validation error
  - `401 Unauthorized` - Not authenticated
  - `409 Conflict` - Category with same slug already exists

### Get Category by ID
- **GET** `/categories/{category_id}`
- **Description**: Get a specific category by its ID
- **Parameters**:
  - `category_id` (path parameter): Category ID
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "name": "string",
  "slug": "string",
  "description": "string",
  "created_at": "datetime"
}
```
- **Error Responses**:
  - `404 Not Found` - Category not found

### Get Category by Name
- **GET** `/categories/name/{category_name}`
- **Description**: Get a specific category by its name
- **Parameters**:
  - `category_name` (path parameter): Category name
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "name": "string",
  "slug": "string",
  "description": "string",
  "created_at": "datetime"
}
```
- **Error Responses**:
  - `404 Not Found` - Category not found

### Update Category
- **PUT** `/categories/{category_id}`
- **Description**: Update an existing category
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- **Parameters**:
  - `category_id` (path parameter): Category ID
- **Request Body**:
```json
{
  "name": "string (optional)",
  "slug": "string (optional)",
  "description": "string (optional)"
}
```
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "name": "string",
  "slug": "string",
  "description": "string",
  "updated_at": "datetime"
}
```
- **Error Responses**:
  - `400 Bad Request` - Validation error
  - `401 Unauthorized` - Not authenticated
  - `404 Not Found` - Category not found
  - `409 Conflict` - Category with same slug already exists

### Delete Category
- **DELETE** `/categories/{category_id}`
- **Description**: Delete a category
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
- **Parameters**:
  - `category_id` (path parameter): Category ID
- **Response**: `200 OK`
```json
{
  "message": "Category deleted successfully"
}
```
- **Error Responses**:
  - `401 Unauthorized` - Not authenticated
  - `404 Not Found` - Category not found

### Get All Categories
- **GET** `/categories/`
- **Description**: Get all categories with optional pagination
- **Query Parameters**:
  - `skip` (optional, integer, default: 0): Number of records to skip
  - `limit` (optional, integer, default: 100): Maximum number of records to return
- **Response**: `200 OK`
```json
[
  {
    "id": "integer",
    "name": "string",
    "slug": "string",
    "description": "string",
    "created_at": "datetime"
  }
]
```

### Get Articles by Category
- **GET** `/categories/{category_id}/articles`
- **Description**: Get all articles belonging to a specific category
- **Parameters**:
  - `category_id` (path parameter): Category ID
  - `skip` (optional, integer, default: 0): Number of records to skip
  - `limit` (optional, integer, default: 100): Maximum number of records to return
  - `published_only` (optional, boolean, default: true): Whether to return only published articles
- **Response**: `200 OK`
```json
[
  {
    "id": "integer",
    "title": "string",
    "slug": "string",
    "content": "string",
    "excerpt": "string",
    "is_published": "boolean",
    "views": "integer",
    "created_at": "datetime",
    "updated_at": "datetime",
    "author": {
      "id": "integer",
      "username": "string",
      "email": "string",
      "full_name": "string"
    },
    "category": {
      "id": "integer",
      "name": "string",
      "slug": "string"
    }
  }
]
```

## Tags API

### Create Tag
- **POST** `/tags/`
- **Description**: Create a new tag
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "string (required)",
  "slug": "string (required)",
  "description": "string (optional)"
}
```
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "name": "string",
  "slug": "string",
  "description": "string",
  "created_at": "datetime"
}
```
- **Error Responses**:
  - `400 Bad Request` - Validation error
  - `401 Unauthorized` - Not authenticated
  - `409 Conflict` - Tag with same slug already exists

### Get Tag by ID
- **GET** `/tags/{tag_id}`
- **Description**: Get a specific tag by its ID
- **Parameters**:
  - `tag_id` (path parameter): Tag ID
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "name": "string",
  "slug": "string",
  "description": "string",
  "created_at": "datetime"
}
```
- **Error Responses**:
  - `404 Not Found` - Tag not found

### Get Tag by Name
- **GET** `/tags/name/{tag_name}`
- **Description**: Get a specific tag by its name
- **Parameters**:
  - `tag_name` (path parameter): Tag name
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "name": "string",
  "slug": "string",
  "description": "string",
  "created_at": "datetime"
}
```
- **Error Responses**:
  - `404 Not Found` - Tag not found

### Update Tag
- **PUT** `/tags/{tag_id}`
- **Description**: Update an existing tag
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- **Parameters**:
  - `tag_id` (path parameter): Tag ID
- **Request Body**:
```json
{
  "name": "string (optional)",
  "slug": "string (optional)",
  "description": "string (optional)"
}
```
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "name": "string",
  "slug": "string",
  "description": "string",
  "updated_at": "datetime"
}
```
- **Error Responses**:
  - `400 Bad Request` - Validation error
  - `401 Unauthorized` - Not authenticated
  - `404 Not Found` - Tag not found
  - `409 Conflict` - Tag with same slug already exists

### Delete Tag
- **DELETE** `/tags/{tag_id}`
- **Description**: Delete a tag
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
- **Parameters**:
  - `tag_id` (path parameter): Tag ID
- **Response**: `200 OK`
```json
{
  "message": "Tag deleted successfully"
}
```
- **Error Responses**:
  - `401 Unauthorized` - Not authenticated
  - `404 Not Found` - Tag not found

### Get All Tags
- **GET** `/tags/`
- **Description**: Get all tags with optional pagination
- **Query Parameters**:
  - `skip` (optional, integer, default: 0): Number of records to skip
  - `limit` (optional, integer, default: 100): Maximum number of records to return
- **Response**: `200 OK`
```json
[
  {
    "id": "integer",
    "name": "string",
    "slug": "string",
    "description": "string",
    "created_at": "datetime"
  }
]
```

### Get Articles by Tag
- **GET** `/tags/{tag_id}/articles`
- **Description**: Get all articles associated with a specific tag
- **Parameters**:
  - `tag_id` (path parameter): Tag ID
  - `skip` (optional, integer, default: 0): Number of records to skip
  - `limit` (optional, integer, default: 100): Maximum number of records to return
  - `published_only` (optional, boolean, default: true): Whether to return only published articles
- **Response**: `200 OK`
```json
[
  {
    "id": "integer",
    "title": "string",
    "slug": "string",
    "content": "string",
    "excerpt": "string",
    "is_published": "boolean",
    "views": "integer",
    "created_at": "datetime",
    "updated_at": "datetime",
    "author": {
      "id": "integer",
      "username": "string",
      "email": "string",
      "full_name": "string"
    },
    "tags": [
      {
        "id": "integer",
        "name": "string",
        "slug": "string"
      }
    ]
  }
]
```

## Articles API

### Get Featured Articles
- **GET** `/articles/featured`
- **Description**: Get featured articles
- **Query Parameters**:
  - `limit` (optional, integer, min: 1, max: 50, default: 10): Number of featured articles to return
- **Response**: `200 OK`
```json
[
  {
    "id": "integer",
    "title": "string",
    "slug": "string",
    "content": "string",
    "excerpt": "string",
    "is_published": "boolean",
    "views": "integer",
    "created_at": "datetime",
    "updated_at": "datetime",
    "author": {
      "id": "integer",
      "username": "string",
      "email": "string",
      "full_name": "string"
    },
    "category": {
      "id": "integer",
      "name": "string",
      "slug": "string"
    }
  }
]
```

### Get Popular Articles
- **GET** `/articles/popular`
- **Description**: Get popular articles sorted by view count
- **Query Parameters**:
  - `limit` (optional, integer, min: 1, max: 50, default: 10): Number of articles to return
- **Response**: `200 OK`
```json
[
  {
    "id": "integer",
    "title": "string",
    "slug": "string",
    "content": "string",
    "excerpt": "string",
    "is_published": "boolean",
    "views": "integer",
    "created_at": "datetime",
    "updated_at": "datetime",
    "author": {
      "id": "integer",
      "username": "string",
      "email": "string",
      "full_name": "string"
    }
  }
]
```

### Get Recommended Articles
- **GET** `/articles/recommended`
- **Description**: Get recommended articles based on various factors
- **Query Parameters**:
  - `limit` (optional, integer, min: 1, max: 50, default: 10): Number of articles to return
- **Response**: `200 OK`
```json
[
  {
    "id": "integer",
    "title": "string",
    "slug": "string",
    "content": "string",
    "excerpt": "string",
    "is_published": "boolean",
    "views": "integer",
    "created_at": "datetime",
    "updated_at": "datetime",
    "author": {
      "id": "integer",
      "username": "string",
      "email": "string",
      "full_name": "string"
    }
  }
]
```

### Search Articles
- **GET** `/articles/search`
- **Description**: Search for articles by keywords
- **Query Parameters**:
  - `q` (required, string): Search query
  - `skip` (optional, integer, default: 0): Number of records to skip
  - `limit` (optional, integer, default: 100): Maximum number of records to return
- **Response**: `200 OK`
```json
[
  {
    "id": "integer",
    "title": "string",
    "slug": "string",
    "content": "string",
    "excerpt": "string",
    "is_published": "boolean",
    "views": "integer",
    "created_at": "datetime",
    "updated_at": "datetime",
    "author": {
      "id": "integer",
      "username": "string",
      "email": "string",
      "full_name": "string"
    }
  }
]
```

## Statistics API

### Get General Statistics
- **GET** `/stats/general`
- **Description**: Get general website statistics
- **Response**: `200 OK`
```json
{
  "total_users": "integer",
  "total_articles": "integer",
  "total_comments": "integer",
  "total_categories": "integer",
  "total_tags": "integer",
  "total_views": "integer",
  "recent_signups": [
    {
      "id": "integer",
      "username": "string",
      "email": "string",
      "created_at": "datetime"
    }
  ],
  "recent_articles": [
    {
      "id": "integer",
      "title": "string",
      "author": "string",
      "created_at": "datetime"
    }
  ]
}
```

### Get Article Statistics
- **GET** `/stats/articles`
- **Description**: Get article-specific statistics
- **Response**: `200 OK`
```json
{
  "total_articles": "integer",
  "published_articles": "integer",
  "draft_articles": "integer",
  "top_viewed_articles": [
    {
      "id": "integer",
      "title": "string",
      "views": "integer",
      "author": "string"
    }
  ],
  "recent_articles": [
    {
      "id": "integer",
      "title": "string",
      "author": "string",
      "created_at": "datetime"
    }
  ],
  "articles_by_category": [
    {
      "category_name": "string",
      "count": "integer"
    }
  ],
  "monthly_article_counts": [
    {
      "month": "string",
      "year": "integer",
      "count": "integer"
    }
  ]
}
```

### Get User Statistics
- **GET** `/stats/users`
- **Description**: Get user-specific statistics
- **Response**: `200 OK`
```json
{
  "total_users": "integer",
  "active_users": "integer",
  "recent_registrations": [
    {
      "id": "integer",
      "username": "string",
      "email": "string",
      "created_at": "datetime"
    }
  ],
  "user_growth": [
    {
      "period": "string",
      "new_users": "integer"
    }
  ]
}
```

## Friend Links API

### Create Friend Link
- **POST** `/friend-links/`
- **Description**: Create a new friend link
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "string (required)",
  "url": "string (required)",
  "description": "string (optional)",
  "email": "string (optional)",
  "is_active": "boolean (optional, default: true)"
}
```
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "name": "string",
  "url": "string",
  "description": "string",
  "email": "string",
  "is_active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```
- **Error Responses**:
  - `400 Bad Request` - Validation error
  - `401 Unauthorized` - Not authenticated

### Get Friend Link by ID
- **GET** `/friend-links/{friend_link_id}`
- **Description**: Get a specific friend link by its ID
- **Parameters**:
  - `friend_link_id` (path parameter): Friend link ID
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "name": "string",
  "url": "string",
  "description": "string",
  "email": "string",
  "is_active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```
- **Error Responses**:
  - `404 Not Found` - Friend link not found

### Update Friend Link
- **PUT** `/friend-links/{friend_link_id}`
- **Description**: Update an existing friend link
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- **Parameters**:
  - `friend_link_id` (path parameter): Friend link ID
- **Request Body**:
```json
{
  "name": "string (optional)",
  "url": "string (optional)",
  "description": "string (optional)",
  "email": "string (optional)",
  "is_active": "boolean (optional)"
}
```
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "name": "string",
  "url": "string",
  "description": "string",
  "email": "string",
  "is_active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```
- **Error Responses**:
  - `400 Bad Request` - Validation error
  - `401 Unauthorized` - Not authenticated
  - `404 Not Found` - Friend link not found

### Delete Friend Link
- **DELETE** `/friend-links/{friend_link_id}`
- **Description**: Delete a friend link
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
- **Parameters**:
  - `friend_link_id` (path parameter): Friend link ID
- **Response**: `200 OK`
```json
{
  "message": "Friend link deleted successfully"
}
```
- **Error Responses**:
  - `401 Unauthorized` - Not authenticated
  - `404 Not Found` - Friend link not found

### Get All Friend Links
- **GET** `/friend-links/`
- **Description**: Get all friend links with optional filtering and pagination
- **Query Parameters**:
  - `skip` (optional, integer, default: 0): Number of records to skip
  - `limit` (optional, integer, default: 100): Maximum number of records to return
  - `is_active` (optional, boolean): Filter by active status
- **Response**: `200 OK`
```json
[
  {
    "id": "integer",
    "name": "string",
    "url": "string",
    "description": "string",
    "email": "string",
    "is_active": "boolean",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
]
```

## Portfolio API

### Create Portfolio Item
- **POST** `/portfolio/`
- **Description**: Create a new portfolio item
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "link": "string (required)",
  "github_url": "string (optional)",
  "image_url": "string (optional)",
  "technologies": "array of strings (optional, default: [])",
  "is_featured": "boolean (optional, default: false)",
  "order": "integer (optional, default: 0)"
}
```
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "title": "string",
  "description": "string",
  "link": "string",
  "github_url": "string",
  "image_url": "string",
  "technologies": "array of strings",
  "is_featured": "boolean",
  "order": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```
- **Error Responses**:
  - `400 Bad Request` - Validation error
  - `401 Unauthorized` - Not authenticated

### Get Portfolio Item by ID
- **GET** `/portfolio/{portfolio_id}`
- **Description**: Get a specific portfolio item by its ID
- **Parameters**:
  - `portfolio_id` (path parameter): Portfolio item ID
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "title": "string",
  "description": "string",
  "link": "string",
  "github_url": "string",
  "image_url": "string",
  "technologies": "array of strings",
  "is_featured": "boolean",
  "order": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```
- **Error Responses**:
  - `404 Not Found` - Portfolio item not found

### Update Portfolio Item
- **PUT** `/portfolio/{portfolio_id}`
- **Description**: Update an existing portfolio item
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- **Parameters**:
  - `portfolio_id` (path parameter): Portfolio item ID
- **Request Body**:
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "link": "string (optional)",
  "github_url": "string (optional)",
  "image_url": "string (optional)",
  "technologies": "array of strings (optional)",
  "is_featured": "boolean (optional)",
  "order": "integer (optional)"
}
```
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "title": "string",
  "description": "string",
  "link": "string",
  "github_url": "string",
  "image_url": "string",
  "technologies": "array of strings",
  "is_featured": "boolean",
  "order": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```
- **Error Responses**:
  - `400 Bad Request` - Validation error
  - `401 Unauthorized` - Not authenticated
  - `404 Not Found` - Portfolio item not found

### Delete Portfolio Item
- **DELETE** `/portfolio/{portfolio_id}`
- **Description**: Delete a portfolio item
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
- **Parameters**:
  - `portfolio_id` (path parameter): Portfolio item ID
- **Response**: `200 OK`
```json
{
  "message": "Portfolio item deleted successfully"
}
```
- **Error Responses**:
  - `401 Unauthorized` - Not authenticated
  - `404 Not Found` - Portfolio item not found

### Get All Portfolio Items
- **GET** `/portfolio/`
- **Description**: Get all portfolio items with optional filtering and pagination
- **Query Parameters**:
  - `skip` (optional, integer, default: 0): Number of records to skip
  - `limit` (optional, integer, default: 100): Maximum number of records to return
  - `is_featured` (optional, boolean): Filter by featured status
- **Response**: `200 OK`
```json
[
  {
    "id": "integer",
    "title": "string",
    "description": "string",
    "link": "string",
    "github_url": "string",
    "image_url": "string",
    "technologies": "array of strings",
    "is_featured": "boolean",
    "order": "integer",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
]
```

## Timeline Events API

### Create Timeline Event
- **POST** `/timeline-events/`
- **Description**: Create a new timeline event
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "title": "string (required)",
  "date": "string (required, ISO format or datetime)",
  "description": "string (optional)",
  "category": "string (optional)",
  "is_highlight": "boolean (optional, default: false)"
}
```
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "title": "string",
  "date": "datetime",
  "description": "string",
  "category": "string",
  "is_highlight": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```
- **Error Responses**:
  - `400 Bad Request` - Validation error
  - `401 Unauthorized` - Not authenticated

### Get Timeline Event by ID
- **GET** `/timeline-events/{timeline_event_id}`
- **Description**: Get a specific timeline event by its ID
- **Parameters**:
  - `timeline_event_id` (path parameter): Timeline event ID
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "title": "string",
  "date": "datetime",
  "description": "string",
  "category": "string",
  "is_highlight": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```
- **Error Responses**:
  - `404 Not Found` - Timeline event not found

### Update Timeline Event
- **PUT** `/timeline-events/{timeline_event_id}`
- **Description**: Update an existing timeline event
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- **Parameters**:
  - `timeline_event_id` (path parameter): Timeline event ID
- **Request Body**:
```json
{
  "title": "string (optional)",
  "date": "string (optional, ISO format or datetime)",
  "description": "string (optional)",
  "category": "string (optional)",
  "is_highlight": "boolean (optional)"
}
```
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "title": "string",
  "date": "datetime",
  "description": "string",
  "category": "string",
  "is_highlight": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```
- **Error Responses**:
  - `400 Bad Request` - Validation error
  - `401 Unauthorized` - Not authenticated
  - `404 Not Found` - Timeline event not found

### Delete Timeline Event
- **DELETE** `/timeline-events/{timeline_event_id}`
- **Description**: Delete a timeline event
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
- **Parameters**:
  - `timeline_event_id` (path parameter): Timeline event ID
- **Response**: `200 OK`
```json
{
  "message": "Timeline event deleted successfully"
}
```
- **Error Responses**:
  - `401 Unauthorized` - Not authenticated
  - `404 Not Found` - Timeline event not found

### Get All Timeline Events
- **GET** `/timeline-events/`
- **Description**: Get all timeline events with optional filtering and pagination
- **Query Parameters**:
  - `skip` (optional, integer, default: 0): Number of records to skip
  - `limit` (optional, integer, default: 100): Maximum number of records to return
  - `category` (optional, string): Filter by category
  - `is_highlight` (optional, boolean): Filter by highlight status
- **Response**: `200 OK`
```json
[
  {
    "id": "integer",
    "title": "string",
    "date": "datetime",
    "description": "string",
    "category": "string",
    "is_highlight": "boolean",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
]
```

## Subscriptions API

### Create Subscription
- **POST** `/subscriptions/`
- **Description**: Create a new subscription
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "string (required)",
  "name": "string (optional)"
}
```
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "email": "string",
  "name": "string",
  "created_at": "datetime"
}
```
- **Error Responses**:
  - `400 Bad Request` - Validation error or email already subscribed
  - `401 Unauthorized` - Not authenticated

### Get Subscription by ID
- **GET** `/subscriptions/{subscription_id}`
- **Description**: Get a specific subscription by its ID
- **Parameters**:
  - `subscription_id` (path parameter): Subscription ID
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "email": "string",
  "name": "string",
  "created_at": "datetime"
}
```
- **Error Responses**:
  - `401 Unauthorized` - Not authenticated
  - `404 Not Found` - Subscription not found

### Update Subscription
- **PUT** `/subscriptions/{subscription_id}`
- **Description**: Update an existing subscription
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- **Parameters**:
  - `subscription_id` (path parameter): Subscription ID
- **Request Body**:
```json
{
  "email": "string (optional)",
  "name": "string (optional)"
}
```
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "email": "string",
  "name": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```
- **Error Responses**:
  - `400 Bad Request` - Validation error or email already subscribed
  - `401 Unauthorized` - Not authenticated
  - `404 Not Found` - Subscription not found

### Delete Subscription
- **DELETE** `/subscriptions/{subscription_id}`
- **Description**: Delete a subscription
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
- **Parameters**:
  - `subscription_id` (path parameter): Subscription ID
- **Response**: `200 OK`
```json
{
  "message": "Subscription deleted successfully"
}
```
- **Error Responses**:
  - `401 Unauthorized` - Not authenticated
  - `404 Not Found` - Subscription not found

### Get All Subscriptions
- **GET** `/subscriptions/`
- **Description**: Get all subscriptions with optional pagination
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
- **Query Parameters**:
  - `skip` (optional, integer, default: 0): Number of records to skip
  - `limit` (optional, integer, default: 100): Maximum number of records to return
- **Response**: `200 OK`
```json
[
  {
    "id": "integer",
    "email": "string",
    "name": "string",
    "created_at": "datetime"
  }
]
```

### Get Subscription Count
- **GET** `/subscriptions/count`
- **Description**: Get the total number of subscriptions
- **Response**: `200 OK`
```json
{
  "count": "integer"
}
```

## Typewriter Contents API

### Get All Typewriter Contents
- **GET** `/typewriter-contents/`
- **Description**: Get all typewriter contents with optional filtering and pagination
- **Query Parameters**:
  - `skip` (optional, integer, default: 0): Number of records to skip
  - `limit` (optional, integer, default: 100, max: 100): Maximum number of records to return
  - `active_only` (optional, boolean, default: true): Only return active contents
- **Response**: `200 OK`
```json
[
  {
    "id": "integer",
    "text": "string",
    "priority": "integer",
    "is_active": "boolean",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
]
```

### Get Active Typewriter Contents
- **GET** `/typewriter-contents/active`
- **Description**: Get all active typewriter contents ordered by priority
- **Response**: `200 OK`
```json
[
  {
    "id": "integer",
    "text": "string",
    "priority": "integer",
    "is_active": "boolean",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
]
```

### Get Typewriter Content by ID
- **GET** `/typewriter-contents/{content_id}`
- **Description**: Get a specific typewriter content by its ID
- **Parameters**:
  - `content_id` (path parameter): Content ID
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "text": "string",
  "priority": "integer",
  "is_active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```
- **Error Responses**:
  - `404 Not Found` - Content not found

### Create Typewriter Content
- **POST** `/typewriter-contents/`
- **Description**: Create a new typewriter content
- **Headers**: 
  - `Authorization: Bearer {jwt_token}` (superuser required)
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "text": "string (required, max: 500 chars)",
  "priority": "integer (optional, default: 0)",
  "is_active": "boolean (optional, default: true)"
}
```
- **Response**: `201 Created`
```json
{
  "id": "integer",
  "text": "string",
  "priority": "integer",
  "is_active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```
- **Error Responses**:
  - `400 Bad Request` - Validation error
  - `401 Unauthorized` - Not authenticated
  - `403 Forbidden` - Superuser access required

### Update Typewriter Content
- **PUT** `/typewriter-contents/{content_id}`
- **Description**: Update an existing typewriter content
- **Headers**: 
  - `Authorization: Bearer {jwt_token}` (superuser required)
  - `Content-Type: application/json`
- **Parameters**:
  - `content_id` (path parameter): Content ID
- **Request Body**:
```json
{
  "text": "string (optional, max: 500 chars)",
  "priority": "integer (optional)",
  "is_active": "boolean (optional)"
}
```
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "text": "string",
  "priority": "integer",
  "is_active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```
- **Error Responses**:
  - `400 Bad Request` - Validation error
  - `401 Unauthorized` - Not authenticated
  - `403 Forbidden` - Superuser access required
  - `404 Not Found` - Content not found

### Delete Typewriter Content
- **DELETE** `/typewriter-contents/{content_id}`
- **Description**: Delete a typewriter content
- **Headers**: 
  - `Authorization: Bearer {jwt_token}` (superuser required)
- **Parameters**:
  - `content_id` (path parameter): Content ID
- **Response**: `204 No Content`
- **Error Responses**:
  - `401 Unauthorized` - Not authenticated
  - `403 Forbidden` - Superuser access required
  - `404 Not Found` - Content not found

### Deactivate Typewriter Content
- **POST** `/typewriter-contents/{content_id}/deactivate`
- **Description**: Soft delete a typewriter content by setting is_active to False
- **Headers**: 
  - `Authorization: Bearer {jwt_token}` (superuser required)
- **Parameters**:
  - `content_id` (path parameter): Content ID
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "text": "string",
  "priority": "integer",
  "is_active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```
- **Error Responses**:
  - `401 Unauthorized` - Not authenticated
  - `403 Forbidden` - Superuser access required
  - `404 Not Found` - Content not found


## Images API

### Upload Image
- **POST** `/images/`
- **Description**: Upload a new image
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
- **Form Data**:
  - `file` (required): Image file (supports JPEG, PNG, GIF, WebP)
  - `title` (optional, string): Image title
  - `description` (optional, string): Image description
  - `alt_text` (optional, string): Alternative text for accessibility
  - `is_featured` (optional, boolean, default: false): Whether this is a featured image
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "filename": "string",
  "filepath": "string",
  "title": "string",
  "description": "string",
  "alt_text": "string",
  "is_featured": "boolean",
  "size": "integer",
  "width": "integer",
  "height": "integer",
  "created_at": "datetime"
}
```
- **Error Responses**:
  - `400 Bad Request` - Validation error or unsupported file type
  - `401 Unauthorized` - Not authenticated
  - `413 Payload Too Large` - File too large

### Get Image by ID
- **GET** `/images/{image_id}`
- **Description**: Get a specific image by its ID
- **Parameters**:
  - `image_id` (path parameter): Image ID
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "filename": "string",
  "filepath": "string",
  "title": "string",
  "description": "string",
  "alt_text": "string",
  "is_featured": "boolean",
  "size": "integer",
  "width": "integer",
  "height": "integer",
  "created_at": "datetime"
}
```
- **Error Responses**:
  - `401 Unauthorized` - Not authenticated
  - `404 Not Found` - Image not found

### Update Image
- **PUT** `/images/{image_id}`
- **Description**: Update an existing image's metadata
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- **Parameters**:
  - `image_id` (path parameter): Image ID
- **Request Body**:
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "alt_text": "string (optional)",
  "is_featured": "boolean (optional)"
}
```
- **Response**: `200 OK`
```json
{
  "id": "integer",
  "filename": "string",
  "filepath": "string",
  "title": "string",
  "description": "string",
  "alt_text": "string",
  "is_featured": "boolean",
  "size": "integer",
  "width": "integer",
  "height": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```
- **Error Responses**:
  - `400 Bad Request` - Validation error
  - `401 Unauthorized` - Not authenticated
  - `404 Not Found` - Image not found

### Delete Image
- **DELETE** `/images/{image_id}`
- **Description**: Delete an image
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
- **Parameters**:
  - `image_id` (path parameter): Image ID
- **Response**: `200 OK`
```json
{
  "message": "Image deleted successfully"
}
```
- **Error Responses**:
  - `401 Unauthorized` - Not authenticated
  - `404 Not Found` - Image not found

### Get All Images
- **GET** `/images/`
- **Description**: Get all images with optional filtering and pagination
- **Headers**: 
  - `Authorization: Bearer {jwt_token}`
- **Query Parameters**:
  - `skip` (optional, integer, default: 0): Number of records to skip
  - `limit` (optional, integer, default: 100): Maximum number of records to return
  - `is_featured` (optional, boolean): Filter by featured status
- **Response**: `200 OK`
```json
[
  {
    "id": "integer",
    "filename": "string",
    "filepath": "string",
    "title": "string",
    "description": "string",
    "alt_text": "string",
    "is_featured": "boolean",
    "size": "integer",
    "width": "integer",
    "height": "integer",
    "created_at": "datetime"
  }
]
```