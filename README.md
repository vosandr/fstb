![CI](https://github.com/debagger/fstb/workflows/CI/badge.svg)

# FSTB User Guide

FSTB stands for FileSystem ToolBox. This library aims to make it easier to interact with the file system in Node.js.

## Install

For install FSTB:

```bash
npm install fstb --save
```
## Usage
### Work with pathes
You can create path to filesystem object usin the FSPath function. 
It can be chained with any key name wich act as path segment.

Example:
```js
FSPath(__dirname).node_modules //work as path.join(__dirname, "node_modules")
FSPath(__dirname)["package.json"] //work as path.join(__dirname, "package.json")
```

### Work with file system objects 
When path completed, you can get further operation to call it as function.

Example:
```js
FSPath(__dirname).node_modules().asDir()
FSPath(__dirname)["package.json"]().asFile()
```
### Special directories shortcuts

cwd - is like FSPath(process.cwd())
... will be continued




## More examples

### Iterate subdirs:

```js
import { FSPath } from 'fstb';
FSPath(process.cwd()).node_modules().asDir().mapDirs(dir=>console.log(dir.name))

```
### Read and write json
```js
    const objectToWrite = {
      test: 'test',
      test1: 123,
    };
    //constructs path to file and get it as FSFile object
    const file1 = cwd.test.testfiles.dir1['file1.json']().asFile();

    //serialize object as json and save in to file1.json
    await file1.write.json(objectToWrite);

    //read json object from file1.json
    const readedObject = await file1.read.json();
```

### Get file stats

```js
const stat = await cwd.test.testfiles['2.json']().asFile().stat()
```

