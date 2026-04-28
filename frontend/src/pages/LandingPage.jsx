import React from 'react';
import { useNavigate } from 'react-router-dom';

function NoteCardPreview({ tag, tagColor, tagBg, title, body, italic, source, style }) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '14px',
      padding: '18px 20px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.05)',
      ...style,
    }}>
      <span style={{ background: tagBg, color: tagColor, fontSize: '9px', fontWeight: '800', padding: '3px 9px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {tag}
      </span>
      {title && (
        <div style={{ fontWeight: '700', fontSize: '13.5px', color: '#1e1b4b', margin: '10px 0 4px', lineHeight: '1.4' }}>{title}</div>
      )}
      <div style={{ fontSize: '12.5px', color: '#4b5563', lineHeight: '1.65', marginTop: title ? '0' : '10px', fontStyle: italic ? 'italic' : 'normal', fontFamily: italic ? "'Fraunces', Georgia, serif" : 'inherit' }}>
        {body}
      </div>
      <div style={{ marginTop: '12px', fontSize: '10.5px', color: '#9ca3af' }}>{source}</div>
    </div>
  );
}

const FEATURES = [
  {
    title: 'Preserved word for word',
    desc: 'The exact sentence that clicked is stored untouched — never paraphrased, never rewritten.',
    symbol: '✦',
    accent: '#f59e0b',
  },
  {
    title: 'AI-written context',
    desc: 'Gemini reads your existing notes and writes a title and summary so clips still make sense weeks later.',
    symbol: '◈',
    accent: '#a78bfa',
  },
  {
    title: 'Organized by topic',
    desc: 'Group clips into topics and search across all of them instantly with full-text search.',
    symbol: '◉',
    accent: '#34d399',
  },
];

const STEPS = [
  { num: '01', label: 'Clip', desc: 'Paste or highlight text from any AI chat, article, or resource.' },
  { num: '02', label: 'Tag', desc: 'Choose a topic and tag — concept, example, or quote.' },
  { num: '03', label: 'AI processes', desc: 'Gemini reads your notes for context and writes a title + summary.' },
  { num: '04', label: 'Saved', desc: 'Your clip is stored with the original preserved in an amber block.' },
];

function CTAButton({ onClick, children }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#7c3aed',
        color: '#ffffff',
        border: 'none',
        borderRadius: '10px',
        padding: '13px 32px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        letterSpacing: '-0.01em',
        boxShadow: hovered ? '0 8px 28px rgba(124,58,237,0.42)' : '0 4px 16px rgba(124,58,237,0.25)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
    >
      {children}
    </button>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#ffffff', color: '#1e1b4b', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* , Hero — split screen ,,,,,,,,,,,,,,,,,,,, */}
      <section style={{ display: 'flex', height: '100vh', minHeight: '640px' }}>

        {/* Left panel — cream */}
        <div style={{ flex: '0 0 44%', background: '#f5f0e8', display: 'flex', flexDirection: 'column', padding: '36px 44px', position: 'relative' }}>
          {/* Top bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                <rect x="5" y="7" width="22" height="22" rx="3" fill="#7c3aed" fillOpacity=".2" stroke="#7c3aed" strokeWidth="1.6"/>
                <rect x="5" y="5.5" width="22" height="3" rx="1.5" fill="#7c3aed" fillOpacity=".3" stroke="#7c3aed" strokeWidth="1.2"/>
                <circle cx="10" cy="7" r="1.4" fill="#7c3aed" fillOpacity=".7"/>
                <circle cx="16" cy="7" r="1.4" fill="#7c3aed" fillOpacity=".7"/>
                <circle cx="22" cy="7" r="1.4" fill="#7c3aed" fillOpacity=".7"/>
                <line x1="9" y1="15" x2="23" y2="15" stroke="#7c3aed" strokeWidth="1.6" strokeLinecap="round"/>
                <line x1="9" y1="19.5" x2="23" y2="19.5" stroke="#7c3aed" strokeWidth="1.6" strokeLinecap="round"/>
                <line x1="9" y1="24" x2="17" y2="24" stroke="#7c3aed" strokeWidth="1.6" strokeLinecap="round"/>
                <line x1="20" y1="24.5" x2="25" y2="19.5" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#1e1b4b', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Clipped</span>
            </div>
            <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.04em' }}>v0.2 · Apr 2026</span>
          </div>

          {/* Main content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '32px' }}>
            <p style={{ fontSize: '10px', fontWeight: '800', color: '#7c3aed', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '20px' }}>
              A Learning Archive, Context Preserved
            </p>
            <h1 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(56px, 6.5vw, 84px)',
              fontWeight: '900',
              lineHeight: '0.93',
              color: '#0f0a1e',
              margin: '0 0 28px',
              letterSpacing: '-0.04em',
            }}>
              Clipped.
            </h1>
            <p style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: '16.5px',
              fontStyle: 'italic',
              color: '#6b7280',
              marginBottom: '40px',
              lineHeight: '1.7',
              maxWidth: '340px',
            }}>
              Every learner loses their best explanations to closed tabs and abandoned copy-pastes. Clipped captures them in one click - word for word, wrapped with AI context, zero friction.
            </p>
            <CTAButton onClick={() => navigate('/app')}>Open the app →</CTAButton>
          </div>

          <div style={{ fontSize: '11px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            No account needed · Self-hosted · MIT license
          </div>
        </div>

        {/* Right panel — lavender with floating cards */}
        <div style={{
          flex: 1,
          background: '#ddd6fe',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(circle, rgba(109,40,217,0.14) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(140deg, rgba(221,214,254,0) 30%, rgba(167,139,250,0.25) 100%)', pointerEvents: 'none' }} />

          <NoteCardPreview
            tag="QUOTE" tagColor="#b45309" tagBg="#fef3c7"
            title={null}
            body={`"Thinking about thinking — when the LLM encountered uncertainty or potential errors, it didn't blindly proceed but instead acknowledged its limitations and adapted its approach."`}
            italic={true}
            source="Pascal Bornet · Agentic AI"
            style={{ position: 'absolute', top: '8%', right: '6%', width: '310px', transform: 'rotate(-2.5deg)' }}
          />
          <NoteCardPreview
            tag="EXAMPLE" tagColor="#059669" tagBg="#f0fdf4"
            title="Spring stereotypes"
            body="@Component, @Service, @Repository — semantic roles for clarity."
            italic={false}
            source="spring.io · annotations"
            style={{ position: 'absolute', top: '40%', left: '6%', width: '290px', transform: 'rotate(1.8deg)' }}
          />
          <NoteCardPreview
            tag="CONCEPT" tagColor="#7c3aed" tagBg="#faf5ff"
            title="useState as short-term memory"
            body={'An object that holds information that might change over time — a counter, text in an input, a "loading" status.'}
            italic={false}
            source="react.dev · hooks"
            style={{ position: 'absolute', top: '63%', right: '8%', width: '305px', transform: 'rotate(-1.2deg)' }}
          />
        </div>
      </section>

      {/* , Anatomy of a clip ,,,,,,,,,,,,,,,,,,,,─ */}
      <section style={{ padding: '96px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '64px', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 300px' }}>
            <p style={{ fontSize: '10px', fontWeight: '800', color: '#7c3aed', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '16px' }}>The format</p>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: '600', color: '#0f0a1e', marginBottom: '16px', lineHeight: '1.2', letterSpacing: '-0.025em' }}>
              Every clip has everything you need
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.8' }}>
              An AI-written title and summary for quick recall. The original preserved word for word. Source and date so you always know where it came from.
            </p>
          </div>

          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #ede9fe', borderRadius: '16px', padding: '22px 24px', boxShadow: '0 8px 40px rgba(124,58,237,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ background: '#ede9fe', color: '#7c3aed', fontSize: '9px', fontWeight: '800', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>concept</span>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Apr 28, 2026</span>
              </div>
              <div style={{ fontWeight: '700', fontSize: '14.5px', color: '#1e1b4b', marginBottom: '6px' }}>Closures capture references, not values</div>
              <div style={{ fontSize: '12.5px', color: '#6b7280', lineHeight: '1.7', marginBottom: '14px' }}>
                A closure stores a live reference to the variable — which is why it sees the final loop value, not the value at creation time.
              </div>
              <div style={{ background: '#fffbeb', borderLeft: '3px solid #f59e0b', borderRadius: '0 8px 8px 0', padding: '10px 14px', fontSize: '12px', color: '#78350f', lineHeight: '1.7' }}>
                "A closure is not a snapshot of the variable — it's a live reference. That's why it sees the final value of i."
              </div>
              <div style={{ marginTop: '12px', fontSize: '11px', color: '#9ca3af' }}>Preserved from Claude · Apr 28</div>
            </div>
          </div>
        </div>
      </section>

      {/* , Features — dark ,,,,,,,,,,,,,,,,,,,,,─ */}
      <section style={{ background: '#0f0a1e', padding: '96px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p style={{ fontSize: '10px', fontWeight: '800', color: '#a78bfa', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>Why it works</p>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: '600', color: '#ffffff', textAlign: 'center', marginBottom: '56px', letterSpacing: '-0.025em' }}>
            Built around how learning actually works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '28px 24px' }}>
                <div style={{ fontSize: '20px', color: f.accent, marginBottom: '16px' }}>{f.symbol}</div>
                <div style={{ fontWeight: '700', fontSize: '15px', color: '#ffffff', marginBottom: '10px' }}>{f.title}</div>
                <div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.75' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* , How it works ,,,,,,,,,,,,,,,,,,,,,,, */}
      <section style={{ padding: '96px 24px', background: '#faf5ff' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <p style={{ fontSize: '10px', fontWeight: '800', color: '#7c3aed', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>The flow</p>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: '600', color: '#0f0a1e', textAlign: 'center', marginBottom: '64px', letterSpacing: '-0.025em' }}>
            Four steps, ten seconds
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '27px', left: '14%', right: '14%', height: '1px', background: 'linear-gradient(90deg, transparent, #c4b5fd 15%, #c4b5fd 85%, transparent)', pointerEvents: 'none' }} />
            {STEPS.map((s) => (
              <div key={s.num} style={{ textAlign: 'center', padding: '0 12px', position: 'relative' }}>
                <div style={{ width: '54px', height: '54px', background: '#ffffff', border: '1px solid #ddd6fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 2px 12px rgba(124,58,237,0.1)' }}>
                  <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '18px', fontWeight: '700', color: '#7c3aed' }}>{s.num}</span>
                </div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#1e1b4b', marginBottom: '8px' }}>{s.label}</div>
                <div style={{ fontSize: '12.5px', color: '#6b7280', lineHeight: '1.7' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* , Extension callout ,,,,,,,,,,,,,,,,,,,,─ */}
      <section style={{ padding: '96px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', gap: '56px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <p style={{ fontSize: '10px', fontWeight: '800', color: '#7c3aed', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '16px' }}>Chrome Extension</p>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: '600', color: '#0f0a1e', marginBottom: '16px', lineHeight: '1.2', letterSpacing: '-0.025em' }}>
              Never leave the page
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.8', marginBottom: '28px' }}>
              Highlight text on any webpage and it's saved to Clipped instantly. Start a Session to silently auto-save everything you read. Press{' '}
              <kbd style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '1px 7px', fontSize: '12px', fontFamily: 'monospace', color: '#374151' }}>Alt+C</kbd>
              {' '}to clip without touching the mouse.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Session Mode', 'Alt+C shortcut', 'Shadow DOM'].map((tag) => (
                <span key={tag} style={{ background: '#faf5ff', border: '1px solid #ddd6fe', color: '#7c3aed', borderRadius: '6px', padding: '5px 13px', fontSize: '12px', fontWeight: '600' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Popup mockup */}
          <div style={{ flex: '0 0 248px' }}>
            <div style={{ background: '#1e1b4b', borderRadius: '16px', padding: '18px', boxShadow: '0 20px 60px rgba(30,27,75,0.18)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                  <rect x="5" y="7" width="22" height="22" rx="3" fill="#7c3aed" fillOpacity=".4" stroke="#a78bfa" strokeWidth="1.6"/>
                  <line x1="9" y1="15" x2="23" y2="15" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round"/>
                  <line x1="9" y1="19.5" x2="23" y2="19.5" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round"/>
                  <line x1="9" y1="24" x2="17" y2="24" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>Clipped</span>
              </div>
              <div style={{ background: 'rgba(124,58,237,0.22)', border: '1px solid rgba(124,58,237,0.38)', borderRadius: '10px', padding: '11px 13px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
                  <div style={{ width: '6px', height: '6px', background: '#a78bfa', borderRadius: '50%' }} />
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Session Active</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', paddingLeft: '13px' }}>React Hooks</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px', textAlign: 'center', color: '#9ca3af', fontSize: '12px' }}>
                End Session
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* , Final CTA ,,,,,,,,,,,,,,,,,,,,,,,,─ */}
      <section style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)', padding: '96px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '10px', fontWeight: '800', color: '#7c3aed', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '20px' }}>Ready?</p>
        <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 'clamp(30px, 4.5vw, 50px)', fontWeight: '700', color: '#0f0a1e', marginBottom: '16px', letterSpacing: '-0.03em' }}>
          Start building your archive
        </h2>
        <p style={{ fontSize: '16px', color: '#6d28d9', marginBottom: '40px', fontStyle: 'italic', fontFamily: "'Fraunces', Georgia, serif" }}>
          No signup. No friction. Just open the app and start clipping.
        </p>
        <CTAButton onClick={() => navigate('/app')}>Open Clipped →</CTAButton>
      </section>

      {/* , Footer ,,,,,,,,,,,,,,,,,,,,,,,,,, */}
      <footer style={{ background: '#0f0a1e', padding: '26px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: '700', color: '#4b5563', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Clipped</span>
        <span style={{ fontSize: '11px', color: '#4b5563' }}>MIT License · Built in the open · v0.2</span>
      </footer>
    </div>
  );
}
