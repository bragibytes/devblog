import { writeFile, mkdir, readdir, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const WIDTH = 1200;
const HEIGHT = 630;

async function generateOgImage(title) {
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
                fontSize: 68,
                fontWeight: 700,
                background: 'linear-gradient(90deg, #c9a96e 0%, #f1f5f9 50%, #67e8f9 100%)',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.03em',
                textAlign: 'center',
                maxWidth: '1000px',
                lineHeight: 1.1,
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                marginTop: 32,
                fontSize: 24,
                color: '#94a3b8',
                letterSpacing: '0.05em',
              },
              children: 'BRAGIBYTES',
            },
          },
        ],
      },
    },
    { width: WIDTH, height: HEIGHT }
  );

  const resvg = new Resvg(svg);
  return resvg.render().asPng();
}

async function main() {
  const ogDir = path.join(projectRoot, 'dist', 'og');
  await mkdir(ogDir, { recursive: true });

  // Default image
  const defaultPng = await generateOgImage('Bragibytes');
  await writeFile(path.join(ogDir, 'default.png'), defaultPng);
  console.log('✓ Generated default.png');

  // Blog post images - scan content files directly (avoids astro:content timing issues)
  try {
    const blogDir = path.join(projectRoot, 'src/content/blog');
    const files = await readdir(blogDir);
    const mdxFiles = files.filter(f => f.endsWith('.mdx'));

    let count = 0;
    for (const file of mdxFiles) {
      const content = await readFile(path.join(blogDir, file), 'utf8');
      const titleMatch = content.match(/title:\s*['"](.+?)['"]/);
      if (titleMatch) {
        const title = titleMatch[1];
        const slug = file.replace('.mdx', '');
        const png = await generateOgImage(title);
        await writeFile(path.join(ogDir, `${slug}.png`), png);
        console.log(`✓ Generated ${slug}.png`);
        count++;
      }
    }
    console.log(`\nGenerated OG images for ${count} blog posts.`);
  } catch (err) {
    console.warn('Could not generate blog post OG images:', err.message);
  }
}

main().catch(console.error);
