import { Inputs, SimulationResult, YearData } from '../types';
import { HOURS_IN_YEAR } from '../constants';

export const calculateTCO = (inputs: Inputs): SimulationResult => {
  const years = 5;
  const data: YearData[] = [];
  
  // 1. Calculate SLA / Downtime Metrics
  const revenuePerHour = inputs.annualRevenue / HOURS_IN_YEAR;
  
  const onPremDowntimeHours = HOURS_IN_YEAR * (1 - inputs.onPremSla / 100);
  const cloudDowntimeHours = HOURS_IN_YEAR * (1 - inputs.cloudSla / 100);

  const hourlyLaborCost = (inputs.adminMonthlySalary / 160) * inputs.adminCount;
  const downtimeCostPerHour = revenuePerHour + hourlyLaborCost;

  const onPremYearlyDowntimeCost = onPremDowntimeHours * downtimeCostPerHour;
  const cloudYearlyDowntimeCost = cloudDowntimeHours * downtimeCostPerHour;

  const slaBenefitYearly = onPremYearlyDowntimeCost - cloudYearlyDowntimeCost;

  // 2. Yearly Operational Costs
  // Split Maintenance from other OpEx to handle Year 1 Warranty logic
  const yearlyMaintenanceCost = inputs.hardwareCost * (inputs.maintenanceYearlyRate / 100);

  const onPremBaseOpEx = 
    (inputs.monthlyPowerCooling * 12) + 
    (inputs.monthlyBandwidth * 12) + 
    (inputs.adminMonthlySalary * 12 * inputs.adminCount);

  const cloudOpEx = inputs.annualCloudBill;

  let onPremCumulative = inputs.hardwareCost; // Year 0 CapEx
  let cloudCumulative = inputs.migrationCost; // Year 0 Migration Cost

  // Track Direct Costs separately (IT Spending only, excluding downtime risk)
  let onPremDirectCumulative = inputs.hardwareCost;
  let cloudDirectCumulative = inputs.migrationCost;

  let breakEvenYear: number | null = null;

  for (let i = 1; i <= years; i++) {
    // Determine OpEx for this year
    // FIX: Exclude maintenance cost in Year 1 (typically covered by hardware purchase warranty)
    const currentYearOnPremOpEx = onPremBaseOpEx + (i === 1 ? 0 : yearlyMaintenanceCost);

    // Add OpEx + Downtime Risk (Total Value View)
    onPremCumulative += currentYearOnPremOpEx + onPremYearlyDowntimeCost;
    cloudCumulative += cloudOpEx + cloudYearlyDowntimeCost;

    // Add OpEx Only (Direct IT Cost View)
    onPremDirectCumulative += currentYearOnPremOpEx;
    cloudDirectCumulative += cloudOpEx;

    // Break-even is calculated based on Total Value (when savings > cost)
    if (breakEvenYear === null && cloudCumulative < onPremCumulative) {
      breakEvenYear = i;
    }

    data.push({
      year: i,
      onPremCumulative,
      cloudCumulative,
      onPremDirectCumulative,
      cloudDirectCumulative,
      onPremDowntimeCost: onPremYearlyDowntimeCost * i,
      cloudDowntimeCost: cloudYearlyDowntimeCost * i,
      savingsCumulative: onPremCumulative - cloudCumulative
    });
  }

  // 3. ROI Calculation
  // New Logic: (SLA Benefit) / (Cloud IT Cost - OnPrem IT Cost)
  // Meaning: The return on the EXTRA cost paid for Cloud to get better SLA.
  
  const totalSlaBenefit = slaBenefitYearly * years;
  
  const totalCostOnPremDirect = data[years - 1].onPremDirectCumulative;
  const totalCostCloudDirect = data[years - 1].cloudDirectCumulative;
  
  // The "Investment" is the difference in IT spend. 
  // If Cloud is more expensive, this is positive.
  const costDifference = totalCostCloudDirect - totalCostOnPremDirect;
  
  let roi = 0;
  if (costDifference !== 0) {
    roi = (totalSlaBenefit / costDifference) * 100;
  } else {
    roi = 0;
  }

  // Calculate Total Net Savings (Total Value)
  const totalCostOnPrem = data[years - 1].onPremCumulative;
  const totalCostCloud = data[years - 1].cloudCumulative;
  const netSavings = totalCostOnPrem - totalCostCloud;

  return {
    data,
    totalSavings5Year: netSavings,
    roi,
    breakEvenYear,
    slaBenefit5Year: totalSlaBenefit
  };
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
    notation: "compact", 
    compactDisplay: "short"
  }).format(val);
};

export const formatCurrencyDetailed = (val: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(val);
};