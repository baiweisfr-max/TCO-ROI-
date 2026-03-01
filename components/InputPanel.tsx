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
          {/* Hardware Group */}
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">硬件基础设施</h4>
            <InputSlider
              label="硬件采购成本"
              value={inputs.hardwareCost}
              min={10000}
              max={1000000}
              step={5000}
              onChange={(v) => update('hardwareCost', v)}
              tooltip="服务器、存储和网络设备的硬件 CapEx 成本 (第0年)。"
            />
            <InputSlider
              label="硬件维保"
              value={inputs.hardwareMaintenanceYearlyRate}
              min={0}
              max={30}
              step={1}
              isPercentage
              onChange={(v) => update('hardwareMaintenanceYearlyRate', v)}
              tooltip="硬件过保后的年度原厂维保费用。模型假设前3年由质保覆盖(免费)，费用从第4年开始计算。"
            />
          </div>

          {/* Software Group */}
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">软件与授权</h4>
            <InputSlider
              label="软件采购成本"
              value={inputs.softwareCost}
              min={0}
              max={1000000}
              step={5000}
              onChange={(v) => update('softwareCost', v)}
              tooltip="操作系统、虚拟化软件、数据库等永久授权 (Perpetual License) 的初始采购费用。"
            />
            <InputSlider
              label="软件维保"
              value={inputs.softwareMaintenanceYearlyRate}
              min={0}
              max={50}
              step={1}
              isPercentage
              onChange={(v) => update('softwareMaintenanceYearlyRate', v)}
              tooltip="软件的年度技术支持 (SnS) 或订阅费用比例。通常从第2年开始产生（假设首年包含在采购中）。"
            />
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">环境与人力</h4>
            <InputSlider
              label="年度电力成本"
              value={inputs.annualPowerCooling + inputs.annualBandwidth}
              min={1000}
              max={240000} // Increased max significantly
              step={1000}
              onChange={(v) => {
                // Split arbitrarily for simplicity in this combined slider
                const half = v/2;
                setInputs(prev => ({...prev, annualPowerCooling: half, annualBandwidth: half }));
              }}
              tooltip="机架空间、电力、冷却和网络带宽的年度经常性成本。"
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
              label="运维人员年薪"
              value={inputs.adminAnnualSalary}
              min={24000}
              max={500000} // Up to 500k CNY/year
              step={5000}
              onChange={(v) => update('adminAnnualSalary', v)}
              tooltip="每位 IT 员工的年度综合人力成本。"
            />
            <InputSlider
              label="本地自建SLA"
              value={inputs.onPremSla}
              min={90}
              max={99.9}
              step={0.1}
              isPercentage
              onChange={(v) => update('onPremSla', v)}
              tooltip="当前历史可用性。99.5% ≈ 每年宕机 44 小时。"
            />
          </div>
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
            label="云上SLA"
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