'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../components/Navbar'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

function newQuestion() {
  return {
    id: Math.random().toString(36).slice(2),
    type: 'mcq',
    question: '',
    options: ['', '', '', ''],
    correct: null,
    marks: 4,
    negativeMarks: 1,
  }
}

function QuestionCard({ q, idx, onChange, onRemove, total }) {
  const updateOption = (i, val) => {
    const opts = [...q.options]; opts[i] = val
    onChange({ ...q, options: opts })
  }
  const addOption = () => onChange({ ...q, options: [...q.options, ''] })
  const removeOption = (i) => {
    const opts = q.options.filter((_, j) => j !== i)
    onChange({ ...q, options: opts, correct: q.correct === i ? null : q.correct > i ? q.correct - 1 : q.correct })
  }

  return (
    <div className="card animate-fade-up" style={{ padding: '24px', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <span className="mono" style={{ fontSize: '13px', color: 'var(--text-dimmer)', minWidth: '28px' }}>Q{idx + 1}</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`btn ${q.type === 'mcq' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '6px 14px', fontSize: '12px' }} onClick={() => onChange({ ...q, type: 'mcq', correct: null })}>MCQ</button>
          <button className={`btn ${q.type === 'numerical' ? 'btn-success' : 'btn-outline'}`} style={{ padding: '6px 14px', fontSize: '12px' }} onClick={() => onChange({ ...q, type: 'numerical', options: [], correct: null })}>Numerical</button>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div>
            <span className="label" style={{ fontSize: '10px', marginBottom: '3px' }}>+Marks</span>
            <input className="input mono" type="number" value={q.marks} onChange={e => onChange({ ...q, marks: +e.target.value })} style={{ width: '64px', padding: '6px 10px', fontSize: '13px' }} />
          </div>
          <div>
            <span className="label" style={{ fontSize: '10px', marginBottom: '3px' }}>−Marks</span>
            <input className="input mono" type="number" value={q.negativeMarks} onChange={e => onChange({ ...q, negativeMarks: +e.target.value })} style={{ width: '64px', padding: '6px 10px', fontSize: '13px' }} />
          </div>
          {total > 1 && (
            <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px', marginTop: '18px' }} onClick={onRemove}>✕</button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label className="label">Question</label>
        <textarea className="input" rows={3} placeholder="Enter your question here..." value={q.question} onChange={e => onChange({ ...q, question: e.target.value })} style={{ resize: 'vertical', lineHeight: '1.5' }} />
      </div>

      {q.type === 'mcq' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label className="label">Options <span style={{ color: 'var(--text-dimmer)', textTransform: 'none', fontSize: '11px', fontWeight: 400 }}>— click letter to mark correct</span></label>
          {q.options.map((opt, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => onChange({ ...q, correct: q.correct === i ? null : i })} style={{ width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0, background: q.correct === i ? 'var(--accent3)' : 'var(--bg3)', border: `1px solid ${q.correct === i ? 'var(--accent3)' : 'var(--border)'}`, color: q.correct === i ? '#fff' : 'var(--text-dim)', fontFamily: 'Space Mono,monospace', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{LETTERS[i]}</button>
              <input className="input" placeholder={`Option ${LETTERS[i]}`} value={opt} onChange={e => updateOption(i, e.target.value)} />
              {q.options.length > 2 && <button onClick={() => removeOption(i)} style={{ background: 'none', border: 'none', color: 'var(--text-dimmer)', cursor: 'pointer', fontSize: '16px', padding: '4px', flexShrink: 0 }}>×</button>}
            </div>
          ))}
          {q.options.length < 5 && <button className="btn btn-ghost" style={{ alignSelf: 'flex-start', fontSize: '13px' }} onClick={addOption}>+ Add Option</button>}
        </div>
      )}

      {q.type === 'numerical' && (
        <div>
          <label className="label">Correct Answer</label>
          <input className="input mono" type="number" placeholder="Enter the numerical answer" value={q.correct ?? ''} onChange={e => onChange({ ...q, correct: e.target.value === '' ? null : +e.target.value })} style={{ maxWidth: '200px' }} />
        </div>
      )}
    </div>
  )
}

export default function CreatePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [password, setPassword] = useState('')
  const [timeMinutes, setTimeMinutes] = useState(180)
  const [questions, setQuestions] = useState([newQuestion()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showPapers, setShowPapers] = useState(false)

  const updateQ = (idx, q) => setQuestions(qs => qs.map((x, i) => i === idx ? q : x))
  const removeQ = (idx) => setQuestions(qs => qs.filter((_, i) => i !== idx))
  const addQ = () => setQuestions(qs => [...qs, newQuestion()])

  const validate = () => {
    if (!title.trim()) return 'Title is required'
    if (!password.trim()) return 'Password is required'
    if (timeMinutes < 1) return 'Time must be at least 1 minute'
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question.trim()) return `Question ${i + 1} text is empty`
      if (q.type === 'mcq') {
        if (q.options.some(o => !o.trim())) return `Question ${i + 1} has empty options`
        if (q.correct === null) return `Question ${i + 1} has no correct answer selected`
      }
      if (q.type === 'numerical' && q.correct === null) return `Question ${i + 1} has no numerical answer`
    }
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError(''); setSaving(true)
    const paper = { id: Math.random().toString(36).slice(2, 10), title: title.trim(), subject: subject.trim(), password, timeMinutes: +timeMinutes, questions, createdAt: Date.now() }
    const papers = JSON.parse(localStorage.getItem('examforge_papers') || '[]')
    papers.push(paper)
    localStorage.setItem('examforge_papers', JSON.stringify(papers))
    setTimeout(() => router.push(`/paper/${paper.id}`), 300)
  }

  const getSavedPapers = () => JSON.parse(localStorage.getItem('examforge_papers') || '[]')

  const mcqCount = questions.filter(q => q.type === 'mcq').length
  const numCount = questions.filter(q => q.type === 'numerical').length
  const totalMarks = questions.reduce((s, q) => s + q.marks, 0)

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <Navbar
        right={
          <button className="btn btn-outline" style={{ fontSize: '13px' }} onClick={() => setShowPapers(!showPapers)}>
            📋 My Papers
          </button>
        }
      />

      {/* Saved papers drawer */}
      {showPapers && (
        <div className="animate-fade-in" style={{ position: 'fixed', top: '68px', right: '80px', width: '300px', background: 'var(--bg2)', border: '1px solid var(--border-bright)', borderRadius: '12px', padding: '16px', zIndex: 200, boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: '700', fontSize: '14px' }}>Saved Papers</span>
            <button onClick={() => setShowPapers(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '18px' }}>×</button>
          </div>
          {getSavedPapers().length === 0
            ? <p style={{ color: 'var(--text-dim)', fontSize: '13px' }}>No papers yet.</p>
            : getSavedPapers().map(p => (
              <div key={p.id} style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg3)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '13px' }}>{p.title}</div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '12px' }}>{p.questions.length} Qs · {p.timeMinutes}min</div>
                </div>
                <Link href={`/paper/${p.id}`} style={{ textDecoration: 'none' }}>
                  <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '11px' }}>View</button>
                </Link>
              </div>
            ))
          }
        </div>
      )}

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>
        <div className="animate-fade-up" style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '8px', lineHeight: 1.1 }}>
            Create Question<br /><span style={{ color: 'var(--accent)' }}>Paper</span>
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '16px' }}>Build a complete exam with MCQ and numerical questions.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card animate-fade-up" style={{ padding: '24px' }}>
            <h2 style={{ fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)', marginBottom: '20px' }}>Paper Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Title *</label>
                <input className="input" placeholder="JEE Main 2024 — Paper 1" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="label">Subject</label>
                <input className="input" placeholder="Physics, Chemistry, Math" value={subject} onChange={e => setSubject(e.target.value)} />
              </div>
              <div>
                <label className="label">Password *</label>
                <input className="input" type="password" placeholder="Set exam password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div>
                <label className="label">Duration (minutes) *</label>
                <input className="input mono" type="number" min={1} value={timeMinutes} onChange={e => setTimeMinutes(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              {[{ label: 'Questions', value: questions.length, color: 'var(--text)' }, { label: 'MCQ', value: mcqCount, color: 'var(--accent)' }, { label: 'Numerical', value: numCount, color: 'var(--accent3)' }, { label: 'Total Marks', value: totalMarks, color: 'var(--accent4)' }].map(s => (
                <div key={s.label} style={{ flex: 1, textAlign: 'center' }}>
                  <div className="mono" style={{ fontSize: '22px', fontWeight: '700', color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dimmer)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {questions.map((q, i) => (
              <QuestionCard key={q.id} q={q} idx={i} total={questions.length} onChange={nq => updateQ(i, nq)} onRemove={() => removeQ(i)} />
            ))}
          </div>

          <button type="button" className="btn btn-outline" onClick={addQ} style={{ alignSelf: 'flex-start', fontSize: '14px', padding: '12px 24px' }}>+ Add Question</button>

          {error && (
            <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.3)', color: 'var(--accent2)', fontSize: '14px' }}>⚠ {error}</div>
          )}

          <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '14px 32px', fontSize: '15px' }}>
              {saving ? '⏳ Saving...' : '✓ Save Question Paper'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
