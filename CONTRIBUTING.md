# Contributing
## Deploying
### Bump the version
    npm --no-git-tag-version version <major|minor|patch>
    git add package.json
### Update the change log and stage it
    git add CHANGELOG.md
### Build
    gulp build
### Commit the build directory
    git add -f docs
    git commit -m 'Bump to version X.Y.Z'
### Tag
    git tag -a vX.Y.Z -m 'Version X.Y.Z'
### Push
    git push
    git push origin vX.Y.Z
