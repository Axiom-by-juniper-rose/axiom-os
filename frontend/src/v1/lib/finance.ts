/**
 * Shared financial calculations — single source of truth.
 * All views (ProForma, Reports, DealAnalyzer) MUST use these.
 */

export interface FinCalcResult {
  totalLots: number;
  hardCosts: number;
  softCosts: number;
  fees: number;
  contingency: number;
  totalProjectCost: number;
  revenue: number;
  profit: number;
  margin: number;
  roi: number;
}

export function calcFinancials(fin: Record<string, any>): FinCalcResult {
  const totalLots = fin.totalLots || 0;
  const salesPrice = fin.salesPricePerLot || 0;
  const landCost = fin.landCost || 0;
  const closingCosts = fin.closingCosts || 0;
  const hardCosts = totalLots * (fin.hardCostPerLot || 0);
  const softCosts = (landCost + hardCosts) * ((fin.softCostPct || 0) / 100);
  const fees = (fin.planningFees || 0)
    + ((fin.permitFeePerLot || 0) + (fin.schoolFee || 0) + (fin.impactFeePerLot || 0)) * totalLots;
  const contingency = hardCosts * ((fin.contingencyPct || 0) / 100);
  const totalProjectCost = landCost + closingCosts + hardCosts + softCosts + contingency + fees;
  const revenue = totalLots * salesPrice * (1 - (fin.salesCommission || 3) / 100);
  const profit = revenue - totalProjectCost;
  const margin = safePercent(profit, revenue);
  const roi = safePercent(profit, totalProjectCost);

  return { totalLots, hardCosts, softCosts, fees, contingency, totalProjectCost, revenue, profit, margin, roi };
}

/** Safe percentage: returns 0 when denominator is 0/undefined/NaN */
export function safePercent(numerator: number, denominator: number): number {
  if (!denominator || !isFinite(denominator) || !isFinite(numerator)) return 0;
  return (numerator / denominator) * 100;
}

/** Format percentage for display, returning "—" for invalid values */
export function fmtPercent(value: number, decimals = 1): string {
  if (!isFinite(value)) return "—";
  return `${value.toFixed(decimals)}%`;
}
