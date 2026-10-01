import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

const CHIP_CODES = [
  { label: 'LEAVE', code: 'PTO' },
  { label: 'COMP-OFF', code: 'COMP_OFF' },
  { label: 'WFH', code: 'WFH' },
  { label: 'BUSINESS TRAVEL', code: 'BUSINESS_TRAVEL' },
  { label: 'PATERNITY', code: 'PATERNITY' },
];

function formatDate(value) {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  return `${m}/${d}/${y}`;
}

export default function LeaveDetails() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('leave_requests')
      .select('*, leave_types(code, name, format)')
      .eq('employee_id', user.id)
      .order('requested_on', { ascending: false })
      .then(({ data }) => setRequests(data ?? []));
  }, [user?.id]);

  const approved = requests.filter((r) => r.status === 'Approved');
  const chips = CHIP_CODES.map(({ label, code }) => {
    const sum = approved
      .filter((r) => r.leave_types?.code === code)
      .reduce((total, r) => total + Number(r.days), 0);
    return { label, value: sum };
  });

  return (
    <div className="max-w-6xl mx-auto bg-white border border-[#E0E0E0] brand-corner teal-hover">
      <div className="px-8 py-6" style={{ background: 'linear-gradient(to right, #9DC6CC, #72B3BE, #57A6B3)' }}>
        <h2 className="text-2xl font-bold text-white">My Leave Details.</h2>
      </div>

      <div className="bg-[#F0F7F8] border-b border-[#ABC7CA] px-8 py-4 flex flex-wrap gap-8 brand-plate text-[10px] tracking-widest">
        <div className="text-[#47A2B0] font-bold">LEAVE UTILIZATION {new Date().getFullYear()}:</div>
        <div className="flex gap-6 text-[#555]">
          {chips.map((chip) => (
            <span key={chip.label}>
              {chip.label}: {chip.value}
            </span>
          ))}
        </div>
      </div>

      <div className="p-8 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-[#47A2B0] brand-plate text-[10px] text-[#47A2B0]">
              <th className="py-4 px-4 font-normal tracking-widest">ABSENCE TYPE</th>
              <th className="py-4 px-4 font-normal tracking-widest">FORMAT</th>
              <th className="py-4 px-4 font-normal tracking-widest">TOTAL</th>
              <th className="py-4 px-4 font-normal tracking-widest">REASON</th>
              <th className="py-4 px-4 font-normal tracking-widest">STATUS</th>
              <th className="py-4 px-4 font-normal tracking-widest">DETAILS</th>
              <th className="py-4 px-4 font-normal tracking-widest">REQUESTED ON</th>
              <th className="py-4 px-4 font-normal tracking-widest text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0E0E0]">
            {requests.map((leave) => (
              <tr key={leave.id} className="hover:bg-[#F0F7F8] transition-colors">
                <td className="py-5 px-4 font-bold">{leave.leave_types?.name ?? '—'}</td>
                <td className="py-5 px-4 text-sm text-[#777]">{leave.leave_types?.format ?? 'Days'}</td>
                <td className="py-5 px-4 font-bold">{leave.days}</td>
                <td className="py-5 px-4 text-sm text-[#555]">{leave.reason}</td>
                <td className="py-5 px-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 brand-plate text-[10px] tracking-wider ${
                      leave.status === 'Approved'
                        ? 'bg-[#ECFDF5] text-[#15803D] border border-[#86EFAC]'
                        : 'bg-[#F0F7F8] text-[#47A2B0] border border-[#ABC7CA]'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {leave.status}
                  </span>
                </td>
                <td className="py-5 px-4 text-sm text-[#555]">{formatDate(leave.start_date)} - {leave.duration}</td>
                <td className="py-5 px-4 text-sm text-[#555]">{formatDate(leave.requested_on)}</td>
                <td className="py-5 px-4 text-center">
                  <button
                    type="button"
                    className="text-[#999] hover:text-[#E04F4F] transition-colors"
                    title="Cancel"
                  >
                    <XCircle className="w-5 h-5 mx-auto" />
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={8} className="py-10 text-center text-[#999]">
                  No leave requests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
