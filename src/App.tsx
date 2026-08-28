import { useState } from 'react';
import { supabase } from '@/lib/supabase';

function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const phonePattern = /^010-\d{4}-\d{4}$/;

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatus('error');
      setErrorMsg('이름을 입력해주세요.');
      return;
    }
    if (!phonePattern.test(phone)) {
      setStatus('error');
      setErrorMsg('올바른 전화번호 형식(010-0000-0000)으로 입력해주세요.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    const { error } = await supabase
      .from('event_registrations')
      .insert({ name: name.trim(), phone });

    if (error) {
      setStatus('error');
      setErrorMsg('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setStatus('success');
    setName('');
    setPhone('');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block border-2 border-black px-3 py-1 text-xs font-bold tracking-widest uppercase mb-4">
            Event
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">이벤트 신청서</h1>
          <p className="text-sm text-gray-500">아래 정보를 입력 후 신청 버튼을 눌러주세요.</p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="border-2 border-black rounded-lg p-6 space-y-6 bg-white"
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-black mb-2">
              이름 <span className="text-gray-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder="홍길동"
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-black placeholder-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-black mb-2">
              전화번호 <span className="text-gray-400">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(formatPhone(e.target.value));
                if (status === 'error') setStatus('idle');
              }}
              placeholder="010-0000-0000"
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-black placeholder-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            />
          </div>

          {/* Error message */}
          {status === 'error' && (
            <p className="text-sm text-black border border-black bg-gray-100 rounded-md px-3 py-2">
              {errorMsg}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-black text-white font-bold py-3 rounded-md hover:bg-gray-800 active:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'submitting' ? '신청 중...' : '신청하기'}
          </button>
        </form>

        {/* Success message */}
        {status === 'success' && (
          <div className="mt-4 border-2 border-black rounded-lg p-6 text-center bg-gray-50">
            <p className="text-base font-bold text-black mb-1">신청 완료!</p>
            <p className="text-sm text-gray-600">이벤트 신청이 정상적으로 접수되었습니다.</p>
          </div>
        )}

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          입력하신 정보는 이벤트 운영 목적으로만 사용됩니다.
        </p>
      </div>
    </div>
  );
}

export default App;
