"use client";

import { useAddQuestion } from "@/hook/usePaper";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function QuestionBuilder() {
  const { paperId } = useParams();
  const { loading, getPaper, questions, addQuestion, editQuestion } =
    useAddQuestion();

  const [marks, setMarks] = useState({ p: '4', n: '-1' });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("marks");
      if (saved) setMarks(JSON.parse(saved));
    } catch {
      localStorage.removeItem("marks");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("marks", JSON.stringify(marks));
  }, [marks]);
  const [currentQ, setCurrentQ] = useState({
    question: "",
    image: "",
    type: "mcq",
    category: "Mathematics",
    options: ["A", "B", "C", "D"],
    answer: "",
  });


  useEffect(() => {
    if (paperId) {
      getPaper(paperId);
    }
  }, [paperId]);

  if (!questions) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-(--bg) text-(--text) p-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT: FORM */}
        <div className="bg-(--bg2) border border-(--border) rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            {false ? "Edit Question" : "Add Question"}
          </h2>

          <form onSubmit={(e) => {
            e.preventDefault();
            addQuestion({...currentQ, marks });
            }} className="space-y-4">
            {/* Question */}
            <textarea
              name="question"
              value={currentQ.question}
              onChange={(e) => setCurrentQ({...currentQ, question: e.target.value })}
              placeholder="Enter question"
              className="w-full p-2 rounded bg-(--bg3) border border-(--border)"
            />

            {/* Image */}
            <input
              name="image"
              placeholder="Image URL (optional)"
              className="w-full p-2 rounded bg-(--bg3) border border-(--border)"
            />

            {/* Type */}
            <select
              name="type"
              value={currentQ.type}
              onChange={(e) => setCurrentQ({...currentQ, type: e.target.value })}
              className="w-full p-2 rounded bg-(--bg3) border border-(--border)"
            >
              <option value="mcq">MCQ</option>
              <option value="numerical">Numerical</option>
            </select>

            {/* Category */}
            <select
              name="category"
              value={currentQ.category}
              onChange={(e) => setCurrentQ({...currentQ, category: e.target.value })}
              className="w-full p-2 rounded bg-(--bg3) border border-(--border)"
            >
              {["Mathematics", "Physics", "Chemistry"].map((s, i) => (
                <option key={i} value="mcq">
                  {s}
                </option>
              ))}
            </select>

            {/* Marks */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                name="correctMarks"
                value={marks.p}
                onChange={(e) =>
                  setMarks({ ...marks, p: e.target.value })
                }
                placeholder="Correct Marks"
                className="p-2 rounded bg-(--bg3) border border-(--border)"
              />
              <input
                type="number"
                name="negativeMarks"
                value={marks.n}
                onChange={(e) =>
                  setMarks({ ...marks, n: e.target.value })
                }
                placeholder="Negative Marks"
                className="p-2 rounded bg-(--bg3) border border-(--border)"
              />
            </div>

            {/* MCQ Options */}
            {true && (
              <div className="space-y-2">
                {currentQ.options.map((opt, i) => (
                  <input
                    key={i}
                    value={opt}
                    onChange={(e) => setCurrentQ({
                      ...currentQ,
                      options: currentQ.options.map((o, idx) => idx === i ? e.target.value : o)})}
                    placeholder={`Option ${i + 1}`}
                    className="w-full p-2 rounded bg-(--bg3) border border-(--border)"
                  />
                ))}
              </div>
            )}

            {/* Answer */}
            <input
              name="answer"
              value={currentQ.answer}
              onChange={(e) => setCurrentQ({...currentQ, answer: e.target.value })}
              placeholder="Correct Answer"
              className="w-full p-2 rounded bg-(--bg3) border border-(--border)"
            />

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-(--accent) text-white py-2 rounded"
              >
                Add
              </button>

              <button
                type="button"
                className="flex-1 bg-(--border) py-2 rounded"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: LIST */}
        <div className="bg-(--bg2) border border-(--border) rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Questions</h2>

          <div className="space-y-3 max-h-150 overflow-y-auto">
            {questions?.length === 0 ? (
              <p className="text-(--text-dim) text-sm">
                No questions added yet
              </p>
            ) : (
              questions.map((q, i) => (
                <div
                  key={q.id}
                  onClick={() => editQuestion(q)}
                  className="p-3 rounded bg-(--bg3) border border-(--border) cursor-pointer hover:border-(--accent) transition"
                >
                  <p className="text-sm text-(--text-dim)">
                    Q{i + 1} ({q.type})
                  </p>
                  <p className="truncate">{q.question}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
