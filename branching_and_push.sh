#!/bin/bash 

# add permissions: chmod +x branching_and_push.sh

# Check if all required parameters were provided
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Usage: ./branching_and_push.sh \"commit-type\" \"branch-name\" \"commit message\""
    echo "Commit types: feat, fix, chore, style, refactor, docs, test"
    echo "Example: ./branching_and_push.sh \"feat\" \"file-upload\" \"implement file upload functionality\""
    echo "Example: ./branching_and_push.sh \"chore\" \"update-deps\" \"update project dependencies\""
    echo "Example: ./branching_and_push.sh \"style\" \"ui-polish\" \"improve button styling and animations\""
    exit 1
fi

git checkout -b $1/$2
git add .
git commit -m "$1: $3"
git push --set-upstream origin $1/$2    