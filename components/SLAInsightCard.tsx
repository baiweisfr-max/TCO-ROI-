import React from 'react';
import { Clock, ServerCrash } from 'lucide-react';
import { HOURS_IN_YEAR } from '../constants';

interface SLAInsightCardProps {
  onPremSla: number;
  cloudSla: number;
}

export const SLAInsightCard: React.FC<SLAInsightCardProps> = ({ onPremSla, cloudSla }) => {
  const calcDowntime = (sla: number) => (HOURS_IN_YEAR * (1 - sla / 100)).toFixed(1);
  const onPremHours = calcDowntime(onPremSla);
  const cloudHours = calcDowntime(cloudSla);

  return (
    <div className="bg-slate-100/50 border border-slate-200 rounded-xl p-4 text-sm mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-slate-500" />
        <h4 className="font-semibold text-slate-800">SLA 估算逻辑与差异分析</h4>
      </div>

      {/* Comparison Table */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-rose-50 border border-rose-100 rounded-lg p-3">
          <div className="text-rose-800 font-bold text-xs uppercase mb-1">本地 (On-Prem)</div>
          <div className="text-2xl font-bold text-rose-600">{onPremSla}%</div>
          <div className="text-xs text-rose-700 mt-1 font-medium">
             ≈ 每年宕机 {onPremHours} 小时
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
          <div className="text-emerald-800 font-bold text-xs uppercase mb-1">云端 (Cloud)</div>
          <div className="text-2xl font-bold text-emerald-600">{cloudSla}%</div>
          <div className="text-xs text-emerald-700 mt-1 font-medium">
             ≈ 每年宕机 {cloudHours} 小时
          </div>
        </div>
      </div>

      {/* Explanation List */}
      <div className="space-y-3">
        <div>
          <h5 className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1.5 text-xs">
            <ServerCrash className="w-3.5 h-3.5 text-rose-500" />
            为什么本地 SLA 普遍较低？
          </h5>
          <ul className="space-y-1.5 pl-1">
            <li className="flex gap-2 text-xs text-slate-600 leading-snug">
              <span className="text-rose-400">•</span>
              <span>
                <strong className="text-slate-700">单点故障风险：</strong> 
                本地机房通常缺乏跨区域冗余。一旦遭遇电力中断、光纤被挖断或核心路由故障，业务将完全中断。
              </span>
            </li>
            <li className="flex gap-2 text-xs text-slate-600 leading-snug">
              <span className="text-rose-400">•</span>
              <span>
                <strong className="text-slate-700">计划性停机：</strong> 
                硬件升级、固件更新或 OS 补丁通常需要维护窗口（重启），这会被计入 SLA 损失。
              </span>
            </li>
            <li className="flex gap-2 text-xs text-slate-600 leading-snug">
              <span className="text-rose-400">•</span>
              <span>
                <strong className="text-slate-700">人工运维依赖：</strong> 
                故障响应依赖 IT 人员到场排查（平均修复时间 MTTR 较长），而非自动化故障转移。
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};