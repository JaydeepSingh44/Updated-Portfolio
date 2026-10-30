import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Monitor, FolderOpen, FileText, ShieldCheck, Mail as MailI, Trash2 } from 'lucide-react'
import { spring } from './components/fx'
import { Scanlines } from './components/fx'
import * as W from './windows/Windows'

const apps = {
  welcome: { t: 'Welcome.exe — Jaydeep Chouhan | Full-Stack & AI Engineer', tab: 'Welcome.exe', C: W.Welcome, menu: 'File' },
  projects: { t: 'C:\\Jaydeep\\Projects\\ — Project Explorer', tab: 'Projects_Explorer.exe', C: W.Projects, menu: 'Edit' },
  experience: { t: 'C:\\Jaydeep\\Career\\ — Experience Log', tab: 'Experience.log', C: W.Experience, menu: 'Go' },
  specs: { t: 'System Properties: Engineering Skills & Diagnostics', tab: 'System_Specs.exe', C: W.Specs, menu: 'View' },
  certs: { t: 'Achievements & Credentials Registry', tab: 'Credentials.lic', C: W.Credentials, menu: 'Special' },
  resume: { t: 'Jaydeep_Chouhan_Resume.pdf — Document Reader', tab: 'Resume_Reader.doc', C: W.Resume },
  mail: { t: 'Compose Message: Contact Jaydeep — Mail Client', tab: 'Mail_Client.exe', C: W.Mail },
}

const desktopIcons = [
  [Monitor, 'My Computer', 'welcome'],
  [FolderOpen, 'C: Drive', 'projects'],
  [FileText, 'Readme.txt', 'resume'],
  [ShieldCheck, 'Achievements', 'certs'],
  [MailI, 'Mail.exe', 'mail'],
  [Trash2, 'Career Log', 'experience'],
]

export default function App() {
  const [wins, setWins] = useState({ welcome: { open: true, min: false } })
  const [order, setOrder] = useState(['welcome'])
  const [clock, setClock] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const updateClock = () => setClock(new Date().toTimeString().slice(0, 8))
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 820)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const focus = id => setOrder(current => [...current.filter(x => x !== id), id])
  const open = id => { setWins(c => ({ ...c, [id]: { open: true, min: false } })); focus(id) }
  const close = id => setWins(c => ({ ...c, [id]: { open: false, min: false } }))
  const minimize = id => setWins(c => ({ ...c, [id]: { open: true, min: true } }))

  const top = order[order.length - 1]
  const activeMenu = wins[top]?.open && !wins[top]?.min ? apps[top]?.menu : null

  if (booting) {
    return (
      <div className="boot">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring}
        >
          <h1>JAYDEEP.OS</h1>
          <p className="mono">Loading system modules...</p>
          <motion.div className="boot-bar">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="desk">
      <Scanlines />
      <header className="menubar">
        <b>Jaydeep.OS v1.0</b>
        {!isMobile && ['File', 'Edit', 'View', 'Special', 'Help'].map(menu => (
          <span key={menu} className={menu === activeMenu ? 'on' : ''}>{menu}</span>
        ))}
        <span className="grow" />
        {!isMobile && <span className="pill">DEV MODE: READY</span>}
        <span className="pill">{clock.slice(0, 5)}</span>
      </header>

      <nav className="icons">
        {desktopIcons.map(([Icon, label, id], i) => (
          <motion.button
            key={label}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...spring, delay: 0.1 + i * 0.05 }}
            whileHover={{ scale: 1.12, y: -4 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => open(id)}
          >
            <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}>
              <Icon size={isMobile ? 32 : 38} />
            </motion.div>
            <span>{label}</span>
          </motion.button>
        ))}
      </nav>

      <AnimatePresence>
        {Object.entries(wins).filter(([, s]) => s.open && !s.min).map(([id]) => {
          const { t, C } = apps[id]
          return (
            <motion.section
              key={id}
              className="win"
              style={{ zIndex: 10 + order.indexOf(id) }}
              drag={!isMobile}
              dragMomentum={false}
              dragListener={false}
              dragConstraints={{ left: -200, right: 200, top: -50, bottom: 200 }}
              initial={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' }}
              transition={spring}
              onPointerDown={() => focus(id)}
            >
              <div
                className="title"
                onPointerDown={event => {
                  if (isMobile) return
                  const section = event.currentTarget.parentNode
                  section.dispatchEvent(new PointerEvent('pointerdown', event.nativeEvent))
                }}
              >
                <span>{t}</span>
                <span className="ctl">
                  <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} aria-label="Minimize" onClick={() => minimize(id)}>_</motion.button>
                  <motion.button whileHover={{ scale: 1.2, backgroundColor: '#ff5555' }} whileTap={{ scale: 0.9 }} aria-label="Close" onClick={() => close(id)}>×</motion.button>
                </span>
              </div>
              <div className="body">
                {C ? <C open={open} /> : null}
              </div>
              <footer className="status">
                Ready. | C:\JAYDEEP_OS\{apps[id].tab.toUpperCase()}
                <span className="grow" />
                PORTFOLIO BUILD | ONLINE
              </footer>
            </motion.section>
          )
        })}
      </AnimatePresence>

      <footer className="taskbar">
        <motion.button className="start" onClick={() => open('welcome')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Start
        </motion.button>
        <div className="taskbar-apps">
          {Object.entries(apps).map(([id, app]) => (
            <motion.button
              key={id}
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -2 }}
              className={wins[id]?.open && !wins[id]?.min && top === id ? 'on' : ''}
              onClick={() => wins[id]?.open && !wins[id]?.min && top === id ? minimize(id) : open(id)}
            >
              {app.tab}
            </motion.button>
          ))}
        </div>
        <span className="grow" />
        <span className="pill mono">{clock}</span>
      </footer>
    </div>
  )
}