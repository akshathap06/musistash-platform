#!/bin/bash
echo "🔧 Installing Python dependencies..."
python -m pip install --upgrade pip
python -m pip install --no-cache-dir -r requirements.txt
echo "✅ Dependencies installed successfully!" 