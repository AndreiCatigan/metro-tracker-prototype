import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Track MeTro",
    short_name: "TrackMeTro",
    description: "Dual-app transit ecosystem for buses in Leyte",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F9FB",
    theme_color: "#FFDFC9",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
