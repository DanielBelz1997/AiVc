#!/bin/bash

# VcAi Backend Setup Script

echo "🚀 Setting up VcAi Backend..."

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and add your OpenAI API key!"
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs autogen_workdir

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file and add your OpenAI API key"
echo "2. Activate virtual environment: source venv/bin/activate"
echo "3. Start development server: python scripts/start_dev.py"
echo "4. Visit http://localhost:8000/api/v1/docs for API documentation"
echo ""
echo "Happy coding! 🎉"
