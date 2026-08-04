import Spinner from "../Spinner";

const LoadingState = () => (
<div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
            <Spinner size="lg" color="indigo" />
            <p className="text-gray-600 font-medium mt-4">Loading your profile...</p>
        </div>
    </div>
);

export default LoadingState;