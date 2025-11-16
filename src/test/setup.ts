import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, vi } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Global mocks
beforeAll(() => {
  // Mock window.matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-unused-vars
    constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {
      // Mock constructor - no implementation needed for tests
    }
    disconnect(): void {
      // Mock method - no implementation needed for tests
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    observe(_target: Element): void {
      // Mock method - no implementation needed for tests
    }
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unobserve(_target: Element): void {
      // Mock method - no implementation needed for tests
    }
  };

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-unused-vars
    constructor(_callback: ResizeObserverCallback) {
      // Mock constructor - no implementation needed for tests
    }
    disconnect(): void {
      // Mock method - no implementation needed for tests
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    observe(_target: Element, _options?: ResizeObserverOptions): void {
      // Mock method - no implementation needed for tests
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unobserve(_target: Element): void {
      // Mock method - no implementation needed for tests
    }
  };
});

// Mock Supabase client for tests
vi.mock("@/db/supabase.client", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      order: vi.fn().mockReturnThis(),
    })),
  })),
  createBrowserClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      order: vi.fn().mockReturnThis(),
    })),
  })),
}));
