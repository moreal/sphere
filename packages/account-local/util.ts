import { homedir } from "os";
import { readdirSync, existsSync } from "fs";
import path from "path";

export const UTC_FILE_PATTERN =
  /^UTC--\d{4}-\d\d-\d\dT\d\d-\d\d-\d\dZ--([\da-f]{8}-?(?:[\da-f]{4}-?){3}[\da-f]{12})$/i;

const WIN_KEYSTORE_PATH = path.join(
  homedir(),
  "AppData",
  "Roaming",
  "planetarium",
  "keystore"
);

const MAC_KEYSTORE_PATH = path.join(
  homedir(),
  "Library",
  "Application Support",
  "planetarium",
  "keystore"
);

const LINUX_KEYSTORE_PATH = path.join(
  homedir(),
  ".config",
  "planetarium",
  "keystore"
);

const KEYSTORE_PATH: {
  [k in NodeJS.Platform]: string | undefined;
} = {
  aix: undefined,
  android: undefined,
  darwin: MAC_KEYSTORE_PATH,
  freebsd: LINUX_KEYSTORE_PATH,
  linux: LINUX_KEYSTORE_PATH,
  openbsd: LINUX_KEYSTORE_PATH,
  sunos: undefined,
  win32: WIN_KEYSTORE_PATH,
  cygwin: WIN_KEYSTORE_PATH,
  netbsd: LINUX_KEYSTORE_PATH,
  haiku: undefined,
};

export function getDefaultKeystorePath(platform: string) {
  return KEYSTORE_PATH[platform];
}

export function sanitizeKeypath(folder: string | undefined = getDefaultKeystorePath(process.platform)){
  if (typeof folder !== "string") throw new Error("Invalid path value");
  if (!existsSync(folder)) throw new Error("This path does not exist");
  return folder;
}

export function listKeystoreFiles(folder?: string): string[] {
  const list = (readdirSync(sanitizeKeypath(folder)))
    .map((f) => f.match(UTC_FILE_PATTERN)?.[0])
    .filter((v): v is string => !!v);
  if (list.length <= 0) {
    throw new Error("No keys found in folder");
  }
  return list;
}
