export function useTrackEvent() {
  return {
    trackEvent: (name: string, props?: any) => {
      console.log(`[Event] ${name}`, props);
    }
  };
}
