import { NextRequest, NextResponse } from 'next/server';

const JUPITER_API = 'https://api.jup.ag/swap/v1';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${JUPITER_API}/swap`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Jupiter Swap API Error:', response.status, errorText);
            return NextResponse.json({ error: errorText }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Jupiter Proxy Swap Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
