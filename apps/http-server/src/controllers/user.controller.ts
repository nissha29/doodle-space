import { Request, Response } from "express";
import { CreateUserSchema, signInSchema } from "@repo/common/types";
import { prismaClient } from "@repo/prisma/client";
import { generateToken } from "../utils/token.util.js";
import bcrypt from "bcrypt";
import { emitError, emitSuccess } from "../utils/response.util.js";
import { CustomRequest } from "../types/express.js";

const signup = async (req: Request, res: Response) => {
  try {
    const { error, data } = CreateUserSchema.safeParse(req.body);
    if (error) {
      emitError({ res, error: `Incorrect Inputs, ${error}`, statusCode: 400 });
      return;
    }

    const { name, email, password } = data;
    const existingUser = await prismaClient.user.findFirst({
      where: { name, email },
    });
    if (existingUser) {
      emitError({ res, error: `User already exists`, statusCode: 409 });
      return;
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashedPass,
      },
    });

    const token = generateToken(user.id);
    if(token?.error){
      emitError({ res, error: `${token.error}`, statusCode: 400 });
      return;
    }

    emitSuccess({
      res,
      result: { token, user: { name: user.name, email: user.email } },
      message: `You are signed up successfully`,
    });
    return;
  } catch (error) {
    emitError({ res, error: `Error while signing up, ${error}` });
    return;
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const { error, data } = signInSchema.safeParse(req.body);
    if (error) {
      emitError({ res, error: `Incorrect Inputs, ${error}`, statusCode: 400 });
      return;
    }

    const { email, password } = data;
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      emitError({ res, error: `User doesn't exists`, statusCode: 400 });
      return;
    }

    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
      emitError({ res, error: `Incorrect Password`, statusCode: 400 });
      return;
    }

    const token = generateToken(user.id);
    if(token?.error){
      emitError({ res, error: `${token.error}`, statusCode: 400 });
      return;
    }
    
    emitSuccess({
      res,
      result: { token, user: { name: user.name, email: user.email } },
      message: `You are signed in successfully`,
    });
    return;
  } catch (error) {
    emitError({ res, error: `Error while signing in, ${error}` });
    return;
  }
};

const me = async(req: CustomRequest, res: Response) => {
  const userId = req.userId;
  
  const user = await prismaClient.user.findFirst({
    where: {
      id: userId,
    }
  });

  if(! user){
    emitError({ res, error: 'User not found', statusCode: 404 });
    return;
  }

  emitSuccess({
    res,
    result: { user: { name: user.name, email: user.email } },
    message: 'User data has been sent successfully'
  });
  return;
}

export { signup, signin, me };
