import {prismaClient} from "../src/application/database.js";
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            userName: "testing"
        }
    })
}

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            userName: "testing",
            pin: await bcrypt.hash("123456", 10),
            accountNumber: "1234567890",
            emailAddress: "renaldy@gmail.com",
            identityNumber: "1234567890123456"
        }
    })
}

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            userName: "testing"
        }
    });
}