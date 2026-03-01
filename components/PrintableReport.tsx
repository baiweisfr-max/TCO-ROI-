import React from 'react';
import { Inputs, SimulationResult } from '../types';
import { formatCurrency, formatCurrencyDetailed } from '../utils/calculations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { Activity, ShieldAlert, TrendingUp, Server, Cloud, AlertTriangle, CheckCircle2, Users } from 'lucide-react';

interface PrintableReportProps {
  inputs: Inputs;
  results: SimulationResult;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ inputs, results }) => {
  const currentDate = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  
  // Logic helpers
  const isCloudCheaper = results.data[4].cloudDirectCumulative < results.data[4].onPremDirectCumulative;
  const isNetPositive = results.totalSavings5Year > 0;
  const downtimeDiff = (inputs.cloudSla - inputs.onPremSla).toFixed(2);

  return (
    <div className="hidden print:block w-full max-w-[210mm] mx-auto bg-white text-slate-900 leading-relaxed font-sans">
      
      {/* --- PAGE 1: COVER & EXECUTIVE SUMMARY --- */}
      <div className="min-h-[290mm] flex flex-col relative page-break-after">
        
        {/* Header */}
        <header className="border-b-2 border-indigo-600 pb-6 mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">IT 基础设施上云战略分析报告</h1>
            <p className="text-slate-500 mt-2">TCO 成本测算与 ROI 投资回报评估</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end text-indigo-700 font-bold mb-1">
              <Activity className="w-5 h-5" />
              <span>CloudArchitect.ai</span>
            </div>
            <p className="text-sm text-slate-400">{currentDate}</p>
          </div>
        </header>

        {/* 1. Executive Summary */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-indigo-500 pl-3 uppercase tracking-wider">
            1. 高管摘要 (Executive Summary)
          </h2>
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg mb-6">
            <p className="text-slate-700 mb-4 text-justify">
              本报告基于企业当前的业务规模（年营收 {inputs.annualRevenue / 100000000} 亿元）与 IT 现状，
              对“本地自建数据中心”与“迁移至企业级托管云”两种模式进行了为期 5 年的全生命周期成本（TCO）与风险价值对比分析。
            </p>
            <p className="text-slate-700 text-justify">
              测算结果显示，{isNetPositive ? '上云策略具备显著的财务优势。' : '上云策略在财务上需要权衡，但SLA收益显著。'}
              通过将基础设施可用性从当前的 <strong>{inputs.onPremSla}%</strong> 提升至目标 <strong>{inputs.cloudSla}%</strong>，
              企业预计在 5 年内避免约 <strong>{formatCurrencyDetailed(results.slaBenefit5Year)}</strong> 的业务中断损失。
              {isCloudCheaper 
                ? '同时，云端直接 IT 支出低于本地自建，实现了“降本增效”的双重收益。' 
                : `尽管云端直接 IT 成本略高，但考虑到规避的风险，投资回报率 (ROI) 达到 ${results.roi.toFixed(1)}%。`
              }
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="border border-slate-200 rounded-lg p-4 text-center">
              <div className="text-sm text-slate-500 mb-1">5年总价值收益</div>
              <div className={`text-2xl font-bold ${isNetPositive ? 'text-emerald-600' : 'text-slate-700'}`}>
                {formatCurrencyDetailed(results.totalSavings5Year)}
              </div>
            </div>
            <div className="border border-slate-200 rounded-lg p-4 text-center">
              <div className="text-sm text-slate-500 mb-1">SLA 投资回报率 (ROI)</div>
              <div className="text-2xl font-bold text-indigo-600">
                {results.roi.toFixed(1)}%
              </div>
            </div>
            <div className="border border-slate-200 rounded-lg p-4 text-center">
              <div className="text-sm text-slate-500 mb-1">盈亏平衡点</div>
              <div className="text-2xl font-bold text-slate-700">
                {results.breakEvenYear ? `第 ${results.breakEvenYear} 年` : '> 5 年'}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Recommendation */}
        <section className="flex-grow">
           <h2 className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-emerald-500 pl-3 uppercase tracking-wider">
            2. 战略建议 (Recommendation)
          </h2>
          <div className="border-l-2 border-slate-200 pl-6 py-2 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-600"/>
                业务连续性优先
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                当前本地架构 ({inputs.onPremSla}%) 每年隐含约 {(24 * 365 * (1 - inputs.onPremSla/100)).toFixed(1)} 小时的业务中断风险。
                建议立即启动上云计划以利用云厂商的冗余基础设施，消除单点故障。
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600"/>
                资产模式转型
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                从重资产的 CapEx (硬件采购) 模式转向弹性的 OpEx (按需付费) 模式。
                虽然云端年度账单可能看似较高，但考虑到本地硬件维保（每年 {inputs.hardwareMaintenanceYearlyRate}%）和运维人力成本的隐性增长，云模式在长期运营中更具可预测性。
              </p>
            </div>
          </div>
        </section>

        {/* Footer Page 1 */}
        <div className="mt-auto border-t border-slate-200 pt-4 flex justify-between text-xs text-slate-400">
          <span>Cloud Migration Feasibility Study</span>
          <span>Page 1 / 3</span>
        </div>
      </div>

      {/* --- PAGE 2: DETAILED FINANCIALS --- */}
      <div className="min-h-[290mm] flex flex-col relative page-break-after pt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 border-l-4 border-indigo-500 pl-3 uppercase tracking-wider">
          3. 财务详情：5年 TCO 预测
        </h2>

        {/* Chart (Static version for print) */}
        <div className="h-64 w-full mb-8 border border-slate-100 rounded-lg p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={results.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{fontSize: 12}} />
              <YAxis tickFormatter={(val) => formatCurrency(val)} tick={{fontSize: 12}} width={50} />
              <Legend />
              <Line type="monotone" dataKey="onPremCumulative" name="本地自建 (总拥有成本)" stroke="#e11d48" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="cloudCumulative" name="托管云 (总拥有成本)" stroke="#059669" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-center text-xs text-slate-400 mt-2">图表 1: 5年累计总拥有成本 (TCO) 趋势对比</p>
        </div>

        {/* Data Table */}
        <div className="mb-8">
          <h3 className="font-bold text-slate-700 mb-3 text-sm">年度现金流与成本明细表</h3>
          <table className="w-full text-sm text-left border-collapse border border-slate-200">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="border border-slate-200 p-2">年份</th>
                <th className="border border-slate-200 p-2">本地 IT 支出</th>
                <th className="border border-slate-200 p-2">本地宕机风险成本</th>
                <th className="border border-slate-200 p-2 bg-indigo-50">云端 IT 支出</th>
                <th className="border border-slate-200 p-2 bg-indigo-50">云端宕机风险成本</th>
                <th className="border border-slate-200 p-2 font-bold text-emerald-700">累计净节省</th>
              </tr>
            </thead>
            <tbody>
              {results.data.map((row) => (
                <tr key={row.year} className="even:bg-slate-50">
                  <td className="border border-slate-200 p-2 font-medium">第 {row.year} 年</td>
                  <td className="border border-slate-200 p-2">{formatCurrency(row.onPremDirectCumulative)}</td>
                  <td className="border border-slate-200 p-2 text-rose-600">{formatCurrency(row.onPremDowntimeCost)}</td>
                  <td className="border border-slate-200 p-2 bg-indigo-50/30">{formatCurrency(row.cloudDirectCumulative)}</td>
                  <td className="border border-slate-200 p-2 text-emerald-600 bg-indigo-50/30">{formatCurrency(row.cloudDowntimeCost)}</td>
                  <td className="border border-slate-200 p-2 font-bold text-emerald-700">{formatCurrency(row.savingsCumulative)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-2">
            * 注：本地 IT 支出包含初始软硬件 CapEx、电力、带宽、运维人力及维保费用。云端 IT 支出包含迁移费及年度订阅费。
          </p>
        </div>

        {/* SLA Deep Dive Table (Static) */}
        <section className="mt-auto mb-8">
           <h2 className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-amber-500 pl-3 uppercase tracking-wider">
            4. 架构与风险评估
          </h2>
          <div className="border border-slate-200 rounded-lg overflow-hidden text-sm">
             <div className="grid grid-cols-12 bg-slate-100 border-b border-slate-200 font-bold p-2 text-slate-700">
               <div className="col-span-3">评估维度</div>
               <div className="col-span-4">本地自建 (AS-IS)</div>
               <div className="col-span-5">托管云 (TO-BE)</div>
             </div>
             
             {/* Rows */}
             <div className="grid grid-cols-12 border-b border-slate-100 p-3">
               <div className="col-span-3 font-medium text-slate-600">SLA 可用性</div>
               <div className="col-span-4 text-rose-700 font-bold">{inputs.onPremSla}% (年宕机 {(24*365*(1-inputs.onPremSla/100)).toFixed(1)}h)</div>
               <div className="col-span-5 text-emerald-700 font-bold">{inputs.cloudSla}% (年宕机 {(24*365*(1-inputs.cloudSla/100)).toFixed(1)}h)</div>
             </div>

             <div className="grid grid-cols-12 border-b border-slate-100 p-3 bg-slate-50">
               <div className="col-span-3 font-medium text-slate-600">物理冗余</div>
               <div className="col-span-4 text-slate-600">单机房，通常无发电机，依赖大楼供电</div>
               <div className="col-span-5 text-slate-600">Tier 3+ 数据中心，双路市电+柴发，跨可用区容灾</div>
             </div>

             <div className="grid grid-cols-12 border-b border-slate-100 p-3">
               <div className="col-span-3 font-medium text-slate-600">监控与响应</div>
               <div className="col-span-4 text-slate-600">被动响应，缺乏全链路监控，定位困难</div>
               <div className="col-span-5 text-slate-600">AIOps 主动防御，7x24 NOC 专家支持，秒级根因定位</div>
             </div>

             <div className="grid grid-cols-12 p-3 bg-slate-50">
               <div className="col-span-3 font-medium text-slate-600">硬件维护</div>
               <div className="col-span-4 text-slate-600">需停机维护，备件更换周期长</div>
               <div className="col-span-5 text-slate-600">热迁移技术 (Live Migration)，底层硬件故障对业务透明</div>
             </div>
          </div>
        </section>

        {/* Footer Page 2 */}
        <div className="mt-auto border-t border-slate-200 pt-4 flex justify-between text-xs text-slate-400">
          <span>Cloud Migration Feasibility Study</span>
          <span>Page 2 / 3</span>
        </div>
      </div>

      {/* --- PAGE 3: APPENDIX --- */}
      <div className="min-h-[290mm] flex flex-col relative pt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 border-l-4 border-slate-500 pl-3 uppercase tracking-wider">
          附录：测算参数设定
        </h2>
        
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
           <p className="text-sm text-slate-500 mb-6">以下参数构成了本次 TCO 模型的基础。如需调整测算结果，请更新以下假设条件。</p>
           
           <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
              <div>
                 <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3">业务基础信息</h4>
                 <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">年总营收</span>
                    <span className="font-mono">{formatCurrencyDetailed(inputs.annualRevenue)}</span>
                 </div>
                 <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">本地自建SLA</span>
                    <span className="font-mono">{inputs.onPremSla}%</span>
                 </div>
                 <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">云上SLA</span>
                    <span className="font-mono">{inputs.cloudSla}%</span>
                 </div>
              </div>

              <div>
                 <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3">本地自建成本 (AS-IS)</h4>
                 <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">硬件采购 (CapEx)</span>
                    <span className="font-mono">{formatCurrencyDetailed(inputs.hardwareCost)}</span>
                 </div>
                 <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">硬件维保</span>
                    <span className="font-mono">{inputs.hardwareMaintenanceYearlyRate}%</span>
                 </div>
                 <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">软件采购成本</span>
                    <span className="font-mono">{formatCurrencyDetailed(inputs.softwareCost)}</span>
                 </div>
                 <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">软件维保</span>
                    <span className="font-mono">{inputs.softwareMaintenanceYearlyRate}%</span>
                 </div>
                 <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">运维人力 (人/年)</span>
                    <span className="font-mono">{inputs.adminCount} 人 * {formatCurrencyDetailed(inputs.adminAnnualSalary)}/年</span>
                 </div>
                 <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">年度电力成本</span>
                    <span className="font-mono">{formatCurrencyDetailed(inputs.annualPowerCooling + inputs.annualBandwidth)}</span>
                 </div>
              </div>

              <div>
                 <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3">云端成本 (TO-BE)</h4>
                 <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">年度云账单预算</span>
                    <span className="font-mono">{formatCurrencyDetailed(inputs.annualCloudBill)}</span>
                 </div>
                 <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">一次性迁移费用</span>
                    <span className="font-mono">{formatCurrencyDetailed(inputs.migrationCost)}</span>
                 </div>
              </div>
           </div>
        </div>
        
        <div className="mt-12 p-6 bg-amber-50 border border-amber-100 rounded-lg text-amber-900 text-sm">
           <strong>免责声明：</strong>
           <p className="mt-2">
             本报告基于用户输入的假设参数生成，仅供战略参考。实际迁移成本和云端账单可能因具体的云服务商定价策略、资源使用效率及业务增长情况而有所不同。建议在正式立项前进行详细的云资源盘点 (Assessment)。
           </p>
        </div>

        {/* Footer Page 3 */}
        <div className="mt-auto border-t border-slate-200 pt-4 flex justify-between text-xs text-slate-400">
          <span>Cloud Migration Feasibility Study</span>
          <span>Page 3 / 3</span>
        </div>
      </div>

    </div>
  );
};