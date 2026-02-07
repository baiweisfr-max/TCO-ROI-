import React from 'react';
import { Inputs } from '../types';
import { InputSlider } from './ui/InputSlider';
import { Settings, Server, Cloud, DollarSign, Activity } from 'lucide-react';
import { HOURS_IN_YEAR } from '../constants';
import { formatCurrencyDetailed } from '../utils/calculations';

interface InputPanelProps {
  inputs: Inputs;
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
}

export const InputPanel: React.FC<InputPanelProps> = ({ inputs, setInputs }) => {
  const update = (key: keyof Inputs, val: number) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  };

  const revenuePerHour = inputs.annualRevenue / HOURS_IN_YEAR;

  return (
    <div className="space-y-8 pr-4">
      
      {/* Section 1: Business Value */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-indigo-600">
          <DollarSign className="w-5 h-5" />
          <h3 className="font-bold uppercase text-xs tracking-widest">业务价值</h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <InputSlider
            label="年总营收 (亿元)"
            value={inputs.annualRevenue / 100000000} // Convert raw value to "Yi"
            min={0}
            max={500} // Max 500 Yi (50 Billion)
            step={0.1}
            unit=""
            suffix="亿"
            onChange={(v) => update('annualRevenue', v * 100000000)} // Convert "Yi" back to raw value
            tooltip="企业全年的总营收 (单位：亿元)，用于计算宕机时的机会成本。"
          />
          <div className="flex justify-end -mt-3 mb-2">
             <div className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100 inline-flex items-center">
                <span className="mr-2">↳ 折算每小时产值:</span>
                <span className="font-mono font-semibold text-slate-700">
                  {formatCurrencyDetailed(revenuePerHour)}
                </span>
             </div>
          </div>
        </div>
      </section>

      {/* Section 2: On-Premises Costs */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-rose-600">
          <Server className="w-5 h-5" />
          <h3 className="font-bold uppercase text-xs tracking-widest">本地自建 (现状)</h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <InputSlider
            label="硬件采购/更新成本 (CapEx)"
            value={inputs.hardwareCost}
            min={10000}
            max={1000000}
            step={5000}
            onChange={(v) => update('hardwareCost', v)}
            tooltip="购买或更新服务器、存储和网络设备的成本 (第0年)。"
          />
          <InputSlider
            label="硬件年维保费率 (%)"
            value={inputs.maintenanceYearlyRate}
            min={0}
            max={30}
            step={1}
            isPercentage
            onChange={(v) => update('maintenanceYearlyRate', v)}
            tooltip="硬件过保后的年度维保/支持费用比例。模型假设第1年由原厂质保覆盖，费用从第2年开始计算。"
          />
          <InputSlider
            label="月度电力、机柜与带宽"
            value={inputs.monthlyPowerCooling + inputs.monthlyBandwidth}
            min={100}
            max={20000}
            step={100}
            onChange={(v) => {
               // Split arbitrarily for simplicity in this combined slider, or just treat as OpEx
               const half = v/2;
               setInputs(prev => ({...prev, monthlyPowerCooling: half, monthlyBandwidth: half }));
            }}
            tooltip="机架空间、电力、冷却和网络带宽的月度经常性成本。"
          />
          <InputSlider
            label="运维人员数量"
            value={inputs.adminCount}
            min={0}
            max={20}
            step={1}
            unit=""
            onChange={(v) => update('adminCount', v)}
            tooltip="负责管理基础设施的全职员工 (FTE) 数量。"
          />
          <InputSlider
            label="运维人员平均月薪"
            value={inputs.adminMonthlySalary}
            min={2000}
            max={20000}
            step={500}
            onChange={(v) => update('adminMonthlySalary', v)}
            tooltip="每位 IT 员工的月度综合人力成本。"
          />
          <InputSlider
            label="当前 SLA / 可用性 (%)"
            value={inputs.onPremSla}
            min={90}
            max={99.9}
            step={0.1}
            isPercentage
            onChange={(v) => update('onPremSla', v)}
            tooltip="当前历史可用性。99.5% ≈ 每年宕机 44 小时。"
          />
        </div>
      </section>

      {/* Section 3: Cloud Costs */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-emerald-600">
          <Cloud className="w-5 h-5" />
          <h3 className="font-bold uppercase text-xs tracking-widest">云端目标</h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <InputSlider
            label="预计年度云账单"
            value={inputs.annualCloudBill}
            min={1000}
            max={600000}
            step={1000}
            onChange={(v) => update('annualCloudBill', v)}
            tooltip="计算、存储和管理服务的预计年度总成本。"
          />
          <InputSlider
            label="一次性迁移成本"
            value={inputs.migrationCost}
            min={0}
            max={200000}
            step={1000}
            onChange={(v) => update('migrationCost', v)}
            tooltip="专业服务咨询、人员培训和新旧系统并行运行的成本。"
          />
          <InputSlider
            label="目标 SLA (%)"
            value={inputs.cloudSla}
            min={99}
            max={99.999}
            step={0.001}
            isPercentage
            onChange={(v) => update('cloudSla', v)}
            tooltip="云端目标可用性。99.975% ≈ 每年宕机 2.2 小时。"
          />
        </div>
      </section>

    </div>
  );
};