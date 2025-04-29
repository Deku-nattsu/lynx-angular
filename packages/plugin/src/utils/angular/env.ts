import { availableParallelism } from "node:os";

function isPresent(variable: string | undefined): variable is string {
  return typeof variable === "string" && variable !== "";
}
const maxWorkersVariable = process.env["NG_BUILD_MAX_WORKERS"];
export const maxWorkers: number = isPresent(maxWorkersVariable)
  ? +maxWorkersVariable
  : Math.min(4, Math.max(availableParallelism() - 1, 1));

const typeCheckingVariable = process.env["NG_BUILD_TYPE_CHECK"];
export const useTypeChecking: boolean =
  !isPresent(typeCheckingVariable) || !isDisabled(typeCheckingVariable);

function isDisabled(variable: string): boolean {
  return variable === "0" || variable.toLowerCase() === "false";
}
