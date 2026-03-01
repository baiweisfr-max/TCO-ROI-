import React from 'react';
import { Inputs } from '../types';
import { HOURS_IN_YEAR } from '../constants';
import { formatCurrencyDetailed } from '../utils/calculations';
import { X, Server, Cloud, AlertTriangle, CheckCircle2, Clock, Zap, ShieldAlert, Users, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SLADetailedAnalysisModalProps {
  inputs: Inputs;
  onClose: () => void;
}

export const SLADetailedAnalysisModal: React.FC<SLADetailedAnalysisModalProps> = ({ inputs, onClose }) => {
  
  // Calculations
  const calcHours = (sla: number) => HOURS_IN_YEAR * (1 - sla / 100);
  const onPremHours = calcHours(inputs.onPremSla);
  const cloudHours = calcHours(inputs.cloudSla);
  const diffHours = onPremHours - cloudHours;

  const revenuePerHour = inputs.annualRevenue / HOURS_IN_YEAR;
  // Calculate hourly from annual: Annual / 12 months / 160 hours
  const laborCostPerHour = (inputs.adminAnnualSalary / (12 * 160)) * inputs.adminCount;
  const totalCostPerHour = revenuePerHour + laborCostPerHour;

  const onPremLoss = onPremHours * totalCostPerHour;
  const cloudLoss = cloudHours * totalCostPerHour;

  // Data for visual chart
  const comparisonData = [
    { name: '本地自建 (On-Prem)', hours: onPremHours, color: '#f43f5e' }, // Rose 500
    { name: '云端目标 (Cloud)', hours: cloudHours, color: '#10b981' },   // Emerald 500
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto flex flex-col relative animate-fade-in-up">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2.5 rounded-lg">
               <ShieldAlert className="w-6 h-6 text-indigo-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">SLA 深度解析与可用性差异</h2>
              <p className="text-sm text-slate-500">为什么“几个9”的差别对业务至关重要？</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-800"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-10">
          
          {/* Section 1: The High Level Impact */}
          <section className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-slate-50 rounded-xl p-6 border border-slate-200">
               <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <Clock className="w-5 h-5 text-indigo-600" />
                 年度停机时间对比 (小时)
               </h3>
               <div className="h-48 w-full flex gap-8 items-end">
                  {/* Custom Simple Bar Viz since Recharts can be overkill for 2 bars, but sticking to consistency if preferred. Using simple HTML bars for clearer control here */}
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="space-y-4">
                        {/* On-Prem Bar */}
                        <div>
                            <div className="flex justify-between text-sm mb-1 font-semibold text-rose-700">
                                <span>本地自建 ({inputs.onPremSla}%)</span>
                                <span>{onPremHours.toFixed(1)} 小时/年</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden relative">
                                <div className="absolute top-0 left-0 h-full bg-rose-500" style={{ width: '100%' }}></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">相当于约 {(onPremHours/24).toFixed(1)} 天的业务完全中断</p>
                        </div>
                        
                        {/* Cloud Bar */}
                        <div>
                            <div className="flex justify-between text-sm mb-1 font-semibold text-emerald-700">
                                <span>托管云 ({inputs.cloudSla}%)</span>
                                <span>{cloudHours.toFixed(1)} 小时/年</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden relative">
                                {/* Use percentage relative to on-prem for width */}
                                <div className="absolute top-0 left-0 h-full bg-emerald-500" style={{ width: `${(cloudHours / onPremHours) * 100}%`, minWidth: '4px' }}></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">大幅减少了 {diffHours.toFixed(1)} 小时的风险敞口</p>
                        </div>
                    </div>
                  </div>
                  
                  {/* Financial Impact Box */}
                  <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm w-72 shrink-0">
                      <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">年度风险价值差异</div>
                      <div className="text-3xl font-bold text-indigo-600 mb-1">
                          {formatCurrencyDetailed(onPremLoss - cloudLoss)}
                      </div>
                      <div className="text-xs text-slate-400 leading-snug">
                          通过提升 SLA，每年预估规避的直接经济损失（营收+人力）。
                      </div>
                  </div>
               </div>
            </div>

            <div className="bg-indigo-900 text-white rounded-xl p-6 shadow-lg flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={120} />
                </div>
                <h3 className="text-lg font-bold mb-4 z-10">宕机成本构成</h3>
                <ul className="space-y-4 text-indigo-100 z-10 text-sm">
                    <li className="flex justify-between items-center border-b border-indigo-700 pb-2">
                        <span>每小时营收损失</span>
                        <span className="font-mono font-bold text-white">{formatCurrencyDetailed(revenuePerHour)}</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-indigo-700 pb-2">
                        <span>每小时IT排查人力</span>
                        <span className="font-mono font-bold text-white">{formatCurrencyDetailed(laborCostPerHour)}</span>
                    </li>
                    <li className="pt-2">
                        <span className="text-xs opacity-70 block mb-1">隐性成本 (未计入模型):</span>
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-indigo-800 px-2 py-1 rounded text-xs">品牌商誉受损</span>
                            <span className="bg-indigo-800 px-2 py-1 rounded text-xs">客户流失</span>
                            <span className="bg-indigo-800 px-2 py-1 rounded text-xs">数据丢失风险</span>
                        </div>
                    </li>
                </ul>
            </div>
          </section>

          {/* Section 2: Deep Dive Comparison Table */}
          <section>
            <h3 className="font-bold text-slate-900 text-lg mb-4">核心架构差异分析</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-700">
                    <div className="col-span-3 p-4">风险领域</div>
                    <div className="col-span-4 p-4 flex items-center gap-2 text-rose-700">
                        <Server size={16} /> 本地自建 (On-Prem)
                    </div>
                    <div className="col-span-5 p-4 flex items-center gap-2 text-emerald-700">
                        <Cloud size={16} /> 企业级托管云 (Cloud)
                    </div>
                </div>

                {/* Row 1: Infrastructure */}
                <div className="grid grid-cols-12 border-b border-slate-100 text-sm">
                    <div className="col-span-3 p-4 bg-slate-50/50 font-medium text-slate-700">
                        电力与物理环境
                        <p className="text-xs text-slate-400 font-normal mt-1">能否抵御市电中断或空调故障？</p>
                    </div>
                    <div className="col-span-4 p-4 text-slate-600">
                        <div className="flex gap-2 items-start">
                            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <span><strong className="text-slate-800">单路供电风险:</strong> 通常仅依赖大楼UPS，缺乏发电机组。空调故障常导致服务器过热自动关机。</span>
                        </div>
                    </div>
                    <div className="col-span-5 p-4 text-slate-600 bg-emerald-50/10">
                        <div className="flex gap-2 items-start">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span><strong className="text-slate-800">Tier 3+ 标准:</strong> 双路市电 + N+1 UPS 冗余 + 柴油发电机组。承诺 99.99% 电力可用性。</span>
                        </div>
                    </div>
                </div>

                {/* Row 2: Maintenance */}
                <div className="grid grid-cols-12 border-b border-slate-100 text-sm">
                    <div className="col-span-3 p-4 bg-slate-50/50 font-medium text-slate-700">
                        计划性维护
                        <p className="text-xs text-slate-400 font-normal mt-1">打补丁、扩容是否影响业务？</p>
                    </div>
                    <div className="col-span-4 p-4 text-slate-600">
                        <div className="flex gap-2 items-start">
                            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <span>
                                <strong className="text-slate-800">技能与流程短板:</strong> 
                                本地运维人员技术栈有限（网络、存储、虚拟化、安全多领域交叉），变更操作依赖个人经验，缺乏标准化流程（SOP）约束，人为失误率高，维护压力高度集中。
                            </span>
                        </div>
                    </div>
                    <div className="col-span-5 p-4 text-slate-600 bg-emerald-50/10">
                        <div className="flex gap-2 items-start">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>
                                <strong className="text-slate-800">专家+SOP+自动化:</strong> 
                                变更由认证专家依托<span className="font-semibold text-emerald-700">标准化流程 (SOP)</span>与<span className="font-semibold text-emerald-700">自动化工具</span>执行，确保变更精准受控，最大程度降低人为风险。
                            </span>
                        </div>
                    </div>
                </div>

                {/* Row 3: Monitoring */}
                <div className="grid grid-cols-12 border-b border-slate-100 text-sm">
                    <div className="col-span-3 p-4 bg-slate-50/50 font-medium text-slate-700">
                        监控与故障响应
                        <p className="text-xs text-slate-400 font-normal mt-1">能否快速发现并定位问题根因？</p>
                    </div>
                    <div className="col-span-4 p-4 text-slate-600">
                        <div className="flex gap-2 items-start">
                            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <span>
                                <strong className="text-slate-800">被动响应 & 定位难:</strong> 
                                简单资源监控无法发现潜在隐患，导致事件响应滞后。缺乏全栈监控体系，出现问题需跨部门排查，无法快速定位根因，大幅延长业务中断时间。
                            </span>
                        </div>
                    </div>
                    <div className="col-span-5 p-4 text-slate-600 bg-emerald-50/10">
                        <div className="flex gap-2 items-start">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>
                                <strong className="text-slate-800">全栈监控 & AIOps:</strong> 
                                全栈监控+AIOps能力可提前发现风险，7x24小时专家将隐患扼杀在萌芽状态。事件发生时，系统能秒级定位根因并快速处置，大幅缩短故障时间。
                            </span>
                        </div>
                    </div>
                </div>

                {/* Row 4: People */}
                <div className="grid grid-cols-12 text-sm">
                    <div className="col-span-3 p-4 bg-slate-50/50 font-medium text-slate-700">
                        运维人力保障
                        <p className="text-xs text-slate-400 font-normal mt-1">谁来保障 24/7 响应？</p>
                    </div>
                    <div className="col-span-4 p-4 text-slate-600">
                        <div className="flex gap-2 items-start">
                            <Users className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <span><strong className="text-slate-800">有限人力:</strong> {inputs.adminCount} 名管理员难以实现真正的 7×24 值守。误操作和响应延迟是主要停机原因。</span>
                        </div>
                    </div>
                    <div className="col-span-5 p-4 text-slate-600 bg-emerald-50/10">
                        <div className="flex gap-2 items-start">
                            <Users className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span><strong className="text-slate-800">专家团队:</strong> 云厂商 NOC (网络运营中心) 提供 7×24 监控。标准化的操作流程 (SOP) 极大降低人为失误。</span>
                        </div>
                    </div>
                </div>
            </div>
          </section>

          {/* Section 3: Summary */}
          <section className="bg-slate-50 rounded-xl p-6 text-center border border-slate-200">
              <p className="text-slate-600 max-w-3xl mx-auto">
                  <span className="font-bold text-indigo-700">结论：</span> 
                  从 {inputs.onPremSla}% 到 {inputs.cloudSla}% 不仅仅是数字的变化，而是从“手动救火”模式向“自动化高可用”架构的质变。
                  虽然云端看似增加了直接 IT 支出，但其提供的<span className="font-semibold text-slate-900">业务连续性保险</span>价值每年高达 {formatCurrencyDetailed(onPremLoss - cloudLoss)}。
              </p>
          </section>

        </div>
      </div>
    </div>
  );
};