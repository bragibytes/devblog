import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export const prerender = false;

const WIDTH = 1200;
const HEIGHT = 630;

export async function GET() {
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
          padding: '40px 60px',
          fontFamily: 'system-ui, sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                fontSize: 78,
                fontWeight: 700,
                background: 'linear-gradient(90deg, #c9a96e 0%, #f1f5f9 50%, #67e8f9 100%)',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.03em',
              },
              children: 'Bragibytes',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                marginTop: 12,
                fontSize: 26,
                color: '#94a3b8',
                letterSpacing: '0.02em',
              },
              children: 'Building software by directing AI',
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
