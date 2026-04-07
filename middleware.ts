/**
 * NeuralMarket — Geo-Blocking Middleware
 *
 * REQUIRED by Kalshi Builders Program:
 * "Onchain predictions are not available to U.S. persons or others subject
 *  to trading restrictions under the Kalshi Member Agreement."
 *
 * Blocked jurisdictions updated via where.kalshi.com
 * Vercel provides ISO-3166-1 alpha-2 country codes via x-vercel-ip-country header.
 */

import { NextRequest, NextResponse } from 'next/server';

// Countries restricted by Kalshi (per where.kalshi.com — April 2026)
// US is handled separately as it's the primary restriction.
const BLOCKED_COUNTRIES = new Set([
    'US', // United States (primary restriction)
    'CU', // Cuba
    'IR', // Iran
    'KP', // North Korea
    'SY', // Syria
    'RU', // Russia (OFAC)
    'BY', // Belarus
    'MM', // Myanmar
    'SD', // Sudan
    'SO', // Somalia
    'YE', // Yemen
    'LY', // Libya
    'ZW', // Zimbabwe
    'CD', // Congo, DRC
    'CF', // Central African Republic
    'VE', // Venezuela
    'IQ', // Iraq
    'LB', // Lebanon
    'NI', // Nicaragua
    'UA', // Parts of Ukraine (conflict zones)
]);

// Routes that require geo-check (trading/prediction routes)
const TRADING_ROUTES = [
    '/markets',
    '/portfolio',
    '/agents',
    '/governance',
    '/api/kalshi',
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only apply geo-blocking on trading routes
    const isTradingRoute = TRADING_ROUTES.some(route => pathname.startsWith(route));

    if (!isTradingRoute) {
        return NextResponse.next();
    }

    // Get country from Vercel's geo headers (auto-populated in production)
    const country = request.headers.get('x-vercel-ip-country') ?? null;

    // In development, skip geo-blocking
    if (!country || process.env.NODE_ENV === 'development') {
        return NextResponse.next();
    }

    if (BLOCKED_COUNTRIES.has(country)) {
        // Serve a geo-blocked page
        const blockedUrl = new URL('/geo-blocked', request.url);
        blockedUrl.searchParams.set('country', country);
        return NextResponse.redirect(blockedUrl);
    }

    // Add country header for downstream use
    const response = NextResponse.next();
    response.headers.set('x-user-country', country);
    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico
         * - images, fonts, etc.
         */
        '/((?!_next/static|_next/image|favicon.ico|logos|.*\\..*|geo-blocked).*)',
    ],
};
