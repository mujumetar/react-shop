// Hand-built SVG illustrations for the speciality pages (no external images needed)

const Grain = ({ id, color, opacity = 0.35 }) => (
  <pattern id={id} width="7" height="7" patternUnits="userSpaceOnUse">
    <circle cx="1.5" cy="1.5" r="0.9" fill={color} opacity={opacity} />
    <circle cx="5" cy="4.5" r="0.7" fill={color} opacity={opacity * 0.8} />
  </pattern>
);

const Chilli = ({ x, y, r = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M0 0 C 18 -6, 52 2, 74 22 C 56 14, 22 12, 2 10 Z" fill="#B3160F" />
    <path d="M6 3 C 24 0, 48 6, 64 16" stroke="#E8473B" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".7" />
    <path d="M0 0 C -6 2, -10 6, -16 4 M0 0 C -2 4, -2 8, 2 10" stroke="#3F6B2A" strokeWidth="4" fill="none" strokeLinecap="round" />
  </g>
);

export const MasalaArt = () => {
  const bowls = [
    { cx: 138, cy: 142, c1: '#E2422F', c2: '#A3170E', id: 'g1' },  // chilli
    { cx: 262, cy: 142, c1: '#F6C33A', c2: '#D48A0C', id: 'g2' },  // haldi
    { cx: 138, cy: 262, c1: '#C9A06A', c2: '#93683A', id: 'g3' },  // dhana
    { cx: 262, cy: 262, c1: '#9A4B26', c2: '#5C2610', id: 'g4' },  // garam masala
  ];
  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="wood" cx="50%" cy="45%" r="75%">
          <stop offset="0" stopColor="#5A3420" /><stop offset="1" stopColor="#24120C" />
        </radialGradient>
        <radialGradient id="brass" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#F2D27A" /><stop offset=".55" stopColor="#C9962F" /><stop offset="1" stopColor="#8A5E15" />
        </radialGradient>
        <radialGradient id="brassIn" cx="45%" cy="40%" r="70%">
          <stop offset="0" stopColor="#D9AE4E" /><stop offset="1" stopColor="#9A6A18" />
        </radialGradient>
        {bowls.map(b => (
          <radialGradient key={b.id} id={b.id} cx="40%" cy="35%" r="70%">
            <stop offset="0" stopColor={b.c1} /><stop offset="1" stopColor={b.c2} />
          </radialGradient>
        ))}
        <Grain id="grainDark" color="#000" opacity={0.28} />
        <Grain id="grainLight" color="#fff" opacity={0.25} />
      </defs>
      <rect width="400" height="400" fill="url(#wood)" />
      <g opacity=".12" stroke="#000" strokeWidth="2">
        {[40, 95, 150, 205, 260, 315, 370].map(y => <path key={y} d={`M0 ${y} Q 200 ${y + 14} 400 ${y - 6}`} fill="none" />)}
      </g>
      {/* thali */}
      <circle cx="200" cy="202" r="178" fill="#000" opacity=".25" />
      <circle cx="200" cy="200" r="176" fill="url(#brass)" />
      <circle cx="200" cy="200" r="160" fill="url(#brassIn)" />
      <circle cx="200" cy="200" r="160" fill="none" stroke="#F6E2A0" strokeOpacity=".5" strokeWidth="1.5" strokeDasharray="2 6" />
      {/* bowls */}
      {bowls.map(b => (
        <g key={b.id}>
          <circle cx={b.cx + 3} cy={b.cy + 5} r="60" fill="#000" opacity=".25" />
          <circle cx={b.cx} cy={b.cy} r="60" fill="url(#brass)" />
          <circle cx={b.cx} cy={b.cy} r="50" fill={`url(#${b.id})`} />
          <circle cx={b.cx} cy={b.cy} r="50" fill="url(#grainDark)" />
          <ellipse cx={b.cx - 12} cy={b.cy - 14} rx="22" ry="14" fill="#fff" opacity=".14" />
          <circle cx={b.cx} cy={b.cy} r="50" fill="url(#grainLight)" opacity=".5" />
        </g>
      ))}
      {/* centre cumin */}
      <circle cx="200" cy="202" r="24" fill="url(#brass)" />
      <circle cx="200" cy="202" r="18" fill="#6E5428" />
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i * 137.5) * Math.PI / 180, d = 3 + (i % 6) * 2.2;
        return <ellipse key={i} cx={200 + Math.cos(a) * d} cy={202 + Math.sin(a) * d} rx="3.4" ry="1.3" fill="#A8874D" transform={`rotate(${i * 40} ${200 + Math.cos(a) * d} ${202 + Math.sin(a) * d})`} />;
      })}
      {/* chillies */}
      <Chilli x={300} y={330} r={-30} s={0.9} />
      <Chilli x={36} y={70} r={20} s={0.8} />
      <Chilli x={318} y={40} r={110} s={0.7} />
      <Chilli x={40} y={348} r={-60} s={0.75} />
    </svg>
  );
};

const Peanut = ({ x, y, r = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M-26 0 C -26 -14, -8 -16, 0 -8 C 8 -16, 26 -14, 26 0 C 26 14, 8 16, 0 8 C -8 16, -26 14, -26 0 Z" fill="#D8AE70" stroke="#9C7238" strokeWidth="1.5" />
    <g stroke="#B68B4E" strokeWidth="1" opacity=".8">
      <path d="M-20 -6 L-14 6 M-12 -9 L-6 9 M8 -9 L14 9 M16 -6 L20 6" />
    </g>
  </g>
);

export const OilArt = () => (
  <svg viewBox="0 0 400 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient id="oilBg" cx="50%" cy="40%" r="75%">
        <stop offset="0" stopColor="#E9B54C" /><stop offset=".6" stopColor="#A86F0E" /><stop offset="1" stopColor="#5A3506" />
      </radialGradient>
      <linearGradient id="oil" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#B87808" /><stop offset=".35" stopColor="#F7C948" /><stop offset=".6" stopColor="#E9A91C" /><stop offset="1" stopColor="#9C6205" />
      </linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity=".05" /><stop offset=".25" stopColor="#fff" stopOpacity=".45" /><stop offset=".4" stopColor="#fff" stopOpacity=".05" /><stop offset="1" stopColor="#fff" stopOpacity=".12" />
      </linearGradient>
      <clipPath id="bottleClip">
        <path d="M172 92 h56 v34 c0 14 38 26 38 70 v128 c0 18 -14 28 -32 28 h-68 c-18 0 -32 -10 -32 -28 v-128 c0 -44 38 -56 38 -70 z" />
      </clipPath>
    </defs>
    <rect width="400" height="400" fill="url(#oilBg)" />
    <circle cx="200" cy="215" r="150" fill="#FFF3D0" opacity=".12" />
    {/* bottle */}
    <ellipse cx="200" cy="360" rx="100" ry="12" fill="#000" opacity=".25" />
    <g clipPath="url(#bottleClip)">
      <rect x="120" y="90" width="160" height="280" fill="#FFF6DD" opacity=".35" />
      <rect x="120" y="175" width="160" height="200" fill="url(#oil)" />
      <path d="M120 178 Q 160 170 200 178 T 280 176 V 186 H120 Z" fill="#FBE08A" opacity=".8" />
      <rect x="120" y="90" width="160" height="280" fill="url(#glass)" />
    </g>
    <path d="M172 92 h56 v34 c0 14 38 26 38 70 v128 c0 18 -14 28 -32 28 h-68 c-18 0 -32 -10 -32 -28 v-128 c0 -44 38 -56 38 -70 z" fill="none" stroke="#FFF6DD" strokeOpacity=".8" strokeWidth="2.5" />
    {/* cap */}
    <rect x="166" y="62" width="68" height="34" rx="6" fill="#8A1C1C" />
    <rect x="166" y="62" width="68" height="8" rx="4" fill="#B53A2E" />
    {/* label */}
    <rect x="146" y="226" width="108" height="76" rx="8" fill="#FFF7EA" />
    <rect x="152" y="232" width="96" height="64" rx="5" fill="none" stroke="#C98A1B" strokeWidth="1.2" />
    <text x="200" y="262" textAnchor="middle" fontFamily="'Noto Serif Gujarati', serif" fontWeight="700" fontSize="20" fill="#8A1C1C">સીંગતેલ</text>
    <text x="200" y="284" textAnchor="middle" fontFamily="Mukta, sans-serif" fontWeight="700" fontSize="10" letterSpacing="2" fill="#A86F0E">PURE · DILKHUSH</text>
    {/* drop */}
    <path d="M300 104 C 300 104, 280 130, 280 144 a20 20 0 0 0 40 0 C 320 130, 300 104, 300 104 Z" fill="#F7C948" stroke="#FFF6DD" strokeWidth="2" />
    <ellipse cx="293" cy="140" rx="5" ry="8" fill="#fff" opacity=".6" />
    {/* peanuts */}
    <Peanut x={84} y={336} r={-20} />
    <Peanut x={120} y={364} r={15} s={0.9} />
    <Peanut x={312} y={344} r={30} />
    <Peanut x={340} y={300} r={-50} s={0.85} />
    <Peanut x={62} y={292} r={60} s={0.8} />
  </svg>
);

const WheatStalk = ({ x, y, r = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M0 0 V -150" stroke="#E2C27A" strokeWidth="3" />
    {Array.from({ length: 7 }).map((_, i) => (
      <g key={i}>
        <ellipse cx="-8" cy={-80 - i * 10} rx="5" ry="11" fill="#E9C46A" stroke="#B88A2E" strokeWidth="1" transform={`rotate(-28 -8 ${-80 - i * 10})`} />
        <ellipse cx="8" cy={-84 - i * 10} rx="5" ry="11" fill="#E9C46A" stroke="#B88A2E" strokeWidth="1" transform={`rotate(28 8 ${-84 - i * 10})`} />
      </g>
    ))}
    <ellipse cx="0" cy="-156" rx="4.5" ry="10" fill="#E9C46A" stroke="#B88A2E" strokeWidth="1" />
  </g>
);

export const FeedArt = () => (
  <svg viewBox="0 0 400 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient id="feedBg" cx="50%" cy="40%" r="75%">
        <stop offset="0" stopColor="#4F7F48" /><stop offset=".6" stopColor="#2E5E3A" /><stop offset="1" stopColor="#15301C" />
      </radialGradient>
      <linearGradient id="sack" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#A9834B" /><stop offset=".4" stopColor="#D9B97E" /><stop offset="1" stopColor="#9A7440" />
      </linearGradient>
      <pattern id="burlap" width="6" height="6" patternUnits="userSpaceOnUse">
        <path d="M0 3 H6 M3 0 V6" stroke="#7A5A2C" strokeWidth=".8" opacity=".35" />
      </pattern>
    </defs>
    <rect width="400" height="400" fill="url(#feedBg)" />
    <circle cx="200" cy="210" r="150" fill="#E5EEE0" opacity=".08" />
    <WheatStalk x={110} y={320} r={-18} />
    <WheatStalk x={290} y={320} r={18} />
    <WheatStalk x={92} y={330} r={-34} s={0.85} />
    <WheatStalk x={308} y={330} r={34} s={0.85} />
    {/* sack */}
    <ellipse cx="200" cy="346" rx="110" ry="14" fill="#000" opacity=".3" />
    <path d="M150 112 C 140 140, 116 170, 112 230 C 108 300, 126 344, 200 346 C 274 344, 292 300, 288 230 C 284 170, 260 140, 250 112 Z" fill="url(#sack)" />
    <path d="M150 112 C 140 140, 116 170, 112 230 C 108 300, 126 344, 200 346 C 274 344, 292 300, 288 230 C 284 170, 260 140, 250 112 Z" fill="url(#burlap)" />
    {/* tied top */}
    <path d="M150 112 C 170 98, 230 98, 250 112 C 236 120, 164 120, 150 112 Z" fill="#8F6A36" />
    <path d="M176 84 C 186 100, 214 100, 224 84 L 214 112 H 186 Z" fill="#C9A66B" />
    <rect x="178" y="106" width="44" height="9" rx="4" fill="#8A1C1C" />
    {/* label */}
    <rect x="146" y="196" width="108" height="92" rx="10" fill="#FFF7EA" />
    <rect x="152" y="202" width="96" height="80" rx="7" fill="none" stroke="#2E5E3A" strokeWidth="1.3" />
    <text x="200" y="236" textAnchor="middle" fontFamily="'Noto Serif Gujarati', serif" fontWeight="700" fontSize="19" fill="#2E5E3A">પશુ આહાર</text>
    <text x="200" y="258" textAnchor="middle" fontFamily="Mukta, sans-serif" fontWeight="700" fontSize="10" letterSpacing="2" fill="#8A1C1C">CATTLE FEED</text>
    <path d="M182 268 h36" stroke="#C98A1B" strokeWidth="1.5" />
    {/* pellets */}
    {Array.from({ length: 34 }).map((_, i) => {
      const side = i % 2 ? 1 : -1, k = Math.floor(i / 2);
      const x = 200 + side * (122 + (k % 5) * 12) + (k % 3) * 4 * side;
      const y = 352 - Math.floor(k / 5) * 9 - (k % 2) * 4;
      return <rect key={i} x={x} y={y} width="12" height="6" rx="3" fill={k % 3 ? '#8B5E34' : '#A87445'} transform={`rotate(${(i * 37) % 70 - 35} ${x + 6} ${y + 3})`} />;
    })}
  </svg>
);
