import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ROLES = [
  'President',
  'Vice President',
  'Secretary',
  'Treasurer',
  'Technical Team',
  'Editorial Team',
  'Creative Team',
  'Event Management Team',
];

const SKILLS = [
  'C++',
  'Python',
  'Java',
  'JavaScript',
  'React',
  'Node.js',
  'UI/UX',
  'Figma',
  'Canva',
  'Photoshop',
  'Video Editing',
  'Photography',
  'Content Writing',
  'Public Speaking',
  'Others',
];

const HOURS_OPTIONS = ['1-5', '5-10', '10-15', '15+'];

const RecruitmentPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    yearOfStudy: '',
    branch: '',
    roles: [],
    preferredRole: '',
    secondPreference: '',
    skills: [],
    otherSkills: '',
    previousClubExperience: '',
    hackathonsParticipated: '',
    eventsOrganized: '',
    leadershipExperience: '',
    github: '',
    linkedin: '',
    portfolioWebsite: '',
    resumeFile: null,
    additionalPortfolioLink: '',
    whyJoinDesoc: '',
    whySelectYou: '',
    valueYouBring: '',
    projectProud: '',
    teamChallenge: '',
    hoursPerWeek: '',
    weekendAvailability: '',
    declarationAccepted: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

 const toggleArrayField = (field, value) => {
  setFormData((prev) => {
    const exists = prev[field].includes(value);

    return {
      ...prev,
      [field]: exists
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    };
  });

  setErrors((prev) =>
    prev[field]
      ? {
          ...prev,
          [field]: undefined,
        }
      : prev
  );
};

  const inputClass = (field) =>
    `w-full bg-black/35 border ${
      errors[field] ? 'border-red-500' : 'border-white/15'
    } rounded-xl px-4 py-3.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500 transition-colors duration-200`;

  const labelClass = 'block text-gray-200 text-sm font-semibold mb-2';
  const cardClass =
    'rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-[0_18px_40px_rgba(0,0,0,0.45),0_0_24px_rgba(220,38,38,0.12)]';

  const validate = () => {
    const e = {};

    if (!formData.fullName.trim()) e.fullName = 'Full name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = 'Valid email address is required';
    }
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile.replace(/\s/g, ''))) {
      e.mobile = 'Valid 10-digit mobile number is required';
    }
    if (!formData.yearOfStudy.trim()) e.yearOfStudy = 'Year of study is required';
    if (!formData.branch.trim()) e.branch = 'Branch is required';
    if (formData.roles.length === 0) e.roles = 'Please select at least one role';
    if (!formData.preferredRole) e.preferredRole = 'Preferred role is required';
    if (formData.skills.length === 0) e.skills = 'Please select at least one skill';
    if (!formData.declarationAccepted) e.declarationAccepted = 'You must accept the declaration';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API call — replace with actual endpoint later
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Log full payload for future backend integration
    console.log('[Recruitment Form Submission]', {
      personalDetails: {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        yearOfStudy: formData.yearOfStudy.trim(),
        branch: formData.branch.trim(),
      },
      roleSelection: {
        selectedRoles: formData.roles,
        preferredRole: formData.preferredRole,
        secondPreference: formData.secondPreference,
      },
      skills: {
        selected: formData.skills,
        others: formData.otherSkills.trim(),
      },
      experience: {
        previousClubExperience: formData.previousClubExperience.trim(),
        //hackathonsParticipated: formData.hackathonsParticipated.trim(),
        //eventsOrganized: formData.eventsOrganized.trim(),
        leadershipExperience: formData.leadershipExperience.trim(),
      },
      portfolio: {
        github: formData.github.trim(),
        linkedin: formData.linkedin.trim(),
        portfolioWebsite: formData.portfolioWebsite.trim(),
        resumeFileName: formData.resumeFile?.name,
        additionalPortfolioLink: formData.additionalPortfolioLink.trim(),
      },
      shortAnswers: {
        whyJoinDesoc: formData.whyJoinDesoc.trim(),
        whySelectYou: formData.whySelectYou.trim(),
        valueYouBring: formData.valueYouBring.trim(),
        projectProud: formData.projectProud.trim(),
        teamChallenge: formData.teamChallenge.trim(),
      },
      availability: {
        hoursPerWeek: formData.hoursPerWeek,
        weekendAvailability: formData.weekendAvailability,
      },
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleApplyNowClick = () => {
    document.getElementById('recruitment-form')?.scrollIntoView({ behavior: 'smooth' });
  };

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
          <h2 className="text-white text-4xl font-bold uppercase tracking-wider mb-4">Application Submitted</h2>
          <p className="text-gray-400 text-sm mb-2">
            Thank you, <span className="text-white font-semibold">{formData.fullName}</span>
          </p>
          <p className="text-gray-500 text-xs mt-4 mb-10">
            We will review your application and get back to you soon.
          </p>
          <Link
            to="/"
            className="px-8 py-3 bg-linear-to-r from-red-700 to-red-600 text-white font-bold uppercase tracking-wider rounded-full hover:from-red-600 hover:to-red-500 transition-all duration-300"
            style={{ boxShadow: '0 0 30px rgba(220,38,38,0.3)' }}
          >
            Back to Home
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
        <div
          className="fixed inset-0 -z-10"
          style={{
            background: 'linear-gradient(135deg, black, rgba(127,29,29,0.3) 50%, black)',
          }}
        />
        <div
          className="fixed inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse at top right, rgba(127,29,29,0.15), transparent 50%)',
          }}
        />
        <div
          className="fixed inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse at bottom left, rgba(153,27,27,0.1), transparent 50%)',
          }}
        />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-white text-4xl sm:text-5xl font-bold tracking-wide mb-4">
              Join DESOC
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
              Become a part of DESOC and work with passionate developers, designers, innovators,
              and leaders while building impactful projects and organizing exciting technical events.
            </p>
            <button
              onClick={handleApplyNowClick}
              className="px-8 py-3.5 bg-linear-to-r from-red-700 to-red-600 text-white font-bold uppercase tracking-wider rounded-full hover:from-red-600 hover:to-red-500 hover:shadow-[0_0_28px_rgba(220,38,38,0.35)] hover:scale-[1.02] transition-all duration-300"
            >
              Apply Now
            </button>
          </div>

          <form id="recruitment-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1 – Personal Details */}
            <section className={cardClass}>
              <h2 className="text-white text-xl font-bold mb-6 border-b border-white/10 pb-3">
                Personal Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className={inputClass('fullName')}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className={labelClass}>Email ID *</label>
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
                  <label className={labelClass}>Mobile Number *</label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => update('mobile', e.target.value)}
                    placeholder="9876543210"
                    className={inputClass('mobile')}
                  />
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                </div>
                <div>
                  <label className={labelClass}>Year of Study *</label>
                  <input
                    type="text"
                    value={formData.yearOfStudy}
                    onChange={(e) => update('yearOfStudy', e.target.value)}
                    placeholder="e.g. FY, SY, TY"
                    className={inputClass('yearOfStudy')}
                  />
                  {errors.yearOfStudy && (
                    <p className="text-red-500 text-xs mt-1">{errors.yearOfStudy}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Branch *</label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => update('branch', e.target.value)}
                    placeholder="e.g. Computer Science, Electronics"
                    className={inputClass('branch')}
                  />
                  {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch}</p>}
                </div>
              </div>
            </section>

            {/* Section 2 – Role Selection */}
            <section className={cardClass}>
              <h2 className="text-white text-xl font-bold mb-6 border-b border-white/10 pb-3">
                Role Selection
              </h2>

              <div className="mb-6">
                <p className="text-gray-300 text-sm font-semibold mb-3">
                  Select the roles you are interested in *
                </p>
                <div className="grid grid-cols-2 gap-3">
                  
                  {ROLES.map((role) => {
                    const selected = formData.roles.includes(role);

                    return (
                      <div
                        key={role}
                        onClick={() => toggleArrayField("roles", role)}
                        className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 select-none flex items-center gap-3
                        ${
                      selected
                      ? "border-red-600 bg-red-600/15"
                      : "border-white/20 hover:border-red-500 hover:bg-white/5"
                      }`}
                      >
                    <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selected
                    ? "bg-red-600 border-red-600"
                    : "border-white/30"
                    }`}
                    >
                  {selected && (
                    <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                    >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                    />
                    </svg>
                  )}
                  </div>

              <span className="text-gray-200 text-sm">{role}</span>
              </div>
              );
              })}
                </div>
                {errors.roles && <p className="text-red-500 text-xs mt-2">{errors.roles}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Preferred Role *</label>
                  <select
                    value={formData.preferredRole}
                    onChange={(e) => update('preferredRole', e.target.value)}
                    className={`${inputClass('preferredRole')} appearance-none`}
                  >
                    <option value="">Select preferred role</option>
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {errors.preferredRole && (
                    <p className="text-red-500 text-xs mt-1">{errors.preferredRole}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Second Preference (Optional)</label>
                  <select
                    value={formData.secondPreference}
                    onChange={(e) => update('secondPreference', e.target.value)}
                    className={`${inputClass('secondPreference')} appearance-none`}
                  >
                    <option value="">Select second preference</option>
                    {ROLES.filter((r) => r !== formData.preferredRole).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Section 3 – Skills */}
            <section className={cardClass}>
              <h2 className="text-white text-xl font-bold mb-6 border-b border-white/10 pb-3">
                Skills
              </h2>

              <div className="mb-4">
                <p className="text-gray-300 text-sm font-semibold mb-3">
                  Select your skills *
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  
                  
                  
                  {SKILLS.map((skill) => {

  const selected = formData.skills.includes(skill);

  return (
    <div
      key={skill}
      onClick={() => toggleArrayField("skills", skill)}
      className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 select-none flex items-center gap-3
      ${
        selected
          ? "border-red-600 bg-red-600/15"
          : "border-white/20 hover:border-red-500 hover:bg-white/5"
      }`}
    >
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
          selected
            ? "bg-red-600 border-red-600"
            : "border-white/30"
        }`}
      >
        {selected && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>

      <span className="text-gray-200 text-sm">{skill}</span>
    </div>
  );
})}
                </div>
                {errors.skills && <p className="text-red-500 text-xs mt-2">{errors.skills}</p>}
              </div>

              {formData.skills.includes('Others') && (
                <div className="mt-4">
                  <label className={labelClass}>Specify other skills</label>
                  <input
                    type="text"
                    value={formData.otherSkills}
                    onChange={(e) => update('otherSkills', e.target.value)}
                    placeholder="List your other skills"
                    className={inputClass('otherSkills')}
                  />
                </div>
              )}
            </section>

            {/* Section 4 – Experience */}
            <section className={cardClass}>
              <h2 className="text-white text-xl font-bold mb-6 border-b border-white/10 pb-3">
                Experience
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Previous club experience?</label>
                  <textarea
                    value={formData.previousClubExperience}
                    onChange={(e) => update('previousClubExperience', e.target.value)}
                    placeholder="Describe any clubs or organizations you've been part of..."
                    rows={3}
                    className={`${inputClass('previousClubExperience')} resize-none`}
                  />
                </div>
                {/* <div>
                  <label className={labelClass}>Hackathons participated?</label>
                  <textarea
                    value={formData.hackathonsParticipated}
                    onChange={(e) => update('hackathonsParticipated', e.target.value)}
                    placeholder="List hackathons you've participated in (if any)"
                    rows={2}
                    className={`${inputClass('hackathonsParticipated')} resize-none`}
                  />
                </div> */}
                {/* <div>
                  <label className={labelClass}>Events organized?</label>
                  <textarea
                    value={formData.eventsOrganized}
                    onChange={(e) => update('eventsOrganized', e.target.value)}
                    placeholder="Describe any events you've helped organize..."
                    rows={2}
                    className={`${inputClass('eventsOrganized')} resize-none`}
                  />
                </div> */}
                <div>
                  <label className={labelClass}>Leadership experience?</label>
                  <textarea
                    value={formData.leadershipExperience}
                    onChange={(e) => update('leadershipExperience', e.target.value)}
                    placeholder="Describe any leadership roles or responsibilities you've held..."
                    rows={2}
                    className={`${inputClass('leadershipExperience')} resize-none`}
                  />
                </div>
              </div>
            </section>

            {/* Section 5 – Portfolio */}
            <section className={cardClass}>
              <h2 className="text-white text-xl font-bold mb-6 border-b border-white/10 pb-3">
                Portfolio
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>GitHub</label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => update('github', e.target.value)}
                    placeholder="https://github.com/username"
                    className={inputClass('github')}
                  />
                </div>
                <div>
                  <label className={labelClass}>LinkedIn</label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => update('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className={inputClass('linkedin')}
                  />
                </div>
                <div>
                  <label className={labelClass}>Portfolio Website</label>
                  <input
                    type="url"
                    value={formData.portfolioWebsite}
                    onChange={(e) => update('portfolioWebsite', e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className={inputClass('portfolioWebsite')}
                  />
                </div>
                <div>
                  <label className={labelClass}>Additional Link(if any)</label>
                  <input
                    type="url"
                    value={formData.additionalPortfolioLink}
                    onChange={(e) => update('additionalPortfolioLink', e.target.value)}
                    placeholder="Behance, Dribbble, etc."
                    className={inputClass('additionalPortfolioLink')}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className={labelClass}>Upload Resume</label>
                <label
                  className={`flex items-center justify-center w-full rounded-xl border-2 border-dashed border-white/20 bg-black/20 cursor-pointer hover:border-red-500/60 transition-colors duration-200 py-8 px-4`}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => update('resumeFile', e.target.files?.[0] || null)}
                  />
                  <span className="text-gray-300 text-sm text-center">
                    {formData.resumeFile
                      ? `Selected: ${formData.resumeFile.name}`
                      : 'Click to upload resume (PDF, DOC, DOCX)'}
                  </span>
                </label>
              </div>
            </section>

            {/* Section 6 – Short Answer */}
            <section className={cardClass}>
              <h2 className="text-white text-xl font-bold mb-6 border-b border-white/10 pb-3">
                Short Answer
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Why do you want to join DESOC?</label>
                  <textarea
                    value={formData.whyJoinDesoc}
                    onChange={(e) => update('whyJoinDesoc', e.target.value)}
                    placeholder="Share your motivation for joining DESOC..."
                    rows={3}
                    className={`${inputClass('whyJoinDesoc')} resize-none`}
                  />
                </div>
                {/* <div>
                  <label className={labelClass}>Why should we select you?</label>
                  <textarea
                    value={formData.whySelectYou}
                    onChange={(e) => update('whySelectYou', e.target.value)}
                    placeholder="What makes you a great fit for DESOC..."
                    rows={3}
                    className={`${inputClass('whySelectYou')} resize-none`}
                  />
                </div>
                <div>
                  <label className={labelClass}>What value can you bring to the club?</label>
                  <textarea
                    value={formData.valueYouBring}
                    onChange={(e) => update('valueYouBring', e.target.value)}
                    placeholder="Describe the unique value you'll add..."
                    rows={3}
                    className={`${inputClass('valueYouBring')} resize-none`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Describe a project you're proud of.</label>
                  <textarea
                    value={formData.projectProud}
                    onChange={(e) => update('projectProud', e.target.value)}
                    placeholder="Tell us about a project that showcases your skills..."
                    rows={3}
                    className={`${inputClass('projectProud')} resize-none`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Describe a challenge you solved while working in a team.</label>
                  <textarea
                    value={formData.teamChallenge}
                    onChange={(e) => update('teamChallenge', e.target.value)}
                    placeholder="Share a team challenge and how you overcame it..."
                    rows={3}
                    className={`${inputClass('teamChallenge')} resize-none`}
                  />
                </div> */}
              </div>
            </section>

            {/* Section 7 – Availability */}
            {/* <section className={cardClass}>
              <h2 className="text-white text-xl font-bold mb-6 border-b border-white/10 pb-3">
                Availability
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Hours available per week</label>
                  <select
                    value={formData.hoursPerWeek}
                    onChange={(e) => update('hoursPerWeek', e.target.value)}
                    className={`${inputClass('hoursPerWeek')} appearance-none`}
                  >
                    <option value="">Select hours</option>
                    {HOURS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt} hours
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Weekend availability</label>
                  <select
                    value={formData.weekendAvailability}
                    onChange={(e) => update('weekendAvailability', e.target.value)}
                    className={`${inputClass('weekendAvailability')} appearance-none`}
                  >
                    <option value="">Select availability</option>
                    <option value="Available">Available</option>
                    <option value="Partially Available">Partially Available</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>
              </div>
            </section> */}

            {/* Section 8 – Declaration */}
            <section className={cardClass}>
              <h2 className="text-white text-xl font-bold mb-6 border-b border-white/10 pb-3">
                Declaration
              </h2>
              <div
                onClick={() =>
                update("declarationAccepted", !formData.declarationAccepted)
                }
                className="flex items-start gap-3 cursor-pointer select-none"
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 ${
                    formData.declarationAccepted
                      ? 'bg-red-600 border-red-600'
                      : errors.declarationAccepted
                      ? 'border-red-500'
                      : 'border-white/30'
                  }`}
                  onClick={() => update('declarationAccepted', !formData.declarationAccepted)}
                >
                  {formData.declarationAccepted && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.declarationAccepted}
                  onChange={(e) => update('declarationAccepted', e.target.checked)}
                />
                <span className="text-gray-300 text-sm leading-relaxed">
                  I confirm that all information provided is correct and I understand that club
                  responsibilities require commitment and teamwork. *
                </span>
              </div>
              {errors.declarationAccepted && (
                <p className="text-red-500 text-xs mt-1 mb-4">{errors.declarationAccepted}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-10 py-3.5 bg-linear-to-r from-red-700 to-red-600 text-white font-bold uppercase tracking-wider rounded-full hover:from-red-600 hover:to-red-500 hover:shadow-[0_0_28px_rgba(220,38,38,0.35)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </section>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default RecruitmentPage;