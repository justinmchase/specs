/**
 * Audits a repository against the specs method
 * (https://github.com/justinmchase/specs).
 *
 * @module
 */

export { audit, type AuditResult } from "./audit.ts";
export { type CliOutput, runCli } from "./cli.ts";
export { error, type Finding, Severity, warning } from "./finding.ts";
export {
  DEFAULT_TESTS,
  type Marker,
  MARKER_PATH,
  type MarkerResult,
  parseMarker,
  SUPPORTED_MAJOR,
} from "./marker.ts";
export { headingSlugs, slug } from "./slug.ts";
