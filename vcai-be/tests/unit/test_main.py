"""
Unit tests for main application
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_endpoint():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "VcAi Backend API"
    assert "version" in data
    assert data["status"] == "healthy"


def test_health_endpoint():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "vcai-backend"


def test_api_docs_accessible():
    """Test that API documentation is accessible"""
    response = client.get("/api/v1/docs")
    assert response.status_code == 200


def test_health_detailed_endpoint():
    """Test detailed health endpoint"""
    response = client.get("/api/v1/health/detailed")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "system" in data
    assert "cpu_percent" in data["system"]
