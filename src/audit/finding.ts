export enum Severity {
  Error = "error",
  Warning = "warning",
}

/** One problem the audit found, about one file. */
export interface Finding {
  severity: Severity;
  /** Relative to the repository root. */
  file: string;
  message: string;
}

export function error(file: string, message: string): Finding {
  return { severity: Severity.Error, file, message };
}

export function warning(file: string, message: string): Finding {
  return { severity: Severity.Warning, file, message };
}
