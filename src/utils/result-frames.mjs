/** Connect same-origin result frames on direct loads and Astro navigation. */
export function installResultFrames({ document, window, ResizeObserver }) {
  function connectResultFrames() {
    document.querySelectorAll('iframe[data-content-height]').forEach(frame => {
      if (frame.dataset.connected) return;
      frame.dataset.connected = 'true';
      let observer;
      const connect = () => {
        observer?.disconnect();
        if (new URL(frame.src).origin !== window.location.origin) return;
        const doc = frame.contentDocument;
        const main = doc?.querySelector('main');
        if (!doc?.body || !main || !frame.contentWindow) return;
        const resize = () => {
          const bodyStyle = frame.contentWindow.getComputedStyle(doc.body);
          const padding = parseFloat(bodyStyle.paddingTop) + parseFloat(bodyStyle.paddingBottom);
          frame.style.height = `${Math.ceil(main.getBoundingClientRect().height + padding + 2)}px`;
        };
        // Observing inner content avoids feedback from changing the frame height.
        observer = new ResizeObserver(resize);
        observer.observe(main);
        resize();
      };
      frame.addEventListener('load', connect);
      connect();
      document.addEventListener('astro:before-swap', () => {
        observer?.disconnect();
        frame.removeEventListener('load', connect);
        delete frame.dataset.connected;
      }, { once: true });
    });
  }
  document.addEventListener('astro:page-load', connectResultFrames);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', connectResultFrames, { once: true });
  }
  connectResultFrames();
}
