import React, { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { db } from "../firebase";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import EventModal from "./EventModal";
import { Link } from "react-router-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

const localizer = momentLocalizer(moment);

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };

  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };

  const goToCurrent = () => {
    toolbar.onNavigate("TODAY");
  };

  const label = () => {
    const date = moment(toolbar.date);
    return (
      <span className="text-2xl font-bold text-gray-700">
        {date.format("MMMM YYYY")}
      </span>
    );
  };

  return (
    <div className="flex justify-between items-center mb-4 p-2 rounded-lg bg-gray-100">
      <div className="flex items-center space-x-2">
        <button
          onClick={goToCurrent}
          className="px-4 py-2 rounded-md bg-rose-500 text-white font-semibold hover:bg-rose-600 transition-all"
        >
          Today
        </button>
        <button
          onClick={goToBack}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={goToNext}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      {label()}
      <div className="flex items-center space-x-2">
        {Object.values(Views).map((view) => (
          <button
            key={view}
            onClick={() => toolbar.onView(view)}
            className={`px-4 py-2 rounded-md font-semibold transition-all ${
              toolbar.view === view
                ? "bg-rose-500 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

const CustomEvent = ({ event }) => {
  return (
    <div className="bg-rose-100 border-l-4 border-rose-500 text-rose-800 p-1 rounded-sm">
      <strong>{event.title}</strong>
    </div>
  );
};

const SharedCalendar = () => {
  const { user, userData } = useAuth();
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (!user || !userData?.partnerId) return;

    const q = query(
      collection(db, "sharedEvents"),
      where("members", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventsArr = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          start: data.start.toDate(),
          end: data.end.toDate(),
        };
      });
      setEvents(eventsArr);
    });

    return () => unsubscribe();
  }, [user, userData]);

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      setSelectedSlot({ start, end });
      setSelectedEvent(null);
      setIsModalOpen(true);
    },
    [setIsModalOpen, setSelectedSlot, setSelectedEvent]
  );

  const handleSelectEvent = useCallback(
    (event) => {
      setSelectedEvent(event);
      setSelectedSlot(null);
      setIsModalOpen(true);
    },
    [setIsModalOpen, setSelectedEvent, setSelectedSlot]
  );

  const handleSaveEvent = async (eventData) => {
    if (!user || !userData?.partnerId) {
      toast.error("You must be connected with a partner to add events.");
      return;
    }

    const eventToSave = {
      title: eventData.title,
      start: eventData.start,
      end: eventData.end,
    };

    try {
      if (eventData.id) {
        const eventDocRef = doc(db, "sharedEvents", eventData.id);
        await updateDoc(eventDocRef, {
          ...eventToSave,
          members: [user.uid, userData.partnerId],
          createdBy: user.uid,
        });
        toast.success("Event updated successfully!");
      } else {
        await addDoc(collection(db, "sharedEvents"), {
          ...eventToSave,
          members: [user.uid, userData.partnerId],
          createdBy: user.uid,
        });
        toast.success("Event added successfully!");
      }
      closeModal();
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event. Please try again.");
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent && selectedEvent.id) {
      try {
        await deleteDoc(doc(db, "sharedEvents", selectedEvent.id));
        toast.success("Event deleted successfully!");
        closeModal();
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event. Please try again.");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4 sm:p-6">
      <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-8 rounded-3xl shadow-2xl max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="text-rose-500" size={32} />
            <h2 className="text-3xl font-bold text-gray-800">Our Calendar</h2>
          </div>
          <Link
            to="/dashboard"
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </Link>
        </div>

        <div className="h-[75vh]">
          <Calendar
            selectable
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={["month", "week", "day", "agenda"]}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            components={{
              toolbar: CustomToolbar,
              event: CustomEvent,
            }}
            eventPropGetter={() => ({
              className: "cursor-pointer",
            })}
            dayPropGetter={(date) => {
              const isToday = moment(date).isSame(moment(), "day");
              return {
                className: isToday ? "bg-rose-50" : "",
              };
            }}
            style={{ height: "100%" }}
          />
        </div>

        <button
          onClick={() => {
            const now = new Date();
            handleSelectSlot({ start: now, end: now });
          }}
          className="absolute bottom-8 right-8 bg-rose-500 text-white p-4 rounded-full shadow-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-transform transform hover:scale-110"
          aria-label="Add new event"
        >
          <Plus size={24} />
        </button>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        slot={selectedSlot}
      />
    </div>
  );
};

export default SharedCalendar;
