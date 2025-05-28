import { useContext, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext); // FIX: authUser not authuser
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (!selectedImage) {
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate("/");
    };
  };

  return (
    <div className="min-h-screen bg-cover flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-md px-4">
      {/* Left */}
      <img src={assets.logo_big} alt="Logo" className="w-[min(30vw,250px)]" />

      <div className="min-h-screen flex items-center justify-center bg-cover gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-md px-4">
        <div className="w-full max-w-lg bg-white/10 border border-blue-300/30 backdrop-blur-2xl rounded-2xl p-8 flex flex-col sm:flex-row justify-between gap-6 shadow-[0_0_40px_#3b82f6aa]">
          {/* Left Side - Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
            <h1 className="text-white text-lg font-semibold">
              Profile details
            </h1>

            {/* Profile Image Upload */}
            <label
              htmlFor="avatar"
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="file"
                id="avatar"
                accept=".png,.jpg,.jpeg"
                hidden
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
              <img
                src={
                  selectedImage
                    ? URL.createObjectURL(selectedImage)
                    : authUser?.profilePic || assets.avatar_icon
                }
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-400 shadow-md"
              />
              <span className="text-sm text-white/70">
                Upload profile image
              </span>
            </label>

            {/* Name Input */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-md bg-white/10 border border-blue-300/30 text-white focus:outline-none placeholder:text-white/60"
              placeholder="Full Name"
            />

            {/* Bio Textarea */}
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-md bg-white/10 border border-blue-300/30 text-white focus:outline-none placeholder:text-white/60"
              placeholder="Bio"
            />

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-3 mt-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-full hover:scale-105 transition-transform"
            >
              Save
            </button>
          </form>

          {/* Right Side - Robot Logo */}
          <div className="flex justify-center items-center">
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : authUser?.profilePic || assets.robot
              }
              alt="Profile Preview"
              className={`w-32 h-32 sm:w-40 sm:h-40 object-cover drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] ${
                authUser?.profilePic || selectedImage ? "rounded-full border-2 border-blue-400" : ""
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
