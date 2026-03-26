import { Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';

const RegistrationAlertBanner = ({
  targetDate,
  ctaTo = '/genesis/register',
  ctaLabel = 'Register Now ->',
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-60 border-b border-white/15 bg-linear-to-r from-[#970233] to-[#c41e5c] shadow-[0_10px_26px_rgba(151,2,51,0.45)]">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-white">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wide fomo-blink">
              ⚠️ Registrations Closing Soon - Limited Slots Left!
            </span>
            <span className="text-[11px] sm:text-xs text-white/90">
              ⚠️ Registrations Closing in{' '}
              <CountdownTimer targetDate={targetDate} className="font-bold tracking-wide text-white" />
            </span>
          </div>

          <Link
            to={ctaTo}
            className="fomo-register-btn inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-white/30 bg-black/20 px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:border-white/60 hover:bg-black/35"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationAlertBanner;