#!/bin/bash
git config user.name "DarkMagician256"
git config user.email "DarkMagician256@users.noreply.github.com"

git filter-branch -f --env-filter '
    export GIT_AUTHOR_NAME="DarkMagician256"
    export GIT_AUTHOR_EMAIL="DarkMagician256@users.noreply.github.com"
    export GIT_COMMITTER_NAME="DarkMagician256"
    export GIT_COMMITTER_EMAIL="DarkMagician256@users.noreply.github.com"
' --msg-filter '
    sed -e "/Co-authored-by: Claude/Id" -e "/Co-Authored-By: Claude/Id"
' --tag-name-filter cat -- --all

git push -f origin main
