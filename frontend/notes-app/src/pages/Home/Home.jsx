import React, { useState, useEffect } from "react";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditNotes from "./AddEditNotes";
import NoteCard from "../../components/Cards/NoteCard";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstantce";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddNotesImg from "../../assets/Add_files.svg";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "success", // "success" | "error" | "delete"
  });

  const [notes, setNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // Set app element for accessibility
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) Modal.setAppElement(root);
  }, []);

  // Fetch user info
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/get-user");
        if (response.data && response.data.user) {
          setUserInfo(response.data.user);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      }
    };
    getUserInfo();
  }, [navigate]);

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const res = await axiosInstance.get("/get-all-notes");
      if (res.data && res.data.notes) {
        setNotes(res.data.notes);
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // ✅ Search Notes API call
  const handleSearchNotes = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      // if query empty → fetch all notes again
      fetchNotes();
      return;
    }
    try {
      const res = await axiosInstance.get(`/search-notes?query=${query}`);
      if (res.data && !res.data.error) {
        setNotes(res.data.notes);
      }
    } catch (error) {
      console.error("Error searching notes:", error);
    }
  };

  // Toast handlers
  const showToastMessage = (message, type = "success") => {
    setShowToastMsg({ isShown: true, message, type });
  };

  const handleCloseToast = () => {
    setShowToastMsg({ isShown: false, message: "", type: "success" });
  };

  // Delete Note
  const handleDeleteNote = async (noteId) => {
    try {
      const res = await axiosInstance.delete(`/delete-note/${noteId}`);
      if (res.data && !res.data.error) {
        setNotes(notes.filter((n) => n._id !== noteId));
        showToastMessage("Note deleted successfully", "delete");
      }
    } catch (err) {
      console.error("Error deleting note:", err);
      showToastMessage("Failed to delete note", "error");
    }
  };

  // Modal Handlers
  const handleOpenModal = (type = "add", data = null) => {
    setOpenAddEditModal({ isShown: true, type, data });
  };

  const handleCloseModal = () => {
    setOpenAddEditModal({ isShown: false, type: "add", data: null });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Pass search handler to Navbar */}
      <Navbar
        userInfo={userInfo}
        onSearch={handleSearchNotes}
        searchQuery={searchQuery}
      />

      <div className="container mx-auto px-6 mt-8">
        {notes.length === 0 ? (
          <EmptyCard
            imgSrc={AddNotesImg}
            message={`Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas, and reminders.`}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={note.createdAt || ""}
                content={note.content}
                tags={note.tags || []}
                isPinned={note.isPinned}
                onEdit={() => handleOpenModal("edit", note)}
                onDelete={() => handleDeleteNote(note._id)}
                onPinNote={() =>
                  setNotes((prev) =>
                    prev.map((n) =>
                      n._id === note._id
                        ? { ...n, isPinned: !n.isPinned }
                        : n
                    )
                  )
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 fixed right-10 bottom-10"
        onClick={() => handleOpenModal("add")}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={handleCloseModal}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.2)" },
        }}
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          notedata={openAddEditModal.data}
          onClose={handleCloseModal}
          refreshNotes={fetchNotes}
          showToastMessage={showToastMessage}
          notes={notes}
          setNotes={setNotes}
        />
      </Modal>

      {/* Toast Message */}
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default Home;
