"use client";

import { useState } from "react";
import Image from "next/image";

const fallbackProfileImage = "/user_pofile_icon.png";

export default function ProfilePicture({ displayName, src }) {
  const [imageSource, setImageSource] = useState(src || fallbackProfileImage);

  return (
    <Image
      alt={`${displayName}'s profile picture`}
      className="h-28 w-28 shrink-0 rounded-full border-4 border-warm-white bg-latte object-cover shadow-lg sm:h-32 sm:w-32"
      height={128}
      onError={() => setImageSource(fallbackProfileImage)}
      src={imageSource}
      unoptimized
      width={128}
    />
  );
}
