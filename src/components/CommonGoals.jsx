import React, { useState, useEffect } from "react";
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
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { Plus, Trash2 } from "lucide-react";

const CommonGoals = () => {
  const { user, userData } = useAuth();
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [partnerData, setPartnerData] = useState(null);

  useEffect(() => {
    if (!user || !userData?.partnerId) return;

    const fetchPartnerData = async () => {
      const partnerDoc = await getDoc(doc(db, "users", userData.partnerId));
      if (partnerDoc.exists()) {
        setPartnerData(partnerDoc.data());
      }
    };
    fetchPartnerData();

    const q = query(
      collection(db, "sharedGoals"),
      where("members", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const goalsData = [];
      querySnapshot.forEach((doc) => {
        goalsData.push({ ...doc.data(), id: doc.id });
      });
      goalsData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setGoals(
        goalsData.filter((goal) => goal.members.includes(userData.partnerId))
      );
    });

    return () => unsubscribe();
  }, [user, userData]);

  const addGoal = async (e) => {
    e.preventDefault();
    if (newGoal.trim() === "") return;

    try {
      await addDoc(collection(db, "sharedGoals"), {
        text: newGoal,
        completed: false,
        createdBy: user.uid,
        members: [user.uid, userData.partnerId],
        createdAt: serverTimestamp(),
      });
      setNewGoal("");
    } catch (error) {
      console.error("Error adding goal: ", error);
    }
  };

  const toggleComplete = async (goal) => {
    try {
      await updateDoc(doc(db, "sharedGoals", goal.id), {
        completed: !goal.completed,
      });
    } catch (error) {
      console.error("Error toggling completion: ", error);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await deleteDoc(doc(db, "sharedGoals", id));
    } catch (error) {
      console.error("Error deleting goal: ", error);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-rose-100 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Common Goals
      </h3>
      <form onSubmit={addGoal} className="flex gap-2">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Add a common goal"
          className="w-full p-2 border rounded-full bg-gray-50 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500"
        />
        <button
          type="submit"
          className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600"
        >
          <Plus />
        </button>
      </form>
      <ul className="mt-4 space-y-4">
        {goals.map((goal) => {
          const creatorName =
            goal.createdBy === user.uid
              ? userData.username
              : partnerData?.username;
          const creationTime = goal.createdAt
            ? new Date(goal.createdAt.seconds * 1000).toLocaleString()
            : "Just now";

          return (
            <li
              key={goal.id}
              className="flex items-start p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleComplete(goal)}
                className="h-5 w-5 text-purple-500 border-gray-300 dark:border-gray-600 rounded-full focus:ring-purple-500 mt-1 flex-shrink-0"
              />
              <div className="ml-3 flex-grow">
                <span
                  className={`block ${
                    goal.completed
                      ? "text-gray-500 dark:text-gray-400 line-through"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {goal.text}
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Added by{" "}
                  <strong className="dark:text-gray-300">
                    {creatorName || "..."}
                  </strong>{" "}
                  at {creationTime}
                </div>
              </div>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="ml-4 text-gray-400 hover:text-red-500 flex-shrink-0"
              >
                <Trash2 size={18} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CommonGoals;
