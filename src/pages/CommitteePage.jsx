import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Import member images from assets/members
import adityaImg from '../assets/members/aditya1.png';
import ayushiImg from '../assets/members/ayushi.svg';
import jeetImg from '../assets/members/jeet.svg';
import ishaniImg from '../assets/members/ishani.svg';
import monishImg from '../assets/members/monish.svg';
import vedantImg from '../assets/members/vedant.svg';
import sanskrutiImg from '../assets/members/sanskruti.svg';
import pranitaImg from '../assets/members/pranita.svg';
import shrimantImg from '../assets/members/shrimant.svg';
import omcImg from '../assets/members/omc.jpeg';
import rajanImg from '../assets/members/rajan.svg';
import dishaImg from '../assets/members/disha.svg';
import madhuraImg from '../assets/members/madhura.svg';
import zaweriyaImg from '../assets/members/zewariya.svg';
import atharvaImg from '../assets/members/atharva.svg';
import omImg from '../assets/members/om.svg';
import kshitijaImg from '../assets/members/kshitija.svg';
import nehaImg from '../assets/members/neha.svg';
import parthImg from '../assets/members/parth.svg';
import sahilImg from '../assets/members/sahil.svg';
import riyaImg from '../assets/members/riya.svg';
import swaradaImg from '../assets/members/swarada.svg';
import shravaniImg from '../assets/members/shravani.svg';
import prashantImg from '../assets/members/prashant.svg';
import siddharthImg from '../assets/members/siddharth.svg';

const SOCIAL_LINKS = {
  'Shrimant Marathe': {
    linkedin: 'https://www.linkedin.com/in/shrimant-marathe',
    github: 'https://github.com/shrimantm',
  },
  'Swarada Joshi': {
    linkedin: 'https://www.linkedin.com/in/swarada-joshi-334a07359',
  },
  'Zaweriya Khan': {
    linkedin: 'https://www.linkedin.com/in/zaweriya-khan-911118332',
  },
  'Ishani Murkewar': {
    linkedin: 'https://www.linkedin.com/in/ishani-murkewar-ab9063317',
    github: 'https://github.com/ItsJustTheBeginning474264',
  },
  'Parth Waje': {
    linkedin: 'https://www.linkedin.com/in/parth-waje-942416377',
    github: 'https://github.com/Arkk9',
  },
  'Jeet Patil': {
    linkedin: 'https://www.linkedin.com/in/jeet-patil-68aa44288',
    github: 'https://github.com/Jeet-Patil',
  },
  'Om Chaudhari': {
    linkedin: 'https://www.linkedin.com/in/om-chaudhari-78b900279',
    github: 'https://github.com/OmChaudhari08',
  },
  'Aditya Ahirrao': {
    linkedin: 'https://www.linkedin.com/in/aditya-ahirrao-61210721a',
    github: 'https://github.com/adityaahirrao17-stack',
    website: 'https://www.aditya-ahirrao.online',
  },
  'Rajan Udapure': {
    linkedin: 'https://www.linkedin.com/in/rajan-u-406658328',
    github: 'https://github.com/141206-rjn',
  },
  'Sanskruti Gite': {
    linkedin: 'https://www.linkedin.com/in/sanskrutigite',
  },
  'Madhura Katti': {
    linkedin: 'https://www.linkedin.com/in/madhura-katti-b34965369',
    github: 'https://github.com/MadhuraKatti',
  },
  'Om Patil': {
    linkedin: 'https://www.linkedin.com/in/om-patil-116984343',
    github: 'https://github.com/om-27',
  },
  'Riya Sequeira': {
    linkedin: 'https://www.linkedin.com/in/riya-sequeira-bb8281213',
    github: 'https://github.com/riya-2617',
  },
  'Atharva Kulkarni': {
    linkedin: 'https://www.linkedin.com/in/atharva-kulkarni-b55a9b277',
    github: 'https://github.com/Atharvakulkarni34',
  },
  'Pranita Patil': {
    linkedin: 'https://www.linkedin.com/in/pranita-patil-0685762a8',
    github: 'https://github.com/pranita7748',
  },
};

const CommitteePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Committee data organized by teams
  const committeeData = {
    faculty: {
      title: "Faculty Coordinator",
      members: [
        { name: "Prof. Mrunali Pawar", role: "Faculty Coordinator", image: "https://via.placeholder.com/300x400?text=Prof.+Mrunali+Pawar" },
      ]
    },
    core: {
      title: "Core Committee",
      members: [
        { name: "Aditya Ahirrao", role: "President", image: adityaImg },
        { name: "Ayushi Deore", role: "Vice President", image: ayushiImg },
        { name: "Vedant Sonawane", role: "Event Operations Head", image: vedantImg },
        { name: "Ishani Murkewar", role: "Secretary", image: ishaniImg },
        { name: "Jeet Patil", role: "Technical Head", image: jeetImg },
        { name: "Monish Patil", role: "Creative Head", image: monishImg },
        { name: "Sanskruti Gite", role: "Treasurer", image: sanskrutiImg },
        { name: "Pranita Patil", role: "Co-Treasurer", image: pranitaImg },
      ]
    },
    technical: {
      title: "Technical Team",
      members: [
        { name: "Shrimant Marathe", role: "Technical Team", image: shrimantImg },
        { name: "Om Chaudhari", role: "Technical Team", image: omcImg },
        { name: "Piyush Shendge", role: "Technical Team", image: '' },
        { name: "Rajan Udapure", role: "Technical Team", image: rajanImg },
      ]
    },
    editorial: {
      title: "Editorial Team",
      members: [
        { name: "Disha Kapse", role: "Editorial Team", image: dishaImg },
        { name: "Madhura Katti", role: "Editorial Team", image: madhuraImg },
        { name: "Zaweriya Khan", role: "Editorial Team", image: zaweriyaImg },
      ]
    },
    eventOps: {
      title: "Event Operations Team",
      members: [
        { name: "Atharva Kulkarni", role: "Event Operations", image: atharvaImg },
        { name: "Om Patil", role: "Event Operations", image: omImg },
        { name: "Kshitija Daware", role: "Event Operations", image: kshitijaImg },
        { name: "Neha Bhamare", role: "Event Operations", image: nehaImg },
        { name: "Parth Waje", role: "Event Operations", image: parthImg },
        { name: "Sahil Batheja", role: "Event Operations", image: sahilImg },
      ]
    },
    creative: {
      title: "Creative Team",
      members: [
        { name: "Riya Sequeira", role: "Creative Team", image: riyaImg },
        { name: "Swarada Joshi", role: "Creative Team", image: swaradaImg },
        { name: "Shravani Bhagwat", role: "Creative Team", image: shravaniImg },
        { name: "Prashant Deokar", role: "Creative Team", image: prashantImg },
        { name: "Siddharth Wade", role: "Creative Team", image: siddharthImg },
      ]
    }
  };

  // Member Card Component
  const MemberCard = ({ member, index }) => {
    const [showIcons, setShowIcons] = useState(false);

    const handleCardClick = () => {
      setShowIcons(!showIcons);
    };

    return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        backdrop-blur-xl border border-white/10
        transition-all duration-500 ease-out
        hover:scale-105 hover:border-red-500/50 cursor-pointer
        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
      style={{ 
        transitionDelay: `${index * 100}ms`,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 40px rgba(220,38,38,0.3), 0 8px 32px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
      }}
      onClick={handleCardClick}
    >
      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(to top, rgba(220,38,38,0.2), transparent)' }}
      />

      {/* Image Container */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-80"
          style={{ background: 'linear-gradient(to top, black, rgba(0,0,0,0.5) 50%, transparent)' }}
        />
        
        {/* Neon border glow effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(to right, transparent, #ef4444, transparent)' }}
        />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-5 left-5 right-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-white font-semibold text-[18px] sm:text-[20px] leading-tight group-hover:text-red-100 transition-colors duration-300">
            {member.name}
          </h3>
        </div>

        <p className="mt-1 text-red-400 text-[13px] sm:text-[14px] font-medium uppercase tracking-[0.08em] group-hover:text-red-300 transition-colors duration-300">
          {member.role}
        </p>
      </div>

      {/* Right Edge Slider - Desktop (hover) and Mobile (click) */}
      <div className={`absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3 pr-3 py-4 transition-all duration-500 md:opacity-0 md:translate-x-8 md:group-hover:opacity-100 md:group-hover:translate-x-0 ${showIcons ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 md:opacity-0 md:translate-x-8'}`}>
        <a
          href={member.linkedin || 'https://linkedin.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a]/80 border border-white/30 p-2.5 text-white hover:bg-[#333333] hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] md:opacity-0 md:group-hover:opacity-100"
          style={{ transitionDelay: '100ms' }}
          title="LinkedIn"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.81 0-9.728h3.554v1.375c.427-.659 1.191-1.595 2.897-1.595 2.117 0 3.704 1.384 3.704 4.362v5.586zM5.337 9.433c-1.144 0-1.915-.759-1.915-1.71 0-.951.77-1.71 1.955-1.71 1.184 0 1.915.759 1.915 1.71 0 .951-.73 1.71-1.955 1.71zm1.575 11.019H3.762V9.724h3.15v10.728zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
        <a
          href={member.github || 'https://github.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a]/80 border border-white/30 p-2.5 text-white hover:bg-[#333333] hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] md:opacity-0 md:group-hover:opacity-100"
          style={{ transitionDelay: '150ms' }}
          title="GitHub"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 .296C5.372.296 0 5.668 0 12.296c0 5.302 3.438 9.8 8.206 11.388.6.111.82-.261.82-.579 0-.286-.011-1.23-.016-2.23-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.303-5.467-1.333-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.006-.404c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.769.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.625-5.479 5.922.43.37.814 1.103.814 2.222 0 1.605-.015 2.898-.015 3.293 0 .321.216.694.825.576C20.565 22.092 24 17.596 24 12.296 24 5.668 18.627.296 12 .296z" />
          </svg>
        </a>
        {member.website && (
          <a
            href={member.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a]/80 border border-white/30 p-2.5 text-white hover:bg-[#333333] hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] md:opacity-0 md:group-hover:opacity-100"
            style={{ transitionDelay: '200ms' }}
            title="Website"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
    );
  };

  // Team Section Component
  const TeamSection = ({ teamKey, team, sectionIndex }) => (
    <section
      className={`
        mb-16 transition-all duration-700 ease-out
        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
      style={{ transitionDelay: `${sectionIndex * 200}ms` }}
    >
      {/* Glass Container */}
      <div 
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl backdrop-blur-2xl border border-white/10 p-4 sm:p-6 md:p-10"
        style={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }}
      >
        {/* Background glow */}
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'rgba(220,38,38,0.1)' }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'rgba(127,29,29,0.1)' }}
        />

        {/* Team Title with Red Accent */}
        <div className="relative flex items-center mb-10">
          <div 
            className="w-1 h-10 rounded-full mr-4"
            style={{ 
              background: 'linear-gradient(to bottom, #ef4444, #b91c1c)',
              boxShadow: '0 0 10px rgba(220,38,38,0.5)'
            }}
          />
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
            {team.title}
          </h2>
        </div>

        {/* Members Grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {team.members.map((member, index) => (
            <MemberCard 
              key={`${teamKey}-${index}`} 
              member={{ ...member, ...(SOCIAL_LINKS[member.name] || {}) }} 
              index={index + sectionIndex * 3}
            />
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Background with gradient */}
      <div className="relative">
        {/* Dark red & black gradient background */}
        <div 
          className="fixed inset-0 -z-10"
          style={{ background: 'linear-gradient(135deg, black, rgba(127,29,29,0.3) 50%, black)' }}
        />
        <div 
          className="fixed inset-0 -z-10"
          style={{ background: 'radial-gradient(ellipse at top right, rgba(127,29,29,0.15), transparent 50%)' }}
        />
        <div 
          className="fixed inset-0 -z-10"
          style={{ background: 'radial-gradient(ellipse at bottom left, rgba(153,27,27,0.1), transparent 50%)' }}
        />
        
        {/* Subtle grid pattern */}
        <div 
          className="fixed inset-0 opacity-5 -z-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Main Content */}
        <main className="relative px-4 sm:px-6 lg:px-8 pt-24 pb-16 max-w-7xl mx-auto">
          {/* Page Header */}
          <header className={`text-center mb-10 sm:mb-16 md:mb-20 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <div className="relative inline-block">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-4">
                DESOC Committee
              </h1>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, #ef4444)' }} />
                <span className="text-red-400 text-xl md:text-2xl font-light tracking-widest">2025–26</span>
                <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, #ef4444)' }} />
              </div>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                Meet the dedicated team driving innovation and excellence at the Design Society
              </p>
            </div>
          </header>

          {/* Team Sections */}
          <div className="space-y-8">
            {Object.entries(committeeData).map(([key, team], index) => (
              <TeamSection 
                key={key} 
                teamKey={key} 
                team={team} 
                sectionIndex={index}
              />
            ))}
          </div>

          {/* Bottom decoration */}
          <div 
            className={`
              mt-20 flex justify-center transition-all duration-1000
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            style={{ transitionDelay: '1000ms' }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full bg-red-600"
                style={{ boxShadow: '0 0 10px rgba(220,38,38,0.8)' }}
              />
              <div 
                className="w-16 h-px"
                style={{ background: 'linear-gradient(to right, #dc2626, transparent)' }}
              />
              <span className="text-gray-500 text-sm uppercase tracking-widest">Design Society</span>
              <div 
                className="w-16 h-px"
                style={{ background: 'linear-gradient(to left, #dc2626, transparent)' }}
              />
              <div 
                className="w-2 h-2 rounded-full bg-red-600"
                style={{ boxShadow: '0 0 10px rgba(220,38,38,0.8)' }}
              />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CommitteePage;
