import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [phase, setPhase] = useState<'fly-in' | 'spin' | 'text' | 'done'>('fly-in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('spin'), 700);
    const t2 = setTimeout(() => setPhase('text'), 1500);
    const t3 = setTimeout(() => setPhase('done'), 2600);
    const t4 = setTimeout(() => onDone(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  const isFlyIn = phase === 'fly-in';
  const isSpin = phase === 'spin';
  const showText = phase === 'text' || phase === 'done';
  const isDone = phase === 'done';

  const circles = [
    { color: '#6B84E8', fromX: '-120px', fromY: '-120px', label: 'tl' },
    { color: '#56CCF2', fromX: '120px',  fromY: '-120px', label: 'tr' },
    { color: '#1E4FD8', fromX: '-120px', fromY: '120px',  label: 'bl' },
    { color: '#1A1A7E', fromX: '120px',  fromY: '120px',  label: 'br' },
  ];

  const offsets: Record<string, { x: string; y: string }> = {
    tl: { x: '-38px', y: '-38px' },
    tr: { x: '38px',  y: '-38px' },
    bl: { x: '-38px', y: '38px'  },
    br: { x: '38px',  y: '38px'  },
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'linear-gradient(135deg, #0f0c29 0%, #1A1A7E 40%, #1E4FD8 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        opacity: isDone ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* 4 circles */}
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        {circles.map((c) => {
          const off = offsets[c.label];
          const translateX = isFlyIn ? c.fromX : off.x;
          const translateY = isFlyIn ? c.fromY : off.y;
          return (
            <div
              key={c.label}
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: '58px', height: '58px',
                borderRadius: '50%',
                background: c.color,
                opacity: 0.92,
                transform: `translate(calc(-50% + ${translateX}), calc(-50% + ${translateY})) rotate(${isSpin ? '360deg' : '0deg'})`,
                transition: isFlyIn
                  ? 'transform 0.65s cubic-bezier(0.34,1.56,0.64,1)'
                  : isSpin
                  ? 'transform 0.75s cubic-bezier(0.4,0,0.2,1)'
                  : 'transform 0.3s ease',
              }}
            />
          );
        })}
      </div>

      {/* JOMI text */}
      <div
        style={{
          marginTop: '24px',
          fontFamily: 'Scripter, cursive',
          fontSize: '56px',
          color: 'white',
          letterSpacing: '4px',
          opacity: showText ? 1 : 0,
          transform: showText ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        JOMI
      </div>
      <div
        style={{
          fontSize: '11px',
          letterSpacing: '3px',
          color: '#56CCF2',
          textTransform: 'uppercase',
          marginTop: '6px',
          opacity: showText ? 1 : 0,
          transition: 'opacity 0.5s ease 0.2s',
        }}
      >
        Journal of My Intelligence
      </div>
    </div>
  );
}
