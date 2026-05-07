import { auth0 } from "@/app/src/lib/auth0/Auth0Client";
export async function GET() {
    const session = await auth0.getSession()
    return Response.json({ message: 'API de teste funcionando!', session: session?.tokenSet.idToken });
}