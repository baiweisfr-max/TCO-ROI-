export interface Inputs {
  // Business Metrics
  annualRevenue: number;
  
  // On-Prem Costs
  hardwareCost: number; // CapEx (Year 0)
  monthlyPowerCooling: number;
  monthlyBandwidth: number;
  adminCount: number;
  adminMonthlySalary: number;
  maintenanceYearlyRate: number; // % of hardware cost
  
  // Cloud Costs
  annualCloudBill: number; // Changed from monthlyCloudBill
  migrationCost: number; // One-time
  
  // Advanced / SLA
  onPremSla: number; // e.g., 99.5
  cloudSla: number; // e.g., 99.99
}

export interface YearData {
  year: number;
  onPremCumulative: number;      // Total (IT + Downtime Risk)
  cloudCumulative: number;       // Total (IT + Downtime Risk)
  onPremDirectCumulative: number; // Direct IT Cost Only
  cloudDirectCumulative: number;  // Direct IT Cost Only
  onPremDowntimeCost: number;
  cloudDowntimeCost: number;
  savingsCumulative: number;
}

export interface SimulationResult {
  data: YearData[];
  totalSavings5Year: number;
  roi: number;
  breakEvenYear: number | null;
  slaBenefit5Year: number; // How much specifically saved due to uptime
}