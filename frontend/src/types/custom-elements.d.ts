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
  }
}

export {};
