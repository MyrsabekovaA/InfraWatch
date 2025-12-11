CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'org')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  image_url TEXT,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'новая' 
    CHECK (status IN ('новая', 'принято', 'в_работе', 'решено')),
  votes INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(problem_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_problems_user_id ON public.problems(user_id);
CREATE INDEX IF NOT EXISTS idx_problems_status ON public.problems(status);
CREATE INDEX IF NOT EXISTS idx_problems_created_at ON public.problems(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_votes_problem_id ON public.votes(problem_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON public.votes(user_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Профили доступны для чтения" ON public.profiles;
DROP POLICY IF EXISTS "Пользователь может создать свой профиль" ON public.profiles;
DROP POLICY IF EXISTS "Пользователь может обновить свой профиль" ON public.profiles;
DROP POLICY IF EXISTS "Проблемы доступны для чтения" ON public.problems;
DROP POLICY IF EXISTS "Авторизованный пользователь может добавить проблему" ON public.problems;
DROP POLICY IF EXISTS "Автор может обновить свою проблему" ON public.problems;
DROP POLICY IF EXISTS "Автор может удалить свою проблему" ON public.problems;
DROP POLICY IF EXISTS "Голоса доступны для чтения" ON public.votes;
DROP POLICY IF EXISTS "Авторизованный пользователь может голосовать" ON public.votes;
DROP POLICY IF EXISTS "Пользователь может удалить свой голос" ON public.votes;

CREATE POLICY "Профили доступны для чтения"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Пользователь может создать свой профиль"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Пользователь может обновить свой профиль"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Проблемы доступны для чтения"
  ON public.problems
  FOR SELECT
  USING (true);

CREATE POLICY "Авторизованный пользователь может добавить проблему"
  ON public.problems
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Автор может обновить свою проблему"
  ON public.problems
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Автор может удалить свою проблему"
  ON public.problems
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Голоса доступны для чтения"
  ON public.votes
  FOR SELECT
  USING (true);

CREATE POLICY "Авторизованный пользователь может голосовать"
  ON public.votes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Пользователь может удалить свой голос"
  ON public.votes
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS trigger_problems_updated_at ON public.problems;

CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trigger_problems_updated_at
BEFORE UPDATE ON public.problems
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();
