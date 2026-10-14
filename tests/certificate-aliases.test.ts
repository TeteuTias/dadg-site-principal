import assert from "node:assert/strict";
import test from "node:test";
import { loadIsolated } from "./helpers/isolated";
test("visualizador legado encaminha ao DTO público do backend sem consulta local", async () => {
  let target = "";
  const route = loadIsolated(
    "app/api/get/myCertificateById/[certificateId]/route.ts",
    {
      "@/lib/public-backend": {
        publicBackend: async (path: string) => {
          target = path;
          return Response.json({ data: { ownerName: "Ana" } });
        },
      },
    },
  );
  const response = await route.GET(
    {},
    { params: Promise.resolve({ certificateId: "507f1f77bcf86cd799439011" }) },
  );
  assert.equal(response.status, 200);
  // No backend, "/download" é a busca em lista; o visualizador precisa do certificado único.
  assert.equal(target, "/api/v1/certificates/507f1f77bcf86cd799439011");
  assert.equal((await response.json()).data.ownerCpf, undefined);
});

test("busca pública encaminha à lista paginada do backend", async () => {
  let target = "";
  const route = loadIsolated("app/api/get/myCertificate/[search]/route.ts", {
    "@/lib/public-backend": {
      publicBackend: async (path: string) => {
        target = path;
        return Response.json({ data: [] });
      },
    },
  });
  await route.GET(
    { nextUrl: { search: "?page=2" } },
    { params: Promise.resolve({ search: "ana maria" }) },
  );
  assert.equal(target, "/api/v1/certificates/ana%20maria/download?page=2");
});

test("configuração ausente de taxa mantém leitura e bloqueia mutações sem banco",async()=>{
 const previous=process.env.RATE_LIMIT;delete process.env.RATE_LIMIT;let called=false;
 try{const {NextRequest,NextResponse}=await import("next/server");const route=loadIsolated("proxy.ts",{"./app/src/lib/auth0/Auth0Client":{auth0:{middleware:async()=>NextResponse.next()}},"./lib/RateLimit":{rateLimit:async()=>{called=true;return {canAccess:true};}}});
 assert.equal((await route.proxy(new NextRequest("https://fixture.invalid/api/get/homeStats"))).status,200);
 assert.equal((await route.proxy(new NextRequest("https://fixture.invalid/api/ouvidoria",{method:"POST"}))).status,503);assert.equal(called,false);}
 finally{if(previous===undefined)delete process.env.RATE_LIMIT;else process.env.RATE_LIMIT=previous;}
});
