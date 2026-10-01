import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export default function ApplyLeave() {
  const navigate = useNavigate();
  const [leaveType, setLeaveType] = useState('Paid Time Off (PTO)');
  const [duration, setDuration] = useState('Full Day');

  const leaveOptions = [
    'Paid Time Off (PTO)',
    'Adoption',
    'Business Travel',
    'Compensatory Off',
    'Contingency Bucket',
    'Leave Without Pay (LWP)',
    'Loss Of Pay (LOP)',
    'My Special Day',
    'Optional Holiday',
    'Paternity Leave',
    'Voting Leave',
    'Work From Home',
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white border border-[#E0E0E0] brand-corner teal-hover">
      <div
        className="border-b border-[#E0E0E0] px-8 py-6 flex items-center gap-4"
        style={{ background: 'linear-gradient(to right, #9DC6CC, #72B3BE, #57A6B3)' }}
      >
        <Calendar className="w-6 h-6 text-white" strokeWidth={1.5} />
        <h2 className="text-2xl font-bold text-white">Apply Leave.</h2>
      </div>

      <div className="p-8 space-y-8">
        <div className="flex flex-col gap-3">
          <label className="brand-plate text-xs text-[#47A2B0] tracking-widest">LEAVE TYPE</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="px-4 py-3 bg-white border border-[#E0E0E0] focus:border-[#47A2B0] text-[#0E0E0E] outline-none"
          >
            {leaveOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-3">
            <label className="brand-plate text-xs text-[#47A2B0] tracking-widest">FROM DATE</label>
            <input
              type="date"
              className="px-4 py-3 bg-white border border-[#E0E0E0] focus:border-[#47A2B0] text-[#0E0E0E] outline-none"
            />
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <label className="brand-plate text-xs text-[#47A2B0] tracking-widest">DURATION</label>
            <div className="flex border border-[#E0E0E0] bg-[#F2F2F0] p-1">
              <button
                type="button"
                onClick={() => setDuration('Full Day')}
                className={`flex-1 py-2 text-sm font-bold transition-colors ${duration === 'Full Day' ? 'bg-[#47A2B0] text-white' : 'text-[#777]'}`}
              >
                Full Day
              </button>
              <button
                type="button"
                onClick={() => setDuration('Half Day')}
                className={`flex-1 py-2 text-sm font-bold transition-colors ${duration === 'Half Day' ? 'bg-[#47A2B0] text-white' : 'text-[#777]'}`}
              >
                Half Day
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="brand-plate text-xs text-[#47A2B0] tracking-widest">REASON</label>
          <textarea
            rows="4"
            placeholder="Enter reason for leave..."
            className="px-4 py-3 bg-white border border-[#E0E0E0] focus:border-[#47A2B0] text-[#0E0E0E] outline-none resize-none"
          />
        </div>

        <div className="pt-6 border-t border-[#E0E0E0] flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 brand-plate text-xs text-[#777] hover:text-[#47A2B0] transition-colors tracking-wider"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-[#47A2B0] text-white font-bold uppercase brand-plate text-xs hover:bg-[#2A7682] transition-colors tracking-wider"
          >
            SUBMIT REQUEST
          </button>
        </div>
      </div>
    </div>
  );
}
