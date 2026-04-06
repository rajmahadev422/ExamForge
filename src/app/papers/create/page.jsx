"use client";

import { useCreatePaper } from "@/hook/usePaper";

export default function QuestionPaperForm() {
  const { createPaper, errors, loading } = useCreatePaper();

  return (
    <div className="min-h-screen bg-(--bg) flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-(--bg3) border border-(--border) shadow">
            <svg
              className="h-8 w-8 text-(--accent)"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586l5.414 5.414V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-(--text) mt-4">
            Create Question Paper
          </h1>
          <p className="text-(--text-dim) mt-2">
            Fill in the details to create a new question paper
          </p>
        </div>

        {/* Card */}
        <div className="bg-(--bg2) border border-(--border) rounded-2xl shadow-(--shadow) backdrop-blur-lg">
          <form onSubmit={createPaper} className="p-6 md:p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm text-(--text-dim) mb-2">
                Title <span className="text-(--accent2)">*</span>
              </label>
              <input
                type="text"
                name="title"
                className="w-full px-4 py-2 rounded-lg bg-(--bg3) border border-(--border) text-(--text) placeholder-(--text-dimmer) focus:outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20 transition"
                placeholder="Mathematics Final Examination"
              />
            </div>

            {/*  Subjects */}
            <div>
              <label className="block text-sm text-(--text-dim) mb-2">
                Subjects (comma separated) <span className="text-(--accent2)">*</span>
              </label>
              <input
                type="text"
                name="subjects"
                className="w-full px-4 py-2 rounded-lg bg-(--bg3) border border-(--border) text-(--text) placeholder-(--text-dimmer) focus:outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20 transition"
                placeholder="Mathematics, Physics, Chemistry"
              />
            </div>

            {/* Duration */}
            <div className="grid  gap-6">
              <div>
                <label className="block text-sm text-(--text-dim) mb-2">
                  Duration (minutes) <span className="text-(--accent2)">*</span>
                </label>
                <input
                  type="number"
                  name="duration"
                  className="w-full px-4 py-2 rounded-lg bg-(--bg3) border border-(--border) text-(--text) placeholder-(--text-dimmer) focus:outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20 transition"
                  placeholder="180"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-(--text-dim) mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                className="w-full px-4 py-2 rounded-lg bg-(--bg3) border border-(--border) text-(--text) placeholder-(--text-dimmer) focus:outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20 transition resize-none"
                placeholder="Provide additional details..."
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-medium text-white 
              bg-(--accent) hover:opacity-90 
              transition-all duration-200 
              shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              {loading ? "Loading..." : "Create Paper"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
