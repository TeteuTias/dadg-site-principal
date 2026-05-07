"use client"
import { useUserContext } from '@/lib/userProvider';
export default function () {
    const a = useUserContext()
    return (
        <main className="w-full min-h-screen bg-yellow-100">
            <button onClick={async () =>
                await fetch('/api/v1/test', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${a.tokenVar}`, // apenas um teste para ser realizado!!
                    },
                })
            }>Estou Autenticado</button>
            <p>{a.tokenVar}</p>
        </main>
    )
}