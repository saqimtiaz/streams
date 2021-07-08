#!/usr/bin/env node

const squtils = require('./build-utils.js')
const chalk = require('chalk')
const figures = require('figures')
const package = require('../package.json')
const fs = require('fs')
const path = require('path')
const config = package.config || {}
const VERSION = package.version
const NAME = package.name
const EDITOR = package.scripts.editor
const PLUGINPATH = config['plugin-path']
const PLUGIN_NS = config['plugin-namespace']

async function createChangelog() {
  const args = {};
  squtils.checkpoint(args, `Generating release notes for %s %s...`,[NAME, 'v'+VERSION])
  
  // Generate temporary file with changelog for new release.
  await squtils.execCommand("diff -u CHANGELOG-temp-PREV.md CHANGELOG.md | grep + | cut -c 2- | sed -e '1,3d' > CHANGELOG-temp-NEW.md",[])
  // Confirm that the file was created and is non-zero
  squtils.checkFile("CHANGELOG-temp-NEW.md")
  
  squtils.checkpoint(args, 'Converting changelog and release notes to HTML...',[])
  // Convert changelogs to HTML
  await squtils.execCommand(`marked -o ${PLUGINPATH}/releasenotes.txt -i CHANGELOG-temp-NEW.md`,[])
  await squtils.execCommand("marked -o tiddlers/CHANGELOG.txt -i CHANGELOG.md",[])
  //exec spawns a shell, whereas the execFile function does not.
  
  // Confirm that HTML files were successfully created.
  squtils.checkFile('tiddlers/CHANGELOG.txt')
  squtils.checkFile(`${PLUGINPATH}/releasenotes.txt`)
    
  squtils.checkpoint(args,'Building TW, please review the tiddlers %s and %s',['CHANGELOG.txt',`${PLUGIN_NS}/CHANGELOG`],chalk.yellow(figures.warning),{color:'yellow',bg:'bgMagenta'})
  
  // Build TW with our plugin
  await squtils.execCommand("cp -f release-artifacts/DefaultTiddlers.tid tiddlers/")
  await squtils.execCommand(package.scripts.build,[]);
  let twPath = path.join(process.env.PWD,'output/index.html');
  // Open the TW in a browser. TODO: permalink with tiddlers to verify
  await squtils.execCommand(`${package.scripts.browser} ${twPath} `,true)
  
  await squtils.execCommand("git restore tiddlers/DefaultTiddlers.tid tiddlers/StoryList.tid")
}

async function createReleaseNote() {
  let proceed = await squtils.ask("Please review %s. Continue? (y/n)",['CHANGELOG.md'])
  if(!proceed) {
    squtils.printError(null,"Exiting. Changelog not converted to HTML.") //clean script would be handy!
    process.exit(1)
  }
  // Create changelog files
  await createChangelog()
  // Clean up temporary files
  await squtils.execCommand(package.scripts['release:clean'])
}

createReleaseNote()


/*  
// build and open TW
  //could I do this with a fresh checkut of the repo with the last created tag?
  // checkout in another directory that is
*/
