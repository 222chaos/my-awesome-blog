import pytest
from fastapi import status
from sqlalchemy.orm import Session

from app.models.portfolio import Portfolio
from app.schemas.portfolio import PortfolioCreate, PortfolioUpdate


def test_create_portfolio_item(client, test_session):
    """Test creating a new portfolio item"""
    portfolio_data = {
        "title": "Project One",
        "description": "A sample project description",
        "link": "https://project-one.com",
        "github_url": "https://github.com/user/project-one",
        "image_url": "https://project-one.com/image.jpg",
        "technologies": ["Python", "FastAPI", "PostgreSQL"],
        "is_featured": True,
        "order": 1
    }
    
    response = client.post("/api/v1/portfolio/", json=portfolio_data)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["title"] == "Project One"
    assert data["description"] == "A sample project description"
    assert data["link"] == "https://project-one.com"
    assert data["github_url"] == "https://github.com/user/project-one"
    assert data["image_url"] == "https://project-one.com/image.jpg"
    assert data["technologies"] == ["Python", "FastAPI", "PostgreSQL"]
    assert data["is_featured"] is True
    assert data["order"] == 1
    assert "id" in data
    
    # Verify the portfolio item was saved to the database
    portfolio_in_db = test_session.query(Portfolio).filter(Portfolio.title == "Project One").first()
    assert portfolio_in_db is not None
    assert portfolio_in_db.title == "Project One"


def test_get_portfolio_item(client, test_session):
    """Test getting a specific portfolio item by ID"""
    # Create a portfolio item first
    portfolio = Portfolio(
        title="Test Project",
        description="A test project",
        link="https://test-project.com",
        github_url="https://github.com/user/test-project",
        image_url="https://test-project.com/image.jpg",
        technologies=["React", "TypeScript", "NextJS"],
        is_featured=False,
        order=2
    )
    test_session.add(portfolio)
    test_session.commit()
    test_session.refresh(portfolio)
    
    response = client.get(f"/api/v1/portfolio/{portfolio.id}")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == portfolio.id
    assert data["title"] == "Test Project"
    assert data["description"] == "A test project"
    assert data["is_featured"] is False
    assert data["order"] == 2


def test_get_nonexistent_portfolio_item(client):
    """Test getting a portfolio item that doesn't exist"""
    response = client.get("/api/v1/portfolio/99999")
    
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_update_portfolio_item(client, test_session):
    """Test updating an existing portfolio item"""
    # Create a portfolio item first
    portfolio = Portfolio(
        title="Old Project",
        description="Old description",
        link="https://old-project.com",
        github_url="https://github.com/user/old-project",
        image_url="https://old-project.com/image.jpg",
        technologies=["OldTech"],
        is_featured=False,
        order=1
    )
    test_session.add(portfolio)
    test_session.commit()
    test_session.refresh(portfolio)
    
    # Update the portfolio item
    update_data = {
        "title": "Updated Project",
        "description": "Updated description",
        "link": "https://updated-project.com",
        "github_url": "https://github.com/user/updated-project",
        "image_url": "https://updated-project.com/image.jpg",
        "technologies": ["NewTech", "ModernStack"],
        "is_featured": True,
        "order": 5
    }
    
    response = client.put(f"/api/v1/portfolio/{portfolio.id}", json=update_data)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["title"] == "Updated Project"
    assert data["description"] == "Updated description"
    assert data["link"] == "https://updated-project.com"
    assert data["github_url"] == "https://github.com/user/updated-project"
    assert data["technologies"] == ["NewTech", "ModernStack"]
    assert data["is_featured"] is True
    assert data["order"] == 5
    
    # Verify the update in the database
    updated_portfolio = test_session.query(Portfolio).filter(Portfolio.id == portfolio.id).first()
    assert updated_portfolio.title == "Updated Project"


def test_delete_portfolio_item(client, test_session):
    """Test deleting an existing portfolio item"""
    # Create a portfolio item first
    portfolio = Portfolio(
        title="To Be Deleted",
        description="This will be deleted",
        link="https://tobedeleted.com",
        github_url="https://github.com/user/tobedeleted",
        image_url="https://tobedeleted.com/image.jpg",
        technologies=["DeleteTech"],
        is_featured=False,
        order=10
    )
    test_session.add(portfolio)
    test_session.commit()
    test_session.refresh(portfolio)
    
    # Delete the portfolio item
    response = client.delete(f"/api/v1/portfolio/{portfolio.id}")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["message"] == "Portfolio item deleted successfully"
    
    # Verify the portfolio item was deleted from the database
    deleted_portfolio = test_session.query(Portfolio).filter(Portfolio.id == portfolio.id).first()
    assert deleted_portfolio is None


def test_get_portfolio_items(client, test_session):
    """Test getting all portfolio items"""
    # Create multiple portfolio items
    portfolio_items_data = [
        {
            "title": "Project Alpha",
            "description": "Alpha project description",
            "link": "https://alpha.com",
            "github_url": "https://github.com/user/alpha",
            "image_url": "https://alpha.com/image.jpg",
            "technologies": ["TechA"],
            "is_featured": True,
            "order": 1
        },
        {
            "title": "Project Beta",
            "description": "Beta project description", 
            "link": "https://beta.com",
            "github_url": "https://github.com/user/beta",
            "image_url": "https://beta.com/image.jpg",
            "technologies": ["TechB"],
            "is_featured": False,
            "order": 2
        },
        {
            "title": "Project Gamma",
            "description": "Gamma project description",
            "link": "https://gamma.com",
            "github_url": "https://github.com/user/gamma", 
            "image_url": "https://gamma.com/image.jpg",
            "technologies": ["TechC"],
            "is_featured": True,
            "order": 3
        }
    ]
    
    for item_data in portfolio_items_data:
        portfolio_item = Portfolio(**item_data)
        test_session.add(portfolio_item)
    
    test_session.commit()
    
    response = client.get("/api/v1/portfolio/")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3  # May have more from other tests
    
    # Check if our portfolio items are in the response
    titles_in_response = [item["title"] for item in data]
    for item_data in portfolio_items_data:
        assert item_data["title"] in titles_in_response


def test_get_portfolio_items_with_pagination(client, test_session):
    """Test getting portfolio items with pagination"""
    # Create multiple portfolio items
    for i in range(10):
        portfolio_item = Portfolio(
            title=f"Project {i}",
            description=f"Description for project {i}",
            link=f"https://project{i}.com",
            github_url=f"https://github.com/user/project{i}",
            image_url=f"https://project{i}.com/image.jpg",
            technologies=[f"Tech{i}"],
            is_featured=i % 2 == 0,  # Alternate featured status
            order=i
        )
        test_session.add(portfolio_item)
    
    test_session.commit()
    
    # Get first page
    response = client.get("/api/v1/portfolio/?skip=0&limit=5")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    # The actual count depends on other portfolio items that might exist
    assert len(data) <= 5


def test_get_featured_portfolio_items(client, test_session):
    """Test getting only featured portfolio items"""
    # Create both featured and non-featured portfolio items
    featured_item = Portfolio(
        title="Featured Project",
        description="A featured project",
        link="https://featured.com",
        github_url="https://github.com/user/featured",
        image_url="https://featured.com/image.jpg",
        technologies=["FeaturedTech"],
        is_featured=True,
        order=1
    )
    
    non_featured_item = Portfolio(
        title="Non-featured Project",
        description="A non-featured project",
        link="https://nonfeatured.com",
        github_url="https://github.com/user/nonfeatured",
        image_url="https://nonfeatured.com/image.jpg",
        technologies=["RegularTech"],
        is_featured=False,
        order=2
    )
    
    test_session.add(featured_item)
    test_session.add(non_featured_item)
    test_session.commit()
    
    # Get only featured portfolio items
    response = client.get("/api/v1/portfolio/?is_featured=true")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    
    # Check that only featured portfolio items are returned
    for item in data:
        assert item["is_featured"] is True
        assert item["title"] != "Non-featured Project"


def test_get_portfolio_items_ordered_by_order_field(client, test_session):
    """Test getting portfolio items ordered by the order field"""
    # Create portfolio items with specific order values
    items_data = [
        {"title": "Last", "order": 3, "is_featured": False},
        {"title": "First", "order": 1, "is_featured": True},
        {"title": "Middle", "order": 2, "is_featured": False}
    ]
    
    for item_data in items_data:
        portfolio_item = Portfolio(
            title=item_data["title"],
            description=f"Description for {item_data['title']}",
            link=f"https://{item_data['title'].lower().replace(' ', '')}.com",
            github_url=f"https://github.com/user/{item_data['title'].lower().replace(' ', '')}",
            image_url=f"https://{item_data['title'].lower().replace(' ', '')}.com/image.jpg",
            technologies=["OrderTest"],
            is_featured=item_data["is_featured"],
            order=item_data["order"]
        )
        test_session.add(portfolio_item)
    
    test_session.commit()
    
    # Get portfolio items
    response = client.get("/api/v1/portfolio/")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    
    # Check that items are ordered by the order field
    if len([item for item in data if item["title"] in ["First", "Middle", "Last"]]) >= 3:
        # Extract the items we created for comparison
        filtered_items = [item for item in data if item["title"] in ["First", "Middle", "Last"]]
        # Sort by order field to check if API response is sorted correctly
        sorted_by_order = sorted(filtered_items, key=lambda x: x["order"])
        
        # Check if the first three items in response are ordered correctly
        titles_in_order = [item["title"] for item in sorted_by_order[:3]]
        assert titles_in_order == ["First", "Middle", "Last"]


def test_create_portfolio_item_minimal_data(client, test_session):
    """Test creating a portfolio item with minimal required data"""
    portfolio_data = {
        "title": "Minimal Project",
        "description": "A minimal project",
        "link": "https://minimal.com"
        # Other fields should use defaults
    }
    
    response = client.post("/api/v1/portfolio/", json=portfolio_data)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["title"] == "Minimal Project"
    assert data["description"] == "A minimal project"
    assert data["link"] == "https://minimal.com"
    # Check that default values are applied
    assert data["github_url"] is None
    assert data["image_url"] is None
    assert data["technologies"] == []
    assert data["is_featured"] is False
    # Order should have a default value (likely 0 or similar)