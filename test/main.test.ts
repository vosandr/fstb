import { FSPath, cwd } from '../src';
import { join } from 'path';
import { stat, readdir, Dirent, Stats } from 'fs';

describe('FSPath', () => {
  it('Join path as prop name', () => {
    expect(FSPath('/aaa').bbb().path).toEqual(join('/aaa', '/bbb'));
  });

  it('Join path as key', () => {
    expect(FSPath('/aaa')['bbb.json']().path).toEqual(join('/aaa', 'bbb.json'));
  });

  const strSort = (a: string, b: string) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  };

  it('map files in dir', async () => {
    const dirents = await new Promise<Dirent[]>((resolve, reject) => {
      const path = join(process.cwd(), '/test/testfiles');
      readdir(path, { withFileTypes: true }, (err, files) => {
        if (err) return reject(err);
        resolve(files);
      });
    });

    const dir = dirents.filter(d => d.isFile()).map(d => d.name);

    dir.sort(strSort);
    expect(
      (
        await cwd.test
          .testfiles()
          .asDir()
          .mapFiles(dirent => dirent.name)
      ).sort(strSort)
    ).toMatchObject(dir);
  });

  it('map subdirs in dir', async () => {
    expect(
      await cwd.test
        .testfiles()
        .asDir()
        .mapDirs(dirent => dirent.name)
    ).toMatchObject(['dir1', 'dir2']);
  });

  it('get file stat', async () => {
    const path = join(process.cwd(), '/test/testfiles/2.json');

    const _stat = await new Promise<Stats>((resolve, reject) => {
      stat(path, (err, stat) => {
        if (err) return reject(err);
        resolve(stat);
      });
    });

    expect(
      await cwd.test.testfiles['2.json']()
        .asFile()
        .stat()
    ).toMatchObject(_stat);
  });

  it('write and read json', async () => {
    const objectToWrite = {
      test: 'test',
      test1: 123,
    };
    const file1 = cwd.test.testfiles.dir1['file1.json']().asFile();

    await file1.write.json(objectToWrite);

    const readObject = await file1.read.json();

    expect(readObject).toMatchObject(objectToWrite);
  });
});
