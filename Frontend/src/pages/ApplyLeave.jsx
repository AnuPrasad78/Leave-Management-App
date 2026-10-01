import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

export default function ApplyLeave() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('Full Day');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('leave_types')
      .select('id, code, name')
      .order('id')
      .then(({ data }) => setLeaveTypes(data ?? []));
  }, []);

  const handleSubmit = async () => {
    if (!user?.id) return;
    setError('');
    setSubmitting(true);

    const { error: insertError } = await supabase.from('leave_requests').insert({
      employee_id: user.id,
      leave_type_id: Number(leaveTypeId),
      start_date: startDate,
      end_date: startDate,
      duration,
      days: duration === 'Half Day' ? 0.5 : 1,
      reason,
    });

    setSubmitting(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    navigate('/dashboard');
  };

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
            value={leaveTypeId}
            onChange={(e) => setLeaveTypeId(e.target.value)}
            className="px-4 py-3 bg-white border border-[#E0E0E0] focus:border-[#47A2B0] text-[#0E0E0E] outline-none"
          >
            <option value="">Select leave type</option>
            {leaveTypes.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-3">
            <label className="brand-plate text-xs text-[#47A2B0] tracking-widest">FROM DATE</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for leave..."
            className="px-4 py-3 bg-white border border-[#E0E0E0] focus:border-[#47A2B0] text-[#0E0E0E] outline-none resize-none"
          />
        </div>

        {error && <p className="text-sm text-[#E04F4F]">{error}</p>}

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
            onClick={handleSubmit}
            disabled={submitting || !leaveTypeId || !startDate}
            className="px-8 py-3 bg-[#47A2B0] text-white font-bold uppercase brand-plate text-xs hover:bg-[#2A7682] transition-colors tracking-wider disabled:opacity-60"
          >
            {submitting ? 'SUBMITTING…' : 'SUBMIT REQUEST'}
          </button>
        </div>
      </div>
    </div>
  );
}
