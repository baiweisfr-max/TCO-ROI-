import React from 'react';
import { Info } from 'lucide-react';

interface InputSliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  tooltip?: string;
  isPercentage?: boolean;
  suffix?: string;
}

export const InputSlider: React.FC<InputSliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '¥',
  tooltip,
  isPercentage = false,
  suffix,
}) => {
  
  // Handle manual text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If empty string (user clearing input), default to 0 to prevent NaN errors
    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
    onChange(val);
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        {/* Label & Tooltip */}
        <div className="flex items-center gap-2 group relative">
          <label className="text-sm font-medium text-slate-700">{label}</label>
          {tooltip && (
            <>
              <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help transition-colors" />
              <div className="absolute left-0 bottom-6 w-64 p-3 bg-white border border-slate-200 rounded-lg shadow-xl text-xs text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
                {tooltip}
              </div>
            </>
          )}
        </div>

        {/* Manual Input Field */}
        <div className="flex items-center bg-white border border-slate-300 rounded-md focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all w-32 px-2 shadow-sm">
          {!isPercentage && unit && (
            <span className="text-slate-400 text-xs font-mono mr-1 select-none">{unit}</span>
          )}
          <input
            type="number"
            min={min}
            max={max}
            step="any" 
            value={value}
            onChange={handleInputChange}
            className="w-full bg-transparent text-right text-indigo-600 font-mono text-sm font-bold focus:outline-none py-1.5 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {isPercentage ? (
            <span className="text-slate-400 text-xs font-mono ml-1 select-none">%</span>
          ) : suffix ? (
            <span className="text-slate-400 text-xs font-mono ml-1 select-none">{suffix}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};