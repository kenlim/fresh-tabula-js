const Command = require('../Command');

const { parseCommandArgs } = Command;

describe('Command', () => {
  it('creates a new instance when using new()', () => {
    const command = new Command('foo', {});
    expect(command instanceof Command).toBeTruthy();
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
