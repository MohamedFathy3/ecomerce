"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { 
  ImageOff, 
  Video, 
  Ruler,
  X,
  Volume2,
  VolumeX
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ProductImagesProps {
  images: string[];
  videoUrl?: string;
  productName: string;
}

// تعريف الـ interfaces
interface ImageMedia {
  type: 'image';
  url: string;
}

interface VideoMedia {
  type: 'video';
  url: string;
  thumbnail: string;
}

type MediaItem = ImageMedia | VideoMedia;

const ProductImages = ({ images, videoUrl, productName }: ProductImagesProps) => {
  const [current, setCurrent] = useState(0);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // ✅ علشان الـ autoplay
  const [hasInteracted, setHasInteracted] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ✅ إصلاح: تحقق من وجود videoUrl صالح
  const isValidVideoUrl = videoUrl && 
    (videoUrl.startsWith('http') || videoUrl.startsWith('https')) &&
    (videoUrl.includes('youtube') || videoUrl.includes('youtu.be') || videoUrl.includes('vimeo') || videoUrl.endsWith('.mp4'));

  // دمج الصور والفيديو في مصفوفة واحدة للعرض
  const mediaItems: MediaItem[] = [
    ...(isValidVideoUrl ? [{ 
      type: 'video', 
      url: videoUrl, 
      thumbnail: images[0] || '/placeholder.jpg' 
    } as VideoMedia] : []),
    ...images.map(img => ({ 
      type: 'image', 
      url: img 
    } as ImageMedia))
  ];

  // ✅ تشغيل الفيديو أوتوماتيك لما يتغير الـ current
  useEffect(() => {
    const currentMedia = mediaItems[current];
    if (currentMedia?.type === 'video') {
      // إعادة تعيين حالة التفاعل
      setHasInteracted(false);
      
      // إذا كان فيديو عادي، شغله أوتوماتيك
      if (videoRef.current && !currentMedia.url.includes('youtube') && !currentMedia.url.includes('vimeo')) {
        videoRef.current.play().catch(error => {
          console.log('Autoplay blocked:', error);
        });
      }
    }
  }, [current, mediaItems]);

  // ✅ toggle mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    setHasInteracted(true);
  };

  // الحصول على أبعاد الصورة
  useEffect(() => {
    const currentMedia = mediaItems[current];
    if (currentMedia?.type === 'image') {
      const imgElement = document.createElement('img');
      imgElement.src = currentMedia.url;
      imgElement.onload = () => {
        setImageDimensions({
          width: imgElement.naturalWidth,
          height: imgElement.naturalHeight
        });
      };
      imgElement.onerror = () => {
        console.error('Failed to load image for dimension detection');
      };
    }
  }, [current, mediaItems]);

  if (mediaItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-80 md:min-h-[500px] border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
        <div className="relative flex flex-col items-center justify-center">
          <ImageOff className="w-16 h-16 text-gray-400 mb-4" />
          <div className="text-gray-500 text-lg">No images available</div>
          <div className="text-gray-400 text-sm mt-2">Product images will be added soon</div>
        </div>
      </div>
    );
  }

  const currentMedia = mediaItems[current];

  return (
    <div className="flex flex-col gap-4 h-full">
      
      {/* Main Image/Video Display */}
      <div 
        className="relative aspect-square w-full bg-white rounded-xl border border-gray-200 overflow-hidden group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        
        {/* Video Indicator */}
        {currentMedia.type === 'video' && (
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium shadow-lg">
              <Video className="w-4 h-4" />
              VIDEO
            </div>
          </div>
        )}

        {/* Mute/Unmute Button للفيديو */}
        {currentMedia.type === 'video' && !currentMedia.url.includes('youtube') && !currentMedia.url.includes('vimeo') && (
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={toggleMute}
              className="bg-black/70 text-white p-2 rounded-full hover:bg-black transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Main Media Display */}
        <div className="w-full h-full">
          {currentMedia.type === 'video' ? (
            <div className="w-full h-full flex items-center justify-center bg-black rounded-xl">
              {currentMedia.url.includes('youtube') || currentMedia.url.includes('youtu.be') ? (
                <iframe
                  src={`${currentMedia.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}?autoplay=1&mute=1&playsinline=1`}
                  className="w-full h-full rounded-xl"
                  allowFullScreen
                  title="Product Video"
                  allow="autoplay; encrypted-media"
                />
              ) : currentMedia.url.includes('vimeo') ? (
                <iframe
                  src={`${currentMedia.url.replace('vimeo.com/', 'player.vimeo.com/video/')}?autoplay=1&muted=1&playsinline=1`}
                  className="w-full h-full rounded-xl"
                  allowFullScreen
                  title="Product Video"
                  allow="autoplay; encrypted-media"
                />
              ) : (
                <video 
                  ref={videoRef}
                  controls={hasInteracted}
                  className="w-full h-full object-contain rounded-xl"
                  poster={currentMedia.thumbnail}
                  autoPlay
                  muted={isMuted}
                  playsInline
                  loop
                >
                  <source src={currentMedia.url} type="video/mp4" />
                  <source src={currentMedia.url} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ) : (
            <>
              <Image
                ref={imageRef}
                src={currentMedia.url}
                alt={`${productName} - Image ${current + 1}`}
                fill
                className="object-cover"
                quality={90}
                priority={current === 0}
                onLoad={() => {
                  if (imageRef.current) {
                    const img = imageRef.current;
                    setImageDimensions({
                      width: img.naturalWidth,
                      height: img.naturalHeight
                    });
                  }
                }}
              />
              
              {/* Dimensions Modal Trigger */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className={`absolute inset-0 bg-black/0 transition-all duration-300 cursor-zoom-in flex items-center justify-center ${
                    isHovering ? 'bg-black/20' : 'bg-black/0'
                  }`}>
                    {isHovering && (
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transform transition-transform duration-300 hover:scale-105">
                        <Ruler className="w-5 h-5 text-gray-700" />
                        <span className="text-gray-800 font-medium">View Image Details</span>
                      </div>
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-white border-0 rounded-xl overflow-hidden">
                  <div className="relative">
                    {/* Header */}
                    <div className="absolute top-4 right-4 z-30">
                      <div className="bg-black/80 text-white px-3 py-2 rounded-lg flex items-center gap-3">
                        <Ruler className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {imageDimensions.width} × {imageDimensions.height}px
                        </span>
                      </div>
                    </div>
                    
                    {/* Close Button */}
                    <div className="absolute top-4 left-4 z-30">
                      <DialogTrigger asChild>
                        <button className="bg-black/80 text-white p-2 rounded-full hover:bg-black transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </DialogTrigger>
                    </div>

                    {/* Image */}
                    <div className="relative w-full h-[80vh] flex items-center justify-center bg-gray-100">
                      <Image
                        src={currentMedia.url}
                        alt={`${productName} - Full Size`}
                        fill
                        className="object-contain"
                        quality={100}
                      />
                    </div>

                    {/* Image Info Footer */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg">
                      <div className="text-sm text-center">
                        <div className="font-medium">{productName}</div>
                        <div className="text-gray-300">
                          Resolution: {imageDimensions.width} × {imageDimensions.height} pixels
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        {/* Navigation Arrows */}
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrent((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Progress Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
          {mediaItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border border-white shadow-sm ${
                index === current 
                  ? 'bg-red-500 scale-125' 
                  : 'bg-white/70 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Carousel */}
      {mediaItems.length > 1 && (
        <div className="w-full px-4">
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
            {mediaItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`flex-shrink-0 w-16 h-16 relative rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                  index === current 
                    ? 'border-red-500 ring-2 ring-red-200 shadow-md' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                {item.type === 'video' ? (
                  <>
                    <Image
                      src={item.thumbnail || '/placeholder-thumbnail.jpg'}
                      alt="Video thumbnail"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Video className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-red-500 rounded-full p-1">
                      <Video className="w-2 h-2 text-white" />
                    </div>
                  </>
                ) : (
                  <Image
                    src={item.url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;