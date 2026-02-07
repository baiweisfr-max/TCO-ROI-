import { Inputs } from './types';

export const HOURS_IN_YEAR = 8760; // 365 * 24

export const DEFAULT_INPUTS: Inputs = {
  annualRevenue: 100000000, // 1 Yi (100 million)
  hardwareCost: 150000,
  monthlyPowerCooling: 2500,
  monthlyBandwidth: 1000,
  adminCount: 2,
  adminMonthlySalary: 6000,
  maintenanceYearlyRate: 15, // 15% of hardware cost per year
  annualCloudBill: 54000, // 4500 * 12
  migrationCost: 25000,
  onPremSla: 99.5,
  cloudSla: 99.975,
};