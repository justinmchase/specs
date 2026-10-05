import { audit } from "./audit.ts";
import { type Finding, Severity } from "./finding.ts";

export interface CliOutput {
  code: number;
  lines: string[];
}

const USAGE = "usage: audit [root] [--strict] [--format text|github]";

/** Runs the audit command (see `audit-006`) and returns what to print. */
export async function runCli(args: string[]): Promise<CliOutput> {
  let root = ".";
  let strict = false;
  let format = "text";
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--strict") strict = true;
    else if (arg === "--format" && ["text", "github"].includes(args[i + 1])) {
      format = args[++i];
    } else if (arg.startsWith("-")) {
      return { code: 2, lines: [`unknown flag "${arg}"`, USAGE] };
    } else root = arg;
  }

  const { findings } = await audit(root);
  const errors = findings.filter((f) => f.severity === Severity.Error).length;
  const warnings = findings.length - errors;
  const lines = findings.map(format === "github" ? github : text);
  lines.push(
    `${errors} ${errors === 1 ? "error" : "errors"}, ${warnings} ${
      warnings === 1 ? "warning" : "warnings"
    }`,
  );
  const failed = errors > 0 || (strict && warnings > 0);
  return { code: failed ? 1 : 0, lines };
}

function text({ severity, file, message }: Finding): string {
  return `${severity} ${file}: ${message}`;
}

function github({ severity, file, message }: Finding): string {
  const escaped = message.replaceAll("%", "%25").replaceAll("\r", "%0D")
    .replaceAll("\n", "%0A");
  return `::${severity} file=${file}::${escaped}`;
}

if (import.meta.main) {
  const { code, lines } = await runCli(Deno.args);
  for (const line of lines) console.log(line);
  Deno.exit(code);
}
