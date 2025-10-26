"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useOrder } from "@/contexts/OrderContext";
import { getUserAddresses } from "@/lib/api/apiUser";
import { UserAddress } from "@/types";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Spinner from "../spinner";
import ButtonStepNav from "./buttonStepNav";
import Link from "next/link";

export default function ChooseLocationTab({ onNext }: { onNext: () => void }) {
  const searchParams = useSearchParams();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const { data: session, status } = useSession();
  const [userToken, setUserToken] = useState<string>("");
  const [pendingAddresses, startTransitionAddresses] = useTransition();
  const [open, setOpen] = useState(false);
  const { setShippingAddress, shippingAddress, setPharmacyId } = useOrder();

  async function fetchAddresses() {
    const addressesData = await getUserAddresses(userToken);
    if (addressesData?.success) {
      setAddresses(addressesData?.data as UserAddress[]);
      const defaultAddress = (addressesData?.data as UserAddress[])?.find(
        (addr) => addr.is_default
      );
      setShippingAddress?.(
        defaultAddress?.id || "",
        `${defaultAddress?.city}, ${defaultAddress?.area}, ${defaultAddress?.building}` ||
          ""
      );
    }
  }

  useEffect(() => {
    const pharmacyId = searchParams.get("pharmacyId");
    if (pharmacyId) {
      setPharmacyId?.(parseInt(pharmacyId));
    }
  }, []);

  useEffect(
    function () {
      if (status === "authenticated" && session?.user.token) {
        setUserToken(session.user.token);
      } else {
        setUserToken("");
      }
    },
    [status]
  );

  useEffect(() => {
    if (userToken) {
      startTransitionAddresses(fetchAddresses);
    }
  }, [userToken]);

  if (pendingAddresses) {
    return <Spinner />;
  }

  return (
    <div className="space-y-4 pt-4">
      <h3 className="text-lg font-bold text-foreground">Choose Location</h3>
      <RadioGroup
        value={shippingAddress || ""}
        onValueChange={(value) => {
          const selectedAddress = addresses.find(
            (addr) => addr.id?.toString() === value
          );
          if (selectedAddress) {
            setShippingAddress?.(
              selectedAddress.id ?? "",
              `${selectedAddress.city}, ${selectedAddress.area}, ${selectedAddress.building}`
            );
          }
        }}
        className="space-y-3"
      >
        {addresses &&
          addresses.length > 0 &&
          addresses.map((addr) => (
            <label
              key={addr.id}
              className="flex items-center gap-4 border p-4 rounded-xl border-border"
              // onClick={() => setShippingAddress?.(addr.id)}
            >
              <RadioGroupItem
                value={addr.id?.toString() as string}
                checked={addr.id === shippingAddress}
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-foreground">
                    {addr.name}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {addr.city}, {addr.area}, {addr.building}
                </p>
              </div>
              {addr.is_default ? (
                <Badge variant="outline" className="text-xs ms-auto">
                  default
                </Badge>
              ) : null}
            </label>
          ))}
      </RadioGroup>
      <div className="flex justify-between">
        {/* <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">Add New Address</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="set-default"
                  checked={setDefault}
                  onCheckedChange={(v) => setSetDefault(!!v)}
                />
                <Label htmlFor="set-default">Set as default</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddAddress}>Add</Button> 
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
        <Button asChild variant="secondary">
          <Link href="/account/addresses">Add New Address</Link>
        </Button>
        <ButtonStepNav handleClick={onNext}>
          Next
          <ArrowRight className="auto-dir" />
        </ButtonStepNav>
      </div>
    </div>
  );
}
