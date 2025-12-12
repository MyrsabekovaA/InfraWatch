import { supabase } from './supabaseClient';
import { mockData, type Problem } from './mockData';



export const supabaseWrapper = {
  getProblems: async () => {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.warn('DB недоступна, используем mock данные');
      return { data: mockData.getProblems(), error: null };
    }
  },

  addProblem: async (problem: Problem) => {
    try {
      const { error } = await supabase.from('problems').insert(problem);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      console.warn('DB недоступна, сохраняем в localStorage');
      mockData.addProblem(problem);
      return { error: null };
    }
  },

  updateVotes: async (id: string, newVotes: number) => {
    try {
      const { error } = await supabase
        .from('problems')
        .update({ votes: newVotes })
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      console.warn('DB недоступна, обновляем в localStorage');
      mockData.updateVotes(id, newVotes);
      return { error: null };
    }
  },

  uploadFile: async (bucket: string, path: string, file: File) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file);

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            data: { path: `local://${path}` },
            error: null,
            isLocal: true,
            dataUrl: e.target?.result as string,
          });
        };
        reader.readAsDataURL(file);
      });
    }
  },

  getPublicUrl: (bucket: string, path: string, dataUrl?: string) => {
    if (dataUrl) {
      return { publicUrl: dataUrl };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data;
  },
};
