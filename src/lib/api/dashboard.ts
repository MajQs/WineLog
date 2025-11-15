/**
 * Dashboard API client
 * Fetches dashboard data from the backend
 */

import type { DashboardDto } from "../../types";
import { fetchWithAuth } from "./fetch";

/**
 * Fetches dashboard data for the authenticated user
 *
 * @returns Dashboard data with active batches and archived count
 */
export async function fetchDashboard(): Promise<DashboardDto> {
  return fetchWithAuth<DashboardDto>("/api/v1/dashboard");
}
