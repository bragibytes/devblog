import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export const prerender = false;

const WIDTH = 1200;
const HEIGHT = 630;

export async function GET({ params, url }: { params: { slug: string }; url: URL }) {
  const { slug } = params;

  // Allow passing a custom title via query param (best for blog posts)
  const titleParam = url.searchParams.get('title');
  const title = titleParam
    ? decodeURIComponent(titleParam)
    : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          padding: '80px 120px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                fontSize: 68,
                fontWeight: 700,
                color: '#f1f5f9',
                textAlign: 'center',
                lineHeight: 1.05,
                maxWidth: '980px',
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                marginTop: 48,
                fontSize: 26,
                color: '#67e8f9',
                letterSpacing: '0.08em',
                fontWeight: 600,
              },
              children: 'BRAGIBYTES',
            },
          },
        ],
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
