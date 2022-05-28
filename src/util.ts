export function isDev(): boolean {
  return process.env.DEV === "true";
}

export function isJestTest() {
  return (
    process.env.NODE_ENV === "test" || process.env.JEST_WORKER_ID !== undefined
  );
}

export function logError(message: string, data?: unknown): void {
  logWithData(message, data, console.error);
}

export function logDebug(message: string, data?: unknown): void {
  logWithData(message, data, console.debug);
}

function logWithData(
  value: unknown,
  data?: unknown,
  logCallback = console.log
) {
  if (data != null) {
    logCallback(value, data);
  } else {
    logCallback(value);
  }
}
