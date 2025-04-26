
import React from "react";
import ProfileForm from "@/components/profile/ProfileForm";

const Profile: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-gray-600">View and update your personal information</p>
      </header>

      <ProfileForm />
    </div>
  );
};

export default Profile;
