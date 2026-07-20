import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import recruitmentImg from '../assets/desoc_recruitment.jpg';

/**
 * RecruitmentPopup
 *
 * Displays a recruitment image popup on the first visit of a browser session.
 * Uses sessionStorage so it only shows once per session.
 * Supports closing via: close button, Escape key, or clicking the overlay.
 */
const RecruitmentPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let shown = false;
    try {
      shown = sessionStorage.getItem('desoc_recruitment_shown') === 'true';
    } catch {
      // sessionStorage unavailable — fall through and show popup normally
    }

    if (!shown) {
      // Small delay so the page has a moment to render before the popup appears
      const timer = setTimeout(() => setIsVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = useCallback(() => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimatingOut(false);
      try {
        sessionStorage.setItem('desoc_recruitment_shown', 'true');
      } catch {
        // sessionStorage unavailable — gracefully ignore
      }
    }, 300); // matches CSS transition duration
  }, []);

  const handleApplyNow = useCallback(() => {
    close();
    // Navigate after the close animation completes
    setTimeout(() => navigate('/recruitment'), 320);
  }, [close, navigate]);

  // Escape key listener
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, close]);

  // Prevent background scroll while popup is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* ── Inline styles (no external CSS file needed) ── */}
      <style>{`
        @keyframes popupFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes popupScaleIn {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes popupFadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes popupScaleOut {
          from { opacity: 1; transform: scale(1)    translateY(0);    }
          to   { opacity: 0; transform: scale(0.92) translateY(8px);  }
        }

        .recruitment-overlay {
          animation: popupFadeIn 0.3s ease both;
        }
        .recruitment-overlay.animating-out {
          animation: popupFadeOut 0.3s ease both;
        }

        .recruitment-modal {
          animation: popupScaleIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .recruitment-modal.animating-out {
          animation: popupScaleOut 0.3s ease both;
        }

        .recruitment-close-btn:hover {
          background: rgba(151, 2, 51, 0.85);
          transform: scale(1.08);
        }
        .recruitment-close-btn:focus-visible {
          outline: 2px solid #ff4d88;
          outline-offset: 2px;
        }

        .recruitment-apply-btn {
          background: linear-gradient(145deg, #970233 0%, #d81b60 55%, #ff4d88 100%);
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
          box-shadow: 0 4px 24px rgba(151, 2, 51, 0.45);
        }
        .recruitment-apply-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 32px rgba(151, 2, 51, 0.65);
          filter: brightness(1.1);
        }
        .recruitment-apply-btn:active {
          transform: translateY(0) scale(0.98);
        }
        .recruitment-apply-btn:focus-visible {
          outline: 2px solid #ff4d88;
          outline-offset: 3px;
        }

        .recruitment-badge-pulse {
          animation: badgePulse 2s ease-in-out infinite;
        }
        @keyframes badgePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>

      {/* ── Overlay ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="DESOC Recruitment Information"
        className={`recruitment-overlay${isAnimatingOut ? ' animating-out' : ''}`}
        onClick={close}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          background: 'rgba(0, 0, 0, 0.78)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          pointerEvents: 'auto',
        }}
      >
        {/* ── Modal ── */}
        <div
          className={`recruitment-modal${isAnimatingOut ? ' animating-out' : ''}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '480px',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '16px',
            overflow: 'hidden',
            overflowY: 'auto',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(151,2,51,0.35)',
            background: '#0a0008',
          }}
        >
          {/* ── Close Button ── */}
          <button
            onClick={close}
            aria-label="Close recruitment popup"
            className="recruitment-close-btn"
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 10,
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1.5px solid rgba(255,255,255,0.25)',
              background: 'rgba(0,0,0,0.65)',
              color: '#fff',
              fontSize: '18px',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s ease, transform 0.2s ease',
              backdropFilter: 'blur(8px)',
            }}
          >
            ×
          </button>

          {/* ── Poster Image ── */}
          <img
            src={recruitmentImg}
            alt="DESOC Recruitment 2026 Poster"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              flexShrink: 0,
            }}
            draggable={false}
          />

          {/* ── Content Section ── */}
          <div
            style={{
              padding: '24px 24px 28px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              background: 'linear-gradient(180deg, #0a0008 0%, #110010 100%)',
              borderTop: '1px solid rgba(151,2,51,0.25)',
            }}
          >
            {/* Badge */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 14px',
                borderRadius: '999px',
                border: '1px solid rgba(255, 77, 136, 0.5)',
                background: 'rgba(151, 2, 51, 0.15)',
                color: '#ff8fad',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              <span
                className="recruitment-badge-pulse"
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#ff4d88',
                  flexShrink: 0,
                }}
              />
              Applications Open
            </span>

            {/* Title */}
            <h2
              style={{
                margin: 0,
                color: '#fff',
                fontSize: 'clamp(17px, 4vw, 21px)',
                fontWeight: 800,
                textAlign: 'center',
                lineHeight: 1.25,
                letterSpacing: '-0.01em',
              }}
            >
              DESOC Recruitment 2026
            </h2>

            {/* Subtitle */}
            <p
              style={{
                margin: 0,
                color: 'rgba(200, 180, 210, 0.8)',
                fontSize: 'clamp(12px, 2.5vw, 13.5px)',
                textAlign: 'center',
                lineHeight: 1.65,
                maxWidth: '380px',
              }}
            >
              Learn, build, lead, and grow with one of the most active student club on campus.
            </p>

            {/* CTA Button */}
            <button
              onClick={handleApplyNow}
              className="recruitment-apply-btn"
              aria-label="Apply Now — navigate to Recruitment page"
              style={{
                marginTop: '6px',
                padding: '13px 40px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 800,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '320px',
              }}
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecruitmentPopup;
