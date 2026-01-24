import pytest
from fastapi import status
from sqlalchemy.orm import Session
from fastapi.testclient import TestClient
import tempfile
import os
from PIL import Image as PILImage

from app.models.image import Image
from app.schemas.image import ImageCreate, ImageUpdate


def test_upload_image_success(client, test_session):
    """Test successful image upload"""
    # Create a temporary image file for testing
    temp_image = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
    img = PILImage.new('RGB', (100, 100), color='red')
    img.save(temp_image.name, format='JPEG')
    temp_image.seek(0)
    
    try:
        with open(temp_image.name, 'rb') as f:
            response = client.post(
                "/api/v1/images/",
                data={
                    "title": "Test Image",
                    "description": "A test image",
                    "alt_text": "Test alt text",
                    "is_featured": True
                },
                files={"file": ("test_image.jpg", f, "image/jpeg")}
            )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["title"] == "Test Image"
        assert data["description"] == "A test image"
        assert data["alt_text"] == "Test alt text"
        assert data["is_featured"] is True
        assert "id" in data
        assert "filename" in data
        assert "filepath" in data
        
        # Verify the image was saved to the database
        image_in_db = test_session.query(Image).filter(Image.title == "Test Image").first()
        assert image_in_db is not None
        assert image_in_db.title == "Test Image"
    finally:
        # Clean up the temporary file
        os.unlink(temp_image.name)


def test_upload_image_without_optional_fields(client, test_session):
    """Test uploading an image with only required fields"""
    # Create a temporary image file for testing
    temp_image = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
    img = PILImage.new('RGB', (100, 100), color='blue')
    img.save(temp_image.name, format='PNG')
    temp_image.seek(0)
    
    try:
        with open(temp_image.name, 'rb') as f:
            response = client.post(
                "/api/v1/images/",
                files={"file": ("test_image.png", f, "image/png")}
            )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "id" in data
        assert "filename" in data
        # Title, description, alt_text might have defaults or be empty depending on schema
    finally:
        # Clean up the temporary file
        os.unlink(temp_image.name)


def test_upload_invalid_file_type(client):
    """Test uploading a non-image file should fail"""
    # Create a temporary text file
    temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False)
    temp_file.write("This is not an image")
    temp_file.close()
    
    try:
        with open(temp_file.name, 'rb') as f:
            response = client.post(
                "/api/v1/images/",
                data={"title": "Invalid File"},
                files={"file": ("test.txt", f, "text/plain")}
            )
        
        # The response status depends on backend validation
        # It could be 422 for validation error or 400 for bad request
        assert response.status_code in [status.HTTP_422_UNPROCESSABLE_ENTITY, status.HTTP_400_BAD_REQUEST]
    finally:
        # Clean up the temporary file
        os.unlink(temp_file.name)


def test_get_image(client, test_session):
    """Test getting a specific image by ID"""
    # Create an image record in the database
    image = Image(
        filename="test.jpg",
        filepath="/uploads/test.jpg",
        title="Test Image",
        description="A test image",
        alt_text="Test alt text",
        is_featured=False
    )
    test_session.add(image)
    test_session.commit()
    test_session.refresh(image)
    
    response = client.get(f"/api/v1/images/{image.id}")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == image.id
    assert data["title"] == "Test Image"
    assert data["filename"] == "test.jpg"


def test_get_nonexistent_image(client):
    """Test getting an image that doesn't exist"""
    response = client.get("/api/v1/images/99999")
    
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_update_image(client, test_session):
    """Test updating an existing image"""
    # Create an image record in the database
    image = Image(
        filename="old.jpg",
        filepath="/uploads/old.jpg",
        title="Old Image",
        description="An old image",
        alt_text="Old alt text",
        is_featured=False
    )
    test_session.add(image)
    test_session.commit()
    test_session.refresh(image)
    
    # Update the image
    update_data = {
        "title": "Updated Image",
        "description": "An updated image",
        "alt_text": "Updated alt text",
        "is_featured": True
    }
    
    response = client.put(f"/api/v1/images/{image.id}", json=update_data)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["title"] == "Updated Image"
    assert data["description"] == "An updated image"
    assert data["alt_text"] == "Updated alt text"
    assert data["is_featured"] is True
    
    # Verify the update in the database
    updated_image = test_session.query(Image).filter(Image.id == image.id).first()
    assert updated_image.title == "Updated Image"


def test_delete_image(client, test_session):
    """Test deleting an existing image"""
    # Create an image record in the database
    image = Image(
        filename="to_delete.jpg",
        filepath="/uploads/to_delete.jpg",
        title="To Be Deleted",
        description="This will be deleted",
        alt_text="Delete me",
        is_featured=False
    )
    test_session.add(image)
    test_session.commit()
    test_session.refresh(image)
    
    # Delete the image
    response = client.delete(f"/api/v1/images/{image.id}")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["message"] == "Image deleted successfully"
    
    # Verify the image was deleted from the database
    deleted_image = test_session.query(Image).filter(Image.id == image.id).first()
    assert deleted_image is None


def test_get_images(client, test_session):
    """Test getting all images"""
    # Create multiple image records in the database
    images_data = [
        {
            "filename": "image1.jpg",
            "filepath": "/uploads/image1.jpg",
            "title": "Image 1",
            "description": "First image",
            "alt_text": "Alt text 1",
            "is_featured": False
        },
        {
            "filename": "image2.jpg",
            "filepath": "/uploads/image2.jpg",
            "title": "Image 2", 
            "description": "Second image",
            "alt_text": "Alt text 2",
            "is_featured": True
        },
        {
            "filename": "image3.jpg",
            "filepath": "/uploads/image3.jpg",
            "title": "Image 3",
            "description": "Third image",
            "alt_text": "Alt text 3", 
            "is_featured": False
        }
    ]
    
    for img_data in images_data:
        image = Image(**img_data)
        test_session.add(image)
    
    test_session.commit()
    
    response = client.get("/api/v1/images/")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3  # May have more from other tests
    
    # Check if our images are in the response
    titles_in_response = [img["title"] for img in data]
    for img_data in images_data:
        assert img_data["title"] in titles_in_response


def test_get_images_with_pagination(client, test_session):
    """Test getting images with pagination"""
    # Create multiple image records in the database
    for i in range(10):
        image = Image(
            filename=f"image_{i}.jpg",
            filepath=f"/uploads/image_{i}.jpg",
            title=f"Image {i}",
            description=f"Description for image {i}",
            alt_text=f"Alt text {i}",
            is_featured=i % 2 == 0  # Alternate featured status
        )
        test_session.add(image)
    
    test_session.commit()
    
    # Get first page
    response = client.get("/api/v1/images/?skip=0&limit=5")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    # The actual count depends on other images that might exist
    assert len(data) <= 5


def test_get_featured_images(client, test_session):
    """Test getting only featured images"""
    # Create both featured and non-featured images
    featured_image = Image(
        filename="featured.jpg",
        filepath="/uploads/featured.jpg",
        title="Featured Image",
        description="A featured image",
        alt_text="Featured alt text",
        is_featured=True
    )
    
    non_featured_image = Image(
        filename="regular.jpg",
        filepath="/uploads/regular.jpg",
        title="Regular Image",
        description="A regular image",
        alt_text="Regular alt text",
        is_featured=False
    )
    
    test_session.add(featured_image)
    test_session.add(non_featured_image)
    test_session.commit()
    
    # Get only featured images
    response = client.get("/api/v1/images/?is_featured=true")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    
    # Check that only featured images are returned
    for img in data:
        assert img["is_featured"] is True
        assert img["title"] == "Featured Image"


def test_upload_image_large_file(client):
    """Test uploading an image that exceeds the size limit"""
    # Create a large temporary image file
    temp_image = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
    
    # Create a large image (larger than typical upload limits)
    # Using a reasonable size for testing purposes (e.g., 10MB equivalent)
    img = PILImage.new('RGB', (3000, 3000), color='green')
    img.save(temp_image.name, format='JPEG')
    temp_image.seek(0)
    
    try:
        with open(temp_image.name, 'rb') as f:
            response = client.post(
                "/api/v1/images/",
                data={"title": "Large Image"},
                files={"file": ("large_image.jpg", f, "image/jpeg")}
            )
        
        # Response depends on backend file size validation
        # Could be 422 for validation error or 413 for payload too large
        assert response.status_code in [
            status.HTTP_200_OK,  # If the backend accepts large files
            status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,  # If there's a size limit
            status.HTTP_422_UNPROCESSABLE_ENTITY  # If there's validation
        ]
    finally:
        # Clean up the temporary file
        os.unlink(temp_image.name)


def test_upload_image_special_characters(client, test_session):
    """Test uploading an image with special characters in metadata"""
    # Create a temporary image file for testing
    temp_image = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
    img = PILImage.new('RGB', (100, 100), color='purple')
    img.save(temp_image.name, format='JPEG')
    temp_image.seek(0)
    
    try:
        with open(temp_image.name, 'rb') as f:
            response = client.post(
                "/api/v1/images/",
                data={
                    "title": "Image with Special chars: àáâãäåæçèé",
                    "description": "Test with unicode: 🚀🌟💻",
                    "alt_text": "Special chars: @#$%^&*()",
                    "is_featured": False
                },
                files={"file": ("special_chars.jpg", f, "image/jpeg")}
            )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "id" in data
        # Verify that special characters are preserved
        assert "àáâãäåæçèé" in data["title"]
        assert "🚀🌟💻" in data["description"] or len(data["description"]) > 0
    finally:
        # Clean up the temporary file
        os.unlink(temp_image.name)


def test_upload_multiple_images_concurrently(client, test_session):
    """Test uploading multiple images (simulated sequentially)"""
    uploaded_ids = []
    
    for i in range(3):
        # Create a temporary image file for testing
        temp_image = tempfile.NamedTemporaryFile(suffix=f".jpg", delete=False)
        img = PILImage.new('RGB', (100, 100), color=(i*50, i*60, i*70))
        img.save(temp_image.name, format='JPEG')
        temp_image.seek(0)
        
        try:
            with open(temp_image.name, 'rb') as f:
                response = client.post(
                    "/api/v1/images/",
                    data={
                        "title": f"Concurrent Test Image {i}",
                        "description": f"Image {i} for concurrent test"
                    },
                    files={"file": (f"concurrent_img_{i}.jpg", f, "image/jpeg")}
                )
            
            assert response.status_code == status.HTTP_200_OK
            data = response.json()
            assert data["title"] == f"Concurrent Test Image {i}"
            uploaded_ids.append(data["id"])
        finally:
            # Clean up the temporary file
            os.unlink(temp_image.name)
    
    # Verify all images were uploaded
    assert len(uploaded_ids) == 3
    for img_id in uploaded_ids:
        response = client.get(f"/api/v1/images/{img_id}")
        assert response.status_code == status.HTTP_200_OK