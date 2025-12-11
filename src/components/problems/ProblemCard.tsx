export type ProblemStatus = "новая" | "принято" | "в_работе" | "решено";

interface ProblemCardProps {
    title: string;
    description: string;
    image?: string;
    status: ProblemStatus;
    votes: number;
    onVote?: () => void;
}

export default function ProblemCard({
                                        title,
                                        description,
                                        image,
                                        status,
                                        votes,
                                        onVote,
                                    }: ProblemCardProps) {
    const statusColors = {
        "новая": "bg-red-500 text-white",
        "принято": "bg-orange-400 text-white",
        "в_работе": "bg-blue-500 text-white",
        "решено": "bg-green-500 text-white",
    };

    const statusTagClass = statusColors[status];

    return (
        <div className="border border-gray-200 rounded-xl p-4 shadow-md bg-white hover:shadow-lg transition duration-300">
            {}
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                />
            )}

            {}
            <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold text-gray-800 pr-2">{title}</h2>

                <span
                    className={`min-w-[80px] text-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusTagClass}`}
                >
          {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
        </span>
            </div>

                {}
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>

            {}
            <div className="flex items-center justify-between text-sm font-medium text-gray-500">
                <div className="flex items-center">
          <span role="img" aria-label="votes" className="mr-1">
            🔥
          </span>
                    {votes} подтверждений
                </div>

                {onVote && (
                    <button
                        type="button"
                        onClick={onVote}
                        className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition"
                    >
                        Поддержать
                    </button>
                )}
            </div>
        </div>
    );
}