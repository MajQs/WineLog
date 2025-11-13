/**
 * Unit tests for useCreateBatch hook
 * Tests mutation logic, cache invalidation, error handling, and business rules
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useCreateBatch } from "./useCreateBatch";
import type { CreateBatchCommand, BatchDto } from "@/types";

// Mock the API module
vi.mock("../api/batch", () => ({
  createBatch: vi.fn(),
}));

import { createBatch } from "../api/batch";

// Type-safe mock
const mockCreateBatch = vi.mocked(createBatch);

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
      mutations: {
        retry: false, // Disable mutation retries for faster tests
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

/**
 * Helper to create mock BatchDto
 */
function createMockBatch(overrides?: Partial<BatchDto>): BatchDto {
  return {
    id: "batch-123",
    user_id: "user-456",
    template_id: "template-789",
    name: "Cabernet Sauvignon 2024",
    type: "red",
    status: "active",
    started_at: "2024-01-15T10:00:00Z",
    completed_at: null,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    stages: [
      {
        id: "stage-1",
        batch_id: "batch-123",
        template_stage_id: "template-stage-1",
        position: 1,
        name: "preparation",
        description: "Preparation stage",
        instructions: "Prepare the grapes",
        materials: ["grapes", "yeast"],
        days_min: 1,
        days_max: 3,
        started_at: "2024-01-15T10:00:00Z",
        completed_at: null,
        status: "in_progress",
      },
    ],
    current_stage_position: 1,
    ...overrides,
  };
}

describe("useCreateBatch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Successful batch creation", () => {
    test("should create batch with template_id only", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
      };

      const mockBatch = createMockBatch();
      mockCreateBatch.mockResolvedValue(mockBatch);

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockCreateBatch).toHaveBeenCalledWith(command);
      expect(mockCreateBatch).toHaveBeenCalledTimes(1);
      expect(result.current.data).toEqual(mockBatch);
      expect(result.current.isError).toBe(false);
    });

    test("should create batch with template_id and custom name", async () => {
      // Arrange
      const customName = "My Custom Batch Name";
      const command: CreateBatchCommand = {
        template_id: "template-789",
        name: customName,
      };

      const mockBatch = createMockBatch({ name: customName });
      mockCreateBatch.mockResolvedValue(mockBatch);

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockCreateBatch).toHaveBeenCalledWith(command);
      expect(result.current.data?.name).toBe(customName);
    });

    test("should return complete BatchDto with all fields", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
      };

      const mockBatch = createMockBatch({
        stages: [
          {
            id: "stage-1",
            batch_id: "batch-123",
            template_stage_id: "template-stage-1",
            position: 1,
            name: "preparation",
            description: "Preparation stage",
            instructions: "Prepare the grapes",
            materials: ["grapes", "yeast"],
            days_min: 1,
            days_max: 3,
            started_at: "2024-01-15T10:00:00Z",
            completed_at: null,
            status: "in_progress",
          },
          {
            id: "stage-2",
            batch_id: "batch-123",
            template_stage_id: "template-stage-2",
            position: 2,
            name: "fermentation",
            description: "Fermentation stage",
            instructions: "Monitor fermentation",
            materials: null,
            days_min: 7,
            days_max: 14,
            started_at: null,
            completed_at: null,
            status: "pending",
          },
        ],
      });

      mockCreateBatch.mockResolvedValue(mockBatch);

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const batch = result.current.data;
      expect(batch).toBeDefined();
      expect(batch?.id).toBe("batch-123");
      expect(batch?.name).toBe("Cabernet Sauvignon 2024");
      expect(batch?.type).toBe("red");
      expect(batch?.status).toBe("active");
      expect(batch?.stages).toHaveLength(2);
      expect(batch?.current_stage_position).toBe(1);
    });
  });

  describe("Cache invalidation", () => {
    test("should invalidate batches cache on success", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
      };

      const mockBatch = createMockBatch();
      mockCreateBatch.mockResolvedValue(mockBatch);

      const queryClient = new QueryClient({
        defaultOptions: {
          mutations: { retry: false },
        },
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      // Act
      const { result } = renderHook(() => useCreateBatch(), { wrapper });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["batches"],
      });
    });

    test("should invalidate dashboard cache on success", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
      };

      const mockBatch = createMockBatch();
      mockCreateBatch.mockResolvedValue(mockBatch);

      const queryClient = new QueryClient({
        defaultOptions: {
          mutations: { retry: false },
        },
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      // Act
      const { result } = renderHook(() => useCreateBatch(), { wrapper });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["dashboard"],
      });
    });

    test("should invalidate both caches on success", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
      };

      const mockBatch = createMockBatch();
      mockCreateBatch.mockResolvedValue(mockBatch);

      const queryClient = new QueryClient({
        defaultOptions: {
          mutations: { retry: false },
        },
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      // Act
      const { result } = renderHook(() => useCreateBatch(), { wrapper });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["batches"],
      });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["dashboard"],
      });
    });

    test("should not invalidate cache when mutation fails", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
      };

      mockCreateBatch.mockRejectedValue(new Error("API error"));

      const queryClient = new QueryClient({
        defaultOptions: {
          mutations: { retry: false },
        },
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      // Act
      const { result } = renderHook(() => useCreateBatch(), { wrapper });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(invalidateQueriesSpy).not.toHaveBeenCalled();
    });
  });

  describe("Error handling", () => {
    test("should handle API errors", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
      };

      const errorMessage = "Failed to create batch";
      mockCreateBatch.mockRejectedValue(new Error(errorMessage));

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.isSuccess).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
      expect((result.current.error as Error).message).toBe(errorMessage);
      expect(result.current.data).toBeUndefined();
    });

    test("should handle network errors", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
      };

      mockCreateBatch.mockRejectedValue(new Error("Network error"));

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeInstanceOf(Error);
      expect((result.current.error as Error).message).toBe("Network error");
    });

    test("should handle server errors (500)", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
      };

      mockCreateBatch.mockRejectedValue(
        new Error("Internal server error")
      );

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeInstanceOf(Error);
    });

    test("should handle validation errors", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "invalid-template",
      };

      mockCreateBatch.mockRejectedValue(
        new Error("Template not found")
      );

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isError).toBe(true));

      expect((result.current.error as Error).message).toBe("Template not found");
    });
  });

  describe("Mutation states", () => {
    test("should set isPending to true during mutation", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
      };

      const mockBatch = createMockBatch();
      
      // Create a promise that we can control
      let resolveMutation: (value: BatchDto) => void;
      const mutationPromise = new Promise<BatchDto>((resolve) => {
        resolveMutation = resolve;
      });

      mockCreateBatch.mockReturnValue(mutationPromise);

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert - should be pending immediately
      await waitFor(() => expect(result.current.isPending).toBe(true));
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);

      // Resolve the mutation
      resolveMutation!(mockBatch);

      await waitFor(() => expect(result.current.isPending).toBe(false));
    });

    test("should set isPending to false after success", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
      };

      const mockBatch = createMockBatch();
      mockCreateBatch.mockResolvedValue(mockBatch);

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    test("should set isPending to false after error", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
      };

      mockCreateBatch.mockRejectedValue(new Error("API error"));

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });

    test("should set isSuccess to true after successful mutation", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
      };

      const mockBatch = createMockBatch();
      mockCreateBatch.mockResolvedValue(mockBatch);

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
    });
  });

  describe("Edge cases", () => {
    test("should handle very long batch name", async () => {
      // Arrange
      const longName = "A".repeat(500);
      const command: CreateBatchCommand = {
        template_id: "template-789",
        name: longName,
      };

      const mockBatch = createMockBatch({ name: longName });
      mockCreateBatch.mockResolvedValue(mockBatch);

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockCreateBatch).toHaveBeenCalledWith(command);
      expect(result.current.data?.name).toBe(longName);
    });

    test("should handle batch name with special characters", async () => {
      // Arrange
      const specialName = "Batch #1 - Cabernet (2024) & Merlot 50%";
      const command: CreateBatchCommand = {
        template_id: "template-789",
        name: specialName,
      };

      const mockBatch = createMockBatch({ name: specialName });
      mockCreateBatch.mockResolvedValue(mockBatch);

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.name).toBe(specialName);
    });

    test("should handle batch name with unicode characters", async () => {
      // Arrange
      const unicodeName = "Wino Czerwone 🍷 Cabernet Sauvignon";
      const command: CreateBatchCommand = {
        template_id: "template-789",
        name: unicodeName,
      };

      const mockBatch = createMockBatch({ name: unicodeName });
      mockCreateBatch.mockResolvedValue(mockBatch);

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.name).toBe(unicodeName);
    });

    test("should handle empty string as name", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
        name: "",
      };

      const mockBatch = createMockBatch({ name: "" });
      mockCreateBatch.mockResolvedValue(mockBatch);

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockCreateBatch).toHaveBeenCalledWith(command);
    });

    test("should handle batch with no stages", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
      };

      const mockBatch = createMockBatch({ stages: [] });
      mockCreateBatch.mockResolvedValue(mockBatch);

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.stages).toEqual([]);
    });

    test("should handle batch with multiple stages", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
      };

      const mockBatch = createMockBatch({
        stages: [
          {
            id: "stage-1",
            batch_id: "batch-123",
            template_stage_id: "template-stage-1",
            position: 1,
            name: "preparation",
            description: "Preparation",
            instructions: "Prepare",
            materials: null,
            days_min: 1,
            days_max: 3,
            started_at: "2024-01-15T10:00:00Z",
            completed_at: null,
            status: "in_progress",
          },
          {
            id: "stage-2",
            batch_id: "batch-123",
            template_stage_id: "template-stage-2",
            position: 2,
            name: "fermentation",
            description: "Fermentation",
            instructions: "Monitor",
            materials: null,
            days_min: 7,
            days_max: 14,
            started_at: null,
            completed_at: null,
            status: "pending",
          },
          {
            id: "stage-3",
            batch_id: "batch-123",
            template_stage_id: "template-stage-3",
            position: 3,
            name: "aging",
            description: "Aging",
            instructions: "Age",
            materials: null,
            days_min: 30,
            days_max: 90,
            started_at: null,
            completed_at: null,
            status: "pending",
          },
        ],
      });

      mockCreateBatch.mockResolvedValue(mockBatch);

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.stages).toHaveLength(3);
    });
  });

  describe("Business rules", () => {
    test("should create batch with different wine types", async () => {
      // Test creating red wine
      const redCommand: CreateBatchCommand = {
        template_id: "template-red",
        name: "Red Wine",
      };

      const redBatch = createMockBatch({ name: "Red Wine", type: "red" });
      mockCreateBatch.mockResolvedValue(redBatch);

      const { result: redResult } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      redResult.current.mutate(redCommand);

      await waitFor(() => expect(redResult.current.isSuccess).toBe(true));
      expect(redResult.current.data?.type).toBe("red");

      // Test creating white wine
      const whiteCommand: CreateBatchCommand = {
        template_id: "template-white",
        name: "White Wine",
      };

      const whiteBatch = createMockBatch({ name: "White Wine", type: "white" });
      mockCreateBatch.mockResolvedValue(whiteBatch);

      const { result: whiteResult } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      whiteResult.current.mutate(whiteCommand);

      await waitFor(() => expect(whiteResult.current.isSuccess).toBe(true));
      expect(whiteResult.current.data?.type).toBe("white");

      // Test creating rosé wine
      const roseCommand: CreateBatchCommand = {
        template_id: "template-rose",
        name: "Rosé Wine",
      };

      const roseBatch = createMockBatch({ name: "Rosé Wine", type: "rose" });
      mockCreateBatch.mockResolvedValue(roseBatch);

      const { result: roseResult } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      roseResult.current.mutate(roseCommand);

      await waitFor(() => expect(roseResult.current.isSuccess).toBe(true));
      expect(roseResult.current.data?.type).toBe("rose");
    });

    test("should create batch with active status by default", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
      };

      const mockBatch = createMockBatch({ status: "active" });
      mockCreateBatch.mockResolvedValue(mockBatch);

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.status).toBe("active");
      expect(result.current.data?.completed_at).toBeNull();
    });

    test("should create batch with started_at timestamp", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
      };

      const startedAt = "2024-01-15T10:00:00Z";
      const mockBatch = createMockBatch({ started_at: startedAt });
      mockCreateBatch.mockResolvedValue(mockBatch);

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.started_at).toBe(startedAt);
      expect(new Date(result.current.data!.started_at).getTime()).toBeGreaterThan(0);
    });

    test("should create batch with first stage as current stage", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
      };

      const mockBatch = createMockBatch({
        current_stage_position: 1,
        stages: [
          {
            id: "stage-1",
            batch_id: "batch-123",
            template_stage_id: "template-stage-1",
            position: 1,
            name: "preparation",
            description: "Preparation stage",
            instructions: "Prepare the grapes",
            materials: ["grapes", "yeast"],
            days_min: 1,
            days_max: 3,
            started_at: "2024-01-15T10:00:00Z",
            completed_at: null,
            status: "in_progress",
          },
        ],
      });

      mockCreateBatch.mockResolvedValue(mockBatch);

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.current_stage_position).toBe(1);
      expect(result.current.data?.stages[0].status).toBe("in_progress");
      expect(result.current.data?.stages[0].started_at).toBeTruthy();
    });
  });

  describe("Multiple mutations", () => {
    test("should handle multiple sequential mutations", async () => {
      // Arrange
      const command1: CreateBatchCommand = {
        template_id: "template-1",
        name: "Batch 1",
      };

      const command2: CreateBatchCommand = {
        template_id: "template-2",
        name: "Batch 2",
      };

      const mockBatch1 = createMockBatch({ id: "batch-1", name: "Batch 1" });
      const mockBatch2 = createMockBatch({ id: "batch-2", name: "Batch 2" });

      mockCreateBatch
        .mockResolvedValueOnce(mockBatch1)
        .mockResolvedValueOnce(mockBatch2);

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      // First mutation
      result.current.mutate(command1);
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.id).toBe("batch-1");

      // Second mutation
      result.current.mutate(command2);
      await waitFor(() => expect(result.current.data?.id).toBe("batch-2"));
      expect(result.current.isSuccess).toBe(true);

      // Assert
      expect(mockCreateBatch).toHaveBeenCalledTimes(2);
    });

    test("should reset error state on new mutation", async () => {
      // Arrange
      const failingCommand: CreateBatchCommand = {
        template_id: "invalid-template",
      };

      const successCommand: CreateBatchCommand = {
        template_id: "template-789",
      };

      mockCreateBatch
        .mockRejectedValueOnce(new Error("Template not found"))
        .mockResolvedValueOnce(createMockBatch());

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      // First mutation fails
      result.current.mutate(failingCommand);
      await waitFor(() => expect(result.current.isError).toBe(true));

      // Second mutation succeeds
      result.current.mutate(successCommand);
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Assert
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("Type safety", () => {
    test("should accept valid CreateBatchCommand", async () => {
      // Arrange
      const command: CreateBatchCommand = {
        template_id: "template-789",
        name: "Test Batch",
      };

      const mockBatch = createMockBatch();
      mockCreateBatch.mockResolvedValue(mockBatch);

      // Act
      const { result } = renderHook(() => useCreateBatch(), {
        wrapper: createWrapper(),
      });

      // TypeScript will catch type errors at compile time
      result.current.mutate(command);

      // Assert
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Type assertions
      const batch = result.current.data;
      const _id: string = batch!.id;
      const _name: string = batch!.name;
      const _type: string = batch!.type;
      const _status: string = batch!.status;
      const _startedAt: string = batch!.started_at;
      const _stages: typeof batch!.stages = batch!.stages;

      expect(_id).toBeDefined();
      expect(_name).toBeDefined();
      expect(_type).toBeDefined();
      expect(_status).toBeDefined();
      expect(_startedAt).toBeDefined();
      expect(_stages).toBeDefined();
    });
  });
});

