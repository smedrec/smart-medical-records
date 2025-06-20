// packages/fhir/src/debug-shim.ts
// A very basic shim for the 'debug' library to provide .extend() and mimic basic functionality.

interface Debugger {
  (...args: any[]): void; // The logger function itself
  extend: (subNamespace: string) => Debugger;
  log?: (...args: any[]) => void; // Optional: if fhirclient uses .log directly
  namespace?: string; // Optional: if fhirclient inspects this
  enabled?: boolean; // Optional
}

// Helper to create a logger function
const createLogger = (namespace: string): Debugger => {
  // The actual logger function
  const logger = (...args: any[]): void => {
    // You can enable actual logging here if needed for debugging the shim:
    // const formattedArgs = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ');
    // console.log(`[${namespace}] ${formattedArgs}`);
  };

  // Implement the .extend() method
  logger.extend = (subNamespace: string): Debugger => {
    return createLogger(`${namespace}:${subNamespace}`);
  };

  // Add other properties that might be expected by consumers like fhirclient
  logger.log = console.log.bind(console); // Or a no-op
  logger.namespace = namespace;
  logger.enabled = false; // By default, shims are often silent unless DEBUG env var is parsed

  return logger as Debugger;
};

// The default export of the 'debug' module is a function that creates a debugger instance.
const debugCreator = (namespace: string): Debugger => {
  return createLogger(namespace);
};

// Mimic other exports if 'debug' has them and fhirclient might use them.
// For example, 'debug' might export its 'default' explicitly for CJS/ESM interop.
// export const debug = debugCreator; // if named export 'debug' is also used
// export { debugCreator as default }; // if you need to ensure it's treated as ES module default

export default debugCreator;
