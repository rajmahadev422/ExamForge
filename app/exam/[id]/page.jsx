'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../_components_/Navbar'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

function getPaper(id) {
  return (JSON.parse(localStorage.getItem('examforge_papers') || '[]')).find(p => p.id === id) || null
}

function formatTime(s) {
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

export default function ExamPage() {
  const { id } = useParams()
  const router = useRouter()
  const [paper, setPaper] = useState(null)
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [pwError, setPwError] = useState('')
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [marked, setMarked] = useState({})
  const [numInput, setNumInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showPalette, setShowPalette] = useState(true)
  const timerRef = useRef(null)

  useEffect(() => {
    const p = getPaper(id)
    if (!p) router.push('/'); else { setPaper(p); setTimeLeft(p.timeMinutes * 60) }
  }, [id])

  const submitExam = useCallback(() => {
    clearInterval(timerRef.current); setSubmitted(true); setShowSubmitModal(false)
  }, [])

  useEffect(() => {
    if (!started || submitted) return
    timerRef.current = setInterval(() => setTimeLeft(t => { if (t <= 1) { submitExam(); return 0 } return t - 1 }), 1000)
    return () => clearInterval(timerRef.current)
  }, [started, submitted, submitExam])

  if (!paper) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',color:'var(--text-dim)' }}>Loading...</div>

  if (!unlocked) {
    const totalMarks = paper.questions.reduce((s, q) => s + q.marks, 0)
    return (
      <div style={{ minHeight:'100vh',position:'relative',zIndex:1 }}>
        <Navbar />
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 60px)',padding:'24px' }}>
          <div className="card animate-fade-up" style={{ width:'100%',maxWidth:'420px',padding:'40px' }}>
            <div style={{ textAlign:'center',marginBottom:'32px' }}>
              <div style={{ fontSize:'40px',marginBottom:'12px' }}>⚡</div>
              <h1 style={{ fontWeight:'800',fontSize:'22px',marginBottom:'6px' }}>{paper.title}</h1>
              {paper.subject && <p style={{ color:'var(--text-dim)',fontSize:'14px' }}>{paper.subject}</p>}
              <div style={{ display:'flex',gap:'12px',justifyContent:'center',marginTop:'12px' }}>
                <span className="mono" style={{ fontSize:'13px',color:'var(--text-dim)' }}>{paper.questions.length}Q</span>
                <span style={{ color:'var(--text-dimmer)' }}>·</span>
                <span className="mono" style={{ fontSize:'13px',color:'var(--text-dim)' }}>{paper.timeMinutes}min</span>
                <span style={{ color:'var(--text-dimmer)' }}>·</span>
                <span className="mono" style={{ fontSize:'13px',color:'var(--text-dim)' }}>{totalMarks}marks</span>
              </div>
            </div>
            <form onSubmit={e => { e.preventDefault(); if (password===paper.password){setUnlocked(true);setPwError('')}else setPwError('Incorrect password') }} style={{ display:'flex',flexDirection:'column',gap:'12px' }}>
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="Enter exam password" value={password} onChange={e=>setPassword(e.target.value)} autoFocus />
                {pwError && <p style={{ color:'var(--accent2)',fontSize:'13px',marginTop:'6px' }}>⚠ {pwError}</p>}
              </div>
              <button type="submit" className="btn btn-primary" style={{ width:'100%',padding:'12px' }}>Enter Exam</button>
              <Link href={`/paper/${id}`} style={{ textDecoration:'none' }}>
                <button type="button" className="btn btn-ghost" style={{ width:'100%' }}>View Paper Instead</button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (!started) {
    const totalMarks = paper.questions.reduce((s, q) => s + q.marks, 0)
    const mcqCount = paper.questions.filter(q => q.type==='mcq').length
    const numCount = paper.questions.filter(q => q.type==='numerical').length
    return (
      <div style={{ minHeight:'100vh',position:'relative',zIndex:1 }}>
        <Navbar title={paper.title} />
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 60px)',padding:'24px' }}>
          <div className="card animate-fade-up" style={{ width:'100%',maxWidth:'560px',padding:'48px' }}>
            <h1 style={{ fontWeight:'800',fontSize:'28px',marginBottom:'4px' }}>{paper.title}</h1>
            {paper.subject && <p style={{ color:'var(--text-dim)',marginBottom:'32px' }}>{paper.subject}</p>}
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'32px' }}>
              {[{ icon:'📝',label:'Total Questions',val:paper.questions.length },{ icon:'⏱',label:'Duration',val:`${paper.timeMinutes} min` },{ icon:'🎯',label:'Maximum Marks',val:totalMarks },{ icon:'🔤',label:'MCQ / Numerical',val:`${mcqCount} / ${numCount}` }].map(s => (
                <div key={s.label} style={{ padding:'16px',borderRadius:'10px',background:'var(--bg3)',border:'1px solid var(--border)' }}>
                  <div style={{ fontSize:'20px',marginBottom:'4px' }}>{s.icon}</div>
                  <div className="mono" style={{ fontSize:'20px',fontWeight:'700',marginBottom:'2px' }}>{s.val}</div>
                  <div style={{ fontSize:'12px',color:'var(--text-dimmer)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ padding:'16px',borderRadius:'10px',background:'rgba(108,99,255,0.06)',border:'1px solid rgba(108,99,255,0.2)',marginBottom:'28px',fontSize:'13px',lineHeight:'1.8',color:'var(--text-dim)' }}>
              <strong style={{ color:'var(--text)',display:'block',marginBottom:'6px' }}>Instructions:</strong>
              • Each MCQ has only one correct option<br />
              • Numerical answers must be integers<br />
              • You can mark questions for review and return later<br />
              • Timer starts when you click "Begin Exam"<br />
              • Submit before time runs out
            </div>
            <div style={{ display:'flex',gap:'12px' }}>
              <button className="btn btn-primary" style={{ flex:1,padding:'14px',fontSize:'16px' }} onClick={() => setStarted(true)}>⚡ Begin Exam</button>
              <Link href={`/paper/${id}`} style={{ textDecoration:'none' }}>
                <button className="btn btn-outline" style={{ padding:'14px 20px' }}>View Paper</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Results ──
  if (submitted) {
    const results = paper.questions.map((q, i) => {
      const ans = answers[i]
      let status = 'unattempted', scoreGain = 0
      if (ans !== undefined && ans !== null && ans !== '') {
        if (q.type==='mcq') { if (ans===q.correct){status='correct';scoreGain=q.marks}else{status='wrong';scoreGain=-q.negativeMarks} }
        else { if (Number(ans)===Number(q.correct)){status='correct';scoreGain=q.marks}else{status='wrong';scoreGain=-q.negativeMarks} }
      }
      return { ...q, ans, status, scoreGain, idx: i }
    })
    const correct = results.filter(r=>r.status==='correct').length
    const wrong   = results.filter(r=>r.status==='wrong').length
    const unattempted = results.filter(r=>r.status==='unattempted').length
    const totalScore = results.reduce((s,r)=>s+r.scoreGain,0)
    const maxScore = paper.questions.reduce((s,q)=>s+q.marks,0)
    const pct = Math.round((totalScore/maxScore)*100)

    return (
      <div style={{ minHeight:'100vh',position:'relative',zIndex:1 }}>
        <Navbar title="Result" subtitle={`— ${paper.title}`} />
        <div style={{ maxWidth:'900px',margin:'0 auto',padding:'40px 24px' }}>
          <div className="card animate-fade-up" style={{ padding:'40px',marginBottom:'32px',textAlign:'center' }}>
            <div style={{ fontSize:'14px',color:'var(--text-dim)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'8px' }}>Your Score</div>
            <div className="mono" style={{ fontSize:'64px',fontWeight:'700',color:totalScore>=0?'var(--accent3)':'var(--accent2)',lineHeight:1 }}>{totalScore}</div>
            <div style={{ color:'var(--text-dim)',fontSize:'18px',marginBottom:'32px' }}>out of {maxScore}</div>
            <div style={{ display:'flex',gap:'32px',justifyContent:'center',marginBottom:'32px' }}>
              {[{ label:'Correct',val:correct,color:'var(--accent3)' },{ label:'Wrong',val:wrong,color:'var(--accent2)' },{ label:'Unattempted',val:unattempted,color:'var(--text-dim)' },{ label:'Accuracy',val:`${correct+wrong>0?Math.round((correct/(correct+wrong))*100):0}%`,color:'var(--accent4)' }].map(s => (
                <div key={s.label}>
                  <div className="mono" style={{ fontSize:'28px',fontWeight:'700',color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:'12px',color:'var(--text-dimmer)',textTransform:'uppercase',letterSpacing:'0.06em' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ maxWidth:'400px',margin:'0 auto' }}>
              <div className="progress-bar"><div className="progress-fill" style={{ width:`${Math.max(0,pct)}%` }} /></div>
              <div style={{ display:'flex',justifyContent:'space-between',marginTop:'6px',fontSize:'12px',color:'var(--text-dim)' }}>
                <span>0</span><span>{pct}% scored</span><span>{maxScore}</span>
              </div>
            </div>
          </div>

          <h2 style={{ fontWeight:'700',fontSize:'18px',marginBottom:'16px' }}>Question-wise Analysis</h2>
          <div style={{ display:'flex',flexDirection:'column',gap:'12px' }}>
            {results.map((r, i) => (
              <div key={r.id} className="card" style={{ padding:'20px',borderLeft:`3px solid ${r.status==='correct'?'var(--accent3)':r.status==='wrong'?'var(--accent2)':'var(--border)'}` }}>
                <div style={{ display:'flex',alignItems:'flex-start',gap:'16px' }}>
                  <div style={{ minWidth:'60px' }}>
                    <span className="mono" style={{ fontSize:'16px',fontWeight:'700',color:'var(--accent)' }}>Q{i+1}</span>
                    <div style={{ fontSize:'10px',color:r.status==='correct'?'var(--accent3)':r.status==='wrong'?'var(--accent2)':'var(--text-dim)',textTransform:'uppercase',letterSpacing:'0.05em',marginTop:'4px',fontWeight:'700' }}>
                      {r.status==='correct'?'✓ Correct':r.status==='wrong'?'✗ Wrong':'○ Skip'}
                    </div>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:'14px',lineHeight:'1.5',marginBottom:'10px' }}>{r.question}</p>
                    {r.type==='mcq' ? (
                      <div style={{ display:'flex',gap:'10px',flexWrap:'wrap' }}>
                        {r.options.map((opt,j) => (
                          <div key={j} style={{ padding:'6px 12px',borderRadius:'6px',fontSize:'13px',display:'flex',alignItems:'center',gap:'6px', background:j===r.correct?'rgba(0,212,170,0.08)':r.ans===j&&j!==r.correct?'rgba(255,107,107,0.08)':'var(--bg3)', border:`1px solid ${j===r.correct?'var(--accent3)':r.ans===j&&j!==r.correct?'var(--accent2)':'var(--border)'}` }}>
                            <span style={{ fontFamily:'Space Mono,monospace',fontSize:'11px',fontWeight:'700',color:j===r.correct?'var(--accent3)':'var(--text-dim)' }}>{LETTERS[j]}</span>
                            {opt}
                            {j===r.correct && <span style={{ color:'var(--accent3)',fontSize:'11px' }}>✓</span>}
                            {r.ans===j&&j!==r.correct && <span style={{ color:'var(--accent2)',fontSize:'11px' }}>← Your ans</span>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize:'13px',color:'var(--text-dim)',display:'flex',gap:'16px' }}>
                        <span>Your answer: <strong className="mono" style={{ color:r.status==='correct'?'var(--accent3)':'var(--accent2)' }}>{r.ans??'—'}</strong></span>
                        <span>Correct: <strong className="mono" style={{ color:'var(--accent3)' }}>{r.correct}</strong></span>
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign:'right',minWidth:'60px' }}>
                    <span className="mono" style={{ fontSize:'18px',fontWeight:'700',color:r.scoreGain>0?'var(--accent3)':r.scoreGain<0?'var(--accent2)':'var(--text-dim)' }}>
                      {r.scoreGain>0?'+':''}{r.scoreGain}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex',gap:'12px',marginTop:'32px',paddingBottom:'40px' }}>
            <Link href={`/exam/${id}`} style={{ textDecoration:'none' }}><button className="btn btn-primary" style={{ padding:'12px 24px' }}>🔄 Retake</button></Link>
            <Link href={`/paper/${id}`} style={{ textDecoration:'none' }}><button className="btn btn-outline" style={{ padding:'12px 24px' }}>View Paper</button></Link>
            <Link href="/" style={{ textDecoration:'none' }}><button className="btn btn-ghost" style={{ padding:'12px 24px' }}>← Home</button></Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Live Exam ──
  const q = paper.questions[current]
  const answered = Object.keys(answers).filter(k => answers[k]!==null && answers[k]!==undefined && answers[k]!=='').length
  const totalQ = paper.questions.length
  const timerClass = timeLeft<=60?'timer timer-danger':timeLeft<=300?'timer timer-warn':'timer'

  const goTo = (idx) => {
    if (q.type==='numerical') setAnswers(prev=>({...prev,[current]:numInput}))
    setCurrent(idx)
    const nextQ = paper.questions[idx]
    if (nextQ.type==='numerical') setNumInput(answers[idx]??'')
  }
  const getStatus = (idx) => {
    if (idx===current) return 'current'
    if (marked[idx]) return 'marked'
    const a = answers[idx]
    if (a!==null&&a!==undefined&&a!=='') return 'answered'
    return 'unanswered'
  }
  const saveAndNext = () => {
    if (q.type==='numerical') setAnswers(prev=>({...prev,[current]:numInput}))
    if (current<totalQ-1) goTo(current+1)
  }
  const clearResponse = () => { setAnswers(prev=>({...prev,[current]:undefined})); if(q.type==='numerical') setNumInput('') }
  const toggleMark = () => setMarked(prev=>({...prev,[current]:!prev[current]}))

  return (
    <div style={{ minHeight:'100vh',display:'flex',flexDirection:'column',position:'relative',zIndex:1 }}>
      {/* Exam header */}
      <header style={{ height:'60px',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',borderBottom:'1px solid var(--border)',background:'var(--header-bg)',backdropFilter:'blur(12px)',position:'sticky',top:0,zIndex:100,transition:'background 0.25s' }}>
        <div style={{ display:'flex',alignItems:'center',gap:'12px' }}>
          <div style={{ width:'28px',height:'28px',borderRadius:'6px',background:'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px' }}>⚡</div>
          <div>
            <div style={{ fontWeight:'700',fontSize:'14px',lineHeight:1 }}>{paper.title}</div>
            <div style={{ fontSize:'11px',color:'var(--text-dim)',marginTop:'2px' }}>{answered}/{totalQ} answered</div>
          </div>
        </div>
        <span className={timerClass}>{formatTime(timeLeft)}</span>
        <div style={{ display:'flex',gap:'8px',alignItems:'center' }}>
          {/* theme toggle inline */}
          <ThemeToggleInline />
          <button className="btn btn-outline" style={{ fontSize:'13px',padding:'7px 14px' }} onClick={()=>setShowPalette(!showPalette)}>
            {showPalette?'Hide Palette':'Show Palette'}
          </button>
          <button className="btn btn-danger" style={{ fontSize:'13px',padding:'7px 16px',background:'rgba(255,107,107,0.12)' }} onClick={()=>setShowSubmitModal(true)}>Submit</button>
        </div>
      </header>

      <div className="progress-bar" style={{ borderRadius:0 }}>
        <div className="progress-fill" style={{ width:`${(answered/totalQ)*100}%` }} />
      </div>

      <div style={{ display:'flex',flex:1,overflow:'hidden' }}>
        {/* Question area */}
        <div style={{ flex:1,overflowY:'auto',padding:'32px 40px' }}>
          <div className="animate-slide-in" key={current}>
            <div style={{ display:'flex',alignItems:'center',gap:'12px',marginBottom:'24px' }}>
              <span className="mono" style={{ fontSize:'28px',fontWeight:'800',color:'var(--accent)' }}>Q{current+1}</span>
              <span style={{ color:'var(--text-dimmer)',fontSize:'16px' }}>/ {totalQ}</span>
              <span className={`tag tag-${q.type==='mcq'?'mcq':'num'}`}>{q.type==='mcq'?'MCQ':'Numerical'}</span>
              {marked[current] && <span className="tag" style={{ background:'rgba(255,209,102,0.1)',color:'var(--accent4)',border:'1px solid rgba(255,209,102,0.3)' }}>🔖 Marked</span>}
              <div style={{ marginLeft:'auto',display:'flex',gap:'16px',fontSize:'13px',color:'var(--text-dim)' }}>
                <span>+{q.marks}</span><span style={{ color:'var(--accent2)' }}>−{q.negativeMarks}</span>
              </div>
            </div>

            <div style={{ fontSize:'18px',lineHeight:'1.7',marginBottom:'32px',fontWeight:'500' }}>{q.question}</div>

            {q.type==='mcq' && (
              <div style={{ display:'flex',flexDirection:'column',gap:'12px',marginBottom:'32px' }}>
                {q.options.map((opt,j) => (
                  <button key={j} className={`option-btn${answers[current]===j?' selected':''}`} onClick={()=>setAnswers(prev=>({...prev,[current]:j}))}>
                    <span className="option-letter">{LETTERS[j]}</span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            )}

            {q.type==='numerical' && (
              <div style={{ marginBottom:'32px' }}>
                <label className="label">Enter your answer</label>
                <input className="input mono" type="number" placeholder="Type the numerical answer..." value={numInput} onChange={e=>{setNumInput(e.target.value);setAnswers(prev=>({...prev,[current]:e.target.value}))}} style={{ maxWidth:'280px',fontSize:'20px',padding:'14px 18px' }} autoFocus />
              </div>
            )}

            <div style={{ display:'flex',gap:'10px',flexWrap:'wrap' }}>
              <button className="btn btn-outline" onClick={toggleMark} style={{ fontSize:'13px' }}>{marked[current]?'🔖 Unmark':'🔖 Mark for Review'}</button>
              <button className="btn btn-ghost" onClick={clearResponse} style={{ fontSize:'13px' }}>↺ Clear</button>
              <div style={{ marginLeft:'auto',display:'flex',gap:'10px' }}>
                {current>0 && <button className="btn btn-outline" onClick={()=>goTo(current-1)} style={{ fontSize:'13px' }}>← Prev</button>}
                {current<totalQ-1
                  ? <button className="btn btn-primary" onClick={saveAndNext} style={{ fontSize:'13px' }}>Save & Next →</button>
                  : <button className="btn btn-success" onClick={()=>setShowSubmitModal(true)} style={{ fontSize:'13px' }}>Submit Exam ✓</button>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Palette */}
        {showPalette && (
          <div style={{ width:'220px',borderLeft:'1px solid var(--border)',background:'var(--bg2)',padding:'20px',overflowY:'auto',flexShrink:0,transition:'background 0.25s' }}>
            <div style={{ fontWeight:'700',fontSize:'12px',textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--text-dim)',marginBottom:'14px' }}>Question Palette</div>
            <div style={{ display:'flex',flexDirection:'column',gap:'5px',marginBottom:'14px',fontSize:'11px',color:'var(--text-dim)' }}>
              {[{cls:'qp-unanswered',label:'Not visited'},{cls:'qp-answered',label:'Answered'},{cls:'qp-marked',label:'Marked'},{cls:'qp-current',label:'Current'}].map(l=>(
                <div key={l.label} style={{ display:'flex',alignItems:'center',gap:'8px' }}>
                  <div className={`qp-btn ${l.cls}`} style={{ width:'16px',height:'16px',borderRadius:'3px',fontSize:'8px',flexShrink:0 }} />
                  <span>{l.label}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'5px' }}>
              {paper.questions.map((_,i) => (
                <button key={i} className={`qp-btn qp-${getStatus(i)}`} onClick={()=>goTo(i)}>{i+1}</button>
              ))}
            </div>
            <div style={{ marginTop:'18px',paddingTop:'14px',borderTop:'1px solid var(--border)' }}>
              {[{label:'Answered',val:answered,color:'var(--accent3)'},{label:'Marked',val:Object.values(marked).filter(Boolean).length,color:'var(--accent4)'},{label:'Remaining',val:totalQ-answered,color:'var(--text-dim)'}].map(s=>(
                <div key={s.label} style={{ display:'flex',justifyContent:'space-between',marginBottom:'7px',fontSize:'13px' }}>
                  <span style={{ color:'var(--text-dim)' }}>{s.label}</span>
                  <span className="mono" style={{ fontWeight:'700',color:s.color }}>{s.val}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-danger" style={{ width:'100%',marginTop:'12px',fontSize:'13px',background:'rgba(255,107,107,0.08)' }} onClick={()=>setShowSubmitModal(true)}>Submit</button>
          </div>
        )}
      </div>

      {showSubmitModal && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:300 }}>
          <div className="card animate-fade-up" style={{ padding:'40px',maxWidth:'380px',width:'100%',margin:'24px' }}>
            <h3 style={{ fontWeight:'800',fontSize:'22px',marginBottom:'8px' }}>Submit Exam?</h3>
            <div style={{ display:'flex',flexDirection:'column',gap:'8px',margin:'20px 0',padding:'16px',borderRadius:'8px',background:'var(--bg3)' }}>
              {[{label:'Answered',val:answered,color:'var(--accent3)'},{label:'Not Answered',val:totalQ-answered,color:'var(--accent2)'},{label:'Marked',val:Object.values(marked).filter(Boolean).length,color:'var(--accent4)'}].map(s=>(
                <div key={s.label} style={{ display:'flex',justifyContent:'space-between',fontSize:'14px' }}>
                  <span style={{ color:'var(--text-dim)' }}>{s.label}</span>
                  <span className="mono" style={{ fontWeight:'700',color:s.color }}>{s.val}</span>
                </div>
              ))}
            </div>
            <p style={{ color:'var(--text-dim)',fontSize:'13px',marginBottom:'24px' }}>This action cannot be undone.</p>
            <div style={{ display:'flex',gap:'12px' }}>
              <button className="btn btn-outline" style={{ flex:1 }} onClick={()=>setShowSubmitModal(false)}>Cancel</button>
              <button className="btn btn-success" style={{ flex:1 }} onClick={submitExam}>Submit Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Inline mini theme toggle for exam header (can't use Navbar there)
function ThemeToggleInline() {
  const [theme, setThemeState] = useState('dark')
  useEffect(() => {
    setThemeState(document.documentElement.getAttribute('data-theme') || 'dark')
  }, [])
  const toggle = () => {
    const next = theme==='dark'?'light':'dark'
    setThemeState(next)
    localStorage.setItem('examforge_theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }
  return (
    <button className="theme-toggle" onClick={toggle} title="Toggle theme" style={{ width:'36px',height:'36px' }}>
      {theme==='dark'?'☀️':'🌙'}
    </button>
  )
}
