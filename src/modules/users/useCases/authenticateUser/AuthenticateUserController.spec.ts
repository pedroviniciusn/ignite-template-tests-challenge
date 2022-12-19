import { Request } from "supertest";

import { app } from "../../../../app";

import { v4 as uuidV4 } from "uuid";

import { hash } from "bcryptjs"

import { Connection } from "typeorm";

import createConnection from "../../../../database/index"

let connection: Connection;