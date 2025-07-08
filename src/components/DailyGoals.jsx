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
} from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { Plus, Trash2 } from "lucide-react";

const DailyGoals = () => {
  const { user, userData } = useAuth();
  const [personalGoals, setPersonalGoals] = useState([]);
  const [sharedGoals, setSharedGoals] = useState([]);
  const [newPersonalGoal, setNewPersonalGoal] = useState("");
  const [newSharedGoal, setNewSharedGoal] = useState("");

  useEffect(() => {
    if (!user) return;

    const personalGoalsQuery = query(
      collection(db, "users", user.uid, "goals")
    );
    const unsubscribePersonal = onSnapshot(
      personalGoalsQuery,
      (querySnapshot) => {
        let goalsArr = [];
        querySnapshot.forEach((doc) => {
          goalsArr.push({ ...doc.data(), id: doc.id });
        });
        setPersonalGoals(goalsArr);
      }
    );

    let unsubscribeShared;
    if (userData && userData.partnerId) {
      const sharedGoalsQuery = query(
        collection(db, "sharedGoals"),
        where("members", "array-contains", user.uid)
      );
      unsubscribeShared = onSnapshot(sharedGoalsQuery, (querySnapshot) => {
        let goalsArr = [];
        querySnapshot.forEach((doc) => {
          goalsArr.push({ ...doc.data(), id: doc.id });
        });
        setSharedGoals(goalsArr);
      });
    }

    return () => {
      unsubscribePersonal();
      if (unsubscribeShared) {
        unsubscribeShared();
      }
    };
  }, [user, userData]);

  const addGoal = async (type) => {
    const goalText = type === "personal" ? newPersonalGoal : newSharedGoal;
    if (goalText.trim() === "") return;

    if (type === "personal") {
      await addDoc(collection(db, "users", user.uid, "goals"), {
        text: goalText,
        completed: false,
        createdBy: user.uid,
      });
      setNewPersonalGoal("");
    } else if (type === "shared" && userData && userData.partnerId) {
      await addDoc(collection(db, "sharedGoals"), {
        text: goalText,
        completed: false,
        members: [user.uid, userData.partnerId],
        createdBy: user.uid,
      });
      setNewSharedGoal("");
    }
  };

  const toggleComplete = async (goal, type) => {
    const collectionName = type === "personal" ? `users/${user.uid}/goals` : "sharedGoals";
    await updateDoc(doc(db, collectionName, goal.id), {
      completed: !goal.completed,
    });
  };

  const deleteGoal = async (id, type) => {
    const collectionName = type === "personal" ? `users/${user.uid}/goals` : "sharedGoals";
    await deleteDoc(doc(db, collectionName, id));
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-rose-100">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Goals</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addGoal("personal");
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={newPersonalGoal}
            onChange={(e) => setNewPersonalGoal(e.target.value)}
            placeholder="Add a personal goal"
            className="w-full p-2 border rounded-full focus:ring-rose-500 focus:border-rose-500"
          />
          <button
            type="submit"
            className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600"
          >
            <Plus />
          </button>
        </form>
        <ul className="mt-4 space-y-2">
          {personalGoals.map((goal) => (
            <li key={goal.id} className="flex items-center">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleComplete(goal, "personal")}
                className="h-5 w-5 text-rose-500 border-gray-300 rounded-full focus:ring-rose-500"
              />
              <span
                className={`ml-3 ${
                  goal.completed ? "text-gray-500 line-through" : "text-gray-700"
                }`}
              >
                {goal.text}
              </span>
              <button
                onClick={() => deleteGoal(goal.id, "personal")}
                className="ml-auto text-gray-400 hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {userData && userData.partnerId && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Shared Goals</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addGoal("shared");
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={newSharedGoal}
              onChange={(e) => setNewSharedGoal(e.target.value)}
              placeholder="Add a shared goal"
              className="w-full p-2 border rounded-full focus:ring-purple-500 focus:border-purple-500"
            />
            <button
              type="submit"
              className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600"
            >
              <Plus />
            </button>
          </form>
          <ul className="mt-4 space-y-2">
            {sharedGoals.map((goal) => (
              <li key={goal.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleComplete(goal, "shared")}
                  className="h-5 w-5 text-purple-500 border-gray-300 rounded-full focus:ring-purple-500"
                />
                <span
                  className={`ml-3 ${
                    goal.completed
                      ? "text-gray-500 line-through"
                      : "text-gray-700"
                  }`}
                >
                  {goal.text}
                </span>
                <button
                  onClick={() => deleteGoal(goal.id, "shared")}
                  className="ml-auto text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DailyGoals;
