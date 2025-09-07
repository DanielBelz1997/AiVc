"""
Custom exception handlers for the FastAPI application
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from starlette.middleware.errors import ServerErrorMiddleware


class VcAiException(Exception):
    """Base exception for VcAi application"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class AutoGenException(VcAiException):
    """Exception for AutoGen related errors"""
    def __init__(self, message: str):
        super().__init__(message, status_code=422)


class ValidationException(VcAiException):
    """Exception for validation errors"""
    def __init__(self, message: str):
        super().__init__(message, status_code=400)


async def vcai_exception_handler(request: Request, exc: VcAiException):
    """Handle custom VcAi exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.__class__.__name__,
            "message": exc.message,
            "status_code": exc.status_code
        }
    )


async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTPException",
            "message": exc.detail,
            "status_code": exc.status_code
        }
    )


async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "InternalServerError",
            "message": "An unexpected error occurred",
            "status_code": 500
        }
    )


def add_exception_handlers(app: FastAPI):
    """Add all exception handlers to the FastAPI app"""
    app.add_exception_handler(VcAiException, vcai_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)
