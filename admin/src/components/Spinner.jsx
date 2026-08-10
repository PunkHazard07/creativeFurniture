const Spinner = ({ size = "md", color = "indigo" }) => {
    const sizeClasses = {
        sm: "h-6 w-6 border-2",
        md: "h-10 w-10 border-2",
        lg: "h-14 w-14 border-4",
    };

    const colorClasses = {
        indigo: "border-t-indigo-500 border-b-indigo-500",
        gray: "border-t-gray-500 border-b-gray-500",
        white: "border-t-white border-b-white",
        red: "border-t-red-500 border-b-red-500",
    };

    return (
        <div
            className={`animate-spin rounded-full border-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
            role="status"
            aria-label="Loading"
        />
    );
};

export default Spinner;