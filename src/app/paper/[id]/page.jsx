'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../../_components_/Navbar'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

function getPaper(id) {
  return (JSON.parse(localStorage.getItem('examforge_papers') || '[]')).find(p => p.id === id) || null
}

export default function PaperPage() {
  const { id } = useParams()
  const router = useRouter()
  const [paper, setPaper] = useState(null)
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [pwError, setPwError] = useState('')
  const [showAnswers, setShowAnswers] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    const p = getPaper(id)
    if (!p) router.push('/'); else setPaper(p)
  }, [id])

  if (!paper) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',color:'var(--text-dim)' }}>Loading...</div>

  const handleUnlock = (e) => {
    e.preventDefault()
    if (password === paper.password) { setUnlocked(true); setPwError('') }
    else setPwError('Incorrect password')
  }

  const deletePaper = () => {
    const papers = JSON.parse(localStorage.getItem('examforge_papers') || '[]')
    localStorage.setItem('examforge_papers', JSON.stringify(papers.filter(p => p.id !== id)))
    router.push('/')
  }

  const totalMarks = paper.questions.reduce((s, q) => s + q.marks, 0)
  const mcqCount = paper.questions.filter(q => q.type === 'mcq').length
  const numCount = paper.questions.filter(q => q.type === 'numerical').length

  if (!unlocked) return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <Navbar />
      <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 60px)',padding:'24px' }}>
        <div className="card animate-fade-up" style={{ width:'100%',maxWidth:'400px',padding:'40px' }}>
          <div style={{ textAlign:'center',marginBottom:'32px' }}>
            <div style={{ fontSize:'40px',marginBottom:'12px' }}>🔒</div>
            <h1 style={{ fontWeight:'800',fontSize:'22px',marginBottom:'6px' }}>{paper.title}</h1>
            {paper.subject && <p style={{ color:'var(--text-dim)',fontSize:'14px' }}>{paper.subject}</p>}
            <div style={{ display:'flex',gap:'12px',justifyContent:'center',marginTop:'12px' }}>
              <span className="mono" style={{ fontSize:'13px',color:'var(--text-dim)' }}>{paper.questions.length} Questions</span>
              <span style={{ color:'var(--text-dimmer)' }}>·</span>
              <span className="mono" style={{ fontSize:'13px',color:'var(--text-dim)' }}>{paper.timeMinutes} min</span>
              <span style={{ color:'var(--text-dimmer)' }}>·</span>
              <span className="mono" style={{ fontSize:'13px',color:'var(--text-dim)' }}>{totalMarks} marks</span>
            </div>
          </div>
          <form onSubmit={handleUnlock} style={{ display:'flex',flexDirection:'column',gap:'12px' }}>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="Enter exam password" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
              {pwError && <p style={{ color:'var(--accent2)',fontSize:'13px',marginTop:'6px' }}>⚠ {pwError}</p>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width:'100%',padding:'12px' }}>Unlock Paper</button>
            <Link href="/" style={{ textDecoration:'none' }}>
              <button type="button" className="btn btn-ghost" style={{ width:'100%' }}>← Back to Home</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh',position:'relative',zIndex:1 }}>
      <Navbar
        title={paper.title}
        subtitle={paper.subject ? `— ${paper.subject}` : ''}
        right={
          <>
            <button className="btn btn-outline" style={{ fontSize:'13px' }} onClick={() => setShowAnswers(!showAnswers)}>
              {showAnswers ? '🙈 Hide Answers' : '👁 Show Answers'}
            </button>
            <Link href={`/exam/${id}`} style={{ textDecoration:'none' }}>
              <button className="btn btn-primary" style={{ fontSize:'13px' }}>⚡ Start Exam</button>
            </Link>
            <button className="btn btn-danger" style={{ fontSize:'13px' }} onClick={() => setDeleteConfirm(true)}>🗑</button>
          </>
        }
      />

      {deleteConfirm && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:300 }}>
          <div className="card animate-fade-up" style={{ padding:'32px',maxWidth:'360px',textAlign:'center' }}>
            <div style={{ fontSize:'32px',marginBottom:'12px' }}>⚠️</div>
            <h3 style={{ fontWeight:'700',marginBottom:'8px' }}>Delete Paper?</h3>
            <p style={{ color:'var(--text-dim)',fontSize:'14px',marginBottom:'24px' }}>This cannot be undone.</p>
            <div style={{ display:'flex',gap:'10px',justifyContent:'center' }}>
              <button className="btn btn-outline" onClick={() => setDeleteConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" style={{ background:'rgba(255,107,107,0.15)' }} onClick={deletePaper}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth:'860px',margin:'0 auto',padding:'40px 24px' }}>
        {/* Info card */}
        <div className="card animate-fade-up" style={{ padding:'28px',marginBottom:'32px' }}>
          <div style={{ display:'flex',gap:'32px',alignItems:'center',flexWrap:'wrap' }}>
            <div style={{ flex:1 }}>
              <h1 style={{ fontWeight:'800',fontSize:'26px',letterSpacing:'-0.02em',marginBottom:'4px' }}>{paper.title}</h1>
              {paper.subject && <p style={{ color:'var(--text-dim)',fontSize:'15px' }}>{paper.subject}</p>}
            </div>
            <div style={{ display:'flex',gap:'24px' }}>
              {[{ label:'Questions',val:paper.questions.length,color:'var(--text)' },{ label:'MCQ',val:mcqCount,color:'var(--accent)' },{ label:'Numerical',val:numCount,color:'var(--accent3)' },{ label:'Duration',val:`${paper.timeMinutes}m`,color:'var(--accent4)' },{ label:'Max Marks',val:totalMarks,color:'var(--accent3)' }].map(s => (
                <div key={s.label} style={{ textAlign:'center' }}>
                  <div className="mono" style={{ fontSize:'20px',fontWeight:'700',color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:'10px',color:'var(--text-dimmer)',textTransform:'uppercase',letterSpacing:'0.06em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop:'20px',paddingTop:'16px',borderTop:'1px solid var(--border)',display:'flex',gap:'20px',fontSize:'13px',color:'var(--text-dim)' }}>
            <span>✓ Correct: <strong style={{ color:'var(--accent3)' }}>+marks</strong></span>
            <span>✗ Wrong MCQ: <strong style={{ color:'var(--accent2)' }}>−marks</strong></span>
            <span>○ Unattempted: <strong>0</strong></span>
          </div>
        </div>

        {/* Questions */}
        <div style={{ display:'flex',flexDirection:'column',gap:'20px' }}>
          {paper.questions.map((q, i) => (
            <div key={q.id} className="card animate-fade-up" style={{ padding:'24px' }}>
              <div style={{ display:'flex',alignItems:'flex-start',gap:'16px' }}>
                <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'8px',minWidth:'40px' }}>
                  <span className="mono" style={{ fontSize:'18px',fontWeight:'700',color:'var(--accent)' }}>Q{i+1}</span>
                  <span className={`tag tag-${q.type==='mcq'?'mcq':'num'}`}>{q.type==='mcq'?'MCQ':'NUM'}</span>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:'16px',lineHeight:'1.6',marginBottom:'16px',fontWeight:'500' }}>{q.question}</p>
                  {q.type === 'mcq' && (
                    <div style={{ display:'flex',flexDirection:'column',gap:'8px' }}>
                      {q.options.map((opt, j) => (
                        <div key={j} style={{ padding:'10px 14px',borderRadius:'8px',display:'flex',alignItems:'center',gap:'12px', background: showAnswers&&q.correct===j ? 'rgba(0,212,170,0.08)' : 'var(--bg3)', border:`1px solid ${showAnswers&&q.correct===j?'var(--accent3)':'var(--border)'}` }}>
                          <span style={{ width:'24px',height:'24px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center', background:showAnswers&&q.correct===j?'var(--accent3)':'var(--bg)', border:`1px solid ${showAnswers&&q.correct===j?'var(--accent3)':'var(--border)'}`, fontSize:'11px',fontWeight:'700',color:showAnswers&&q.correct===j?'#fff':'var(--text-dim)', fontFamily:'Space Mono,monospace',flexShrink:0 }}>{LETTERS[j]}</span>
                          <span style={{ fontSize:'14px',color:showAnswers&&q.correct===j?'var(--accent3)':'var(--text)' }}>{opt}</span>
                          {showAnswers&&q.correct===j && <span style={{ marginLeft:'auto',fontSize:'12px',color:'var(--accent3)',fontWeight:'600' }}>✓ Correct</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  {q.type === 'numerical' && (
                    <div style={{ padding:'12px 16px',borderRadius:'8px',background:'var(--bg3)',border:'1px solid var(--border)',display:'inline-flex',alignItems:'center',gap:'10px' }}>
                      <span style={{ fontSize:'13px',color:'var(--text-dim)' }}>Answer:</span>
                      {showAnswers
                        ? <span className="mono" style={{ fontSize:'18px',fontWeight:'700',color:'var(--accent3)' }}>{q.correct}</span>
                        : <span style={{ fontSize:'13px',color:'var(--text-dimmer)' }}>Hidden — click "Show Answers"</span>
                      }
                    </div>
                  )}
                  <div style={{ display:'flex',gap:'16px',marginTop:'12px',fontSize:'12px',color:'var(--text-dimmer)' }}>
                    <span>+{q.marks} marks</span><span>−{q.negativeMarks} wrong</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop:'40px',textAlign:'center',paddingBottom:'40px' }}>
          <Link href={`/exam/${id}`} style={{ textDecoration:'none' }}>
            <button className="btn btn-primary" style={{ padding:'16px 40px',fontSize:'16px' }}>⚡ Start Exam Mode</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
