export interface Inputs {
  // Business Metrics
  annualRevenue: number;
  
  // On-Prem Costs
  hardwareCost: number; // CapEx (Year 0)
  hardwareMaintenanceYearlyRate: number; // % of hardware cost
  
  softwareCost: number; // New: CapEx (Year 0) - OS, DB, Virtualization, etc.
  softwareMaintenanceYearlyRate: number; // New: % of software cost
  
  annualPowerCooling: number; // Changed from monthly
  annualBandwidth: number;    // Changed from monthly
  adminCount: number;
  adminAnnualSalary: number;  // Changed from monthly
  
  // Cloud Costs
  annualCloudBill: number;
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