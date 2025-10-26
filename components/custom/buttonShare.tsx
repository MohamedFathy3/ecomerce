"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Copy, Facebook, Share2, Twitter } from "lucide-react";
import { toast } from "sonner";

const ButtonShare = () => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-slate-100 text-primary dark:hover:bg-slate-800"
          >
            <Share2 className="!w-7 !h-7" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52 p-2">
          <DropdownMenuItem className="text-blue-600">
            <Facebook className="w-4 h-4 mr-2" /> Share on Facebook
          </DropdownMenuItem>
          <DropdownMenuItem className="text-sky-500">
            <Twitter className="w-4 h-4 mr-2" /> Share on Twitter
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-muted-foreground"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.custom(() => (
                <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-md shadow-md">
                  <Copy className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Link copied to clipboard</span>
                </div>
              ));
            }}
          >
            <Copy className="w-4 h-4 mr-2" /> Copy Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ButtonShare;
