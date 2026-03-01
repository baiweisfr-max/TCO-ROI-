import { Inputs } from './types';

export const HOURS_IN_YEAR = 8760; // 365 * 24

export const DEFAULT_INPUTS: Inputs = {
  annualRevenue: 100000000, // 1 Yi (100 million)
  
  // On-Prem
  hardwareCost: 100000,
  hardwareMaintenanceYearlyRate: 10, // 10%
  softwareCost: 50000,
  softwareMaintenanceYearlyRate: 20, // 20%
  
  annualPowerCooling: 30000, // 2500 * 12
  annualBandwidth: 12000,    // 1000 * 12
  adminCount: 2,
  adminAnnualSalary: 72000,  // 6000 * 12
  
  // Cloud
  annualCloudBill: 54000, // 4500 * 12
  migrationCost: 25000,
  
  // SLA
  onPremSla: 99.5,
  cloudSla: 99.975,
};