import assert from 'node:assert/strict';
import test from 'node:test';
import rehypeBasePath from './rehype-base-path.mjs';

test('raw HTML image URLs resolve identically before and after client navigation', () => {
  const image = { type: 'raw', value: '<img src="/xdr2000/xdr2000_mesh_3d.png" fetchpriority="high">' };
  rehypeBasePath({ base: '/seankim/' })({ type: 'root', children: [image] });
  const source = image.value.match(/src="([^"]+)"/)[1];
  for (const page of ['/seankim/', '/seankim/projects/', '/seankim/projects/bioreactor-temperature-control/']) {
    assert.equal(new URL(source, `https://example.com${page}`).pathname, '/seankim/xdr2000/xdr2000_mesh_3d.png');
  }
});

test('full-size links, iframe sources, and query strings keep the deployment base', () => {
  const html = { type: 'raw', value: '<a href="/xdr2000/diagram.png?v=123"><img src=\'/xdr2000/diagram.png?v=123\'></a><iframe src="/xdr2000/index.html"></iframe>' };
  const tree = { type: 'root', children: [html] };
  const transform = rehypeBasePath({ base: '/seankim' });
  transform(tree);
  const once = html.value;
  transform(tree);
  assert.equal(html.value, once);
  assert.equal(html.value, '<a href="/seankim/xdr2000/diagram.png?v=123"><img src=\'/seankim/xdr2000/diagram.png?v=123\'></a><iframe src="/seankim/xdr2000/index.html"></iframe>');
});

test('parsed Markdown elements receive the base while external and fragment URLs stay unchanged', () => {
  const children = ['/image.png', '//cdn.example.com/image.png', 'https://example.com/image.png', '#section', '../other/'].map(src => ({ type: 'element', properties: { src } }));
  rehypeBasePath({ base: '/seankim' })({ type: 'root', children });
  assert.deepEqual(children.map(node => node.properties.src), ['/seankim/image.png', '//cdn.example.com/image.png', 'https://example.com/image.png', '#section', '../other/']);
});

test('local root deployment keeps public asset paths unchanged', () => {
  const tree = { type: 'root', children: [{ type: 'raw', value: '<img src="/xdr2000/image.png">' }] };
  const before = structuredClone(tree);
  rehypeBasePath({ base: '/' })(tree);
  assert.deepEqual(tree, before);
});
