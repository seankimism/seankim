# Bioreactor explorer results

The explorer serves 1,601 separately calculated scenarios, one for each whole-liter volume from 400 through 2,000 L. It loads one compressed result on demand. Rotation, the temperature plot, playback, and the time slider use saved display data.

`public/xdr2000/results/<version>/` contains gzip-compressed JSON files and a manifest with each file's size and SHA-256 checksum. `result-loader.js` decodes and validates a selected result before the viewer replaces its current scenario. Failed downloads preserve the current result and allow another attempt. The initial 1,000 L view remains embedded in the page.

Each result contains only display geometry, ring boundaries, temperature histories, target crossing, and displayed conditions. Temperatures are saved to four decimals, as in the original embedded explorer. The retained time points are every 10 seconds for the first 10 minutes, then every 60 seconds, plus the samples bracketing the target crossing. The target crossing is retained from the full simulation output. Volumes are never interpolated.

## Updating results

Keep the computational source, internal parameters, and offline generator outside this repository and its public deployment. Run the private generator for the complete catalog when model inputs change, then copy only the display results into a new version directory. Update the viewer's `results_root` and embedded default, and update the fixture path in `scripts/result-loader.test.mjs`. Remove obsolete result directories from the deployment after verifying the new catalog.

Run `node --test scripts/result-loader.test.mjs` and `npm run build`. The build checks every saved volume, checksum, result shape, and target crossing; checks for known computational source or parameter markers; and verifies the site's size. Gzip is storage compression, not source protection: model privacy depends on keeping the solver and internal configuration out of public files.

The loader uses the browser's native `DecompressionStream` API. It also accepts JSON that the host has already decompressed. Relative URLs preserve both root hosting and GitHub Pages repository paths.

Replacing the deployed viewer does not remove computational source already present in public Git history or copies previously downloaded from the site. Repository visibility/history must be handled separately.
