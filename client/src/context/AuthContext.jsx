import React, { createContext, useContext, useEffect, useState } from 'react';

import { supabase } from '../services/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    // Fetch full profile including custom RBAC role

    const fetchProfile = async (userId) => {

        try {

            const { data, error } = await supabase

                .from('profiles')

                .select('*')

                .eq('id', userId)

                .single();

            if (error) throw error;

            setProfile(data);

        } catch (err) {

            console.error('[AuthContext] Error fetching profile:', err.message);

            setProfile(null);

        }

    };


    useEffect(() => {

        // This part Check initial auth session

        const getInitialSession = async () => {

            try {

                const { data, error } = await supabase.auth.getSession();

                if (error) throw error;


                if (data?.session?.user) {

                    setUser(data.session.user);

                    await fetchProfile(data.session.user.id);
                }

            } catch (err) {

                console.error('[AuthContext] Error getting initial session:', err.message);

            } finally {

                setLoading(false);

            }

        };

        getInitialSession();

        // This is a Safe real-time auth listener setup

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {

            if (session?.user) {

                setUser(session.user);

                await fetchProfile(session.user.id);

            } else {

                setUser(null);

                setProfile(null);

            }

            setLoading(false);

        });

        // This is a Safe cleanup preventing undefined subscription crashes

        return () => {

            if (authListener?.subscription) {

                authListener.subscription.unsubscribe();

            }

        };

    }, []);



    // This Standard Email/Password SignUp

    const signUp = async (email, password, fullName, contactNumber) => {

        const { data, error } = await supabase.auth.signUp({

            email,

            password,

            options: {

                data: {

                    full_name: fullName,

                    contact_number: contactNumber,

                },

            },

        });


        if (error) throw error;

        return data;

    };


    // This will be the Standard Email/Password Login

    const signIn = async (email, password) => {

        const { data, error } = await supabase.auth.signInWithPassword({

            email,

            password,

        });


        if (error) throw error;

        return data;

    };

    // This is the par where Google OAuth Login

    const signInWithGoogle = async () => {

        const { data, error } = await supabase.auth.signInWithOAuth({

            provider: 'google',

            options: {

                redirectTo: window.location.origin,

            },

        });


        if (error) throw error;

        return data;

    };


    // User SignOut

    const signOut = async () => {

        const { error } = await supabase.auth.signOut();

        if (error) console.error('[AuthContext] Error during signout:', error.message);

        setUser(null);

        setProfile(null);

    };


    return (

        <AuthContext.Provider

            value={{

                user,

                profile,

                loading,

                signUp,

                signIn,

                signInWithGoogle,

                signOut,

            }}

        >

            {!loading && children}

        </AuthContext.Provider>

    );

};


export const useAuth = () => useContext(AuthContext);
