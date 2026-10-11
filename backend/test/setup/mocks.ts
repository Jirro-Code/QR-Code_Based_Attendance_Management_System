import { vi } from "vitest";

vi.mock("../../src/services/azureBlob.ts", () => ({
    uploadProfilePicture: vi.fn(async () => "test-profile-picture.jpg"),
    updateProfilePicture: vi.fn(async (blobName: string) => blobName),
    generateProfilePictureSASUrl: vi.fn((blobName: string) => `https://test.invalid/${blobName}`),
}));

vi.mock("../../src/services/email.ts", () => ({
    sendPasswordResetOTP: vi.fn(async (email: string) => ({
        accepted: [email],
        rejected: [],
    })),
    sendAccountCreationEmail: vi.fn(async (email: string) => ({
        accepted: [email],
        rejected: [],
    })),
    sendEmailUpdateEmail: vi.fn(async (email: string) => ({
        accepted: [email],
        rejected: [],
    })),
}));

vi.mock("../../src/index.ts", () => ({
    io: {
        to: vi.fn(() => ({
            emit: vi.fn(),
        })),
    },
}));
