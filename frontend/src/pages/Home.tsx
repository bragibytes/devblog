import '../App.css'

export default function Home() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero-content">
          <div className="hero-label">Freelance Software Engineer · Building in public</div>
          <h1>I build production software<br />that ships.</h1>
          <p className="hero-sub">
            I help founders and teams turn ambitious ideas into reliable web apps,
            SaaS platforms, games, and AI-powered tools.
          </p>
          <div className="hero-ctas">
            <button className="btn-primary" onClick={() => scrollTo('work')}>See my work</button>
            <button className="btn-secondary" onClick={() => scrollTo('contact')}>Let's talk</button>
          </div>
          <div className="hero-tags">
            <span>Web Apps</span>
            <span>SaaS</span>
            <span>Games</span>
            <span>AI</span>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* SERVICES */}
      <section id="services" className="section">
        <div className="section-header">
          <h2>What I build</h2>
          <p>End-to-end development across the full product lifecycle.</p>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🌐</div>
            <h3>Web Development</h3>
            <p>Fast, accessible, production-ready websites and web applications. From marketing sites to complex dashboards and internal tools.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🚀</div>
            <h3>SaaS &amp; Platforms</h3>
            <p>Full-stack product development including authentication, billing, multi-tenancy, and the infrastructure to scale reliably.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🎮</div>
            <h3>Game Development</h3>
            <p>Engaging games and interactive experiences using Unity, web technologies, or custom engines. Prototypes to polished releases.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🤖</div>
            <h3>AI Integration</h3>
            <p>Practical AI features that deliver real value — RAG systems, intelligent automation, content generation, and custom model workflows.</p>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* WORK */}
      <section id="work" className="section">
        <div className="section-header">
          <h2>Selected work</h2>
          <p>Recent projects and tools I've built.</p>
        </div>

        <div className="project-card">
          <div className="project-header">
            <div>
              <h3>Celio's Forge</h3>
              <span className="project-tag">Virtual Tabletop</span>
            </div>
            <a 
              href="https://celiosforge.fly.dev" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary"
            >
              Visit Site →
            </a>
          </div>
          
          <p className="project-desc">
            A virtual tabletop built for running Dungeons &amp; Dragons 5th Edition campaigns.
            Features interactive maps, token management, real-time collaboration, and tools designed
            for both players and game masters.
          </p>

          <div className="project-tech">
            <span>React</span>
            <span>TypeScript</span>
            <span>WebSockets</span>
            <span>Node.js</span>
            <span>Fly.io</span>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ABOUT */}
      <section id="about" className="section about">
        <div className="about-content">
          <div>
            <h2>Hi, I'm Sam.</h2>
            <p>
              I'm a freelance software engineer with a decade of experience shipping
              reliable software for startups, agencies, and independent founders.
            </p>
            <p>
              I care deeply about clean architecture, performance, and building things
              that stay maintainable long after launch. My goal is always the same:
              deliver work I'm proud of and that genuinely helps your business.
            </p>
          </div>
          <div className="about-details">
            <div>
              <div className="detail-label">Based in</div>
              <div>United States (remote)</div>
            </div>
            <div>
              <div className="detail-label">Current focus</div>
              <div>Modern web + AI tooling</div>
            </div>
            <div>
              <div className="detail-label">Availability</div>
              <div className="available">Currently open to select projects</div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* CONTACT */}
      <section id="contact" className="section contact">
        <div className="contact-inner">
          <h2>Let's build something together.</h2>
          <p className="contact-sub">
            Have a project in mind or just want to explore ideas? I'd love to hear from you.
          </p>

          <a href="mailto:rustycoder42@gmail.com" className="btn-primary contact-btn">
            Email me at rustycoder42@gmail.com
          </a>

          <div className="contact-alt">
            Or find me on{' '}
            <a href="https://github.com/bragibytes" target="_blank" rel="noopener noreferrer">GitHub</a>
            {' '}·{' '}
            <a href="https://x.com/sambragge" target="_blank" rel="noopener noreferrer">X</a>
          </div>
        </div>
      </section>
    </>
  )
}
