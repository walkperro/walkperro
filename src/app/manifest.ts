import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WalkPerro",
    short_name: "WalkPerro",
    description: "Websites and conversion systems for modern businesses.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/perro/white_perro_v2_no_bg.png",
        sizes: "500x500",
        type: "image/png",
      },
      {
        src: "/perro/white_perro_v2.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
  };
}
