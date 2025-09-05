#!/bin/bash 

# add permissions: chmod +x commit_and_push.sh

# Check if both commit type and message were provided
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./commit_and_push.sh \"commit-type\" \"commit message\""
    echo "Commit types: feat, fix, chore, style, refactor, docs, test"
    echo "Example: ./commit_and_push.sh \"feat\" \"add file upload feature\""
    echo "Example: ./commit_and_push.sh \"chore\" \"update dependencies\""
    echo "Example: ./commit_and_push.sh \"style\" \"improve button styling\""
    exit 1
fi

git add .
git commit -m "$1: $2"
git push