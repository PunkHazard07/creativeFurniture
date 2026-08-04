const UserCard = ({ user }) => {
const initial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

return (
    <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
      <div className="flex items-center mb-6">
        <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">
          {initial}
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-bold text-gray-800">{user?.username}</h2>
          <p className="text-gray-500">
            {user?.verified ? "Verified Account" : "Unverified Account"}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-3">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p className="text-gray-700">{user?.username}</p>
        </div>

        <div className="flex items-center">
          <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-700">{user?.email}</p>
        </div>

        <div className="flex items-center">
          <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-700">
            {user?.verified ? (
              <span className="text-green-600 font-medium">Verified</span>
            ) : (
              <span className="text-yellow-600 font-medium">Not verified</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;