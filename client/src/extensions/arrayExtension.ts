export {};

declare global {
  interface Array<T> {
    get(index: number): T | null;
    first(): T | null;
  }
}

// eslint-disable-next-line no-extend-native
Array.prototype.get = function<T>(index: number) {
  if (this.length <= index) { return null; }

  return this[index] as T;
};

// eslint-disable-next-line no-extend-native
Array.prototype.first = function() {
  return this.get(0);
};
