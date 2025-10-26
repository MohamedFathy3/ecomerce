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
import { doctorRegisterSchema } from "@/lib/validators";
import { DoctorRegisterFormData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import SpinnerMini from "@/components/custom/SpinnerMini";
import { registerDoctor } from "@/lib/api/apiUser";
import { APP_NAME, signUpDefaultValues } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

// 3|e8wTV7x6fnsJjPbowVI3OmVxM78DqkGSnj68G7BDc3155768

const RegisterDoctor = () => {
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    formState: { errors },
  } = useForm<DoctorRegisterFormData>({
    resolver: zodResolver(doctorRegisterSchema),
  });

  const onSubmit = async (data: DoctorRegisterFormData) => {
    setFormErrors([]);

    // Create the payload with the file object
    const payload = {
      ...data,
      certificate_file: certificateFile || undefined,
    };

    const response = await registerDoctor(payload);
    console.log(response);

    if (response.status === "error") {
      const errorsArray = Object.values(response.payload).map(
        (value) => value as string
      );
      setFormErrors(errorsArray);
    } else {
      redirect("/signin");
    }
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificateFile(file);
      // Set the filename for validation purposes
      setValue("certificate_file", file.name, { shouldValidate: true });
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
        <input type="hidden" name="is_doctor" value="1" />
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
            Address
          </Label>
          <Input
            id="governorate"
            {...register("state")}
            defaultValue={signUpDefaultValues.governorate}
            className="mt-1"
          />

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
            className="mt-1 block w-full border py-1 px-3  rounded-md shadow-sm"
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

        <div>
          <Label htmlFor="license_number" className="block text-sm font-medium">
            License Number
          </Label>
          <Input
            id="license_number"
            type="text"
            {...register("license_number")}
            className="mt-1"
            defaultValue={signUpDefaultValues.license_number}
          />
          {errors.license_number && (
            <p className="text-red-500 text-sm mt-1">
              {errors.license_number.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="specialization" className="block text-sm font-medium">
            Specialization
          </Label>
          <Input
            id="specialization"
            type="text"
            {...register("specialization")}
            className="mt-1"
            defaultValue={signUpDefaultValues.specialization}
          />
          {errors.specialization && (
            <p className="text-red-500 text-sm mt-1">
              {errors.specialization.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="certificate" className="block text-sm font-medium">
            Certificate
          </Label>
          <Input
            id="certificate"
            type="file"
            onChange={handleCertificateChange}
            className="mt-1"
          />
          {errors.certificate_file && (
            <p className="text-red-500 text-sm mt-1">
              {errors.certificate_file.message}
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

export default RegisterDoctor;
