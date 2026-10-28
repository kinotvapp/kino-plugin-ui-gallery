#!/usr/bin/env node
// Signs the built plugin.js with the author's Ed25519 key (the signature goes into kino-plugin.json). Sign again after every
// build and every version change: the signature covers plugin.js, the id, the version and the repository address.
//
//   npm run sign                      uses ~/.config/kino/kino-author-key.pem
//   KINO_AUTHOR_KEY=/path/key.pem npm run sign
//
// The key is the maintainer's and is never committed; people who only read or build this repository do not need it.
import { spawnSync } from "node:child_process";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const key = process.env.KINO_AUTHOR_KEY || join(homedir(), ".config", "kino", "kino-author-key.pem");
const r = spawnSync(process.execPath, [join(root, "sdk", "seal.mjs"), "--sign", "--repo", "kinotvapp/kino-plugin-ui-gallery", "--manifest", join(root, "kino-plugin.json"), "--key", key], { stdio: "inherit" });
process.exit(r.status ?? 1);
