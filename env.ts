import {env as loadEnv} from "custom-env";
//zod is a package that validates the environment's data type and format
import {z} from "zod";

process.env.APP_STAGE = process.env.APP_STAGE || `development`;

const isProduction = process.env.APP_STAGE === `production`;
const isDevelopment = process.env.APP_STAGE === `development`;
const isTesting = process.env.APP_STAGE === `test`;

if (isDevelopment) {
    loadEnv();
} else if (isTesting) {
    loadEnv("test");
}

const envSchema = z.object({
    NODE_ENV: z.enum([`production`, `development`, `test`]).default(`development`),
    APP_STAGE: z.enum([`production`, `development`, `test`]).default(`development`),
    PORT: z.coerce.number().positive().default(3000),
    DATABASE_URL: z.string().startsWith(`mysql://`),
    JWT_SECRET: z.string().min(32, `must be at least 32 characters long`),
    JWT_EXPIRES_IN: z.string().default(`3d`),
    BCRYPT_ROUNDS: z.coerce.number().min(18).max(20).default(12),
});

export type Env = z.infer<typeof envSchema>;
let env: Env;

try{
    env = envSchema.parse(process.env);
} catch (e){
    if (e instanceof z.ZodError) { 
        console.log(`Invalid environment variables:`);
        //null, 2 is used to pretty print the JSON output, meaning 2 indentation
        //flatten() used to convert errors intro more readable format, fieldErrors is used to get the errors related to each field
        console.error(JSON.stringify(e.flatten().fieldErrors, null, 2));

        e.issues.forEach(err =>{ 
            const path = err.path.join(`.`);
            console.log(`${path}: ${err.message}`);
        })
        
        process.exit(1);
    }

    throw e;
}

export const isProd = () => env.APP_STAGE === `production`;
export const isDev = () => env.APP_STAGE === `development`;
export const isTest = () => env.APP_STAGE === `test`;

export { env };
export default env;