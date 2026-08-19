import { apiFetch } from  "./http";

export interface Attendance {
    id: string;
    eventId: string;
    userId: string;
    isLate: boolean;
    attendedAt: string;
}

export const markStudentPresent = async (uuid: string, eventId: string, isLate: boolean) => {
    const response = await apiFetch(`/attendance/mark`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ 
            eventId: eventId,
            userId: uuid,
            isLate: isLate
        }),
    });
    return response.json();
};

export const getAttendanceByEventId = async (eventId: string) => {
    const response = await apiFetch(`/attendance/eventId/${eventId}`, {
        method: "GET",
        credentials: "include",
    });
    return response.json();
}


export const getEventAttendanceByStrand = async ( strand: string) => {
    const response = await apiFetch(`/attendance/strand/${strand}`, {
        method: "GET",
        credentials: "include",
    });
    return response.json();
};


export const getAttendanceByStrand= async (eventId: string, strand: string) => {
    const response = await apiFetch(`/attendance/groupStrand/${strand}/eventId/${eventId}`, {
        method: "GET",
        credentials: "include",
    });
    return response.json();
}
