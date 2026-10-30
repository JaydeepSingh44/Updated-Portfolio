// Smooth-UI / Unlumen-style motion primitives
import { motion, useMotionValue, useSpring, animate, useInView, useTransform, useScroll, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export const spring = { type: 'spring', stiffness: 380, damping: 30, mass: 0.7 }
export const softSpring = { type: 'spring', stiffness: 200, damping: 25, mass: 0.8 }
export const bouncy = { type: 'spring', stiffness: 500, damping: 15, mass: 0.5 }

// Magnetic button with glow + ripple
export function SmoothButton({ children, className = '', ...p }) {
  const prefersReduced = useReducedMotion()
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 20 })
  const sy = useSpring(y, { stiffness: 300, damping: 20 })
  const [ripple, setRipple] = useState(null)

  const handleClick = e => {
    const r = e.currentTarget.getBoundingClientRect()
    setRipple({ x: e.clientX - r.left, y: e.clientY - r.top, id: Date.now() })
    setTimeout(() => setRipple(null), 600)
    p.onClick?.(e)
  }

  return (
    <motion.button
      className={'btn ' + className}
      style={{ x: prefersReduced ? 0 : sx, y: prefersReduced ? 0 : sy, position: 'relative', overflow: 'hidden' }}
      onMouseMove={e => {
        if (prefersReduced) return
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * 0.15)
        y.set((e.clientY - r.top - r.height / 2) * 0.25)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.04 }}
      transition={spring}
      {...p}
      onClick={handleClick}
    >
      {children}
      {ripple && (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40, height: 40,
            borderRadius: '50%',
            background: 'currentColor',
            pointerEvents: 'none',
          }}
        />
      )}
    </motion.button>
  )
}

export function CountUp({ to, decimals = 0 }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (inView) {
      const c = animate(0, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: setV })
      return () => c.stop()
    }
  }, [inView, to])
  return <span ref={ref}>{v.toFixed(decimals)}</span>
}

export function Stagger({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial="h"
      animate="s"
      variants={{ s: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  )
}

export const Item = ({ children, className = '', ...p }) => (
  <motion.div
    className={className}
    variants={{
      h: { opacity: 0, y: 20, filter: 'blur(4px)' },
      s: { opacity: 1, y: 0, filter: 'blur(0px)', transition: spring },
    }}
    {...p}
  >
    {children}
  </motion.div>
)

// Typewriter with blinking cursor & sound-like effect
export function TypeText({ lines }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n < lines.length) {
      const t = setTimeout(() => setN(n + 1), 650)
      return () => clearTimeout(t)
    }
  }, [n, lines.length])
  return (
    <>
      {lines.slice(0, n).map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -12, filter: 'blur(2px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.3 }}
        >
          {l}
        </motion.div>
      ))}
      <motion.span
        className="cur"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </>
  )
}

// Animated bar graph
export function Bar({ pct, color = 'var(--teal)', segs = 10 }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <div className="bar" ref={ref}>
      {Array.from({ length: segs }).map((_, i) => (
        <motion.i
          key={i}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={inView ? { scaleY: 1, opacity: 1 } : {}}
          transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 20 }}
          style={{ background: i < Math.round(pct / 100 * segs) ? color : undefined }}
        />
      ))}
    </div>
  )
}

// 3D tilt card on hover
export function TiltCard({ children, className = '', max = 10 }) {
  const prefersReduced = useReducedMotion()
  const x = useMotionValue(0), y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), { stiffness: 300, damping: 20 })
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), { stiffness: 300, damping: 20 })

  return (
    <motion.div
      className={className}
      style={{ rotateX: prefersReduced ? 0 : rx, rotateY: prefersReduced ? 0 : ry, transformStyle: 'preserve-3d' }}
      onMouseMove={e => {
        if (prefersReduced) return
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left) / r.width - 0.5)
        y.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.div>
  )
}

// Scroll reveal wrapper
export function Reveal({ children, className = '', y = 30, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ ...softSpring, delay }}
    >
      {children}
    </motion.div>
  )
}

// Glitch text effect
export function GlitchText({ children, className = '' }) {
  return (
    <motion.span
      className={'glitch ' + className}
      data-text={typeof children === 'string' ? children : ''}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
    >
      {children}
    </motion.span>
  )
}

// CRT scanline overlay (purely decorative)
export function Scanlines() {
  return <div className="scanlines" aria-hidden />
}

// Floating badge/chip
export function FloatChip({ children, className = '' }) {
  return (
    <motion.span
      className={'chip ' + className}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.span>
  )
}

// Parallax decoration
export function Parallax({ children, speed = 0.2 }) {
  const ref = useRef()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [50 * speed, -50 * speed])
  return <motion.div ref={ref} style={{ y }}>{children}</motion.div>
}