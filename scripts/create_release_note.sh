#!/usr/bin/env bash
set -eu

atom CHANGELOG.md

read -p "Please review CHANGELOG.md. Continue (y/n)?" CONT
echo
if [ "$CONT" = "n" ]; then
  echo "Exiting, changelog not processed."
  exit 2
fi

echo "Generating release notes for this release..."
diff -u CHANGELOG-PREV.md CHANGELOG.md | grep + | cut -c 2- | sed -e '1,3d' > CHANGELOG-NEW.md
echo "Converting changelog and release notes to HTML..."
marked -o plugins/streams/changelog.txt -i CHANGELOG-NEW.md
marked -o tiddlers/CHANGELOG.txt -i CHANGELOG.md
git add plugins/streams/changelog.txt tiddlers/CHANGELOG.txt CHANGELOG.md package.json plugins/streams/plugin.info
echo "Changelog and releasenotes staged in git."
rm CHANGELOG-PREV.md
rm CHANGELOG-NEW.md
atom tiddlers/CHANGELOG.txt
atom plugins/streams/changelog.txt
echo "Please review rendered release notes. Run npm run publish to add tag and push."
