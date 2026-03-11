  import { createContext, useContext } from 'react';

  /**
   * Context to provide the Shadow DOM container to Radix UI portals.
   * When running inside Shadow DOM (embed mode), portals must render
   * inside the shadow root instead of document.body.
   */
  const ShadowRootContext = createContext<HTMLElement | undefined>(undefined);

  export const ShadowRootProvider = ShadowRootContext.Provider;

  export function useShadowRoot(): HTMLElement | undefined {
    return useContext(ShadowRootContext);
  }
