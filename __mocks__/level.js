const mockPut = jest.fn();
const mockGet = jest.fn();
const mockDel = jest.fn();

const mock = jest.fn(() => ({
  put: mockPut,
  get: mockGet,
  del: mockDel
}));

mock.mockPut = mockPut;
mock.mockGet = mockGet;
mock.mockDel = mockDel;

module.exports = mock;
