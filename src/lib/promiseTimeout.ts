export function withTimeout<T>(
  promise: PromiseLike<T>,
  ms = 10000,
  label = "operação",
): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;

  return new Promise<T>((resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Tempo esgotado ao carregar ${label}.`));
    }, ms);

    Promise.resolve(promise)
      .then(resolve, reject)
      .finally(() => clearTimeout(timer));
  });
}