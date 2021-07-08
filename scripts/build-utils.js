/* 
Derived from standard-version
https://github.com/conventional-changelog/standard-version
*/

const util = require('util')
const chalk = require('chalk')
const figures = require('figures')
const readline = require('readline')
const { promisify } = require('util')
const execFile = promisify(require('child_process').execFile) //execFileSync
const exec = util.promisify(require('child_process').exec);  //execSync
const fs = require('fs')
const spawn = promisify(require('child_process').spawn)

async function ask (question,args,options) {
    options = options || {}
    args = args || [];
    yesValues = [ 'yes', 'y' ]

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise(function (resolve, reject) {
        if(!options.color){
            options.bg = 'bgMagenta',
            options.color = 'yellow'
        }
        checkpoint([],question,args,chalk.cyan(figures.questionMarkPrefix),options)
        rl.question('', async function (answer) {
            rl.close();

            const cleaned = answer.trim().toLowerCase();
            if (yesValues.indexOf(cleaned) >= 0) {
                return resolve(true);
            } else {
              return resolve(false);
            }
        });
    });
}

function printError (args, msg, opts) {
    opts = Object.assign({
      level: 'error',
      color: 'red'
    }, opts)
    console[opts.level](chalk[opts.color](msg))
}

async function execCommand(cmd,silent) {
  try {
    const promise = exec(cmd)
    const child = promise.child
    child.stdout.pipe(process.stdout)
    const { stdout, stderr } = await promise; 
    //const { stdout, stderr } = await exec(cmd);  
    if (stderr && !silent) printError([cmd], stderr, { level: 'warn', color: 'yellow' })
    return stdout
  }catch (err) {
      printError([cmd], err.stderr || err.message)
      throw error
  };
}

// This is buggy, it works but the parent process exits immediately afterwards
async function execSpawn(cmd,cmdArgs,silent) {
  try {
    const { stdout, stderr } = await spawn(cmd,cmdArgs,{shell: true, stdio: 'inherit'});  
    if (stderr && !silent) printError([cmd], stderr, { level: 'warn', color: 'yellow' })
    return stdout
  }catch (err) {
      printError([cmd], err.stderr || err.message)
      throw error
  };
  
  //exits my scripts here, bada! but get colors
}

async function runExecFile (args, cmd, cmdArgs) {
  if (args.dryRun) return
  try {
    const promise = execFile(cmd,cmdArgs)
    const child = promise.child
    child.stdout.pipe(process.stdout)
    const { stdout, stderr } = await promise;  
    //const { stderr, stdout } = await execFile(cmd, cmdArgs)
    // If execFile returns content in stderr, but no error, print it as a warning
    if (stderr) printError(args, stderr, { level: 'warn', color: 'yellow' })
    return stdout
  } catch (error) {
    // If execFile returns an error, print it and exit with return code 1
    printError(args, error.stderr || error.message)
    throw error
  }
}

function checkpoint(argv, msg, args, figure, options) {
  options = options || {};
  if(options.bg) {
    msg = chalk[options.bg](msg)
  }
  if(!options.color){
    options.color = 'whiteBright'
  }
  if(options.color){
    msg = chalk[options.color](msg)
  }
  if(options.strong) {
    msg = chalk.bold(msg)
  }
  const defaultFigure = chalk.green(figures.tick)
  console.info((figure || defaultFigure) + ' ' + util.format.apply(util, [msg].concat(args.map(function (arg) {
    return chalk.bold(arg)
  }))))
}

function formatCommitMessage(rawMsg,newVersion) {
  const message = String(rawMsg)
  return message.replace(/{{newVersion}}/g, newVersion)
}

//an alternative way to check a file exists is a simple ls filename which should return the filename, but size wont be considered
  // find . -empty -name filename will return nothing if the file is empty
  //find . -max-depth 1 -size +1c -name foo  //exist and non empty
  //returns    ./foo
function checkFile(filepath) {
  try{
      fs.open(filepath,(err,fd) => {
        if (err) throw err;
        fs.fstat(fd,function(err,stats){
          if(err) throw err;
          if(stats.size === 0) {
            printError(null,`${filepath} is 0 bytes. Exiting.`)
            process.exit(1)          
          }
          fs.close(fd, (err) => {
            if (err) throw err;
            //console.log('No errors');
          }); 
        })
   
      })
  } catch(err) {
      printError(null,`${filepath} not created. Exiting.`)
      printError([], err.stderr || err.message)  
  }
}


module.exports = {
  ask,
  printError,
  runExecFile,
  checkpoint,
  formatCommitMessage,
  execCommand,
  checkFile,
  execSpawn
}
