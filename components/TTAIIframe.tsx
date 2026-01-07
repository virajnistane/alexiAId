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
      height="700px"
      frameBorder="0"
      allow="microphone; camera; display-capture"
      className={className}
    ></iframe>
  );
}
