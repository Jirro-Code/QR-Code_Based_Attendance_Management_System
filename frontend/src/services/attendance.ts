import { apiFetch } from  "./http";

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

