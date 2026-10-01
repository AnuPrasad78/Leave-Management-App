import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

function formatDate(value) {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  return `${m}/${d}/${y}`;
}

function StatusBadge({ status }) {
  if (status === 'Approved') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ECFDF5] text-[#15803D] border border-[#86EFAC] brand-plate text-[10px] tracking-wider">
        <CheckCircle className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  }
  if (status === 'Rejected') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] brand-plate text-[10px] tracking-wider">
        <XCircle className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] brand-plate text-[10px] tracking-wider">
      <Clock className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}

export default function LeaveRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  const load = async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from('leave_requests')
      .select('*, employee:profiles!leave_requests_employee_id_fkey(emp_id, name), leave_types(name)')
      .eq('profiles.manager_id', user.id)
      .order('requested_on', { ascending: false });
    setRequests(data ?? []);
  };

  useEffect(() => {
    load();
  }, [user?.id]);

  const pendingCount = useMemo(
    () => requests.filter((r) => r.status === 'Pending').length,
    [requests],
  );

  const updateStatus = (id, status) => {
    supabase
      .from('leave_requests')
      .update({ status, reviewed_by: user.id, reviewed_at: new Date().toISOString() })
      .eq('id', id)
      .then(() => load());
  };

  return (
    <div className="max-w-6xl mx-auto bg-white border border-[#E0E0E0] brand-corner teal-hover">
      <div className="px-8 py-6" style={{ background: 'linear-gradient(to right, #9DC6CC, #72B3BE, #57A6B3)' }}>
        <h2 className="text-2xl font-bold text-white">Leave Requests.</h2>
        <p className="text-white/85 text-sm mt-1">Review and action leave requests from your team.</p>
      </div>

      <div className="bg-[#F0F7F8] border-b border-[#ABC7CA] px-8 py-4 flex flex-wrap gap-6 brand-plate text-[10px] tracking-widest">
        <div className="text-[#47A2B0] font-bold">PENDING APPROVALS: {pendingCount}</div>
        <div className="text-[#555]">TOTAL REQUESTS: {requests.length}</div>
      </div>

      <div className="p-8 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[56rem]">
          <thead>
            <tr className="border-b-2 border-[#47A2B0] brand-plate text-[10px] text-[#47A2B0]">
              <th className="py-4 px-4 font-normal tracking-widest">EMPLOYEE</th>
              <th className="py-4 px-4 font-normal tracking-widest">ABSENCE TYPE</th>
              <th className="py-4 px-4 font-normal tracking-widest">DETAILS</th>
              <th className="py-4 px-4 font-normal tracking-widest">DAYS</th>
              <th className="py-4 px-4 font-normal tracking-widest">REASON</th>
              <th className="py-4 px-4 font-normal tracking-widest">REQUESTED ON</th>
              <th className="py-4 px-4 font-normal tracking-widest">STATUS</th>
              <th className="py-4 px-4 font-normal tracking-widest text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0E0E0]">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-[#F0F7F8] transition-colors">
                <td className="py-5 px-4">
                  <p className="font-bold text-[#0E0E0E]">{req.employee?.name}</p>
                  <p className="text-xs text-[#777] mt-0.5">{req.employee?.emp_id}</p>
                </td>
                <td className="py-5 px-4 font-medium">{req.leave_types?.name}</td>
                <td className="py-5 px-4 text-sm text-[#555]">{formatDate(req.start_date)} - {req.duration}</td>
                <td className="py-5 px-4 font-bold">{req.days}</td>
                <td className="py-5 px-4 text-sm text-[#555] max-w-[12rem]">{req.reason}</td>
                <td className="py-5 px-4 text-sm text-[#555]">{formatDate(req.requested_on)}</td>
                <td className="py-5 px-4">
                  <StatusBadge status={req.status} />
                </td>
                <td className="py-5 px-4">
                  {req.status === 'Pending' ? (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateStatus(req.id, 'Approved')}
                        className="px-3 py-1.5 bg-[#47A2B0] text-white text-xs font-bold brand-plate tracking-wider hover:bg-[#2A7682] transition-colors"
                      >
                        APPROVE
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(req.id, 'Rejected')}
                        className="px-3 py-1.5 border border-[#E0E0E0] text-[#777] text-xs font-bold brand-plate tracking-wider hover:border-[#E04F4F] hover:text-[#E04F4F] transition-colors"
                      >
                        REJECT
                      </button>
                    </div>
                  ) : (
                    <span className="block text-center text-xs text-[#999] brand-plate tracking-wider">—</span>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={8} className="py-10 text-center text-[#999]">
                  No team requests to review.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
