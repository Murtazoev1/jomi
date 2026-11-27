import { useEffect, useState } from 'react';
import { type Theme } from '../data/theme';

interface SplashScreenProps {
  onDone: () => void;
  theme: Theme;
}

export function SplashScreen({ onDone, theme }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Анимация длится ~3.8с, потом плавно исчезает
    const t1 = setTimeout(() => setFadeOut(true), 3800);
    const t2 = setTimeout(() => onDone(), 4300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: `linear-gradient(135deg, ${theme.splashFrom}, ${theme.splashTo})`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.5s ease',
    }}>
      <style>{`
        @keyframes fly-top    { 0%{transform:translateY(-700px);opacity:0} 100%{transform:translateY(0);opacity:1} }
        @keyframes fly-left   { 0%{transform:translateX(-700px);opacity:0} 100%{transform:translateX(0);opacity:1} }
        @keyframes fly-right  { 0%{transform:translateX(700px);opacity:0}  100%{transform:translateX(0);opacity:1} }
        @keyframes fly-bottom { 0%{transform:translateY(700px);opacity:0}  100%{transform:translateY(0);opacity:1} }
        @keyframes spin       { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes rise       { 0%{transform:translateY(0)} 100%{transform:translateY(-22px)} }
        @keyframes text-in    {
          0%  { opacity:0; transform:translateY(24px) scale(0.88); }
          65% { transform:translateY(-3px) scale(1.02); }
          100%{ opacity:1; transform:translateY(0) scale(1); }
        }
        .sp-b-top    { animation: fly-top    0.7s cubic-bezier(.2,.8,.3,1.2) 0.4s both; }
        .sp-b-left   { animation: fly-left   0.7s cubic-bezier(.2,.8,.3,1.2) 0.5s both; }
        .sp-b-bottom { animation: fly-bottom 0.7s cubic-bezier(.2,.8,.3,1.2) 0.6s both; }
        .sp-b-right  { animation: fly-right  0.7s cubic-bezier(.2,.8,.3,1.2) 0.5s both; }
        .sp-spin {
          transform-box: view-box;
          transform-origin: 540px 489px;
          animation: spin 1.1s cubic-bezier(.4,0,.2,1) 1.4s both;
        }
        .sp-rise { animation: rise 0.55s cubic-bezier(.34,1.3,.64,1) 2.5s both; }
        .sp-text {
          font-family: 'Scripter', sans-serif;
          font-size: 98px;
          line-height: 1;
          color: #111;
          opacity: 0;
          margin-top: 6px;
          user-select: none;
          animation: text-in 0.65s cubic-bezier(.2,.8,.3,1.1) 3.1s both;
        }
      `}</style>

      <svg style={{ width: 260, height: 'auto', overflow: 'visible' }}
           viewBox="207 169 665 640" xmlns="http://www.w3.org/2000/svg">
        <g className="sp-rise">
          <g className="sp-spin">
            <circle className="sp-b-top"    cx="529" cy="341" r="171" fill={theme.c1}/>
            <circle className="sp-b-left"   cx="377" cy="496" r="170" fill={theme.c2}/>
            <circle className="sp-b-bottom" cx="527" cy="637" r="171" fill={theme.c3}/>
            <circle className="sp-b-right"  cx="700" cy="497" r="171" fill={theme.c4}/>
          </g>
        </g>
      </svg>

      <div className="sp-text">JOMI</div>
    </div>
  );
}
