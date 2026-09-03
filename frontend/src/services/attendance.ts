import { apiFetch } from  "./http";

export interface Attendance {
    id: string;
    eventId: string;
    userId: string;
    isLate: boolean;
    attendedAt: string;
    isArchived: boolean;
    isArchivedByStudent: boolean;
    isArchivedByEvent: boolean;
}

export const checkAttendance = async (eventId: string, userId: string) => {
    const response = await apiFetch(`/attendance/checkAttendance/${eventId}/${userId}`, {
        method: "GET",
        credentials: "include",
    });
    return response.json();
};

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

export const getAllAttendanceByStudentId = async (userId: string) => {
    const response = await apiFetch(`/attendance/userId/${userId}`, {
        method: "GET",
        credentials: "include",
    });
    return response.json();
}

export const getAllEventAttendance = async () => {
    const response = await apiFetch(`/attendance/allEvents`, {
        method: "GET",
        credentials: "include",
    });
    return response.json();
}

export const getAllArchivedEventAttendance = async () => {
    const response = await apiFetch(`/attendance/allArchivedEvents`, {
        method: "GET",
        credentials: "include",
    });
    return response.json();
}

export const getAttendanceByEventId = async (eventId: string) => {
    const response = await apiFetch(`/attendance/eventId/${eventId}`, {
        method: "GET",
        credentials: "include",
    });
    return response.json();
}

export const getEventAttendanceByStrand = async ( strand: string, archived: boolean) => {
    const response = await apiFetch(`/attendance/strand/${strand}?archived=${archived}`, {
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

export const updateAttendance = async (attendanceId: string, isLate: boolean) => {
    const response = await apiFetch(`/attendance/update/${attendanceId}`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({ isLate }),
    });
    return response.json();
}

export const unarchiveAttendance = async (attendanceId: string) => {
    const response = await apiFetch(`/attendance/unarchive/${attendanceId}`, {
        method: "PATCH",
        credentials: "include",
    });
    return response.json();
}

export const archiveAttendance = async (attendanceId: string) => {
    const response = await apiFetch(`/attendance/archive/${attendanceId}`, {
        method: "PATCH",
        credentials: "include",
    });
    return response.json();
}