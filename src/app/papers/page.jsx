"use client";

import Link from "next/link";
import React, { useState } from "react";

export default function QuestionPapersPage() {
  const [questionPapers, setQuestionPapers] = useState([
    {
      id: 1,
      title: "Mathematics Final Examination",
      totalMarks: 100,
      totalQuestions: 25,
      subject: "Mathematics",
      grade: "10th Grade",
      duration: "3 hours",
      createdAt: "2024-03-15",
      status: "Published",
    },
    {
      id: 2,
      title: "Physics Mid-Term Test",
      totalMarks: 80,
      totalQuestions: 20,
      subject: "Physics",
      grade: "12th Grade",
      duration: "2.5 hours",
      createdAt: "2024-03-10",
      status: "Draft",
    },
    {
      id: 3,
      title: "English Literature Assessment",
      totalMarks: 50,
      totalQuestions: 15,
      subject: "English",
      grade: "9th Grade",
      duration: "2 hours",
      createdAt: "2024-03-05",
      status: "Published",
    },
    {
      id: 4,
      title: "Chemistry Quarterly Exam",
      totalMarks: 70,
      totalQuestions: 18,
      subject: "Chemistry",
      grade: "11th Grade",
      duration: "2.5 hours",
      createdAt: "2024-02-28",
      status: "Archived",
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPaper, setNewPaper] = useState({
    title: "",
    totalMarks: "",
    totalQuestions: "",
    subject: "",
    grade: "",
    duration: "",
  });

  const handleCreatePaper = () => {
    if (!newPaper.title || !newPaper.totalMarks || !newPaper.totalQuestions) {
      alert("Please fill in all required fields");
      return;
    }

    const paper = {
      id: questionPapers.length + 1,
      title: newPaper.title,
      totalMarks: parseInt(newPaper.totalMarks),
      totalQuestions: parseInt(newPaper.totalQuestions),
      subject: newPaper.subject || "General",
      grade: newPaper.grade || "Not Specified",
      duration: newPaper.duration || "2 hours",
      createdAt: new Date().toISOString().split("T")[0],
      status: "Draft",
    };

    setQuestionPapers([paper, ...questionPapers]);
    setShowCreateModal(false);
    setNewPaper({
      title: "",
      totalMarks: "",
      totalQuestions: "",
      subject: "",
      grade: "",
      duration: "",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "Archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Question Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questionPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {paper.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Total Marks:</span>
                    <span className="font-semibold text-gray-900">
                      {paper.totalMarks}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="font-semibold text-gray-900">
                      {paper.totalQuestions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subject:</span>
                    <span className="text-gray-900">{paper.subject}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Grade:</span>
                    <span className="text-gray-900">{paper.grade}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="text-gray-900">{paper.duration}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-gray-500">{paper.createdAt}</span>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {questionPapers.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No question papers
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new question paper.
            </p>
          </div>
        )}
        {/* create paper button */}
        <div className="fixed bottom-6 right-6">
          <Link
            href={"/"}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {/* Create Question Paper */}
          </Link>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Create New Question Paper
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newPaper.title}
                    onChange={(e) =>
                      setNewPaper({ ...newPaper, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter question paper title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Marks *
                    </label>
                    <input
                      type="number"
                      value={newPaper.totalMarks}
                      onChange={(e) =>
                        setNewPaper({ ...newPaper, totalMarks: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., 100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Questions *
                    </label>
                    <input
                      type="number"
                      value={newPaper.totalQuestions}
                      onChange={(e) =>
                        setNewPaper({
                          ...newPaper,
                          totalQuestions: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., 25"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newPaper.subject}
                    onChange={(e) =>
                      setNewPaper({ ...newPaper, subject: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Mathematics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade/Class
                  </label>
                  <input
                    type="text"
                    value={newPaper.grade}
                    onChange={(e) =>
                      setNewPaper({ ...newPaper, grade: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 10th Grade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newPaper.duration}
                    onChange={(e) =>
                      setNewPaper({ ...newPaper, duration: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 3 hours"
                  />
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePaper}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Paper
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
