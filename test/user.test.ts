import request from "supertest";
import app from "../src/server.ts";
import { v4 as uuid } from "uuid";
import { createTestUser, clearDatabase } from "./setup/dbHelpers.ts";
import { hashPassword } from "../src/utils/password.ts";