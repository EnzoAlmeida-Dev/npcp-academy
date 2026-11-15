import type { MetadataRoute } from "next";

// Nome e icones usados quando o site e salvo na tela inicial (Android).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NPCP Academy",
    short_name: "NPCP Academy",
    description: "Plataforma interna de capacitação técnica do NPCP",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#eeeef0",
    theme_color: "#1c1d21",
    icons: [
      { src: "/icons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
