import { create } from "zustand";

export interface Session {

    id: string;

    macAddress: string;

    ipAddress: string | null;

    packageId: string;

    packageName: string;

    startTime: string;

    endTime: string;

    isActive: boolean;

}

interface SessionStore {

    sessions: Session[];

    setSessions: (sessions: Session[]) => void;

    addSession: (session: Session) => void;

    updateSession: (
        id: string,
        data: Partial<Session>
    ) => void;

}

export const useSessionStore =
create<SessionStore>((set) => ({

    sessions: [],

    setSessions: (sessions) =>
        set({ sessions }),

    addSession: (session) =>
        set((state) => ({
            sessions: [...state.sessions, session],
        })),

    updateSession: (id, data) =>
        set((state) => ({
            sessions: state.sessions.map((session) =>
                session.id === id
                    ? { ...session, ...data }
                    : session
            ),
        })),

}));