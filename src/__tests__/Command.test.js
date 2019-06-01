const Command = require('../Command');
const {
  spawn,
  spawnSync,
} = require('child_process');

const { parseCommandArgs } = Command;

jest.mock('child_process');

describe('Command', () => {
  describe('constructor', () => {
    it('creates a new instance when using new()', () => {
      const command = new Command('foo', {});
      expect(command instanceof Command).toBeTruthy();
    });

    it('prepends silent logging args when given command args with silent set to true', () => {
      const cmd = new Command('foo', {
        silent: true,
      });
      expect(cmd._args.slice(0, 3)).toEqual([
        '-Dorg.slf4j.simpleLogger.defaultLogLevel=off',
        '-Dorg.apache.commons.logging.Log=org.apache.commons.logging.impl.NoOpLog',
        '-Dfile.encoding=utf-8',
      ]);
    });

    it('prepends the JAR path to internal args when constructed', () => {
      const cmd = new Command('foo');
      expect(cmd._args[0]).toEqual('-jar');
      expect(cmd._args[1]).toContain('bin/jar/tabula-java.jar');
    });

    it('places the PDF path last in the array of arguments', () => {
      const cmd = new Command('foo');
      expect(cmd._args.slice(-1)).toEqual([
        'foo',
      ]);
    });
  });

  describe('run()', () => {
    it('calls spawn() with java and args', () => {
      const cmd = new Command('foo');
      cmd.run();
      const args = spawn.mock.calls[0];
      expect(args[0]).toEqual('java');
      expect(args[1]).toBeDefined();
    });
  });

  describe('runSync()', () => {
    it('calls spawnSync() with java, args, and an option to pipe stdio', () => {
      const cmd = new Command('foo');
      cmd.runSync();
      const args = spawnSync.mock.calls[0];
      expect(args[0]).toEqual('java');
      expect(args[1]).toBeDefined();
      expect(args[2]).toEqual({
        stdio: 'pipe',
      });
    });
  });
});

describe('parseCommandArgs()', () => {
  describe('when given multiple keys with string values', () => {
    it('prepends -- and converts keys to kebabCase', () => {
      const args = {
        fooBar: 'baz',
        fooBar2: 'baz2',
      };
      expect(parseCommandArgs(args)).toEqual([
        '--foo-bar', 'baz',
        '--foo-bar-2', 'baz2',
      ]);
    });
  });

  describe('when given multiple keys with boolean values', () => {
    it('only adds the key to the command', () => {
      const args = {
        foo: true,
        bar: true,
      };
      expect(parseCommandArgs(args)).toEqual([
        '--foo', '--bar'
      ]);
    });
  });

  describe('when given multiple keys with array values', () => {
    it('adds an argument for each value with the same key', () => {
      const args = {
        foo: [ 'foo1', 'foo2', 'foo3' ],
        bar: [ 'bar1', 'bar2', 'bar3' ],
      };
      expect(parseCommandArgs(args)).toEqual([
        '--foo', 'foo1',
        '--foo', 'foo2',
        '--foo', 'foo3',
        '--bar', 'bar1',
        '--bar', 'bar2',
        '--bar', 'bar3',
      ]);
    });
  });

  describe('when given multiple keys of mixed value types', () => {
    it('adds arguments in the correct format', () => {
      const args = {
        arr: [ '1', '2' ],
        bool: true,
        str: 'string',
      };
      expect(parseCommandArgs(args)).toEqual([
        '--arr', '1',
        '--arr', '2',
        '--bool',
        '--str', 'string',
      ]);
    });
  })
});
