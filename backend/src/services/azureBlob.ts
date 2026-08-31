import { BlobServiceClient, BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } from "@azure/storage-blob";
import { env } from "../../env.ts";
import { randomUUID } from "crypto";

const blobServiceClient = BlobServiceClient.fromConnectionString(
    env.AZURE_STORAGE_CONNECTION_STRING
);

const containerClient = blobServiceClient.getContainerClient(
    env.AZURE_STORAGE_CONTAINER_NAME
);

const sharedKeyCredential = new StorageSharedKeyCredential(
    env.AZURE_STORAGE_ACCOUNT_NAME,
    env.AZURE_STORAGE_ACCOUNT_KEY
);

export const uploadProfilePicture = async (file: Express.Multer.File) => {
    const fileExtension = file.originalname.split(".").pop();
    
    const blobName = `${randomUUID()}.${fileExtension}`;
    
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: {
            blobContentType: file.mimetype
        }
    });
    
    return blobName;
};

export const updateProfilePicture = async (blobName: string, file: Express.Multer.File) => {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: {
            blobContentType: file.mimetype
        }
    });
    return blobName;
};

export const generateProfilePictureSASUrl = (blobName: string) => {
    const startTime = new Date(Date.now() - 5 * 60 * 1000); 
    const expiryTime = new Date(Date.now() + 30 * 60 * 1000);
    
    const sasToken = generateBlobSASQueryParameters(
        {
            containerName: env.AZURE_STORAGE_CONTAINER_NAME,
            blobName: blobName,
            permissions: BlobSASPermissions.parse("r"),
            startsOn: startTime,
            expiresOn: expiryTime
        },
        sharedKeyCredential
    ).toString();
    
    return `${containerClient.getBlockBlobClient(blobName).url}?${sasToken}`;
};