import { FC } from "react";

interface ProgressBarProps {
  value: number;
}
const ProgressBar: FC<ProgressBarProps> = ({ value }) => {
  return (
    <div className='flex gap-2 items-center'>
      <div className='w-[100px] rounded-2xl bg-slate-200 h-3 overflow-hidden'>
        <div className='h-full bg-blue-600' style={{ width: `${value}%` }}>
        </div>
      </div>
      <span className='text-base'>{value}%</span>
    </div>
  );
};

export default ProgressBar;