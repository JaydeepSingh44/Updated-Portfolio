import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Compass, FolderCode, Terminal, Download, ShieldCheck,
  Briefcase, ExternalLink, Mail as MailIcon
} from 'lucide-react'
import { profile, stats, log, projects, certs, experience, specTabs, links } from '../data'
import {
  SmoothButton, CountUp, Stagger, Item, TypeText, Bar,
  spring, TiltCard, Reveal, GlitchText, FloatChip
} from '../components/fx'

export function Welcome({ open }) {
  return (
    <Stagger className="pad">
      <Item className="row hero">
        {profile.photo && (
          <motion.img
            className="avatar"
            src={profile.photo}
            alt={`${profile.name} profile`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ ...spring, delay: 0.2 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        )}
        <div>
          <FloatChip>ENGINEER BUILD // 2027</FloatChip>
          <h1><GlitchText>{profile.name}</GlitchText></h1>
          <h3 className="ind">{profile.role}</h3>
          <div className="well mono">C:\BOOT\ABOUT.TXT<br />“{profile.bio}”</div>
          <div className="tags">
            {profile.tags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05, ...spring }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
        <motion.div
          className="postit"
          initial={{ opacity: 0, rotate: -8, y: -20 }}
          animate={{ opacity: 1, rotate: -3, y: 0 }}
          transition={{ ...spring, delay: 0.5 }}
          whileHover={{ rotate: 0, scale: 1.03 }}
        >
          <b>POST // BUILD NOTES</b>
          <p>
Build with purpose.  
Think in systems, not just features.  
Experiment with AI, solve real problems, and turn ideas into working products.  
Keep learning. Keep shipping.</p>
        </motion.div>
      </Item>

      <Item className="grid4">
        {stats.map(([label, value, unit, note], index) => (
          <TiltCard key={label} className="panel" max={8}>
            <small>{label}</small>
            <div className={`big c${index}`}>
              {typeof value === 'number' ? <CountUp to={value} decimals={Number.isInteger(value) ? 0 : 1} /> : value}
              {unit}
            </div>
            <small>{note}</small>
          </TiltCard>
        ))}
      </Item>

      <Item className="panel">
        <small>QUICK LAUNCH TOOLBAR [OPEN A MODULE]</small>
        <div className="grid4">
          {[
            [Compass, 'Experience', 'Internships & work', 'experience'],
            [FolderCode, 'View Projects', `${projects.length} portfolio projects`, 'projects'],
            [Terminal, 'Tech Specs', 'Skills & tools', 'specs'],
            [Download, 'Read Resume', 'Education & summary', 'resume'],
          ].map(([Icon, title, subtitle, target], i) => (
            <SmoothButton key={title} className="launch" onClick={() => open(target)}>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              >
                <Icon size={26} />
              </motion.div>
              <b>{title}</b><small>{subtitle}</small>
            </SmoothButton>
          ))}
        </div>
      </Item>

      <Item className="panel">
        <small>SYSTEM LOG / CAREER_TELEMETRY.LOG</small>
        <div className="term"><TypeText lines={log} /></div>
      </Item>

      <Item className="grid3">
        {[
          ['Frontend / UI', 78, 'var(--teal)'],
          ['Backend / APIs', 90, 'var(--ind)'],
          ['RAG / AI Systems', 85, 'var(--amber)'],
        ].map(([label, percent, color]) => (
          <TiltCard className="panel" key={label}>
            <small>{label} <b className="r">{percent}%</b></small>
            <Bar pct={percent} color={color} />
          </TiltCard>
        ))}
      </Item>
      
    </Stagger>
  )
}

export function Projects() {
  return (
    <div className="pad">
      <Reveal className="notice">PROJECT DIRECTORY // Open a live demo or source repository from each project card.</Reveal>
      <Stagger className="grid2">
        {projects.map(project => (
          <Item key={project.n}>
            <TiltCard className="proj" max={6}>
              <motion.div className="ico" whileHover={{ rotate: 10, scale: 1.1 }}>
                {project.ext || '.EXE'}
              </motion.div>
              <div>
                <b>{project.n}</b><span className="kb">{project.status || 'PROJECT'}</span>
                <p>{project.d}</p>
                <div className="tags">{project.t.map(tag => <span key={tag}>{tag}</span>)}</div>
                <div className="acts">
                  {project.links?.map(link => (
                    <SmoothButton key={link.label} onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}>
                      {link.label} <ExternalLink size={12} />
                    </SmoothButton>
                  ))}
                </div>
              </div>
            </TiltCard>
          </Item>
        ))}
      </Stagger>
      <Reveal><p className="mono ind r">PROJECTS LOADED // DETAILS SUBJECT TO ITERATION</p></Reveal>
    </div>
  )
}

export function Specs() {
  const [tab, setTab] = useState('Languages')
  const currentItems = specTabs[tab] || []
  return (
    <div className="pad">
      <div className="tabs">
        {Object.keys(specTabs).map(label => (
          <button key={label} className={label === tab ? 'on' : ''} onClick={() => setTab(label)}>
            {label}{label === tab && <motion.u layoutId="tab" transition={spring} />}
          </button>
        ))}
      </div>
      <div className="grid2">
        <TiltCard className="panel">
          <b className="big c0">BUILD / LEARN / SHIP</b>
          <small>ENGINEERING WORKFLOW</small>
          <Bar pct={82} segs={20} />
          <small>Version control, API testing, debugging and iterative delivery</small>
          <Bar pct={75} color="var(--ind)" segs={20} />
        </TiltCard>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            className="panel"
            initial={{ opacity: 0, x: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -20, filter: 'blur(6px)' }}
            transition={{ duration: 0.3 }}
          >
            <b>{tab} // TOOLKIT</b>
            {currentItems.map((item, i) => (
              <motion.div
                key={item}
                className="mono ok"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                ✔ {item}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export function Credentials() {
  return (
    <div className="pad">
      <Reveal className="panel row">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <ShieldCheck size={40} />
        </motion.div>
        <div>
          <h2>Achievements & Learning Registry</h2>
          <small>Portfolio credentials and competition highlights. No fabricated certificates or verification claims.</small>
        </div>
      </Reveal>
      <div className="dark mono">STATUS: PORTFOLIO RECORDS // VERIFY EACH ISSUER DIRECTLY</div>
      <Stagger className="grid2">
        {certs.map(item => (
          <Item key={item.n}>
            <TiltCard className="cert" max={5}>
              <small>ACHIEVEMENT RECORD</small>
              <h3>{item.n}</h3>
              <FloatChip>{item.b}</FloatChip>
              <div className="kv"><span>Organization:</span><span>{item.by}</span></div>
              <div className="kv"><span>Year / period:</span><span>{item.d}</span></div>
              {item.note && <p>{item.note}</p>}
              {item.url && (
                <motion.a className="link" href={item.url} target="_blank" rel="noreferrer" whileHover={{ x: 4 }}>
                  <b>Open reference</b><ExternalLink size={14} />
                </motion.a>
              )}
            </TiltCard>
          </Item>
        ))}
      </Stagger>
    </div>
  )
}

export function Resume() {
  return (
    <Stagger className="pad doc">
      <Item className="panel">
        <small>CURRICULUM VITAE :: BATCH 2027</small>
        <h1><GlitchText>{profile.name}</GlitchText></h1>
        <p>{profile.role}</p>
        <p>{profile.email} · {profile.location}</p>
        <div className="tags">
          {links.map(([label, url]) => (
            <motion.a key={label} href={url} target="_blank" rel="noreferrer" whileHover={{ y: -2, scale: 1.05 }}>
              {label}
            </motion.a>
          ))}
        </div>
      </Item>
      <Item><h3 className="ok">■ PROFILE</h3><p>{profile.summary}</p></Item>
      <Item><h3 className="ok">■ EDUCATION</h3></Item>
      <Item className="panel">
        <b>B.Tech, Computer Science & Engineering</b>
        <p>Jaypee University of Engineering & Technology (JUET), Guna · Expected 2027</p>
        <small>CGPA: 6.7/10 (update this if your latest official CGPA changes)</small>
      </Item>
      <Item><h3 className="ok">■ EXPERIENCE</h3></Item>
      {experience.map(item => (
        <Item className="panel" key={item.r}>
          <div className="row sp"><b>{item.r}</b><span className="chip">{item.y}</span></div>
          <small className="ind">{item.c} · {item.loc}</small>
          <p>{item.d}</p>
          {item.t?.length > 0 && <div className="tags">{item.t.map(tag => <span key={tag}>{tag}</span>)}</div>}
        </Item>
      ))}
      <Item><h3 className="ok">■ SELECTED PROJECTS</h3></Item>
      {projects.map(project => (
        <Item className="panel" key={project.n}>
          <b>{project.n}</b><p>{project.d}</p>
          <div className="tags">{project.t.map(tag => <span key={tag}>{tag}</span>)}</div>
        </Item>
      ))}
      <Item><p className="notice">To enable a real PDF download, place your current resume in the public folder and add a link to it here.</p></Item>
    </Stagger>
  )
}

export function Experience() {
  return (
    <div className="pad">
      <Reveal className="notice">C:\Jaydeep\Career\ — Work experience, newest first.</Reveal>
      <div className="timeline">
        {experience.map((item, index) => (
          <motion.div
            className="node"
            key={item.r}
            initial={{ opacity: 0, x: -30, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ ...spring, delay: index * 0.08 }}
          >
            <motion.span
              className="dot"
              whileHover={{ scale: 1.3, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Briefcase size={12} />
            </motion.span>
            <TiltCard className="panel" max={5}>
              <div className="row sp"><h3>{item.r}</h3><span className="chip">{item.y}</span></div>
              <small className="ind">{item.c} · {item.loc}</small>
              <p>{item.d}</p>
              <div className="tags">{item.t.map(tag => <span key={tag}>{tag}</span>)}</div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function Mail() {
  const [sent, setSent] = useState(false)
  const [from, setFrom] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const submit = event => {
    event.preventDefault()
    const body = `From: ${from}\n\n${message}`
    const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(subject || 'Portfolio inquiry')}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
    setSent(true)
  }

  return (
    <Stagger className="pad grid2">
      <Item>
        <form onSubmit={submit}>
          <div className="kv"><span>To:</span><span className="chip">{profile.email}</span></div>
          <motion.input whileFocus={{ scale: 1.01 }} type="email" required value={from} onChange={e => setFrom(e.target.value)} placeholder="From: you@domain.com" />
          <motion.input whileFocus={{ scale: 1.01 }} required value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject: Collaboration / Project Inquiry" />
          <motion.textarea whileFocus={{ scale: 1.01 }} required rows="7" value={message} onChange={e => setMessage(e.target.value)} placeholder="Hi Jaydeep, ..." />
          <SmoothButton className="primary" type="submit">
            <MailIcon size={14} />
            {sent ? 'Open email app again' : 'Compose email'}
          </SmoothButton>
          <small>This opens your email application; it does not send mail directly from the portfolio.</small>
        </form>
      </Item>
      <Item>
        <TiltCard className="panel" max={6}>
          <b>Links & Channels</b>
          {links.map(([label, url], i) => (
            <motion.a
              whileHover={{ x: 6, scale: 1.02 }}
              className="link"
              href={url}
              target="_blank"
              rel="noreferrer"
              key={label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <b>{label}</b>
              <small>{url.replace(/^https?:\/\//, '')}</small>
            </motion.a>
          ))}
        </TiltCard>
        <TiltCard className="panel center">
          <small>PORTFOLIO STATUS</small>
          <motion.div
            className="big c0 mono"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            BUILD · LEARN · SHIP
          </motion.div>
          <small>Full-stack development · RAG applications · AI agents</small>
        </TiltCard>
      </Item>
    </Stagger>
  )
}