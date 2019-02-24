export const mockLog = jest.fn();

export const Logger = jest.fn().mockImplementation(() => ({
  log: mockLog
}));
