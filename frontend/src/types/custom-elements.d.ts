// Declare custom HTML elements for Transitive Robotics web components
declare namespace JSX {
  interface IntrinsicElements {
    'maps-fleet': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      id?: string;
      host?: string;
      ssl?: string;
      jwt?: string;
      posesource?: string;
    }, HTMLElement>;
    
    'webrtc-video-device': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      id?: string;
      host?: string;
      ssl?: string;
      jwt?: string;
      stream?: string | number;
      autoplay?: string;
      count?: string;
      framerate?: string;
      height?: string;
      width?: string;
      quantizer?: string;
      source?: string;
      streamtype?: string;
      timeout?: string;
      type?: string;
    }, HTMLElement>;
  }
}

export {};
