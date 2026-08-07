import { UpdateUser } from "../services/users";

function useUpdate() {
    async function updateData(data: any) {
        try {
            const response = await UpdateUser(data.id, data);
            return response.json();
        } catch (error) {
            console.error("Error updating data:", error);
            throw error;
        }
    }
    return { updateData };
}
export default useUpdate;   