import {env as loadEnv} from "custom-env";
import {z} from "zod";

process.env.APP_STAGE = process.env.APP_STAGE || `development`;

const isDevelopment = process.env.APP_STAGE === `development`;
const isTesting = process.env.APP_STAGE === `test`;

if (isDevelopment) {
    loadEnv();
} else if (isTesting) {
    loadEnv("test");
}

const SENSITIVE_KEYS = [`DATABASE_URL`, `JWT_SECRET`, "AZURE_STORAGE_CONNECTION_STRING", "AZURE_STORAGE_ACCOUNT_KEY"];

const envSchema = z.object({
    NODE_ENV: z.enum([`production`, `development`, `test`]).default(`development`),
    APP_STAGE: z.enum([`production`, `development`, `test`]).default(`development`),
    PORT: z.coerce.number().positive().default(3000),
    
    DATABASE_URL: z.string().startsWith(`postgresql://`),
    JWT_SECRET: z.string().min(32, `must be at least 32 characters long`),
    JWT_EXPIRES_IN: z.string().default(`5h`),
    BCRYPT_ROUNDS: z.coerce.number().min(10).max(14).default(12),
    
    AZURE_STORAGE_CONNECTION_STRING: z.string().min(1),
    AZURE_STORAGE_CONTAINER_NAME: z.string().min(1),
    AZURE_STORAGE_ACCOUNT_NAME: z.string().min(1),
    AZURE_STORAGE_ACCOUNT_KEY: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;
let env: Env;


function redact(value: unknown): unknown {
    if (typeof value !== `object` || value === null) return value;
    
    const clone: Record<string, unknown> = {...(value as Record<string, unknown>)};
    for (const key of SENSITIVE_KEYS) {
        if (key in clone) clone[key] = `[REDACTED]`;
    }
    return clone;
}

try{
    env = envSchema.parse(process.env);
} 
catch (e){
    if (e instanceof z.ZodError) { 
        console.error(`Invalid environment variables:`);
        console.error(JSON.stringify(redact(e.flatten().fieldErrors), null, 2));
        
        e.issues.forEach(err =>{ 
            const path = err.path.join(`.`);
            const isSensitive = SENSITIVE_KEYS.includes(path);
            console.error(`${path}: ${isSensitive ? `invalid value (redacted)` : err.message}`);
        })
        
        process.exit(1);
    }
    
    throw e;
}

export const isProd = () => env.APP_STAGE === `production`;
export const isDev = () => env.APP_STAGE === `development`;
export const isTest = () => env.APP_STAGE === `test`;

export const publicEnv = {
    NODE_ENV: env.NODE_ENV,
    APP_STAGE: env.APP_STAGE,
    PORT: env.PORT,
    JWT_EXPIRES_IN: env.JWT_EXPIRES_IN,
};

export { env };
export default env;