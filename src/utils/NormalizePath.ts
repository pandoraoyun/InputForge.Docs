import { normalize } from "path/posix"

export function NormalizePathPosix(p: string) {
  return normalize('/' + p).replace(/\/+$/, '');
}