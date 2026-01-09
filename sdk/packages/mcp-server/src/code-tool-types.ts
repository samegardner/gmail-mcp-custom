// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export type WorkerInput = {
  project_name: string;
  code: string;
  client_opts: Record<string, unknown>;
};
export type WorkerOutput = {
  is_error: boolean;
  result: unknown | null;
  log_lines: string[];
  err_lines: string[];
};
