import backgroundImage from '../assets/bg.png';
import desocLogo from '../assets/logo_home.png';
import clgLogo from '../assets/clg_logo.svg';
import ParticleHeroBackground from './ParticleHeroBackground';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {

  const navigate = useNavigate();

  const [events, setEvents] = useState(0);
  const [participation, setParticipation] = useState(0);
  const [alumni, setAlumni] = useState(0);
  const [prize, setPrize] = useState(0);

  useEffect(() => {

    const eventInterval = setInterval(() => {
      setEvents(prev => prev < 50 ? prev + 1 : 50);
    }, 100);

    const participationInterval = setInterval(() => {
      setParticipation(prev => prev < 5000 ? prev + 50 : 5000);
    }, 30);

    const alumniInterval = setInterval(() => {
      setAlumni(prev => prev < 100 ? prev + 1 : 100);
    }, 100);

    const prizeInterval = setInterval(() => {
      setPrize(prev => prev < 15000 ? prev + 150 : 15000);
    }, 30);

    return () => {
      clearInterval(eventInterval);
      clearInterval(participationInterval);
      clearInterval(alumniInterval);
      clearInterval(prizeInterval);
    };

  }, []);

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">

      {/* Particle Background */}
      <ParticleHeroBackground />

      {/* Left Background Image */}
      <div className="absolute inset-0 lg:w-[45%]">
        <img
          src={backgroundImage}
          alt="DESOC Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-[#7a0000]/30 to-black"></div>
      </div>

      {/* CLG Logo */}
      <div className="absolute top-4 left-4 lg:left-12 z-50">
        <img src={clgLogo} className="w-28 sm:w-36 lg:w-44" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-[45%_55%] min-h-screen">

        {/* Left Empty (image already placed) */}
        <div></div>

        {/* Right Content */}
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16">

          {/* DESOC Logo */}
          <img
            src={desocLogo}
            className="w-60 sm:w-72 mb-6"
          />

          {/* Description */}
          <p className="text-gray-300 text-lg lg:text-xl mb-8 max-w-xl">
            Design Society is a community where we empower students to innovate
            at the intersection of design and technology through projects,
            workshops, competitions and collaborations.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mb-12">

            <button
              onClick={() => navigate('/about')}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-bold rounded"
            >
              About Us
            </button>

            <button
              onClick={() => navigate('/genesis')}
              className="px-6 py-2 text-white font-bold rounded"
              style={{ background: 'linear-gradient(135deg,#970233,#c41e5c)' }}
            >
              GENESIS
            </button>

          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">

            <div>
              <h3 className="text-3xl font-bold text-white">{events}+</h3>
              <p className="text-white/80 text-sm">Events Conducted</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white">{participation}+</h3>
              <p className="text-white/80 text-sm">Participation</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white">{alumni}+</h3>
              <p className="text-white/80 text-sm">Alumni</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white">₹{prize}+</h3>
              <p className="text-white/80 text-sm">Prize Pool</p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;