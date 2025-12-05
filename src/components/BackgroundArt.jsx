export function BackgroundArt() {
  return (
    <div className="background-art">
      <svg className="bg-svg-1" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251, 191, 36, 0.1)" />
            <stop offset="100%" stopColor="rgba(251, 191, 36, 0.05)" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="80" fill="url(#grad1)" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(251, 191, 36, 0.2)" strokeWidth="2" />
        <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(251, 191, 36, 0.15)" strokeWidth="1" />
      </svg>
      
      <svg className="bg-svg-2" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251, 191, 36, 0.08)" />
            <stop offset="100%" stopColor="rgba(251, 191, 36, 0.03)" />
          </linearGradient>
        </defs>
        <polygon points="150,50 250,200 50,200" fill="url(#grad2)" />
        <polygon points="150,80 220,180 80,180" fill="none" stroke="rgba(251, 191, 36, 0.15)" strokeWidth="2" />
      </svg>
      
      <svg className="bg-svg-3" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251, 191, 36, 0.06)" />
            <stop offset="100%" stopColor="rgba(251, 191, 36, 0.02)" />
          </linearGradient>
        </defs>
        <rect x="50" y="50" width="300" height="300" fill="url(#grad3)" transform="rotate(45 200 200)" />
        <rect x="100" y="100" width="200" height="200" fill="none" stroke="rgba(251, 191, 36, 0.1)" strokeWidth="2" transform="rotate(45 200 200)" />
      </svg>
      
      <div className="grid-pattern"></div>
      <div className="noise-overlay"></div>
    </div>
  );
}


