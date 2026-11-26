import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/eventos",
    "/certificados",
    "/mural",
    "/ouvidoria",
    "/ouvidoria/acompanhar",
    "/sobre",
    "/contato",
    "/coordenadorias",
    "/coordenadorias/caep",
    "/coordenadorias/caes",
    "/coordenadorias/clam",
    "/coordenadorias/cac",
    "/coordenadorias/clev",
    "/processos-seletivos",
    "/privacidade",
    "/termos",
    "/criar-conta",
  ].map((path) => ({ url: `https://www.dadg.com.br${path}` }));
}
