import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { SimulationResult, Inputs } from '../types';
import { formatCurrency, formatCurrencyDetailed } from '../utils/calculations';
import { ArrowUpRight, ArrowDownRight, Info, Cloud, Activity } from 'lucide-react';

interface DashboardProps {
  results: SimulationResult;
  inputs: Inputs;
  onOpenSlaAnalysis: () => void;
}

const COLORS = ['#f43f5e', '#10b981', '#6366f1', '#f59e0b'];

// Helper Component for Logic Tooltips
const MetricTooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="group relative inline-block ml-2 align-text-bottom z-50">
    <Info className="w-4 h-4 text-slate-400 cursor-help hover:text-indigo-500 transition-colors" />
    {/* Tooltip positioned below (top-full) to avoid being hidden by sticky header */}
    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 p-4 bg-slate-800 text-slate-50 text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl border border-slate-700 leading-relaxed text-left pointer-events-none z-50">
      {children}
      {/* Arrow pointing up */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-slate-800"></div>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ results, inputs, onOpenSlaAnalysis }) => {
  
  // Prepare data for Pie Chart (Components of Savings)
  const totalOnPremCost = results.data[4].onPremCumulative;
  const totalCloudCost = results.data[4].cloudCumulative;
  
  const slaSavings = results.slaBenefit5Year;
  const rawCostSavings = (totalOnPremCost - slaSavings) - (totalCloudCost); 
  
  const pieData = [
    { name: 'SLA 风险规避收益', value: slaSavings > 0 ? slaSavings : 0 },
    { name: '设施与运维成本节省', value: rawCostSavings > 0 ? rawCostSavings : 0 },
  ].filter(d => d.value > 0);

  const isCloudMoreExpensive = results.totalSavings5Year < 0;
  
  // Check if Cloud Direct Cost < OnPrem Direct Cost (Denominator is negative)
  const isCloudCheaperDirectly = results.data[4].cloudDirectCumulative < results.data[4].onPremDirectCumulative;

  // New Metric: Total Cloud Direct Investment (5 Years)
  const cloudTotalInvestment = results.data[4].cloudDirectCumulative;

  return (
    <div className="space-y-6">
      
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Total Cloud Investment (Replaced Net Savings) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-visible z-10">
          <div className="absolute top-0 right-0 p-3 opacity-5 text-indigo-900 pointer-events-none overflow-hidden rounded-tr-xl">
            <Cloud size={64} />
          </div>
          <div className="flex items-center text-slate-500 text-sm font-medium mb-1">
            5年上云总投入
            <MetricTooltip>
              <div className="font-bold mb-2 text-slate-200 text-sm border-b border-slate-600 pb-1">计算逻辑</div>
              <div className="mb-2 font-mono">
                <span className="text-indigo-400">一次性迁移费</span> + (<span className="text-indigo-400">年云账单</span> × 5)
              </div>
              <ul className="list-disc pl-3 space-y-1.5 text-slate-300">
                <li>
                  <strong className="text-indigo-400/80">迁移成本:</strong> {formatCurrency(inputs.migrationCost)} (第0年)
                </li>
                <li>
                  <strong className="text-indigo-400/80">云服务支出:</strong> {formatCurrency(inputs.annualCloudBill)} × 5年
                </li>
              </ul>
            </MetricTooltip>
          </div>
          <h2 className="text-3xl font-bold text-slate-800">
            {formatCurrencyDetailed(cloudTotalInvestment)}
          </h2>
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
            <ArrowUpRight size={14} />
            <span>IT 基础设施直接支出 (CapEx + OpEx)</span>
          </div>
        </div>

        {/* Card 2: ROI */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-visible z-10">
           <div className="flex items-center text-slate-500 text-sm font-medium mb-1">
             SLA 投资回报率 (ROI)
             <MetricTooltip>
              <div className="font-bold mb-2 text-slate-200 text-sm border-b border-slate-600 pb-1">计算逻辑 (修正)</div>
              <div className="mb-3 font-mono text-center bg-slate-900/50 p-1.5 rounded border border-slate-700">
                 ( <span className="text-amber-400">本地SLA损失</span> - <span className="text-emerald-400">云端SLA损失</span> )
                 <br/>
                 <div className="w-full h-px bg-slate-500 my-1"></div>
                 ( <span className="text-emerald-400">云端IT成本</span> - <span className="text-amber-400">本地IT成本</span> )
              </div>
              <p className="text-slate-300">
                衡量为获取更高可用性(SLA)而支付的额外云成本的回报率。
              </p>
              <p className="text-emerald-400 mt-2 italic text-[10px]">
                *若云端IT成本低于本地（分母为负），ROI 为负值代表“降本增效”的最佳场景（省了钱还提升了SLA）。
              </p>
            </MetricTooltip>
           </div>
           <h2 className={`text-3xl font-bold ${isCloudCheaperDirectly ? 'text-emerald-600' : 'text-indigo-600'}`}>
             {formatCurrencyDetailed(results.roi)}%
           </h2>
           <p className="text-xs text-slate-500 mt-2">
             {isCloudCheaperDirectly 
                ? "云端成本更低 (降本增效)" 
                : `SLA 溢价投资回收期: ${results.roi > 0 ? (5 / (results.roi/100)).toFixed(1) + ' 年' : '无法回收'}`
             }
           </p>
        </div>

        {/* Card 3: SLA Benefit */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-visible z-10">
           <div className="flex items-center text-slate-500 text-sm font-medium mb-1">
             SLA 风险规避价值
             <MetricTooltip>
              <div className="font-bold mb-2 text-slate-200 text-sm border-b border-slate-600 pb-1">计算逻辑</div>
              <div className="mb-2">
                (本地预计宕机损失 - 云端预计宕机损失) × 5年
              </div>
              <div className="bg-slate-700/50 p-2 rounded mt-2">
                <div className="text-[10px] text-slate-400 mb-1 uppercase tracking-wider">单小时宕机成本公式</div>
                <div className="font-mono text-amber-400">
                  (每小时营收 + 运维排查人力)
                </div>
              </div>
              <p className="text-slate-300 mt-2">
                量化了更高可用性带来的直接财务价值（业务止损）。
              </p>
            </MetricTooltip>
           </div>
           <h2 className="text-3xl font-bold text-amber-600">{formatCurrencyDetailed(results.slaBenefit5Year)}</h2>
           <p className="text-xs text-slate-500 mt-2">5年内因更高可用性避免的损失</p>
        </div>
      </div>

      {/* SLA Deep Dive Trigger Banner */}
      <button
        onClick={onOpenSlaAnalysis}
        className="w-full group bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 hover:from-indigo-800 hover:via-indigo-700 hover:to-indigo-800 text-white rounded-xl p-4 shadow-md transition-all duration-300 flex items-center justify-between border border-slate-700 hover:border-indigo-500 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/10 p-3 rounded-lg group-hover:bg-white/20 transition-colors">
                <Activity className="w-6 h-6 text-indigo-300 group-hover:text-white" />
            </div>
            <div className="text-left">
                <h4 className="font-bold text-lg text-white group-hover:text-indigo-50 flex items-center gap-2">
                    SLA 差异深度解析
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-500/30 uppercase tracking-wider">Insight</span>
                </h4>
                <p className="text-sm text-slate-300 group-hover:text-indigo-100 mt-1 max-w-xl">
                    点击查看为什么 <span className="font-mono font-bold text-white mx-1">{inputs.onPremSla}%</span> 与 <span className="font-mono font-bold text-white mx-1">{inputs.cloudSla}%</span> 之间存在巨大的财务与技术鸿沟。
                </p>
            </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-indigo-300 group-hover:text-white transition-colors pr-4 relative z-10">
            查看详情 <ArrowUpRight className="w-4 h-4" />
        </div>
      </button>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Line Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm z-0">
          <div className="flex items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900">累计 TCO 分析 (仅 IT 成本)</h3>
            <MetricTooltip>
              <div className="font-bold mb-2 text-slate-200 text-sm border-b border-slate-600 pb-1">图表数据定义</div>
              <p className="mb-2 text-slate-300">
                此图表仅展示<strong className="text-white">直接财务支出</strong>，不包含潜在的业务宕机损失风险。
              </p>
              <ul className="list-disc pl-3 space-y-1.5 text-slate-300 font-mono text-[10px]">
                <li>
                  <strong className="text-rose-400">本地自建:</strong> 硬件与软件CapEx + 电力/机柜 + 带宽 + 运维人力 + 维保(第2年起)
                </li>
                <li>
                  <strong className="text-emerald-400">业务上云:</strong> 迁移费 + 云服务年账单
                </li>
              </ul>
            </MetricTooltip>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="year" 
                  stroke="#64748b" 
                  tickFormatter={(val) => `第 ${val} 年`} 
                  tick={{fill: '#64748b'}}
                />
                <YAxis 
                  stroke="#64748b" 
                  tickFormatter={(val) => formatCurrency(val)} 
                  width={60}
                  tick={{fill: '#64748b'}}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val: number) => formatCurrencyDetailed(val)}
                  labelStyle={{ color: '#64748b' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line 
                  type="linear" 
                  dataKey="onPremDirectCumulative" 
                  name="本地自建 (IT成本)" 
                  stroke="#e11d48" 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="linear" 
                  dataKey="cloudDirectCumulative" 
                  name="业务上云 (IT成本)" 
                  stroke="#059669" 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart / Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col z-0">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {isCloudMoreExpensive ? "云成本构成" : "总价值构成分析"}
          </h3>
          <p className="text-xs text-slate-500 mb-6">
             {isCloudMoreExpensive 
              ? "当前云 TCO 高于本地自建，请检查月度云支出。" 
              : "细分业务上云带来的总价值来源 (含 SLA 收益)。"}
          </p>
          
          <div className="flex-1 min-h-[250px] relative">
            {isCloudMoreExpensive ? (
              <div className="flex items-center justify-center h-full text-slate-400 italic text-sm text-center px-8">
                基于当前参数，5年内未达到盈亏平衡。
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#d97706' : '#059669'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: number) => formatCurrencyDetailed(val)}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#475569' }}/>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};