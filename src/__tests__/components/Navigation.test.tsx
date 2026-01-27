import { describe, it, expect } from 'vitest';

describe('Navigation Component', () => {
  it('should export Navigation component', async () => {
    const Navigation = await import('../../components/Navigation');
    expect(Navigation.default).toBeDefined();
  });

  it('should be a valid React component', async () => {
    const Navigation = await import('../../components/Navigation');
    expect(typeof Navigation.default).toBe('function');
  });

  // Note: Full rendering tests require proper router context setup
  // These will be added in integration tests
});
