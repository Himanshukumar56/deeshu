import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { Pencil, Trash2 } from 'lucide-react';

const Notes = () => {
  const { user, userData } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loadingNote, setLoadingNote] = useState(false);

  useEffect(() => {
    if (user && userData) {
      const userIds = [user.uid];
      if (userData.partnerId) {
        userIds.push(userData.partnerId);
      }

      const q = query(
        collection(db, 'notes'),
        where('userId', 'in', userIds),
        orderBy('createdAt', 'desc')
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notesData = [];
        querySnapshot.forEach((doc) => {
          notesData.push({ id: doc.id, ...doc.data() });
        });
        setNotes(notesData);
      });
      return () => unsubscribe();
    }
  }, [user, userData]);

  const handleAddNote = async () => {
    if (newNote.trim() !== '' && user) {
      setLoadingNote(true);
      try {
        await addDoc(collection(db, 'notes'), {
          userId: user.uid,
          userName: userData.name || user.displayName,
          note: newNote,
          createdAt: new Date(),
        });
        setNewNote('');
      } catch (error) {
        console.error('Error adding note: ', error);
      } finally {
        setLoadingNote(false);
      }
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (error) {
      console.error("Error deleting note: ", error);
    }
  };

  if (!user || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Loading...</h1>
          <p className="text-gray-600 dark:text-gray-300">Please wait while we fetch your data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-4">
              <Pencil className="text-rose-500 mr-3" size={32} />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent dark:from-rose-400 dark:via-pink-400 dark:to-purple-400 dark:text-transparent">
                Sweet Notes
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
              Leave a sweet note for your partner.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl mb-8 border border-rose-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <Pencil className="mr-3 text-rose-500" /> Add a New Note
            </h2>
            <div className="flex gap-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write a sweet note for your partner..."
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                rows="3"
              />
              <button
                onClick={handleAddNote}
                disabled={loadingNote || !newNote.trim()}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingNote ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </div>

          <div className="mb-12">
            {notes.map((note) => (
              <div key={note.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 relative mb-4">
                <p className="text-gray-800 dark:text-gray-200">{note.note}</p>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex justify-between items-center">
                  <span>By: <strong>{note.userName}</strong></span>
                  <span>{new Date(note.createdAt.toDate()).toLocaleString()}</span>
                </div>
                {user && user.uid === note.userId && (
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-50 hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
