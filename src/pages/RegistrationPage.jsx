import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import upiqrImg from '../assets/upiqr.jpeg';

const EVENT_CONFIG = {
  Sharkverse: { date: '28th March 2026', teamSize: '1-4 members', fee: 'Rs.150 per team' },
};

const EVENT_OPTIONS = Object.keys(EVENT_CONFIG);

const RegistrationPage = () => {
  const [searchParams] = useSearchParams();
  const preSelectedEvent = searchParams.get('event') || 'Sharkverse';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    teamName: '',
    teamLeaderName: '',
    email: '',
    phone: '',
    collegeDepartment: '',
    teamSize: '',
    event: preSelectedEvent,
    additionalMembers: [
      { name: '', contact: '' },
      { name: '', contact: '' },
      { name: '', contact: '' },
    ],
    paymentScreenshot: null,
    transactionId: '',
  });

  const selectedEventMeta = useMemo(
    () => EVENT_CONFIG[formData.event] || { teamSize: '1-4 members', fee: 'Rs.150 per team' },
    [formData.event]
  );

  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const updateMember = (index, field, value) => {
    const updated = formData.additionalMembers.map((member, i) =>
      i === index ? { ...member, [field]: value } : member
    );
    setFormData((prev) => ({ ...prev, additionalMembers: updated }));
    const key = `member_${index + 2}_${field}`;
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleTeamSizeChange = (value) => {
    update('teamSize', value);
    const size = Number(value || 1);
    const activeMembers = Math.max(size - 1, 0);
    if (activeMembers < formData.additionalMembers.length) {
      const resetMembers = formData.additionalMembers.map((member, i) =>
        i < activeMembers ? member : { name: '', contact: '' }
      );
      setFormData((prev) => ({ ...prev, additionalMembers: resetMembers }));
    }
  };

  const validate = () => {
    const e = {};

    if (!formData.teamName.trim()) e.teamName = 'Team name is required';
    if (!formData.teamLeaderName.trim()) e.teamLeaderName = 'Team leader name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = 'Valid email address is required';
    }
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      e.phone = 'Valid 10-digit phone number is required';
    }
    if (!formData.collegeDepartment.trim()) e.collegeDepartment = 'College / Department is required';
    if (!formData.teamSize) e.teamSize = 'Team size is required';
    if (!formData.event) e.event = 'Event name is required';

    const additionalCount = Math.max(Number(formData.teamSize || 1) - 1, 0);
    for (let i = 0; i < additionalCount; i += 1) {
      const member = formData.additionalMembers[i];
      if (!member.name.trim()) e[`member_${i + 2}_name`] = `Member ${i + 2} name is required`;
      if (!member.contact.trim() || !/^\d{10}$/.test(member.contact.replace(/\s/g, ''))) {
        e[`member_${i + 2}_contact`] = `Valid Member ${i + 2} contact number is required`;
      }
    }

    if (!formData.paymentScreenshot) e.paymentScreenshot = 'Payment screenshot is required';
    if (!formData.transactionId.trim()) e.transactionId = 'UPI Transaction ID is required';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = new FormData();

      // API compatibility fields expected by backend
      payload.append('fullName', formData.teamLeaderName.trim());
      payload.append('email', formData.email.trim());
      payload.append('phone', formData.phone.trim());
      payload.append('year', 'N/A');
      payload.append('leaderName', formData.teamLeaderName.trim());
      payload.append('leaderCollege', formData.collegeDepartment.trim());
      const additionalCount = Math.max(Number(formData.teamSize || 1) - 1, 0);
      const membersPayload = formData.additionalMembers
        .slice(0, additionalCount)
        .map((member) => ({
          name: member.name.trim(),
          college: formData.collegeDepartment.trim() || 'N/A',
        }));
      payload.append('members', JSON.stringify(membersPayload));
      payload.append('event', formData.event);
      payload.append('transactionId', formData.transactionId.trim());
      payload.append('paymentScreenshot', formData.paymentScreenshot);

      // Optional metadata for future reporting
      payload.append('teamName', formData.teamName.trim());
      payload.append('teamSize', formData.teamSize);
      payload.append(
        'memberContacts',
        JSON.stringify(formData.additionalMembers.slice(0, additionalCount).map((member) => member.contact.trim()))
      );

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/genesis/register`,
        { method: 'POST', body: payload }
      );
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || { general: data.error || 'Registration failed. Please try again.' });
        setIsSubmitting(false);
        return;
      }
    } catch {
      setErrors({ general: 'Network error. Please check your connection and try again.' });
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const inputClass = (field) =>
    `w-full bg-black/35 border ${
      errors[field] ? 'border-red-500' : 'border-white/15'
    } rounded-xl px-4 py-3.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500 transition-colors duration-200`;

  const labelClass = 'block text-gray-200 text-sm sm:text-base font-semibold mb-2';

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black" style={{ fontFamily: 'Inter, sans-serif' }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
          <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center mb-8">
            <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-white text-4xl font-bold uppercase tracking-wider mb-4">Registration Complete</h2>
          <p className="text-gray-400 text-sm mb-2">
            Thank you, <span className="text-white font-semibold">{formData.teamLeaderName}</span>
          </p>
          <p className="text-gray-400 text-sm mb-2">
            Event: <span className="text-white font-semibold">{formData.event || 'DESOC Event'}</span>
          </p>
          <p className="text-gray-500 text-xs mt-4 mb-10">
            A confirmation email will be sent to <span className="text-gray-300">{formData.email}</span> within 24 hours.
          </p>
          <Link
            to="/genesis"
            className="px-8 py-3 bg-linear-to-r from-red-700 to-red-600 text-white font-bold uppercase tracking-wider rounded-full hover:from-red-600 hover:to-red-500 transition-all duration-300"
            style={{ boxShadow: '0 0 30px rgba(220,38,38,0.3)' }}
          >
            Back to Genesis
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <div className="relative">
        <div className="fixed inset-0 -z-10" style={{ background: 'linear-gradient(135deg, black, rgba(127,29,29,0.3) 50%, black)' }} />
        <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top right, rgba(127,29,29,0.15), transparent 50%)' }} />
        <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at bottom left, rgba(153,27,27,0.1), transparent 50%)' }} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/genesis"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Event
            </Link>
            <span className="text-gray-600 text-xs uppercase tracking-widest">DESOC Registration</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            <section className="lg:col-span-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-[0_18px_40px_rgba(0,0,0,0.45),0_0_24px_rgba(220,38,38,0.12)]">
              <h1 className="text-white text-3xl sm:text-[32px] font-bold tracking-wide mb-2">Event Registration</h1>
              <p className="text-red-400 text-sm sm:text-base font-semibold mb-2 uppercase tracking-wide">
                Event: <span className="text-white">{formData.event || 'Select an event'}</span>
              </p>
              <p className="text-gray-400 text-sm sm:text-base mb-6">
                Complete the form below to register your team for the event.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelClass}>Select Event</label>
                  <select
                    value={formData.event}
                    onChange={(e) => update('event', e.target.value)}
                    className={`${inputClass('event')} appearance-none`}
                  >
                    {EVENT_OPTIONS.map((event) => (
                      <option key={event} value={event}>{event}</option>
                    ))}
                  </select>
                  {errors.event && <p className="text-red-500 text-xs mt-1">{errors.event}</p>}
                </div>

                <div>
                  <label className={labelClass}>Team Name</label>
                  <input
                    type="text"
                    value={formData.teamName}
                    onChange={(e) => update('teamName', e.target.value)}
                    placeholder="Enter your team name"
                    className={inputClass('teamName')}
                  />
                  {errors.teamName && <p className="text-red-500 text-xs mt-1">{errors.teamName}</p>}
                </div>

                <div>
                  <label className={labelClass}>Team Leader Name</label>
                  <input
                    type="text"
                    value={formData.teamLeaderName}
                    onChange={(e) => update('teamLeaderName', e.target.value)}
                    placeholder="Enter team leader name"
                    className={inputClass('teamLeaderName')}
                  />
                  {errors.teamLeaderName && <p className="text-red-500 text-xs mt-1">{errors.teamLeaderName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass('email')}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder="9876543210"
                      className={inputClass('phone')}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>College / Department</label>
                  <input
                    type="text"
                    value={formData.collegeDepartment}
                    onChange={(e) => update('collegeDepartment', e.target.value)}
                    placeholder="Enter college or department"
                    className={inputClass('collegeDepartment')}
                  />
                  {errors.collegeDepartment && <p className="text-red-500 text-xs mt-1">{errors.collegeDepartment}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Team Size</label>
                    <select
                      value={formData.teamSize}
                      onChange={(e) => handleTeamSizeChange(e.target.value)}
                      className={`${inputClass('teamSize')} appearance-none`}
                    >
                      <option value="">Select team size</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                    {errors.teamSize && <p className="text-red-500 text-xs mt-1">{errors.teamSize}</p>}
                  </div>
                  <div className="hidden sm:block" />
                </div>

                <div
                  className="overflow-hidden transition-all duration-300 ease-out"
                  style={{
                    maxHeight: Math.max(Number(formData.teamSize || 1) - 1, 0) > 0
                      ? `${Math.max(Number(formData.teamSize || 1) - 1, 0) * 140}px`
                      : '0px',
                    opacity: Math.max(Number(formData.teamSize || 1) - 1, 0) > 0 ? 1 : 0,
                  }}
                >
                  <div className="space-y-4 pt-1">
                    {formData.additionalMembers
                      .slice(0, Math.max(Number(formData.teamSize || 1) - 1, 0))
                      .map((member, idx) => {
                        const memberNo = idx + 2;
                        return (
                          <div key={memberNo} className="grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-300 ease-out">
                            <div>
                              <label className={labelClass}>Member {memberNo} Name</label>
                              <input
                                type="text"
                                value={member.name}
                                onChange={(e) => updateMember(idx, 'name', e.target.value)}
                                placeholder={`Enter member ${memberNo} name`}
                                className={inputClass(`member_${memberNo}_name`)}
                              />
                              {errors[`member_${memberNo}_name`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`member_${memberNo}_name`]}</p>
                              )}
                            </div>
                            <div>
                              <label className={labelClass}>Member {memberNo} Contact Number</label>
                              <input
                                type="tel"
                                maxLength={10}
                                value={member.contact}
                                onChange={(e) => updateMember(idx, 'contact', e.target.value)}
                                placeholder={`Enter member ${memberNo} contact`}
                                className={inputClass(`member_${memberNo}_contact`)}
                              />
                              {errors[`member_${memberNo}_contact`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`member_${memberNo}_contact`]}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Upload Payment Screenshot</label>
                  <label
                    className={`flex items-center justify-center w-full rounded-xl border-2 border-dashed ${
                      errors.paymentScreenshot ? 'border-red-500' : 'border-white/20'
                    } bg-black/20 cursor-pointer hover:border-red-500/60 transition-colors duration-200 py-8 px-4`}
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      className="hidden"
                      onChange={(e) => update('paymentScreenshot', e.target.files?.[0] || null)}
                    />
                    <span className="text-gray-300 text-sm text-center">
                      {formData.paymentScreenshot
                        ? `Selected: ${formData.paymentScreenshot.name}`
                        : 'Click to upload payment screenshot'}
                    </span>
                  </label>
                  {errors.paymentScreenshot && <p className="text-red-500 text-xs mt-1">{errors.paymentScreenshot}</p>}
                </div>

                <div>
                  <label className={labelClass}>UPI Transaction ID</label>
                  <input
                    type="text"
                    value={formData.transactionId}
                    onChange={(e) => update('transactionId', e.target.value)}
                    placeholder="Enter UPI transaction ID"
                    className={`${inputClass('transactionId')} font-mono`}
                  />
                  {errors.transactionId && <p className="text-red-500 text-xs mt-1">{errors.transactionId}</p>}
                </div>

                {errors.general && (
                  <div className="border border-red-500/30 bg-red-500/5 rounded-xl p-3.5">
                    <p className="text-red-400 text-sm">{errors.general}</p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-linear-to-r from-red-700 to-red-600 text-white font-bold uppercase tracking-wider rounded-full hover:from-red-600 hover:to-red-500 hover:shadow-[0_0_28px_rgba(220,38,38,0.35)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                  </button>
                </div>
              </form>
            </section>

            <aside className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45),0_0_20px_rgba(220,38,38,0.1)]">
                <h2 className="text-white text-xl font-bold mb-4">Event Details</h2>
                <div className="space-y-3 text-sm sm:text-base">
                  <p className="text-gray-300">
                    <span className="text-red-400 font-medium">Event:</span> {formData.event || 'Select from form'}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-red-400 font-medium">Event Date:</span> {selectedEventMeta.date}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-red-400 font-medium">Team Size:</span> {selectedEventMeta.teamSize}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-red-400 font-medium">Registration Fee:</span> {selectedEventMeta.fee}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center shadow-[0_18px_40px_rgba(0,0,0,0.45),0_0_20px_rgba(220,38,38,0.1)]">
                <img
                  src={upiqrImg}
                  alt="UPI QR Code"
                  className="w-full max-w-65 mx-auto rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
                />
                <p className="text-gray-300 text-sm mt-4">
                  Scan the QR code to complete the registration payment.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Please keep a screenshot of the payment confirmation.
                </p>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default RegistrationPage;
