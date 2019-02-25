// We need to implement the mock with a constructor in order to ensure type checks work properly.
// If we don't, then a `toBeInstanceOf()` will fail because it will receive an Object constructor,
// rather than Logger.
export const Logger = jest.fn(function(this: any) {
  this.log = jest.fn();
});
