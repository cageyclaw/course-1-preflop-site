import { useEffect, useMemo, useState } from 'react'
import { marked } from 'marked'
import './App.css'
import './visuals/visuals.css'

type Chapter = {
  id: string
  title: string
  file: string
}

const chapters: Chapter[] = [
  { id: 'A1', title: 'RFI (Raise First In)', file: 'A1.md' },
  { id: 'A2', title: '3-Bet Strategy', file: 'A2.md' },
  { id: 'A3', title: 'Facing a 3-Bet', file: 'A3.md' },
  { id: 'A4', title: 'Blind Defense (SB/BB)', file: 'A4.md' },
  { id: 'A5', title: 'Isolation (ISO) Raising & Sizing', file: 'A5.md' },
  { id: 'A6', title: 'Stack Depth (Shallow vs Deep)', file: 'A6.md' },
  { id: 'A7', title: '30-Day Preflop Plan', file: 'A7.md' },
  { id: 'D1', title: 'RFI Decision Lab', file: 'D1-rfi-decision-lab.md' },
  { id: 'D2', title: '3-Bet or Defend Lab', file: 'D2-3bet-or-defend-lab.md' },
  { id: 'D3', title: 'BB Defense Speed Drill', file: 'D3-bb-defense-speed-drill.md' },
  { id: 'D4', title: 'Final Assessment', file: 'D4-final-assessment.md' },
]

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [contentHtml, setContentHtml] = useState('<p>Loading…</p>')

  const current = useMemo(() => chapters[currentIndex], [currentIndex])
  const progress = useMemo(() => {
    return Math.round(((currentIndex + 1) / chapters.length) * 100)
  }, [currentIndex])

  // UX: when switching sections, always start at the top.
  useEffect(() => {
    const active = document.activeElement
    if (active instanceof HTMLElement) active.blur()

    const scrollTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    scrollTop()
    requestAnimationFrame(scrollTop)
    setTimeout(scrollTop, 0)
  }, [currentIndex])

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const base = import.meta.env.BASE_URL ?? '/'
        // Avoid stale markdown after deploy (GitHub Pages can be aggressively cached)
        const v = import.meta.env.VITE_BUILD_ID
        const qs = v ? `?v=${encodeURIComponent(String(v))}` : ''
        const res = await fetch(`${base}course-md/${current.file}${qs}`, {
          cache: 'no-store',
        })
        let text = await res.text()
        // Safety: strip internal chapter codes from markdown headings if any slip through
        // Examples: "# A1 — Title" / "## D3 — Drill" etc.
        text = text.replace(/^(#{1,6})\s*[A-D]\d+\s*[—-]\s*/gim, '$1 ')
        let html = (await marked.parse(text)) as string
        // GitHub Pages base-path fix: markdown often references /course-md/... (root),
        // but this site is hosted under /course-1-preflop-site/. Rewrite to include BASE_URL.
        html = html.replaceAll('src="/course-md/', `src="${base}course-md/`)
        if (isMounted) setContentHtml(html)
      } catch {
        if (isMounted)
          setContentHtml(
            '<p>Failed to load chapter. Check the markdown path.</p>'
          )
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [current])

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <img
              className="brand-icon"
              src={`${import.meta.env.BASE_URL}course-assets/cards-icon.svg`}
              alt="Poker cards icon"
            />
            <span className="brand-signal" aria-hidden="true" />
          </div>
          <div className="brand-copy">
            <div className="brand-kicker">Elite Performance Lab</div>
            <div className="brand-title">Course 1 — Preflop</div>
            <div className="brand-sub">Data-driven foundations</div>
          </div>
        </div>

        <div className="sidebar-progress">
          <div>
            <div className="progress-label">Module Progress</div>
            <div className="progress-value">{progress}%</div>
          </div>
          <div className="progress-bar" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-meta">{currentIndex + 1} of {chapters.length} complete</div>
        </div>

        <nav className="nav">
          {chapters.map((chapter, idx) => (
            <button
              key={chapter.id}
              className={`nav-item ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            >
              <span className="nav-id">{chapter.id}</span>
              <span className="nav-title">{chapter.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="lab-header">
          <div className="lab-header-meta">
            <span className="lab-pill">Signal Green Track</span>
            <span className="lab-meta">Updated 2026 · Lab Mode</span>
          </div>
          <div className="lab-title-row">
            <div>
              <div className="content-meta">Course 1 — Preflop</div>
              <h1>{current.title}</h1>
              <p className="content-summary">
                Precision-first preflop execution. Every section is tuned for repeatable
                decision systems, fast recall, and measured edge.
              </p>
            </div>
            <div className="lab-hero-panel">
              <div className="hero-stat">
                <span className="hero-label">Module</span>
                <span className="hero-value">{current.id}</span>
              </div>
              <div className="hero-stat">
                <span className="hero-label">Focus</span>
                <span className="hero-value">Automation</span>
              </div>
              <div className="hero-stat">
                <span className="hero-label">Intensity</span>
                <span className="hero-value">High</span>
              </div>
              <div className="hero-stat">
                <span className="hero-label">Accuracy</span>
                <span className="hero-value">Target 90%</span>
              </div>
            </div>
          </div>
        </header>

        <section className="lab-metrics">
          <div className="metric-card">
            <div className="metric-title">Session Objective</div>
            <div className="metric-value">Stabilize open + 3-bet ranges</div>
            <div className="metric-note">Baseline EV capture across positions</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Decision Tempo</div>
            <div className="metric-value">≤ 6 seconds</div>
            <div className="metric-note">Speed drills + spot checks</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Leak Control</div>
            <div className="metric-value">Reduce passive calls</div>
            <div className="metric-note">Pressure tested in labs</div>
          </div>
        </section>

        <article
          className="markdown"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <div className="section-divider" aria-hidden="true">
          <img
            src={`${import.meta.env.BASE_URL}course-assets/table-divider.svg`}
            alt=""
          />
        </div>

        <div className="pager">
          <button
            className="pager-btn"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            ← Previous
          </button>
          <button
            className="pager-btn"
            onClick={() =>
              setCurrentIndex((i) => Math.min(chapters.length - 1, i + 1))
            }
            disabled={currentIndex === chapters.length - 1}
          >
            Next →
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
