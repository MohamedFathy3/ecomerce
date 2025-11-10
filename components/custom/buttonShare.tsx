"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  Facebook,
  Share2,
  Music,
  Instagram,
} from "lucide-react";
import { toast } from "sonner";

const ButtonShare = () => {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const title = document?.title || "Check this out!";

  const shareTo = (platform: string) => {
    let url = "";
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);

    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "instagram":
        toast("Instagram doesn’t support direct web share — link copied!");
        navigator.clipboard.writeText(shareUrl);
        return;
      case "tiktok":
        url = `https://www.tiktok.com/share?url=${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

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
          <DropdownMenuItem
            className="text-blue-600"
            onClick={() => shareTo("facebook")}
          >
            <Facebook className="w-4 h-4 mr-2" /> Share on Facebook
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-pink-500"
            onClick={() => shareTo("instagram")}
          >
            <Instagram className="w-4 h-4 mr-2" /> Share on Instagram
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-pink-600"
            onClick={() => shareTo("tiktok")}
          >
            <Music className="w-4 h-4 mr-2" /> Share on TikTok
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-muted-foreground"
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
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
