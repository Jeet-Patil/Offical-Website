import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { pastEvents } from '../data/pastEventsData';

const PastEventsPage = () => {
  return (
    <div className="min-h-screen bg-black" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-black via-[#0a0005] to-[#0f0010] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-purple-900/10 to-transparent"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#bc0034]/5 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1
              className="
                text-4xl sm:text-5xl md:text-6xl font-bold text-white
                uppercase tracking-[0.2em]
                drop-shadow-[0_0_30px_rgba(220,38,38,0.3)]
                mb-4
              "
            >
              Past Events
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-0.5 w-12 bg-linear-to-r from-transparent to-[#bc0034]"></div>
              <div className="h-1 w-20 bg-linear-to-r from-[#bc0034] via-purple-500 to-[#bc0034] rounded-full"></div>
              <div className="h-0.5 w-12 bg-linear-to-l from-transparent to-[#bc0034]"></div>
            </div>
            <p className="text-gray-400 mt-6 text-lg uppercase tracking-widest">DESOC Event Archive</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <div
                key={event.id}
                className="group animate-fade-in-up overflow-hidden rounded-2xl border border-red-500/20 bg-black/40 backdrop-blur-xl shadow-[0_0_30px_rgba(185,28,28,0.12)] transition-all duration-500 hover:scale-[1.02] hover:border-red-400/45 hover:shadow-[0_0_40px_rgba(220,38,38,0.25)]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-video w-full overflow-hidden border-b border-red-500/15">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-5 sm:p-6">
                  <h2 className="text-white text-xl font-semibold leading-snug min-h-14">{event.title}</h2>
                  <p className="mt-2 text-sm text-red-300">{event.date || 'Date to be announced'}</p>
                  <p className="mt-4 text-sm text-gray-300 leading-relaxed min-h-20">{event.shortDescription}</p>

                  <Link
                    to={`/events/${event.id}`}
                    className="mt-5 inline-flex items-center justify-center rounded-full border border-red-500/45 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-red-200 transition hover:bg-red-500/15 hover:text-white"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PastEventsPage;
