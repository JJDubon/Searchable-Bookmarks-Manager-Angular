import { AllowUnsafePipe } from './allow-unsafe.pipe';

describe('AllowUnsafePipe', () => {
  it('create an instance', () => {
    const pipe = new AllowUnsafePipe();
    expect(pipe).toBeTruthy();
  });
});
