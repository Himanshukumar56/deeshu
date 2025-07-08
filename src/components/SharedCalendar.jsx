import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
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
import { X } from "lucide-react";

const localizer = momentLocalizer(moment);

const SharedCalendar = () => {
  const { user, userData } = useAuth();
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (!user || !userData || !userData.partnerId) return;

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

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent({ start, end });
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (eventData) => {
    if (eventData.id) {
      // Update existing event
      const eventDocRef = doc(db, "sharedEvents", eventData.id);
      await updateDoc(eventDocRef, {
        title: eventData.title,
      });
    } else {
      // Create new event
      await addDoc(collection(db, "sharedEvents"), {
        ...eventData,
        members: [user.uid, userData.partnerId],
        createdBy: user.uid,
      });
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent && selectedEvent.id) {
      await deleteDoc(doc(db, "sharedEvents", selectedEvent.id));
    }
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Our Calendar</h2>
          <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </Link>
        </div>
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "70vh" }}
          views={["month", "week", "day"]}
          className="text-gray-700"
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
        />
      </div>
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
      />
    </div>
  );
};

export default SharedCalendar;
