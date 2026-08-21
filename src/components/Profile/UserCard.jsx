const UserCard = ({ user }) => {
  const initial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:col-span-1 w-full min-w-0 overflow-hidden">
      {/* Header: avatar + name + verification badge */}
      <div className="flex items-center mb-6 min-w-0">
        <div className="bg-blue-500 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
          {initial}
        </div>
        <div className="ml-3 sm:ml-4 min-w-0 flex-1">
          <h2 className="text-base sm:text-xl font-bold text-gray-800 truncate">
            {user?.username}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 truncate">
            {user?.verified ? "Verified Account" : "Unverified Account"}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-3">
        <div className="flex items-center min-w-0">
          <svg
            className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <p className="text-sm sm:text-base text-gray-700 truncate min-w-0 flex-1">
            {user?.username}
          </p>
        </div>

        <div className="flex items-center min-w-0">
          <svg
            className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm sm:text-base text-gray-700 truncate min-w-0 flex-1 break-all sm:break-normal">
            {user?.email}
          </p>
        </div>

        <div className="flex items-center min-w-0">
          <svg
            className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm sm:text-base text-gray-700 truncate min-w-0 flex-1">
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
