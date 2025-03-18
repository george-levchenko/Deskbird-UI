import { EllipsisPipe } from './ellipsis.pipe';

describe('EllipsisPipe', () => {
  let pipe: EllipsisPipe;

  beforeEach(() => {
    pipe = new EllipsisPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an empty string if value is falsy', () => {
    expect(pipe.transform('')).toBe('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(pipe.transform(null as any)).toBe('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(pipe.transform(undefined as any)).toBe('');
  });

  it('should return the original string if its length is less than or equal to the limit', () => {
    const shortText = 'Short text';
    expect(pipe.transform(shortText, 20)).toBe(shortText);

    // Exactly equal to the limit.
    const exactText = '1234567890';
    expect(pipe.transform(exactText, 10)).toBe(exactText);
  });

  it('should truncate the string and append ellipsis if it exceeds the limit', () => {
    const longText = 'This is a long string that should be truncated';
    const limit = 20;
    expect(pipe.transform(longText, limit)).toBe(longText.substring(0, limit) + '...');
  });

  it('should use the default limit of 30 when no limit is provided', () => {
    const longText = 'a'.repeat(40);
    expect(pipe.transform(longText)).toBe('a'.repeat(30) + '...');
  });
});
