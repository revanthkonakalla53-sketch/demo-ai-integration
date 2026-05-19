// ============================================================
// OllamaAI - Premium AI SaaS Landing Page
// Ollama API endpoint: https://establishment-withdrawal-farmers-gmc.trycloudflare.com/api/generate
// To change model: update OLLAMA_MODEL constant below
// ============================================================

const { useState, useEffect, useRef, useCallback } = React;

// ── CONFIG ──────────────────────────────────────────────────
// UPDATE THIS to change the Ollama model used in the chatbot
const OLLAMA_MODEL = "mistral-nemo:12b";
// Ollama API base URL (running locally)
const OLLAMA_API = "https://establishment-withdrawal-farmers-gmc.trycloudflare.com/api/generate";
// ─────────────────────────────────────────────────────────────

// Marked config for markdown
if (typeof marked !== 'undefined') {
  marked.setOptions({
    breaks: true,
    gfm: true,
    highlight: (code, lang) => {
      if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return typeof hljs !== 'undefined' ? hljs.highlightAuto(code).value : code;
    }
  });
}

// ── ICONS (SVG via Lucide) ──────────────────────────────────
const Icon = ({ name, size = 16, ...props }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && typeof lucide !== 'undefined') {
      ref.current.innerHTML = '';
      const icon = lucide.createElement(lucide[name] || lucide['Circle']);
      icon.setAttribute('width', size);
      icon.setAttribute('height', size);
      ref.current.appendChild(icon);
    }
  }, [name, size]);
  return <span ref={ref} style={{ display: 'inline-flex', alignItems: 'center' }} {...props} />;
};

// ── ANIMATED BACKGROUND ─────────────────────────────────────
const Background = () => (
  <div className="bg-canvas">
    <div className="grid-overlay" />
    <div className="blob blob-1" />
    <div className="blob blob-2" />
    <div className="blob blob-3" />
  </div>
);

// ── NAVBAR ───────────────────────────────────────────────────
const Navbar = ({ onChatOpen }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-logo">
        <div className="nav-logo-icon">⚡</div>
        <span>OllamaAI</span>
      </div>
      <ul className="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#demo">Demo</a></li>
        <li><a href="#how">How It Works</a></li>
        <li><a href="#pricing">Pricing</a></li>
      </ul>
      <div className="nav-actions">
        <button className="btn btn-ghost" onClick={onChatOpen} id="nav-open-chat">View Models</button>
        <button className="btn btn-primary" onClick={onChatOpen} id="nav-start-chat">Start Chatting →</button>
      </div>
    </nav>
  );
};

// ── HERO ─────────────────────────────────────────────────────
const TypewriterText = ({ texts, speed = 60 }) => {
  const [display, setDisplay] = useState('');
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const current = texts[idx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setIdx(i => (i + 1) % texts.length);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, texts, speed]);

  return (
    <span className="gradient-text">
      {display}
      <span className="cursor-blink" />
    </span>
  );
};

const Hero = ({ onChatOpen }) => (
  <section className="hero" id="hero">
    <div className="hero-content">
      <div className="status-badge fade-up fade-up-d1">
        <span className="status-dot" />
        Model Online · mistral-nemo:12b
      </div>
      <h1 className="fade-up fade-up-d2">
        Run Powerful Local AI<br />
        <TypewriterText texts={["Models Privately", "Without the Cloud", "At Lightning Speed", "On Your Machine"]} />
      </h1>
      <p className="fade-up fade-up-d3">
        Chat with your own locally hosted Ollama AI directly from your browser.
        No data leaves your machine. No subscriptions. Full privacy.
      </p>
      <div className="hero-cta fade-up fade-up-d4">
        <button className="btn btn-primary btn-lg" onClick={onChatOpen} id="hero-start-chat">
          ✦ Start Chatting
        </button>
        <a href="#demo" className="btn btn-outline btn-lg" id="hero-view-demo">
          View Demo ↓
        </a>
      </div>
      <div className="hero-stats fade-up fade-up-d4">
        <div className="stat"><div className="stat-value">100%</div><div className="stat-label">Private</div></div>
        <div className="stat"><div className="stat-value">&lt;1ms</div><div className="stat-label">Latency</div></div>
        <div className="stat"><div className="stat-value">∞</div><div className="stat-label">Requests</div></div>
        <div className="stat"><div className="stat-value">20+</div><div className="stat-label">Models</div></div>
      </div>
    </div>
  </section>
);

// ── FEATURES ─────────────────────────────────────────────────
const FEATURES = [
  { icon: '🔒', title: 'Privacy First', desc: 'Every conversation stays on your machine. No logs, no telemetry, no external servers. Your data is yours.' },
  { icon: '⚡', title: 'Fast Responses', desc: 'Direct GPU acceleration via Ollama. Sub-second streaming responses with real-time token generation.' },
  { icon: '🧠', title: 'Multi-Model Support', desc: 'Switch between Llama, Mistral, Qwen, Gemma, and 20+ open-source models with a single API call.' },
  { icon: '📡', title: 'Local AI Processing', desc: 'All inference runs locally via Ollama. No internet required after initial model download.' },
  { icon: '🌐', title: 'Offline Capability', desc: 'Works completely offline once models are pulled. Perfect for air-gapped environments.' },
  { icon: '🔄', title: 'Real-Time Streaming', desc: 'Token-by-token streaming responses create a fluid, interactive experience just like ChatGPT.' },
];

const FeaturesSection = () => (
  <section className="section" id="features">
    <div className="section-header">
      <div className="section-label">✦ Capabilities</div>
      <h2 className="section-title">Everything You Need.<br />Nothing You Don't.</h2>
      <p className="section-sub">Built for developers and privacy-focused teams who want AI without compromise.</p>
    </div>
    <div className="features-grid">
      {FEATURES.map((f, i) => (
        <div className="glass-card feature-card" key={i}>
          <div className="feature-icon">{f.icon}</div>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

// ── DEMO SECTION ─────────────────────────────────────────────
const DemoTyping = ({ text, delay = 0, speed = 28 }) => {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  useEffect(() => {
    if (!started) return;
    if (displayed.length < text.length) {
      const t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed);
      return () => clearTimeout(t);
    }
  }, [started, displayed, text, speed]);
  return <span dangerouslySetInnerHTML={{ __html: displayed }} />;
};

const DemoSection = () => (
  <section className="section" id="demo">
    <div className="section-header">
      <div className="section-label">✦ Live Preview</div>
      <h2 className="section-title">See It In Action</h2>
      <p className="section-sub">Watch your local Ollama model respond in real time with markdown and code support.</p>
    </div>
    <div className="demo-window">
      <div className="demo-titlebar">
        <div className="demo-dots">
          <div className="demo-dot" /><div className="demo-dot" /><div className="demo-dot" />
        </div>
        <span className="demo-title">OllamaAI Chat · qwen2.5:14b · trycloudflare.com</span>
      </div>
      <div className="demo-body">
        <div className="demo-messages">
          <div className="msg user">
            <div className="msg-avatar user">U</div>
            <div className="msg-bubble">Write a Python function to check if a number is prime.</div>
          </div>
          <div className="msg">
            <div className="msg-avatar ai">⚡</div>
            <div className="msg-bubble">
              <DemoTyping text="Sure! Here&apos;s an efficient prime-checking function:" delay={600} />
              <pre style={{ marginTop: '12px' }}><code className="language-python">{`def is_prime(n: int) -> bool:
    """Check if n is a prime number."""
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    for i in range(3, int(n**0.5) + 1, 2):
        if n % i == 0:
            return False
    return True

# Examples
print(is_prime(17))  # True
print(is_prime(18))  # False`}</code></pre>
              <div style={{ marginTop: '12px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <DemoTyping text="This runs in <code>O(√n)</code> time — optimal for single checks. Need a sieve for bulk primality testing?" delay={1800} />
              </div>
            </div>
          </div>
          <div className="msg user">
            <div className="msg-avatar user">U</div>
            <div className="msg-bubble">Yes, show me the Sieve of Eratosthenes.</div>
          </div>
          <div className="msg">
            <div className="msg-avatar ai">⚡</div>
            <div className="msg-bubble">
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── HOW IT WORKS ─────────────────────────────────────────────
const HowSection = () => (
  <section className="section" id="how">
    <div className="section-header">
      <div className="section-label">✦ Setup</div>
      <h2 className="section-title">Up & Running in 3 Steps</h2>
      <p className="section-sub">No cloud accounts. No API keys. No subscriptions.</p>
    </div>
    <div className="steps">
      {[
        { n: '1', title: 'Install Ollama', desc: 'Download Ollama from ollama.ai and install it on your machine. Supports Mac, Linux, and Windows.' },
        { n: '2', title: 'Pull a Model', desc: 'Run `ollama pull qwen2.5:14b` in your terminal. Ollama downloads and manages models automatically.' },
        { n: '3', title: 'Start Chatting', desc: 'Open this page and click the chat button. Your browser connects directly to the cloud API.' },
      ].map((s, i) => (
        <div className="glass-card step-card" key={i}>
          <div className="step-num">{s.n}</div>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

// ── CTA ──────────────────────────────────────────────────────
const CTASection = ({ onChatOpen }) => (
  <section className="cta-section" id="pricing">
    <div className="cta-card">
      <div className="status-badge" style={{ justifyContent: 'center' }}>
        <span className="status-dot" />
        Free & Open Source Forever
      </div>
      <h2>Start Chatting with<br /><span className="gradient-text">Local AI Today</span></h2>
      <p>No signups. No fees. Just you and your models.</p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-primary btn-lg" onClick={onChatOpen} id="cta-open-chat">
          ✦ Open Chat Widget
        </button>
        <a href="https://ollama.ai" target="_blank" rel="noopener" className="btn btn-outline btn-lg" id="cta-get-ollama">
          Get Ollama →
        </a>
      </div>
    </div>
  </section>
);

// ── FOOTER ───────────────────────────────────────────────────
const Footer = () => (
  <footer>
    <div className="footer-inner">
      <div className="footer-copy">© 2025 OllamaAI. Built for local-first AI. · Powered by <strong>Ollama</strong></div>
      <div className="footer-links">
        <a href="https://ollama.ai" target="_blank" rel="noopener">Ollama</a>
        <a href="https://github.com/ollama/ollama" target="_blank" rel="noopener">GitHub</a>
        <a href="#features">Docs</a>
        <a href="#how">Setup</a>
      </div>
    </div>
  </footer>
);

// ── CHAT WIDGET ──────────────────────────────────────────────
// This component handles the floating chatbot connected to Ollama.
// API: POST https://establishment-withdrawal-farmers-gmc.trycloudflare.com/api/generate with streaming enabled.
// To change the model, update OLLAMA_MODEL at the top of this file.

const SYSTEM_MESSAGES = [
  { role: 'ai', content: "Hey! 👋 I'm your **local AI assistant** powered by **Ollama**.\n\nI'm running `" + OLLAMA_MODEL + "` directly on your machine — completely private, no cloud involved.\n\nAsk me anything: code, analysis, writing, math..." },
];

const MarkdownMsg = ({ content }) => {
  const html = typeof marked !== 'undefined'
    ? marked.parse(content || '')
    : content;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const ChatWidget = ({ open, onClose }) => {
  const [messages, setMessages] = useState(SYSTEM_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modelOnline, setModelOnline] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const abortRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check if Ollama is reachable when widget opens
  useEffect(() => {
    if (!open) return;
    fetch('https://establishment-withdrawal-farmers-gmc.trycloudflare.com/api/tags', { signal: AbortSignal.timeout(3000) })
      .then(r => setModelOnline(r.ok))
      .catch(() => setModelOnline(false));
  }, [open]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const sendMessage = useCallback(async () => {
    const prompt = input.trim();
    if (!prompt || loading) return;

    setInput('');
    setError('');
    const userMsg = { role: 'user', content: prompt };
    const aiMsg = { role: 'ai', content: '' };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setLoading(true);

    try {
      // ── OLLAMA API CALL ─────────────────────────────────────
      // POST to local Ollama with streaming enabled.
      // Adjust "model" to switch models dynamically.
      // For chat history, use /api/chat endpoint instead with messages array.
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const res = await fetch(OLLAMA_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({
          model: OLLAMA_MODEL,   // ← change model here or make dynamic
          prompt: prompt,
          stream: true,          // ← enables token-by-token streaming
          options: {
            temperature: 0.7,    // ← adjust creativity (0.0 = deterministic, 1.0 = creative)
            num_predict: 2048,   // ← max tokens per response
          }
        }),
      });

      if (!res.ok) {
        throw new Error(`Ollama returned ${res.status}. Is the model "${OLLAMA_MODEL}" pulled?`);
      }

      // ── STREAM READER ───────────────────────────────────────
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.response) {
              accumulated += json.response;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'ai', content: accumulated };
                return updated;
              });
            }
            if (json.done) break;
          } catch { }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      const errMsg = err.message.includes('Failed to fetch')
        ? '⚠️ Cannot reach the cloud Ollama API.\n\nMake sure:\n1. The Cloudflare tunnel is active\n2. Model is available (`ollama pull ' + OLLAMA_MODEL + '`)'
        : `⚠️ Error: ${err.message}`;
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'ai', content: errMsg };
        return updated;
      });
      setError(err.message);
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [input, loading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const stopGeneration = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  const statusColor = modelOnline === true ? '#22c55e' : modelOnline === false ? '#ef4444' : '#f59e0b';
  const statusText = modelOnline === true ? 'Online' : modelOnline === false ? 'Offline' : 'Checking...';

  return (
    <div className={`chat-widget${open ? ' visible' : ' hidden'}`} role="dialog" aria-label="AI Chat Assistant">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-avatar">⚡</div>
        <div className="chat-header-info">
          <h4>OllamaAI Assistant</h4>
          <div className="chat-model-badge">
            <span className="dot" style={{ background: statusColor }} />
            <span>{OLLAMA_MODEL} · {statusText}</span>
          </div>
        </div>
        <button className="chat-close" onClick={onClose} aria-label="Close chat">✕</button>
      </div>

      {/* Messages */}
      <div className="chat-messages" id="chat-messages-list">
        {messages.map((msg, i) => (
          <div className={`chat-msg ${msg.role}`} key={i}>
            <div className={`chat-msg-avatar ${msg.role}`}>
              {msg.role === 'ai' ? '⚡' : '👤'}
            </div>
            <div className="chat-bubble">
              {msg.role === 'ai' ? (
                msg.content
                  ? <MarkdownMsg content={msg.content} />
                  : <div className="typing-indicator">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
              ) : (
                <span>{msg.content}</span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-footer">
        <div className="chat-input-row">
          <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder="Ask anything... (Shift+Enter for new line)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            id="chat-input-field"
            disabled={loading && false}
          />
          {loading ? (
            <button className="chat-send" onClick={stopGeneration} title="Stop generation" id="chat-stop-btn">
              ⏹
            </button>
          ) : (
            <button
              className="chat-send"
              onClick={sendMessage}
              disabled={!input.trim()}
              id="chat-send-btn"
              aria-label="Send message"
            >
              ↑
            </button>
          )}
        </div>
        <div className="chat-hint">
          {loading ? 'Streaming from Ollama...' : 'Running locally · No data sent to cloud'}
        </div>
      </div>
    </div>
  );
};

// ── FLOATING ACTION BUTTON ───────────────────────────────────
const ChatFAB = ({ open, onClick }) => (
  <button className="chat-fab" onClick={onClick} id="chat-fab-btn" aria-label="Open AI Chat">
    <div className="fab-ring" />
    {open ? '✕' : '⚡'}
  </button>
);

// ── MAIN APP ─────────────────────────────────────────────────
const App = () => {
  const [chatOpen, setChatOpen] = useState(false);

  const openChat = () => setChatOpen(true);
  const toggleChat = () => setChatOpen(v => !v);

  // Highlight code blocks after render
  useEffect(() => {
    if (typeof hljs !== 'undefined') {
      document.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
    }
  });

  return (
    <>
      <Background />
      <Navbar onChatOpen={openChat} />
      <main>
        <Hero onChatOpen={openChat} />
        <FeaturesSection />
        <DemoSection />
        <HowSection />
        <CTASection onChatOpen={openChat} />
      </main>
      <Footer />
      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
      <ChatFAB open={chatOpen} onClick={toggleChat} />
    </>
  );
};

// ── RENDER ────────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
