#!/usr/bin/env node

const squtils = require('./build-utils.js')
const chalk = require('chalk')
const figures = require('figures')
const util = require('util')
const readline = require('readline')
const package = require('../package.json')
const config = package.config || {}
const VERSION = package.version
const NAME = package.name
const EDITOR = package.scripts.editor
const NEWTAG = 'v' + VERSION
const PLUGINPATH = config['plugin-path']
const RELEASEFILES = config['release-files'].map(x => x.replace(/{{PLUGINPATH}}/g,PLUGINPATH))
/*
  for(const index in toAdd) {      
      toAdd[index] = toAdd[index].replace(/{{PLUGINPATH}}/g,PLUGINPATH)
  }
  */
const { promisify } = require('util')
const execFile = promisify(require('child_process').execFile)
const spawnSync = require('child_process').spawnSync

process.env['FORCE_COLOR'] = 1

var myArgs = process.argv

async function doTag (args) {
  args = args || []
  const newVersion = package.version
  let tagOption = '-a';
  squtils.checkpoint(args, 'tagging release %s%s', ["v", newVersion])
  //Tag new release.
  await squtils.runExecFile(args, 'git', ['tag', tagOption, "v" + newVersion, '-m', `${squtils.formatCommitMessage("chore(RELEASE): {{newVersion}}", newVersion)}`])
  
  //Confirm that new release corresponds to HEAD
  const currentTag = await squtils.runExecFile(args,'git',['describe','--exact-match','HEAD'])
  if(currentTag.trim() !== NEWTAG.trim()) {
    squtils.printError(args,"Error: new tag does not correspond to HEAD")
    process.exit(1)
  }
}

async function doCommit(args) {
  args = args || []
  const newVersion = package.version
  let msg = 'committing %s'
  let paths = RELEASEFILES
  
  squtils.checkpoint(args, msg, paths)  
  // Git add files
  await squtils.runExecFile(args,'git',['add'].concat(RELEASEFILES))
  // Visual confirmation of staged files
    // git status --short | grep '^[MARCD]'
    // Add confirmation prompt here?
    // No visual output, see https://stackoverflow.com/questions/10232192/exec-display-stdout-live

  // Git commit.
  await squtils.runExecFile(args,'git',['commit', '-m', `${squtils.formatCommitMessage("chore(RELEASE): {{newVersion}}", newVersion)}`])
  // Visual confirmation of commit
  spawnSync('git',['log','-1','--stat'],{shell: true, stdio: 'inherit'})
  //IDEA, exactly 5 files should be in here and they must be the 5 release-files
    // git diff-tree --no-commit-id --name-only -r HEAD
}

async function doPush() {
  args=[];
  // Get the current git branch
  const currentBranch = await squtils.runExecFile('', 'git', ['rev-parse', '--abbrev-ref', 'HEAD'])
  const proceed = await squtils.ask("Do you want to push to Github ?",[],{'strong':true})
  
  if(proceed) {
    squtils.checkpoint(args, 'pushing %s release %s', [NAME, 'v' + VERSION])
    // Push to remote git repo
    await squtils.runExecFile(args, 'git', ['push', 'origin', currentBranch.trim(), '--follow-tags'])
    squtils.checkpoint(args,"%s release %s pushed to Github.",[NAME,'v'+VERSION],chalk.green(figures.tick),{bg:'bgGreen',color:'whiteBright'})
  } else {
    squtils.checkpoint(args,'%s to push to Github',['npm run push'],chalk.blue(figures.info)) // TODO script name
    process.exit(1)
  }
}

async function run(){
  let proceed = await squtils.ask("Do you want to commit changes and tag %s %s? (y/n)",[NAME,'v'+VERSION]) //show new tag
  if(!proceed) {
    squtils.checkpoint([],'%s to commit changes, add tag and push',['git push origin main --follow-tags'],chalk.blue(figures.info))  // XXX TODO change name of script to whatever it will be in the end
    process.exit(1);
  }
  await doCommit()
  await doTag()
  await doPush()
  process.exit(0)
}

run();

/*  
  // IDEA (later) : have command line arguments for this script (both scrips combined in one)
    commandline arguments map to an options object (like standard-version)
    if no arguments, run All
    but can specify to run only one step, or from a specific step
      then can expose clean or push step separately as well, but all code is in one script
*/

// standard-version bump files has hardwired plugin paths
