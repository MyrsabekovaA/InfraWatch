
export type Problem = {
  id: string;
  title: string;
  description: string;
  category: string;
  lat: number;
  lng: number;
  image_url?: string;
  user_id: string;
  status: 'новая' | 'принято' | 'в_работе' | 'решено';
  votes: number;
  created_at: string;
};

const STORAGE_KEY = 'infrawatch_problems';

export const mockData = {
  getProblems: (): Problem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  addProblem: (problem: Problem): Problem => {
    const problems = mockData.getProblems();
    problems.push(problem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
    return problem;
  },

  updateVotes: (id: string, newVotes: number): void => {
    const problems = mockData.getProblems();
    const problem = problems.find(p => p.id === id);
    if (problem) {
      problem.votes = newVotes;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
    }
  },

  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  seedMockData: (): void => {
    const mockProblems: Problem[] = [
      {
        id: '1',
        title: 'Яма возле остановки',
        description: 'Большая яма на ул. Московской, машины объезжают по встречке.',
        category: 'Яма',
        lat: 42.8746,
        lng: 74.5698,
        image_url: 'https://via.placeholder.com/400x200?text=Яма',
        user_id: 'demo-user-1',
        status: 'принято',
        votes: 23,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Не работает фонарь во дворе',
        description: 'Во дворе по Ахунбаева 123 уже неделю нет света, очень темно.',
        category: 'Освещение',
        lat: 42.8856,
        lng: 74.5798,
        user_id: 'demo-user-2',
        status: 'новая',
        votes: 7,
        created_at: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Мусор в парке Панфилова',
        description: 'Много мусора возле входа в парк, никто не убирает.',
        category: 'Мусор',
        lat: 42.8646,
        lng: 74.5798,
        user_id: 'demo-user-1',
        status: 'в_работе',
        votes: 15,
        created_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProblems));
  },
};
