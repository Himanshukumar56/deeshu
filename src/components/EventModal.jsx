import React, { useState, useEffect } from "react";
import { X, Trash2, Calendar, Clock } from "lucide-react";
import moment from "moment";

const EventModal = ({ isOpen, onClose, onSave, onDelete, event, slot }) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  useEffect(() => {
    const initialEvent = event || slot;
    if (initialEvent) {
      setTitle(initialEvent.title || "");
      setStart(moment(initialEvent.start).toDate());
      setEnd(moment(initialEvent.end).toDate());
    }
  }, [event, slot]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      id: event?.id,
      title,
      start,
      end,
    });
  };

  const handleDateTimeChange = (setter) => (e) => {
    const newDate = moment(e.target.value).toDate();
    setter(newDate);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 animate-in fade-in-0 zoom-in-95">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {event?.id ? "Edit Event" : "Add New Event"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's the occasion?"
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-semibold text-gray-600 flex items-center">
                <Calendar className="mr-2" size={18} /> Start Date & Time
              </label>
              <input
                type="datetime-local"
                value={moment(start).format("YYYY-MM-DDTHH:mm")}
                onChange={handleDateTimeChange(setStart)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="font-semibold text-gray-600 flex items-center">
                <Clock className="mr-2" size={18} /> End Date & Time
              </label>
              <input
                type="datetime-local"
                value={moment(end).format("YYYY-MM-DDTHH:mm")}
                onChange={handleDateTimeChange(setEnd)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-8">
          <div>
            {event?.id && (
              <button
                onClick={onDelete}
                className="text-red-500 hover:text-red-700 font-semibold flex items-center p-2 rounded-md hover:bg-red-50 transition-colors"
              >
                <Trash2 className="mr-2" size={18} />
                Delete Event
              </button>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-8 rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {event?.id ? "Save Changes" : "Create Event"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
