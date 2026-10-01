import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function LeaveDetails() {
  const leaveHistory = [
    {
      type: 'Optional Holiday',
      format: 'Days',
      total: 1,
      reason: 'Optional Holiday',
      status: 'Approved',
      details: '08/26/2026 - Full',
      requestedOn: '08/26/2026',
    },
    {
      type: 'My Special Day',
      format: 'Days',
      total: 1,
      reason: 'My Special Day!',
      status: 'Approved',
      details: '03/20/2026 - Full',
      requestedOn: '03/05/2026',
    },
    {
      type: 'Voting Leave',
      format: 'Days',
      total: 1,
      reason: 'Voting Leave',
      status: 'Approved',
      details: '02/11/2026 - Full',
      requestedOn: '02/10/2026',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto bg-white border border-[#E0E0E0] brand-corner teal-hover">
      <div className="px-8 py-6" style={{ background: 'linear-gradient(to right, #9DC6CC, #72B3BE, #57A6B3)' }}>
        <h2 className="text-2xl font-bold text-white">My Leave Details.</h2>
      </div>

      <div className="bg-[#F0F7F8] border-b border-[#ABC7CA] px-8 py-4 flex flex-wrap gap-8 brand-plate text-[10px] tracking-widest">
        <div className="text-[#47A2B0] font-bold">LEAVE UTILIZATION 2026:</div>
        <div className="flex gap-6 text-[#555]">
          <span>LEAVE: 0</span>
          <span>COMP-OFF: 0</span>
          <span>WFH: 0</span>
          <span>BUSINESS TRAVEL: 0</span>
          <span>PATERNITY: 0</span>
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
            {leaveHistory.map((leave, i) => (
              <tr key={i} className="hover:bg-[#F0F7F8] transition-colors">
                <td className="py-5 px-4 font-bold">{leave.type}</td>
                <td className="py-5 px-4 text-sm text-[#777]">{leave.format}</td>
                <td className="py-5 px-4 font-bold">{leave.total}</td>
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
                <td className="py-5 px-4 text-sm text-[#555]">{leave.details}</td>
                <td className="py-5 px-4 text-sm text-[#555]">{leave.requestedOn}</td>
                <td className="py-5 px-4 text-center">
                  <button type="button" className="text-[#999] hover:text-[#E04F4F] transition-colors">
                    <XCircle className="w-5 h-5 mx-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
