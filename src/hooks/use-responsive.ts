
import { useState, useEffect } from 'react';

// Define breakpoints
const breakpoints = {
  sm: 640,   // Small devices
  md: 768,   // Medium devices
  lg: 1024,  // Large devices
  xl: 1280,  // Extra large devices
};

type Breakpoint = keyof typeof breakpoints;

export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const [isAboveBreakpoint, setIsAboveBreakpoint] = useState<boolean>(false);

  useEffect(() => {
    const checkBreakpoint = () => {
      setIsAboveBreakpoint(window.innerWidth >= breakpoints[breakpoint]);
    };

    // Initial check
    checkBreakpoint();

    // Add event listener for window resize
    window.addEventListener('resize', checkBreakpoint);

    // Cleanup
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, [breakpoint]);

  return isAboveBreakpoint;
}

// Convenient hooks for common breakpoints
export function useIsMobile() {
  return !useBreakpoint('sm');
}

export function useIsTablet() {
  return useBreakpoint('sm') && !useBreakpoint('lg');
}

export function useIsDesktop() {
  return useBreakpoint('lg');
}

export function useIsLargeDesktop() {
  return useBreakpoint('xl');
}
