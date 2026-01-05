/**
 * ToughTongue AI Iframe wrapper component
 */

interface TTAIIframeProps {
  src: string;
  className?: string;
}

export function TTAIIframe({ src, className = "" }: TTAIIframeProps) {
  return (
    <iframe
      src={src}
      width="100%"
      height="100%"
      frameBorder="0"
      allow="microphone; camera; display-capture"
      className={`rounded-lg border border-border shadow-lg shadow-teal-500/5 ${className}`}
    />
  );
}
