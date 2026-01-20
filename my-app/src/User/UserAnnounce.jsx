import React, { useContext } from "react";
import { GlobalContext } from "../Context/GlobalContext";
import { Megaphone } from "lucide-react";

const UserAnnounce= () => {
  const { announcements } = useContext(GlobalContext);
  console.log(announcements);
  console.log(" UserAnnounce component loaded");
  
  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-5 text-green-700 flex items-center justify-center gap-2">
        <Megaphone className="text-green-600 lla" /> Latest Announcements
      </h2>
      <div className="space-y-3 max-w-2xl mx-auto">
        {announcements.length === 0 ? (
          <p className="text-center text-gray-500">No announcements yet...</p>
        ) : (
          announcements.map((a, index) => (
            <div
              key={index}
              className="p-4 bg-green-50 shadow-sm border border-green-200 rounded-xl hover:shadow-md hover:border-green-300 transition"
            >
              <p className="text-gray-800 font-medium">{a.message}</p>
              <small className="text-green-600">
                {new Date(a.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserAnnounce;