import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Events from '../components/Events';
import Committee from '../components/Commitee';
import Gallery from '../components/Gallery';
import Footer from '../components/Footer';
import RegistrationAlertBanner from '../components/RegistrationAlertBanner';

const REGISTRATION_DEADLINE = '2026-03-26T23:59:00+05:30';

const Home = () => {
  return (
    <div className="bg-black min-h-screen">
      <RegistrationAlertBanner targetDate={REGISTRATION_DEADLINE} />
      <Navbar topOffset={44} />
      <Hero />
      <Events />
      <Committee />
      <Gallery />
      <Footer />
    </div>
  );
};

export default Home;