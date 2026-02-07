import React from 'react';
import { SimulationResult, Inputs } from '../types';
import { formatCurrencyDetailed } from '../utils/calculations';
import { FileText, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface ExecutiveSummaryProps {
  results: SimulationResult;
  inputs: Inputs;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ results, inputs }) => {
  const yearlySlaBenefit = results.slaBenefit5Year / 5;
  const downtimeDiff = (inputs.cloudSla - inputs.onPremSla).toFixed(2);
  
  // Logic to determine if "Good" (Savings > 0)
  const isNetPositive = results.totalSavings5Year > 0;
  
  // Logic for ROI Text:
  // If ROI is negative because Cloud Cost < OnPrem Cost, it is "Cost Reduction + Benefit" (Best case)
  const isCloudCheaper = results.data[4].cloudDirectCumulative < results.data[4].onPremDirectCumulative;
  const roiValue = results.roi.toFixed(1);

  return (
    <div className="mt-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-slate-900">总结与建议</h3>
      </div>
      
      <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Key Takeaway 1: ROI */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <TrendingUp className="w-5 h-5" />
            <span className="font-bold uppercase text-xs tracking-wider">财务影响 (Financial)</span>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            {isCloudCheaper ? (
               <span>
                 云端 IT 成本低于本地自建，同时 SLA 价值提升。这属于<span className="text-emerald-700 font-bold">“降本增效”</span>的最佳财务场景，直接 ROI 为负值（因无需额外投入）。
               </span>
            ) : (
               <span>
                 为获取更高 SLA 而支付的额外云成本，预计在 5 年内产生 <span className="text-emerald-700 font-bold">{roiValue}%</span> 的投资回报率 (ROI)。
               </span>
            )}
            预计盈亏平衡点 (Break-even point) 将出现在 <span className="text-slate-900 font-bold">{results.breakEvenYear ? `第 ${results.breakEvenYear} 年` : '5 年后'}</span>。
          </p>
        </div>

        {/* Key Takeaway 2: SLA & Risk */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-bold uppercase text-xs tracking-wider">风险规避 (SLA Risk)</span>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            通过将服务可用性从 {inputs.onPremSla}% 提升至 {inputs.cloudSla}% (提升了 {downtimeDiff}%)，
            企业每年可避免约 <span className="text-amber-700 font-bold">{formatCurrencyDetailed(yearlySlaBenefit)}</span> 的宕机损失 
            (含业务营收损失与紧急运维成本)。
          </p>
        </div>

        {/* Key Takeaway 3: Strategic */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-blue-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-bold uppercase text-xs tracking-wider">战略建议 (Recommendation)</span>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            {isNetPositive 
              ? "分析数据强烈支持上云策略。硬件资本支出 (CapEx) 的减少以及显著的 SLA 风险规避收益，已超过迁移成本和云运营支出。" 
              : "分析建议谨慎行事。虽然 SLA 收益明显，但高昂的月度云运营成本可能需要优化（如使用预留实例/节省计划）以证明迁移的经济合理性。"}
          </p>
        </div>
      </div>
    </div>
  );
};