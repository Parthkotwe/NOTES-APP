import React, { useState, useEffect } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../axiosInstantce";

const AddEditNotes = ({
  notedata,
  type,
  onClose,
  setNotes,
  notes,
  refreshNotes,
  showToastMessage,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);

  // Prefill in edit mode
  useEffect(() => {
    if (type === "edit" && notedata) {
      setTitle(notedata.title);
      setContent(notedata.content);
      setTags(notedata.tags || []);
    }
  }, [type, notedata]);

  const handleAddEdit = async () => {
    if (!title || !content) {
      setError("Title and Content are required");
      return;
    }
    setError("");

    try {
      if (type === "edit") {
        const res = await axiosInstance.put(`/edit-note/${notedata._id}`, {
          title,
          content,
          tags,
        });

        if (res.data && !res.data.error) {
          const updatedNotes = notes.map((note) =>
            note._id === notedata._id
              ? { ...note, title, content, tags }
              : note
          );
          setNotes(updatedNotes);
          showToastMessage("Note updated successfully", "success");
          onClose();
        }
      } else {
        const res = await axiosInstance.post("/add-note", {
          title,
          content,
          tags,
        });

        if (res.data && !res.data.error) {
          await refreshNotes();
          showToastMessage("Note added successfully", "success");
          onClose();
        }
      }
    } catch (err) {
      console.error("Error adding/editing note:", err);
      showToastMessage(
        err.response?.data?.message || "Something went wrong.",
        "error"
      );
    }
  };

  return (
    <div className="relative bg-white p-6 rounded-lg">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-3">
        <label className="text-xs text-gray-500 font-semibold">TITLE</label>
        <input
          type="text"
          value={title}
          placeholder="Go to gym at 7am"
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <label className="text-xs text-gray-500 font-semibold mt-3">
          CONTENT
        </label>
        <textarea
          rows={10}
          value={content}
          placeholder="Write your note here..."
          onChange={(e) => setContent(e.target.value)}
          className="text-base border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <label className="text-xs text-gray-500 font-semibold mt-3">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-sm text-red-500 pt-4">{error}</p>}

      <button
        onClick={handleAddEdit}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
