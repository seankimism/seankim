/** Load the 3D engine only on pages containing a flask comparison. */
export function installFlaskViewers() {
  let observer;
  const disposers = new Set();
  let generation = 0;

  function connect() {
    const current = generation;
    const mounts = document.querySelectorAll('.flask-viewer:not([data-connected])');
    if (!mounts.length) return;
    observer ??= new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        import('./flask-viewer.mjs').then(async ({ createFlaskViewer }) => {
          if (generation !== current || !entry.target.isConnected) return;
          const dispose = await createFlaskViewer(entry.target);
          if (generation !== current) dispose();
          else disposers.add(dispose);
        }).catch(() => {
          if (entry.target.isConnected) entry.target.textContent = 'The 3D viewer could not load. Please reload the page to try again.';
        });
      }
    }, { rootMargin: '200px' });
    for (const mount of mounts) {
      mount.dataset.connected = 'true';
      mount.textContent = 'Loading interactive geometry…';
      observer.observe(mount);
    }
  }

  document.addEventListener('astro:before-swap', () => {
    generation++;
    observer?.disconnect();
    observer = undefined;
    for (const dispose of disposers) dispose();
    disposers.clear();
  });
  document.addEventListener('astro:page-load', connect);
  connect();
}
