export class ApiError extends Error {
    status: number
    details: Record<string, unknown>;
    constructor(message: string, status: number, details: Record<string, unknown> = {}) {
        super(message);
        this.status = status;
        this.details = details;
        this.name = "ApiError";
    }
}