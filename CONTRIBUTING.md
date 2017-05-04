# Contributing
## Deploying
### Bump the version
    npm --no-git-tag-version version <major|minor|patch>
    git add package.json
### Update the change log and stage it
    git add CHANGELOG.md
### Build
    gulp build
### Deploying
    gulp gh-deploy
### Tag
    git tag -a vX.Y.Z -m 'Version X.Y.Z'
### Push
    git push
    git push origin vX.Y.Z
