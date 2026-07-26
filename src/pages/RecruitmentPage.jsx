import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RecruitmentPage = () => {
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
          </div>

          {/* Recruitment Closed Message */}
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-white/20 flex items-center justify-center mb-8">
              <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-white text-3xl sm:text-4xl font-bold uppercase tracking-wider mb-4">
              Recruitment Closed
            </h2>
            <p className="text-gray-400 text-sm mb-2">
              Thank you for your interest in joining DESOC.
            </p>
            <p className="text-gray-500 text-xs mt-2 mb-10">
              Applications are currently closed. Stay tuned for the next recruitment cycle.
            </p>
            <Link
              to="/"
              className="px-8 py-3 bg-linear-to-r from-red-700 to-red-600 text-white font-bold uppercase tracking-wider rounded-full hover:from-red-600 hover:to-red-500 transition-all duration-300"
              style={{ boxShadow: '0 0 30px rgba(220,38,38,0.3)' }}
            >
              Back to Home
            </Link>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default RecruitmentPage;