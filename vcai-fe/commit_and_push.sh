#!/bin/bash

# Check if a commit message was provided
if [ -z "$1" ]; then
    echo "Usage: ./commit_and_push.sh \"your commit message\""
    echo "Example: ./commit_and_push.sh \"add file upload feature\""
    exit 1
fi

git add .
git commit -m "feat: $1"
git push