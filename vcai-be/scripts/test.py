#!/usr/bin/env python3
"""
Test runner script
"""

import pytest
import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

if __name__ == "__main__":
    # Run tests with pytest
    exit_code = pytest.main([
        "tests/",
        "-v",
        "--tb=short",
        "--cov=app",
        "--cov-report=html",
        "--cov-report=term-missing",
    ])
    sys.exit(exit_code)
