import { useEffect, useMemo, useState } from 'react';

const getRemainingTime = (targetMs) => {
  const now = Date.now();
  const diff = Math.max(0, targetMs - now);
  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  return { days, hours, minutes };
};

const pad = (value) => String(Math.max(0, value)).padStart(2, '0');

const CountdownTimer = ({ targetDate, className = '' }) => {
  const targetMs = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
  const [timeLeft, setTimeLeft] = useState(() => getRemainingTime(targetMs));

  useEffect(() => {
    if (!Number.isFinite(targetMs)) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      return undefined;
    }

    const tick = () => setTimeLeft(getRemainingTime(targetMs));
    tick();

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetMs]);

  return (
    <span className={className}>
      {pad(timeLeft.days)}d {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m
    </span>
  );
};

export default CountdownTimer;