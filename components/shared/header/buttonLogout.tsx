"use client";
import SpinnerMini from "@/components/custom/SpinnerMini";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { signOutUser } from "@/lib/api/apiUser";
import { User as UserType } from "@/types";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import React, { useTransition } from "react";

const ButtonLogout = ({
  dialogOpen,
  setDialogOpen,
  user,
}: {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserType | null;
}) => {
  const [pending, startTransition] = useTransition();

  const handleLogout = () => {
    signOut({ redirectTo: "/" });
    startTransition(async () => {
      await signOutUser(user?.token as string);
    });
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger className="hidden" asChild>
        <Button variant="ghost" onClick={() => setDialogOpen(true)}>
          <LogOut className="text-destructive" />
          Sign Out
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleLogout}>
            {pending ? <SpinnerMini /> : "Yes, Logout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ButtonLogout;
