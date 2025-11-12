export default function Background() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 radial">
      {/* Subtle emerald beams */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#005949"/>
            <stop offset="1" stopColor="transparent"/>
          </linearGradient>
        </defs>
        {Array.from({length:9}).map((_,i)=>(
          <rect key={i} x={-10+i*12} y={-10} width="4" height="140" fill="url(#g)">
            <animate attributeName="x" values="-20;110;-20" dur={`${18+i*1.3}s`} repeatCount="indefinite"/>
          </rect>
        ))}
      </svg>
    </div>
  );
}
