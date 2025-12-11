import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // начальное состояние
        supabase.auth.getSession().then(({data}) => {
            setUser(data.session?.user ?? null);
            setLoading(false);
        });

        // подписка на изменения (login/logout)
        const {data: subscription} = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            subscription.subscription.unsubscribe();
        };
    }, []);

    return {user, loading};
}