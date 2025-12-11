import { useState } from "react";
import ProblemCard from "../components/problems/ProblemCard";
import type {ProblemStatus} from "../components/problems/ProblemCard.tsx";

type Problem = {
    id: string;
    title: string;
    description: string;
    image?: string;
    status: ProblemStatus;
    votes: number;
};

const MOCK_PROBLEMS: Problem[] = [
    {
        id: "1",
        title: "Яма возле остановки",
        description: "Большая яма на ул. Московской, машины объезжают по встречке.",
        status: "принято",
        votes: 23,
        image: "https://via.placeholder.com/400x200?text=%D0%AF%D0%BC%D0%B0",
    },
    {
        id: "2",
        title: "Не работает фонарь во дворе",
        description: "Во дворе по Ахунбаева 123 уже неделю нет света, очень темно.",
        status: "новая",
        votes: 7,
    },
];

export default function Home() {
    const [problems, setProblems] = useState<Problem[]>(MOCK_PROBLEMS);

    const handleVote = (id: string) => {
        setProblems((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, votes: p.votes + 1 } : p
            )
        );
        // позже здесь будет запрос в Supabase / API
    };

    return (
        <main className="container mx-auto px-4 py-6 space-y-4 bg-gray-100">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Проблемы города</h1>
                <p className="text-sm text-gray-600">
                    Голосуйте за важные проблемы, чтобы помочь им подняться в приоритете.
                </p>
            </div>

            <div className="space-y-3">
                {problems.map((problem) => (
                    <ProblemCard
                        key={problem.id}
                        title={problem.title}
                        description={problem.description}
                        image={problem.image}
                        status={problem.status}
                        votes={problem.votes}
                        onVote={() => handleVote(problem.id)}
                    />
                ))}
            </div>
        </main>
    );
}