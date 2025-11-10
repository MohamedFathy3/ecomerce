"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Share2,
  Instagram,
  Facebook,
  Music,
} from "lucide-react";
import Link from "next/link";

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
        <DropdownMenuContent className="w-56 p-2">
          {/* فيسبوك */}
          <DropdownMenuItem asChild>
            <Link 
              href="https://www.facebook.com/people/Forma-Shop/61583053477324/" 
              aria-label="Facebook" 
              target="_blank" 
              className="flex items-center w-full"
            >
              <Facebook className="w-4 h-4 mr-2 text-blue-600" /> 
              Facebook
            </Link>
          </DropdownMenuItem>

          {/* تيك توك */}
          <DropdownMenuItem asChild>
            <Link 
              href="https://www.tiktok.com/tag/tecktik" 
              target="_blank" 
              className="flex items-center w-full"
            >
              <Music className="w-4 h-4 mr-2 text-black" /> 
              TikTok
            </Link>
          </DropdownMenuItem>

          {/* انستجرام */}
          <DropdownMenuItem asChild>
            <Link 
              href="https://www.instagram.com/formashop.nl/" 
              aria-label="Instagram" 
              target="_blank" 
              className="flex items-center w-full"
            >
              <Instagram className="w-4 h-4 mr-2 text-pink-500" /> 
              Instagram
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ButtonShare;