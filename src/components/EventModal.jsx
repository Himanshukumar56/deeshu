import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";

const EventModal = ({ isOpen, onClose, onSave, onDelete, event }) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
    }
  }, [event]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ ...event, title });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {event?.id ? "Edit Event" : "Add Event"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
            className="w-full p-3 border rounded-full focus:ring-rose-500 focus:border-rose-500 transition-all"
          />
        </div>
        <div className="flex justify-between items-center mt-8">
          {event?.id && (
            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-700 font-semibold flex items-center"
            >
              <Trash2 className="mr-2" size={18} />
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-6 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {event?.id ? "Save Changes" : "Add Event"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
