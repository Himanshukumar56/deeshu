import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  serverTimestamp,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../hooks/useAuth";
import { Upload, Heart } from "lucide-react";

const Scrapbook = () => {
  const { user, userData } = useAuth();
  const [memories, setMemories] = useState([]);
  const [newMemoryText, setNewMemoryText] = useState("");
  const [newMemoryFile, setNewMemoryFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user || !userData || !userData.partnerId) return;

    const q = query(
      collection(db, "sharedMemories"),
      where("members", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const memoriesArr = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMemories(memoriesArr);
    });

    return () => unsubscribe();
  }, [user, userData]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setNewMemoryFile(e.target.files[0]);
    }
  };

  const addMemory = async (e) => {
    e.preventDefault();
    if (newMemoryText.trim() === "" && !newMemoryFile) return;
    if (!userData.partnerId) return;

    setUploading(true);

    let fileURL = "";
    if (newMemoryFile) {
      const storageRef = ref(
        storage,
        `sharedMemories/${user.uid}-${userData.partnerId}/${newMemoryFile.name}`
      );
      await uploadBytes(storageRef, newMemoryFile);
      fileURL = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "sharedMemories"), {
      text: newMemoryText,
      fileURL,
      timestamp: serverTimestamp(),
      favorite: false,
      members: [user.uid, userData.partnerId],
      createdBy: user.uid,
    });

    setNewMemoryText("");
    setNewMemoryFile(null);
    setUploading(false);
  };

  const toggleFavorite = async (memory) => {
    await updateDoc(doc(db, "sharedMemories", memory.id), {
      favorite: !memory.favorite,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Our Scrapbook
          </h1>
          <p className="text-gray-600 mt-4">
            Every moment captured, every memory treasured.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl mb-12">
          <form onSubmit={addMemory}>
            <textarea
              value={newMemoryText}
              onChange={(e) => setNewMemoryText(e.target.value)}
              placeholder="Share a new memory..."
              className="w-full p-3 border rounded-2xl focus:ring-rose-500 focus:border-rose-500 transition-all mb-4"
              rows="3"
            ></textarea>
            <div className="flex justify-between items-center">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center bg-gray-200 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-300 cursor-pointer"
              >
                <Upload className="mr-2" size={20} />
                {newMemoryFile ? newMemoryFile.name : "Add Photo"}
              </label>
              <button
                type="submit"
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white py-2 px-6 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
                disabled={uploading}
              >
                {uploading ? "Sharing..." : "Share Memory"}
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group"
            >
              {memory.fileURL && (
                <img
                  src={memory.fileURL}
                  alt="Memory"
                  className="w-full h-56 object-cover"
                />
              )}
              <div className="p-6">
                <p className="text-gray-700 mb-4">{memory.text}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {memory.timestamp?.toDate().toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => toggleFavorite(memory)}
                    className={`p-2 rounded-full transition-colors ${
                      memory.favorite
                        ? "text-yellow-400"
                        : "text-gray-300 group-hover:text-yellow-300"
                    }`}
                  >
                    <Heart fill="currentColor" size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scrapbook;
