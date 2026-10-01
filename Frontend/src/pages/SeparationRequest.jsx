import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserMinus, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

export default function SeparationRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lastWorkingDay, setLastWorkingDay] = useState('');
  const [reason, setReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!user?.id) return;
    setError('');
    setSubmitting(true);

    const { error: insertError } = await supabase.from('separation_requests').insert({
      employee_id: user.id,
      last_working_day: lastWorkingDay,
      reason,
      remarks,
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
      <div className="border-b border-[#E0E0E0] px-8 py-6 flex items-center gap-3 bg-[#E04F4F]">
        <UserMinus className="w-6 h-6 text-white" strokeWidth={1.5} />
        <h2 className="text-2xl font-bold text-white">Separation Request.</h2>
      </div>

      <div className="p-8 space-y-6">
        <div className="bg-amber-50 border border-amber-200 p-4 flex gap-3 text-amber-800 text-sm brand-corner">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>
            Initiating a separation request will start your formal offboarding process. Please ensure you
            have discussed this with your manager before proceeding.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <label className="brand-plate text-xs text-[#47A2B0] tracking-widest">INTENDED LAST WORKING DAY</label>
          <input
            type="date"
            value={lastWorkingDay}
            onChange={(e) => setLastWorkingDay(e.target.value)}
            className="px-4 py-3 border border-[#E0E0E0] bg-white focus:border-[#47A2B0] outline-none"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="brand-plate text-xs text-[#47A2B0] tracking-widest">REASON FOR LEAVING</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="px-4 py-3 border border-[#E0E0E0] bg-white focus:border-[#47A2B0] outline-none"
          >
            <option value="">Select a reason...</option>
            <option>Better Career Opportunity</option>
            <option>Higher Education</option>
            <option>Relocation</option>
            <option>Health/Personal Reasons</option>
            <option>Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-3">
          <label className="brand-plate text-xs text-[#47A2B0] tracking-widest">ADDITIONAL REMARKS</label>
          <textarea
            rows="4"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Any details you wish to share..."
            className="px-4 py-3 border border-[#E0E0E0] bg-white focus:border-[#47A2B0] outline-none resize-none"
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
            disabled={submitting || !lastWorkingDay}
            className="px-8 py-3 bg-[#E04F4F] text-white font-bold uppercase brand-plate text-xs hover:bg-[#c43c3c] transition-colors tracking-wider disabled:opacity-60"
          >
            {submitting ? 'SUBMITTING…' : 'SUBMIT REQUEST'}
          </button>
        </div>
      </div>
    </div>
  );
}
