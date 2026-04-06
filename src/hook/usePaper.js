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
