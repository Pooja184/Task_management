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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        setUser(res.data.user);
        setName(res.data.user.name);
        setEmail(res.data.user.email);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    if ((email !== user?.email || password) && !currentPassword) {
      toast.error("Please confirm your current password");
      return;
    }

    const toastId = toast.loading("Updating profile...");

    try {
      const res = await api.put("/auth/profile", {
        name,
        email,
        password: password || undefined,
        currentPassword: currentPassword || undefined,
      });

      setUser(res.data.user);
      setPassword("");
      setCurrentPassword("");
      setEditing(false);

      toast.success("Profile updated successfully", { id: toastId });
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Update failed",
        { id: toastId }
      );
    }
  };

  if (loading) return <p className="text-gray-500">Loading profile...</p>;
  if (!user) return <p className="text-red-500">No user data found</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="bg-white border rounded-xl shadow-sm p-6 space-y-4">
        {/* Name */}
        <div>
          <label className="text-sm text-gray-500">Name</label>
          <input
            disabled={!editing}
            className="w-full border rounded p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-500">Email</label>
          <input
            disabled={!editing}
            className="w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* New Password */}
        {editing && (
          <div>
            <label className="text-sm text-gray-500">
              New Password (optional)
            </label>
            <input
              type="password"
              className="w-full border rounded p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        {/* Current Password (confirmation) */}
        {editing && (email !== user.email || password) && (
          <div>
            <label className="text-sm text-red-500">
              Confirm Current Password
            </label>
            <input
              type="password"
              className="w-full border rounded p-2"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 flex gap-3">
          {editing ? (
            <>
              <button
                onClick={handleUpdate}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setName(user.name);
                  setEmail(user.email);
                  setPassword("");
                  setCurrentPassword("");
                }}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="border px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
