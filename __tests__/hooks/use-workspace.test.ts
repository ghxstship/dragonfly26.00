import { renderHook } from '@testing-library/react';
import { useWorkspace } from '@/hooks/use-workspace';

describe('useWorkspace Hook', () => {
  it('returns workspace data', () => {
    const { result } = renderHook(() => useWorkspace());
    expect(result.current).toBeDefined();
  });

  it('handles loading state', () => {
    const { result } = renderHook(() => useWorkspace());
    expect(result.current.isLoading).toBeDefined();
  });
});
