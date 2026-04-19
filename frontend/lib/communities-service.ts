import { ApiClient } from "./api-client";

export interface CommunityMetric {
  label: string;
  value: number;
  helperText: string;
}

export interface CommunityDashboard {
  id: string;
  slug: string;
  name: string;
  region: string;
  district: string;
  center: string;
  metrics: CommunityMetric[];
  settlements: {
    name: string;
    type: string;
    plotCount: number;
  }[];
  taxesSummary: {
    totalTaxes: number;
    totalPayers: number;
    estimatedAnnualRevenue: number;
  };
}

export interface CommunityPlot {
  id: string;
  cadastralNumber: string;
  settlementName: string;
  location: string;
  ownerName: string;
  purpose: string;
  areaHa: number;
  taxNumber: string;
  status: "active" | "pending" | "leased";
  coordinates: [number, number][];
}

export interface CommunityTax {
  id: string;
  type: string;
  name: string;
  rate: string;
  unit: string;
  payerCount: number;
  annualRevenue: number;
  isActive: boolean;
  description: string;
}

export interface CommunityProfile {
  id: string;
  slug: string;
  name: string;
  region: string;
  district: string;
  center: string;
  accountEmail: string;
  contactPhone: string;
  settlements: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export class CommunitiesService {
  static async getProfile(slug: string): Promise<CommunityProfile> {
    return ApiClient.get(`/communities/${slug}`);
  }

  static async getDashboard(slug: string): Promise<any> {
    return ApiClient.get(`/communities/${slug}/dashboard`);
  }

  static async getPlots(
    slug: string,
    settlement?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<CommunityPlot>> {
    const params = new URLSearchParams();
    if (settlement) params.append("settlement", encodeURIComponent(settlement));
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    return ApiClient.get(`/communities/${slug}/plots?${params.toString()}`);
  }

  static async getTaxes(
    slug: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<CommunityTax>> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    return ApiClient.get(`/communities/${slug}/taxes?${params.toString()}`);
  }
}
