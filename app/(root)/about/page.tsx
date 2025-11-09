"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/lib/validators";
import { RegisterFormData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

import SpinnerMini from "@/components/custom/SpinnerMini";
import { registerUser } from "@/lib/api/apiUser";
import {
  APP_NAME,
  signUpDefaultValues,
} from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ServerTranslate } from '@/components/ServerTranslate';

const RegisterUser = () => {
  const [formErrors, setFormErrors] = React.useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setFormErrors([]);
    const response = await registerUser(data);
    console.log(response);

    if (response.status === "error") {
      if (response?.payload && typeof response.payload === "object") {
        const errorsArray = Object.entries(response.payload).map(
          ([, value]) => String(value)
        );
        setFormErrors(errorsArray);
      } else if (response?.message) {
        setFormErrors([response.message]);
      } else {
        setFormErrors(["An unknown error occurred. Please try again."]);
      }
    } else {
      redirect("/signin");
    }
  };

  return (
    <Card className="p-6 w-full max-w-[900px] bg-teal-100/20 dark:bg-background">
      <CardHeader className="space-y-4">
        <Link href="/" className="flex-center">
          <Image
            src="/images/logos/Logo.svg"
            width={100}
            height={100}
            alt={`${APP_NAME} logo`}
            priority
          />
        </Link>
        <CardTitle className="text-center">
          <ServerTranslate textKey="register.title" />
        </CardTitle>
        <CardDescription className="text-center">
          <ServerTranslate textKey="register.description" />
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <Label htmlFor="name" className="block text-sm font-medium">
            <ServerTranslate textKey="register.name" />
          </Label>
          <Input
            id="name"
            type="text"
            {...register("name")}
            className="mt-1"
            defaultValue={signUpDefaultValues.first_name}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="block text-sm font-medium">
            <ServerTranslate textKey="register.phone" />
          </Label>
          <Input
            id="phone"
            type="text"
            {...register("phone")}
            className="mt-1"
            defaultValue={signUpDefaultValues.phone}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="block text-sm font-medium">
            <ServerTranslate textKey="register.email" />
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className="mt-1"
            defaultValue={signUpDefaultValues.email}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="block text-sm font-medium">
            <ServerTranslate textKey="register.password" />
          </Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            className="mt-1"
            defaultValue={signUpDefaultValues.password}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="col-span-full flex flex-col gap-3 mt-4">
          {formErrors.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <ul className="list-disc ps-5">
                {formErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-fit mx-auto"
          >
            {isSubmitting ? <SpinnerMini /> : <ServerTranslate textKey="register.register" />}
          </Button>
        </div>
        <div className="col-span-full text-center text-sm text-muted-foreground">
          <ServerTranslate textKey="register.haveAccount" />
          <Link href="/signin" target="_self" className="link">
            <ServerTranslate textKey="register.signIn" />
          </Link>
        </div>
      </form>
    </Card>
  );
};

export default RegisterUser;