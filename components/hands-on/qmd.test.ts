import {getComponentName} from './qmd'

describe('getComponentName function', () => {
  it('gets the correct name', () => {
    const content = `<TestComp \>`
    expect(getComponentName(content)).toBe('TestComp');
  });
});