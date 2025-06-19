#!/bin/bash

echo "🔧 Running Black (code formatter)..."
black .

echo "🔃 Running isort (import sorter)..."
isort .

echo "🔍 Running Flake8 (linter)..."
flake8 .

echo "📊 Running Pylint (quality report)..."
find . -name "*.py" -not -path "*/venv/*" | xargs pylint
