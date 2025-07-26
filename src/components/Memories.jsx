import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { Camera, Heart, Trash2, UploadCloud } from 'lucide-react';

const Memories = () => {
  const { user, userData } = useAuth();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    if (user && userData) {
      const userIds = [user.uid];
      if (userData.partnerId) {
        userIds.push(userData.partnerId);
      }

      const q = query(
        collection(db, 'memories'),
        where('userId', 'in', userIds),
        orderBy('createdAt', 'desc')
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const memoriesData = [];
        querySnapshot.forEach((doc) => {
          memoriesData.push({ id: doc.id, ...doc.data() });
        });
        setMemories(memoriesData);
      });
      return () => unsubscribe();
    }
  }, [user, userData]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
    }
  };

  const handleUpload = async () => {
    if (image && user) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', uploadPreset);

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        const imageUrl = data.secure_url;

        await addDoc(collection(db, 'memories'), {
          userId: user.uid,
          imageUrl: imageUrl,
          caption: caption,
          createdAt: new Date(),
        });

        setImage(null);
        setCaption('');
      } catch (error) {
        console.error('Error uploading image: ', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'memories', id));
    } catch (error) {
      console.error("Error deleting memory: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      {/* Floating Hearts Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-rose-200 dark:text-rose-800 opacity-20"><Heart size={24} /></div>
        <div className="absolute top-40 right-20 text-pink-200 dark:text-pink-800 opacity-20"><Heart size={20} /></div>
        <div className="absolute bottom-32 left-20 text-purple-200 dark:text-purple-800 opacity-20"><Heart size={28} /></div>
        <div className="absolute bottom-20 right-10 text-rose-200 dark:text-rose-800 opacity-20"><Heart size={16} /></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-4">
              <Camera className="text-rose-500 mr-3" size={32} />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent dark:from-rose-400 dark:via-pink-400 dark:to-purple-400 dark:text-transparent">
                Our Memories
              </h1>
              <Camera className="text-rose-500 ml-3" size={32} />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
              A collection of our most cherished moments.
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl mb-8 border border-rose-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Add a New Memory</h2>
            {image && (
              <div className="mb-4 text-center">
                <img src={URL.createObjectURL(image)} alt="Preview" className="w-40 h-40 object-cover rounded-lg inline-block" />
                <button onClick={() => setImage(null)} className="mt-2 text-sm text-red-500 hover:text-red-700">
                  Remove Image
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <div className="flex items-center space-x-4">
                <label htmlFor="file-upload" className="flex-1 cursor-pointer bg-gradient-to-r from-gray-200 to-gray-100 hover:from-gray-300 text-gray-800 font-bold py-4 px-6 rounded-2xl inline-flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                  <UploadCloud className="w-5 h-5 mr-3" />
                  <span>{image ? "Change File" : "Choose File"}</span>
                </label>
                <input id="file-upload" type="file" onChange={handleImageChange} className="hidden" />
                <button
                  onClick={handleUpload}
                  disabled={!image || loading}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {memories.map((memory) => (
              <div key={memory.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100 dark:border-gray-700 overflow-hidden group relative">
                <img src={memory.imageUrl} alt={memory.caption} className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-white font-semibold text-lg">{memory.caption}</p>
                </div>
                {user && user.uid === memory.userId && (
                  <button
                    onClick={() => handleDelete(memory.id)}
                    className="absolute top-4 right-4 bg-red-500/80 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                  >
                    <Trash2 size={18} />
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

export default Memories;
