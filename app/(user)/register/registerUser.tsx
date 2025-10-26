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
  EGYPT_GOVERNORATES,
  signUpDefaultValues,
} from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

// 3|e8wTV7x6fnsJjPbowVI3OmVxM78DqkGSnj68G7BDc3155768

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
      const errorsArray = Object.entries(response.payload).map(
        ([key, value]) => value as string
      );
      setFormErrors(errorsArray);
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
        <CardTitle className="text-center">Sign Up</CardTitle>
        <CardDescription className="text-center">
          Create your account, enter your information below.
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <Label htmlFor="first_name" className="block text-sm font-medium">
            First Name
          </Label>
          <Input
            id="first_name"
            type="text"
            {...register("first_name")}
            className="mt-1"
            defaultValue={signUpDefaultValues.first_name}
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.first_name.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="last_name" className="block text-sm font-medium">
            Last Name
          </Label>
          <Input
            id="last_name"
            type="text"
            {...register("last_name")}
            className="mt-1"
            defaultValue={signUpDefaultValues.last_name}
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.last_name.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="governorate" className="block text-sm font-medium">
            Governorate
          </Label>
          <select
            id="governorate"
            {...register("state")}
            defaultValue={signUpDefaultValues.governorate}
            className="mt-1 block w-full border py-1 px-3 bg-input/30 rounded-md shadow-sm"
          >
            <option value="-1">Select governorate</option>
            {EGYPT_GOVERNORATES.map((gov) => (
              <option key={gov} value={gov}>
                {gov}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="gender" className="block text-sm font-medium">
            Gender
          </Label>
          <select
            id="gender"
            {...register("gender")}
            defaultValue={signUpDefaultValues.gender}
            className="mt-1 block w-full border py-1 px-3 bg-input/30 rounded-md shadow-sm"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="age" className="block text-sm font-medium">
            Age
          </Label>
          <Input
            id="age"
            type="text"
            {...register("age")}
            className="mt-1"
            defaultValue={signUpDefaultValues.age}
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="block text-sm font-medium">
            Phone
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
            Email
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
            Password
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

        <div>
          <Label
            htmlFor="password_confirmation"
            className="block text-sm font-medium"
          >
            Confirm Password
          </Label>
          <Input
            id="password_confirmation"
            type="password"
            {...register("password_confirmation")}
            className="mt-1"
            defaultValue={signUpDefaultValues.password_confirmation}
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        <div className="col-span-full flex flex-col gap-3 mt-4 ">
          {formErrors.length > 0 && (
            <div className=" bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
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
            {isSubmitting ? <SpinnerMini /> : "Register"}
          </Button>
        </div>
        <div className="col-span-full text-center text-sm text-muted-foreground">
          Already have an account?
          <Link href="/signin" target="_self" className="link">
            Sign In
          </Link>
        </div>
      </form>
    </Card>
  );
};

export default RegisterUser;
