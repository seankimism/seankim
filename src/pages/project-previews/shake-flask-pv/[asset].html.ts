import type { APIRoute, GetStaticPaths } from 'astro';
import { previewPaths, servePreview } from '../../../utils/shake-flask-pv-preview.mjs';

export const getStaticPaths: GetStaticPaths = () => previewPaths(import.meta.env.DEV);

export const GET: APIRoute = ({ params }) => servePreview({
  development: import.meta.env.DEV,
  asset: params.asset,
  base: import.meta.env.BASE_URL,
});
