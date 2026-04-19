export interface CommunityMetricDto {
  label: string;
  value: number;
  helperText: string;
}

export interface CommunityDashboardDto {
  id: string;
  slug: string;
  name: string;
  region: string;
  district: string;
  center: string;
  metrics: CommunityMetricDto[];
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

export interface CommunityPlotDto {
  id: string;
  cadastralNumber: string;
  settlementName: string;
  location: string;
  ownerName: string;
  purpose: string;
  areaHa: number;
  taxNumber: string;
  status: 'active' | 'pending' | 'leased';
  coordinates: [number, number][];
}

export interface CommunityTaxDto {
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

export interface CommunityProfileDto {
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
