import { get } from "node:http";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useCreatePaper = create((set) => ({
  loading: false,
  errors: null,
  eid: null,

  // send data to backend
  createPaper: async (e) => {
    set({ loading: true, error: null });
    e.preventDefault();
    const formData = new FormData(e.target);
    let paperData = Object.fromEntries(formData.entries());
    const subjects = paperData.subjects.split(",").map((s) => s.trim());
    paperData = { ...paperData, subjects };

    try {
      const res = await fetch("/api/paper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(paperData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Error submitting paper");
        throw new Error(data.message || "Error submitting paper");
      }

      toast.success(data.message || "Paper created successfully");
      // console.log("Paper created:", data.data);
      e.target.reset();
      return data;
    } catch (err) {
      toast.error(err.message || "Error submitting paper");
      set({ error: err.message, loading: false });
    } finally {
      set({ loading: false });
    }
  },
}));

export const useAddQuestion = create((set, get) => ({
  loading: false,
  error: null,
  questions: null,

  getPaper: async (paperId) => {
    set({ questions: [] });
    console.log("Fetching paper with ID:", paperId);
  },

  addQuestion: async (e) => {
    console.log("Adding question:", e);
    // e.preventDefault();
    // const formData = new FormData(e.target);
    // let questionData = Object.fromEntries(formData.entries());
    // console.log("Adding question:", questionData);
    // set({questions: [...get().questions, { ...questionData, id: Date.now() }] });
  },

  editQuestion: async (questionData) => {
    console.log("Editing question:", questionData);
  },
}));
