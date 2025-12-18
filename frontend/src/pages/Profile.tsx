import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

type User = {
  id: string;
  name: string;
  email: string;
};

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        console.log(res.data)
        setUser(res.data.user);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-red-500">No user data found</p>;
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="bg-white border rounded-xl shadow-sm p-6 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">Name</label>
          <p className="text-lg font-medium">{user.name}</p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">Email</label>
          <p className="text-lg font-medium">{user.email}</p>
        </div>

        {/* Info */}
        <div className="pt-4 text-sm text-gray-400">
          This is your account information.
        </div>
      </div>
    </div>
  );
};

export default Profile;
