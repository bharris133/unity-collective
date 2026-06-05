import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../firebase', () => ({ storage: {} }));

vi.mock('firebase/storage', () => ({
  ref: vi.fn(() => 'mock-ref'),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
  deleteObject: vi.fn(),
}));

const mockFile = (name = 'test.jpg') => new File(['data'], name, { type: 'image/jpeg' });

describe('storageService (mock mode)', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_USE_MOCK_DATA', 'true');
  });

  it('returns a blob URL for uploadVerificationDoc without calling Firebase', async () => {
    const { uploadVerificationDoc } = await import('../../services/storageService');
    const { uploadBytes } = await import('firebase/storage');
    const result = await uploadVerificationDoc('member-1', mockFile('doc.pdf'));
    expect(result.path).toBe('onboarding/member-1/docs/doc.pdf');
    expect(uploadBytes).not.toHaveBeenCalled();
  });

  it('returns a blob URL for uploadProductImage without calling Firebase', async () => {
    const { uploadProductImage } = await import('../../services/storageService');
    const { uploadBytes } = await import('firebase/storage');
    const result = await uploadProductImage('biz-1', 'prod-1', mockFile('product.jpg'));
    expect(result.path).toBe('products/biz-1/prod-1/product.jpg');
    expect(uploadBytes).not.toHaveBeenCalled();
  });

  it('returns a blob URL for uploadBusinessLogo without calling Firebase', async () => {
    const { uploadBusinessLogo } = await import('../../services/storageService');
    const { uploadBytes } = await import('firebase/storage');
    const result = await uploadBusinessLogo('biz-1', mockFile('logo.png'));
    expect(result.path).toBe('businesses/biz-1/logo/logo.png');
    expect(uploadBytes).not.toHaveBeenCalled();
  });

  it('no-ops deleteStorageFile in mock mode', async () => {
    const { deleteStorageFile } = await import('../../services/storageService');
    const { deleteObject } = await import('firebase/storage');
    await deleteStorageFile('some/path/file.jpg');
    expect(deleteObject).not.toHaveBeenCalled();
  });
});

describe('storageService (live mode)', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_USE_MOCK_DATA', 'false');
  });

  it('calls Firebase Storage for uploadVerificationDoc', async () => {
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    vi.mocked(uploadBytes).mockResolvedValue({} as any);
    vi.mocked(getDownloadURL).mockResolvedValue('https://storage.example.com/doc.pdf');

    const { uploadVerificationDoc } = await import('../../services/storageService');
    const result = await uploadVerificationDoc('member-1', mockFile('doc.pdf'));

    expect(ref).toHaveBeenCalled();
    expect(uploadBytes).toHaveBeenCalled();
    expect(result.url).toBe('https://storage.example.com/doc.pdf');
  });

  it('calls Firebase Storage for uploadBusinessLogo', async () => {
    const { uploadBytes, getDownloadURL } = await import('firebase/storage');
    vi.mocked(uploadBytes).mockResolvedValue({} as any);
    vi.mocked(getDownloadURL).mockResolvedValue('https://storage.example.com/logo.png');

    const { uploadBusinessLogo } = await import('../../services/storageService');
    const result = await uploadBusinessLogo('biz-1', mockFile('logo.png'));

    expect(uploadBytes).toHaveBeenCalled();
    expect(result.url).toBe('https://storage.example.com/logo.png');
  });

  it('calls deleteObject for deleteStorageFile', async () => {
    const { deleteObject } = await import('firebase/storage');
    vi.mocked(deleteObject).mockResolvedValue();

    const { deleteStorageFile } = await import('../../services/storageService');
    await deleteStorageFile('businesses/biz-1/logo/logo.png');

    expect(deleteObject).toHaveBeenCalled();
  });
});
