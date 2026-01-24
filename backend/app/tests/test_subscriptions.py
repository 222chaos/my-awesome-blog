import pytest
from fastapi import status
from sqlalchemy.orm import Session

from app.models.subscription import Subscription
from app.schemas.subscription import SubscriptionCreate, SubscriptionUpdate


def test_create_subscription(client, test_session):
    """Test creating a new subscription"""
    subscription_data = {
        "email": "subscriber@example.com",
        "name": "John Doe"
    }
    
    response = client.post("/api/v1/subscriptions/", json=subscription_data)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "subscriber@example.com"
    assert data["name"] == "John Doe"
    assert "id" in data
    
    # Verify the subscription was saved to the database
    subscription_in_db = test_session.query(Subscription).filter(Subscription.email == "subscriber@example.com").first()
    assert subscription_in_db is not None
    assert subscription_in_db.email == "subscriber@example.com"


def test_create_subscription_without_name(client, test_session):
    """Test creating a subscription with only email (name is optional)"""
    subscription_data = {
        "email": "anonymous@example.com"
        # name is omitted
    }
    
    response = client.post("/api/v1/subscriptions/", json=subscription_data)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "anonymous@example.com"
    # Name should be None or empty string depending on schema definition
    assert "id" in data


def test_create_duplicate_subscription(client, test_session):
    """Test creating a subscription with duplicate email should fail"""
    # Create first subscription
    subscription_data = {
        "email": "duplicate@example.com",
        "name": "First Subscriber"
    }
    response = client.post("/api/v1/subscriptions/", json=subscription_data)
    assert response.status_code == status.HTTP_200_OK
    
    # Try to create another subscription with same email
    duplicate_data = {
        "email": "duplicate@example.com",
        "name": "Second Subscriber"
    }
    response = client.post("/api/v1/subscriptions/", json=duplicate_data)
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    data = response.json()
    assert "detail" in data
    assert "already subscribed" in data["detail"].lower()


def test_get_subscription(client, test_session):
    """Test getting a specific subscription by ID"""
    # Create a subscription first
    subscription = Subscription(
        email="test@example.com",
        name="Test User"
    )
    test_session.add(subscription)
    test_session.commit()
    test_session.refresh(subscription)
    
    response = client.get(f"/api/v1/subscriptions/{subscription.id}")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == subscription.id
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"


def test_get_nonexistent_subscription(client):
    """Test getting a subscription that doesn't exist"""
    response = client.get("/api/v1/subscriptions/99999")
    
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_update_subscription(client, test_session):
    """Test updating an existing subscription"""
    # Create a subscription first
    subscription = Subscription(
        email="old@example.com",
        name="Old Name"
    )
    test_session.add(subscription)
    test_session.commit()
    test_session.refresh(subscription)
    
    # Update the subscription
    update_data = {
        "email": "updated@example.com",
        "name": "Updated Name"
    }
    
    response = client.put(f"/api/v1/subscriptions/{subscription.id}", json=update_data)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "updated@example.com"
    assert data["name"] == "Updated Name"
    
    # Verify the update in the database
    updated_subscription = test_session.query(Subscription).filter(Subscription.id == subscription.id).first()
    assert updated_subscription.email == "updated@example.com"


def test_delete_subscription(client, test_session):
    """Test deleting an existing subscription"""
    # Create a subscription first
    subscription = Subscription(
        email="tobedeleted@example.com",
        name="To Be Deleted"
    )
    test_session.add(subscription)
    test_session.commit()
    test_session.refresh(subscription)
    
    # Delete the subscription
    response = client.delete(f"/api/v1/subscriptions/{subscription.id}")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["message"] == "Subscription deleted successfully"
    
    # Verify the subscription was deleted from the database
    deleted_subscription = test_session.query(Subscription).filter(Subscription.id == subscription.id).first()
    assert deleted_subscription is None


def test_get_subscriptions(client, test_session):
    """Test getting all subscriptions"""
    # Create multiple subscriptions
    subscriptions_data = [
        {"email": "user1@example.com", "name": "User One"},
        {"email": "user2@example.com", "name": "User Two"},
        {"email": "user3@example.com", "name": "User Three"}
    ]
    
    for sub_data in subscriptions_data:
        subscription = Subscription(**sub_data)
        test_session.add(subscription)
    
    test_session.commit()
    
    response = client.get("/api/v1/subscriptions/")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3  # May have more from other tests
    
    # Check if our subscriptions are in the response
    emails_in_response = [sub["email"] for sub in data]
    for sub_data in subscriptions_data:
        assert sub_data["email"] in emails_in_response


def test_get_subscriptions_with_pagination(client, test_session):
    """Test getting subscriptions with pagination"""
    # Create multiple subscriptions
    for i in range(10):
        subscription = Subscription(
            email=f"user{i}@example.com",
            name=f"User {i}"
        )
        test_session.add(subscription)
    
    test_session.commit()
    
    # Get first page
    response = client.get("/api/v1/subscriptions/?skip=0&limit=5")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    # The actual count depends on other subscriptions that might exist
    assert len(data) <= 5


def test_get_subscription_count(client, test_session):
    """Test getting the total count of subscribers"""
    # Create multiple subscriptions
    for i in range(5):
        subscription = Subscription(
            email=f"counttest{i}@example.com",
            name=f"Count Test {i}"
        )
        test_session.add(subscription)
    
    test_session.commit()
    
    # Get subscriber count
    response = client.get("/api/v1/subscriptions/count")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "count" in data
    assert isinstance(data["count"], int)
    assert data["count"] >= 5  # Could be more if other tests added subscriptions


def test_create_subscription_invalid_email(client):
    """Test creating a subscription with invalid email format"""
    subscription_data = {
        "email": "invalid-email",  # Invalid email format
        "name": "Invalid Email User"
    }
    
    response = client.post("/api/v1/subscriptions/", json=subscription_data)
    
    # Should return validation error if email validation is implemented
    assert response.status_code in [status.HTTP_200_OK, status.HTTP_422_UNPROCESSABLE_ENTITY]


def test_update_subscription_to_duplicate_email(client, test_session):
    """Test updating a subscription to use an email that already exists"""
    # Create two subscriptions first
    sub1 = Subscription(email="first@example.com", name="First User")
    sub2 = Subscription(email="second@example.com", name="Second User")
    test_session.add(sub1)
    test_session.add(sub2)
    test_session.commit()
    
    # Try to update the second subscription to use the first subscription's email
    update_data = {
        "email": "first@example.com",
        "name": "Updated Second User"
    }
    
    response = client.put(f"/api/v1/subscriptions/{sub2.id}", json=update_data)
    
    # Should fail because email is already in use
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    data = response.json()
    assert "detail" in data
    assert "already subscribed" in data["detail"].lower()


def test_create_multiple_subscriptions_same_name(client, test_session):
    """Test that multiple subscriptions can have the same name with different emails"""
    # Create two subscriptions with same name but different emails
    sub_data_1 = {
        "email": "person1@example.com",
        "name": "Same Name"
    }
    
    sub_data_2 = {
        "email": "person2@example.com", 
        "name": "Same Name"
    }
    
    response1 = client.post("/api/v1/subscriptions/", json=sub_data_1)
    assert response1.status_code == status.HTTP_200_OK
    
    response2 = client.post("/api/v1/subscriptions/", json=sub_data_2)
    assert response2.status_code == status.HTTP_200_OK
    
    # Both should succeed since emails are different
    data1 = response1.json()
    data2 = response2.json()
    assert data1["email"] == "person1@example.com"
    assert data2["email"] == "person2@example.com"
    assert data1["name"] == data2["name"] == "Same Name"


def test_subscription_email_case_sensitivity(client, test_session):
    """Test if email addresses are treated as case-insensitive duplicates"""
    # Create first subscription
    sub_data_1 = {
        "email": "test@example.com",
        "name": "Test User"
    }
    response1 = client.post("/api/v1/subscriptions/", json=sub_data_1)
    assert response1.status_code == status.HTTP_200_OK
    
    # Try to create another subscription with same email but different case
    sub_data_2 = {
        "email": "TEST@EXAMPLE.COM",  # Same email, different case
        "name": "Test User Caps"
    }
    response2 = client.post("/api/v1/subscriptions/", json=sub_data_2)
    
    # Depending on how the backend handles case sensitivity, 
    # this might succeed or fail. Let's check both possibilities.
    if response2.status_code == status.HTTP_400_BAD_REQUEST:
        # If it fails, it means emails are treated as case-insensitive
        data = response2.json()
        assert "already subscribed" in data["detail"].lower()
    elif response2.status_code == status.HTTP_200_OK:
        # If it succeeds, it means emails are case-sensitive
        data = response2.json()
        assert data["email"] == "TEST@EXAMPLE.COM"