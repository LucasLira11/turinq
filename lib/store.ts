// Store mínimo: o 3D lê com get() a cada quadro, sem re-render do React.

export type Store<T> = {
  get(): T;
  set(partial: Partial<T>): void;
  subscribe(fn: (state: T) => void): () => void;
};

export function createStore<T extends object>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<(state: T) => void>();
  return {
    get: () => state,
    set(partial) {
      state = { ...state, ...partial };
      listeners.forEach((fn) => fn(state));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
