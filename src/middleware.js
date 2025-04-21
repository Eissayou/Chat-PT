import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
    console.log("Middleware is running!");
    const token = req.cookies.get('token')?.value;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const isPublicRoute = req.nextUrl.pathname === '/pages/login';

    if (isPublicRoute) {
        if (token) {
            try {
                await jwtVerify(token, secret);
                return NextResponse.redirect(new URL('/', req.url));
            } catch (error) {
                console.error('JWT Verification Error:', error);
                return NextResponse.redirect(new URL('/pages/login', req.url));
            }
        }
        return NextResponse.next(); // allow access to login if no token
    }

    // All other routes are protected
    if (!token) {
        return NextResponse.redirect(new URL('/pages/login', req.url));
    }

    try {
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return NextResponse.redirect(new URL('/pages/login', req.url));
    }
}

export const config = {
    matcher: [
      '/pages/:path*',     // applies to all /pages/** routes
      '/',                 // apply to root
    ],
  };
  