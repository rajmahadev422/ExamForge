import toast from "react-hot-toast";
import { create } from "zustand";

export const useCreatePaper = create((set) => ({
  loading: false,
  errors: null,
  eid: null,
  // update single field
  updateField: (key, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: value,
      },
    })),

  // send data to backend
  createPaper: async (e) => {
    set({ loading: true, error: null });
    e.preventDefault();
    const formData = new FormData(e.target);
    const paperData = Object.fromEntries(formData.entries());
   
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

      if (!res.ok) {
        toast.error(data.message || "Error submitting paper");
        throw new Error(data.message || "Error submitting paper");
      }

      set({ loading: false });
      toast.success("Paper created successfully!");
      return data;

    } catch (err) {
      set({ error: err.message, loading: false });

    } finally {
      set({ loading: false });
    }
  },
}));
