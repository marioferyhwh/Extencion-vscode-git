//Path.ts
let path = "";

export function GetPathCommands(): string {
  return path;
}

export function SetPathCommands(newPatch: string): void {
  path = newPatch;
}
