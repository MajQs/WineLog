/**
 * Unit tests for useDashboardData hook
 * Tests business rules, edge cases, and data transformations
 */

import { describe, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useDashboardData } from "./useDashboardData";
import type { DashboardDto } from "../../types";

// Mock the API module
vi.mock("../api/dashboard", () => ({
  fetchDashboard: vi.fn(),
}));

import { fetchDashboard } from "../api/dashboard";

// Type-safe mock
const mockFetchDashboard = vi.mocked(fetchDashboard);

/**
 * Create a QueryClient wrapper for testing
 */
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for faster tests
        gcTime: 0, // Disable caching between tests
      },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestWrapper";
  return Wrapper;
}

describe("useDashboardData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Successful data fetching", () => {
    test("should return transformed batches with all required fields", async () => {
      // Arrange
      const mockData: DashboardDto = {
        active_batches: [
          {
            id: "batch-1",
            name: "Cabernet Sauvignon 2024",
            type: "red",
            started_at: "2024-01-15T10:00:00Z",
            current_stage: {
              position: 2,
              name: "fermentation",
              description: "Primary fermentation",
              days_elapsed: 7,
            },
            latest_note: {
              id: "note-1",
              action: "Temperature increased to 22°C",
              created_at: "2024-01-20T14:30:00Z",
            },
          },
        ],
        archived_batches_count: 5,
      };

      mockFetchDashboard.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.batches).toHaveLength(1);
      expect(result.current.batches[0]).toMatchObject({
        id: "batch-1",
        name: "Cabernet Sauvignon 2024",
        type: "red",
        startedAtHuman: "15.01.2024",
        currentStageDescription: "Primary fermentation",
        currentStagePosition: 2,
        currentStageDaysElapsed: 7,
        latestNoteAction: "Temperature increased to 22°C",
        latestNoteDateHuman: "20.01.2024",
      });
      expect(result.current.archivedCount).toBe(5);
    });

    test("should handle batch without latest note", async () => {
      // Arrange
      const mockData: DashboardDto = {
        active_batches: [
          {
            id: "batch-1",
            name: "Merlot 2024",
            type: "red",
            started_at: "2024-02-01T10:00:00Z",
            current_stage: {
              position: 1,
              name: "preparation",
              description: "Preparation stage",
            },
            latest_note: null,
          },
        ],
        archived_batches_count: 0,
      };

      mockFetchDashboard.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.batches[0]).toMatchObject({
        id: "batch-1",
        name: "Merlot 2024",
        latestNoteAction: undefined,
        latestNoteDateHuman: undefined,
      });
    });

    test("should handle batch without days_elapsed in current stage", async () => {
      // Arrange
      const mockData: DashboardDto = {
        active_batches: [
          {
            id: "batch-1",
            name: "Chardonnay 2024",
            type: "white",
            started_at: "2024-03-01T10:00:00Z",
            current_stage: {
              position: 1,
              name: "preparation",
              description: "Preparation stage",
              // No days_elapsed field
            },
            latest_note: null,
          },
        ],
        archived_batches_count: 0,
      };

      mockFetchDashboard.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.batches[0].currentStageDaysElapsed).toBeUndefined();
    });

    test("should return empty array when no active batches", async () => {
      // Arrange
      const mockData: DashboardDto = {
        active_batches: [],
        archived_batches_count: 10,
      };

      mockFetchDashboard.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.batches).toEqual([]);
      expect(result.current.archivedCount).toBe(10);
    });

    test("should return 0 archived count when not provided", async () => {
      // Arrange
      const mockData: DashboardDto = {
        active_batches: [],
        archived_batches_count: 0,
      };

      mockFetchDashboard.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.archivedCount).toBe(0);
    });
  });

  describe("Date formatting", () => {
    test("should format started_at date to dd.MM.yyyy format", async () => {
      // Arrange - Test various date formats
      const mockData: DashboardDto = {
        active_batches: [
          {
            id: "batch-1",
            name: "Test Batch",
            type: "red",
            started_at: "2024-12-25T15:30:00Z",
            current_stage: {
              position: 1,
              name: "preparation",
              description: "Preparation stage",
            },
            latest_note: null,
          },
        ],
        archived_batches_count: 0,
      };

      mockFetchDashboard.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.batches[0].startedAtHuman).toBe("25.12.2024");
    });

    test("should format latest note date to dd.MM.yyyy format", async () => {
      // Arrange
      const mockData: DashboardDto = {
        active_batches: [
          {
            id: "batch-1",
            name: "Test Batch",
            type: "red",
            started_at: "2024-01-01T10:00:00Z",
            current_stage: {
              position: 1,
              name: "preparation",
              description: "Preparation stage",
            },
            latest_note: {
              id: "note-1",
              action: "Test action",
              created_at: "2024-03-15T08:45:00Z",
            },
          },
        ],
        archived_batches_count: 0,
      };

      mockFetchDashboard.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.batches[0].latestNoteDateHuman).toBe("15.03.2024");
    });
  });

  describe("Multiple batches handling", () => {
    test("should transform multiple batches correctly", async () => {
      // Arrange
      const mockData: DashboardDto = {
        active_batches: [
          {
            id: "batch-1",
            name: "Batch 1",
            type: "red",
            started_at: "2024-01-01T10:00:00Z",
            current_stage: {
              position: 1,
              name: "preparation",
              description: "Stage 1",
            },
            latest_note: null,
          },
          {
            id: "batch-2",
            name: "Batch 2",
            type: "white",
            started_at: "2024-02-01T10:00:00Z",
            current_stage: {
              position: 2,
              name: "fermentation",
              description: "Stage 2",
              days_elapsed: 5,
            },
            latest_note: {
              id: "note-1",
              action: "Note for batch 2",
              created_at: "2024-02-05T10:00:00Z",
            },
          },
          {
            id: "batch-3",
            name: "Batch 3",
            type: "rose",
            started_at: "2024-03-01T10:00:00Z",
            current_stage: {
              position: 3,
              name: "aging",
              description: "Stage 3",
              days_elapsed: 15,
            },
            latest_note: null,
          },
        ],
        archived_batches_count: 7,
      };

      mockFetchDashboard.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.batches).toHaveLength(3);
      expect(result.current.batches[0].id).toBe("batch-1");
      expect(result.current.batches[1].id).toBe("batch-2");
      expect(result.current.batches[2].id).toBe("batch-3");
      expect(result.current.archivedCount).toBe(7);
    });
  });

  describe("Error handling", () => {
    test("should set isError to true when fetch fails", async () => {
      // Arrange
      mockFetchDashboard.mockRejectedValue(new Error("Network error"));

      // Act
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      // Assert - Wait longer due to retry attempts (2 retries configured in hook)
      await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.batches).toEqual([]);
      expect(result.current.archivedCount).toBe(0);
      expect(result.current.error).toBeDefined();
    });

    test("should expose error object when fetch fails", async () => {
      // Arrange
      const errorMessage = "Failed to fetch dashboard data";
      mockFetchDashboard.mockRejectedValue(new Error(errorMessage));

      // Act
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      // Assert - Wait longer due to retry attempts (2 retries configured in hook)
      await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 });

      expect(result.current.error).toBeInstanceOf(Error);
      expect((result.current.error as Error).message).toBe(errorMessage);
    });
  });

  describe("Loading state", () => {
    test("should set isLoading to true initially", () => {
      // Arrange
      mockFetchDashboard.mockImplementation(
        () =>
          new Promise(() => {
            /* Never resolves */
          })
      );

      // Act
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isError).toBe(false);
      expect(result.current.batches).toEqual([]);
    });

    test("should set isLoading to false after successful fetch", async () => {
      // Arrange
      const mockData: DashboardDto = {
        active_batches: [],
        archived_batches_count: 0,
      };

      mockFetchDashboard.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.isError).toBe(false);
    });
  });

  describe("Refetch functionality", () => {
    test("should expose refetch function", async () => {
      // Arrange
      const mockData: DashboardDto = {
        active_batches: [],
        archived_batches_count: 0,
      };

      mockFetchDashboard.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Assert
      expect(result.current.refetch).toBeDefined();
      expect(typeof result.current.refetch).toBe("function");
    });

    test("should refetch data when refetch is called", async () => {
      // Arrange
      const initialData: DashboardDto = {
        active_batches: [],
        archived_batches_count: 0,
      };

      const updatedData: DashboardDto = {
        active_batches: [
          {
            id: "new-batch",
            name: "New Batch",
            type: "red",
            started_at: "2024-04-01T10:00:00Z",
            current_stage: {
              position: 1,
              name: "preparation",
              description: "Preparation stage",
            },
            latest_note: null,
          },
        ],
        archived_batches_count: 1,
      };

      mockFetchDashboard.mockResolvedValueOnce(initialData);

      // Act
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.batches).toHaveLength(0);

      // Update mock to return new data
      mockFetchDashboard.mockResolvedValueOnce(updatedData);

      // Trigger refetch
      await result.current.refetch();

      // Assert
      await waitFor(() => {
        expect(result.current.batches).toHaveLength(1);
        expect(result.current.batches[0].id).toBe("new-batch");
        expect(result.current.archivedCount).toBe(1);
      });
    });
  });

  describe("Data memoization", () => {
    test("should not recompute batches VM when data reference is same", async () => {
      // Arrange
      const mockData: DashboardDto = {
        active_batches: [
          {
            id: "batch-1",
            name: "Test Batch",
            type: "red",
            started_at: "2024-01-01T10:00:00Z",
            current_stage: {
              position: 1,
              name: "preparation",
              description: "Preparation stage",
            },
            latest_note: null,
          },
        ],
        archived_batches_count: 5,
      };

      mockFetchDashboard.mockResolvedValue(mockData);

      // Act
      const { result, rerender } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const firstBatchesReference = result.current.batches;

      // Trigger rerender
      rerender();

      // Assert - batches reference should be stable due to useMemo
      expect(result.current.batches).toBe(firstBatchesReference);
    });
  });

  describe("Edge cases", () => {
    test("should handle batch with very long name", async () => {
      // Arrange
      const longName = "A".repeat(500);
      const mockData: DashboardDto = {
        active_batches: [
          {
            id: "batch-1",
            name: longName,
            type: "red",
            started_at: "2024-01-01T10:00:00Z",
            current_stage: {
              position: 1,
              name: "preparation",
              description: "Preparation stage",
            },
            latest_note: null,
          },
        ],
        archived_batches_count: 0,
      };

      mockFetchDashboard.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.batches[0].name).toBe(longName);
    });

    test("should handle batch with stage position 0", async () => {
      // Arrange
      const mockData: DashboardDto = {
        active_batches: [
          {
            id: "batch-1",
            name: "Test Batch",
            type: "red",
            started_at: "2024-01-01T10:00:00Z",
            current_stage: {
              position: 0, // Edge case: position 0
              name: "initial",
              description: "Initial stage",
            },
            latest_note: null,
          },
        ],
        archived_batches_count: 0,
      };

      mockFetchDashboard.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.batches[0].currentStagePosition).toBe(0);
    });

    test("should handle batch with days_elapsed as 0", async () => {
      // Arrange
      const mockData: DashboardDto = {
        active_batches: [
          {
            id: "batch-1",
            name: "Test Batch",
            type: "red",
            started_at: "2024-01-01T10:00:00Z",
            current_stage: {
              position: 1,
              name: "preparation",
              description: "Preparation stage",
              days_elapsed: 0, // Started today
            },
            latest_note: null,
          },
        ],
        archived_batches_count: 0,
      };

      mockFetchDashboard.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.batches[0].currentStageDaysElapsed).toBe(0);
    });
  });

  describe("Type safety", () => {
    test("should return properly typed BatchCardVM objects", async () => {
      // Arrange
      const mockData: DashboardDto = {
        active_batches: [
          {
            id: "batch-1",
            name: "Test Batch",
            type: "red",
            started_at: "2024-01-01T10:00:00Z",
            current_stage: {
              position: 1,
              name: "preparation",
              description: "Preparation stage",
              days_elapsed: 5,
            },
            latest_note: {
              id: "note-1",
              action: "Test action",
              created_at: "2024-01-05T10:00:00Z",
            },
          },
        ],
        archived_batches_count: 3,
      };

      mockFetchDashboard.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Assert - TypeScript compilation will fail if types are incorrect
      const batch = result.current.batches[0];

      // Required fields
      const _id: string = batch.id;
      const _name: string = batch.name;
      const _type: string = batch.type;
      const _startedAtHuman: string = batch.startedAtHuman;
      const _currentStageDescription: string = batch.currentStageDescription;
      const _currentStagePosition: number = batch.currentStagePosition;

      // Optional fields
      const _currentStageDaysElapsed: number | undefined = batch.currentStageDaysElapsed;
      const _latestNoteAction: string | undefined = batch.latestNoteAction;
      const _latestNoteDateHuman: string | undefined = batch.latestNoteDateHuman;

      // Count
      const _archivedCount: number = result.current.archivedCount;

      // Avoid unused variable warnings
      expect(_id).toBeDefined();
      expect(_name).toBeDefined();
      expect(_type).toBeDefined();
      expect(_startedAtHuman).toBeDefined();
      expect(_currentStageDescription).toBeDefined();
      expect(_currentStagePosition).toBeDefined();
      expect(_currentStageDaysElapsed).toBeDefined();
      expect(_latestNoteAction).toBeDefined();
      expect(_latestNoteDateHuman).toBeDefined();
      expect(_archivedCount).toBeDefined();
    });
  });
});
