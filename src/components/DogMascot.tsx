"use client";

export default function DogMascot({ say = "Click me." }: { say?: string }) {
  return (
    <div className="dogWrap" role="img" aria-label="WalkPerro dog">
      <div className="dogBubble">{say}</div>

      <div className="dogCard">
        <svg width="56" height="36" viewBox="0 0 56 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.92" d="M6 22L18 10H34L48 18V28H40L36 22H20L16 28H8L6 22Z" fill="white"/>
          <path opacity="0.85" d="M34 10L40 4L52 10L48 18L34 10Z" fill="white"/>
          <path opacity="0.70" d="M14 28V34H10V28H14Z" fill="white"/>
          <path opacity="0.70" d="M42 28V34H38V28H42Z" fill="white"/>
          <path className="dogTail" d="M6 22L2 18" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}
