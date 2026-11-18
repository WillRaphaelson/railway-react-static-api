import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setSending(true);
    setStatus('');
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Request failed.');
      setStatus(result.message);
    } catch (error) { setStatus(error.message || 'Unable to submit. Please try again.'); }
    finally { setSending(false); }
  }
  return <>
    <header><a className="brand" href="/">fieldwork<span> / studio</span></a><nav><a href="/work">Work</a><a href="/contact">Contact</a></nav></header>
    <main>
      <section className="intro"><p className="eyebrow">INDEPENDENT DESIGN & DEVELOPMENT</p><h1>Websites built<br/>for what comes next.</h1><p className="lede">We help small teams turn an idea into a useful website, then keep it working as their business grows.</p><a className="link" href="#contact">Tell us about your project <span>↗</span></a></section>
      <section className="projects" id="work"><div className="section-label"><h2>Selected work</h2><span>01 / 02</span></div><div className="grid"><article className="project peach"><div className="art"><div className="circle"></div><span className="wordmark">ORBIT<br/>COFFEE</span></div><div className="project-info"><h3>Orbit Coffee</h3><p>Brand & online shop</p></div></article><article className="project green"><div className="art"><div className="arches"><i></i><i></i><i></i></div><span className="wordmark small">a little<br/>more outside.</span></div><div className="project-info"><h3>Outside Journal</h3><p>Editorial website</p></div></article></div></section>
      <section className="contact" id="contact"><div><p className="eyebrow">LET'S TALK</p><h2>What are you<br/>working on?</h2><p>This is a deployment example. The API validates your request and returns a receipt. It doesn't store or email your message.</p></div><form onSubmit={submit}><label>Name<input name="name" required maxLength="100" autoComplete="name"/></label><label>Email<input name="email" type="email" required maxLength="254" autoComplete="email"/></label><label>Project details<textarea name="message" required maxLength="2000" rows="3"/></label><button disabled={sending}>{sending ? 'Sending…' : 'Send demo request'} <span>↗</span></button><p className="status" role="status">{status}</p></form></section>
    </main><footer><span>Fieldwork Studio · Example project</span><span>React frontend / Node.js API</span></footer>
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
