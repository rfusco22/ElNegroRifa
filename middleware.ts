import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect admin routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.isAdmin === true
        }

        // Protect user routes (require any authenticated user)
        if (req.nextUrl.pathname.startsWith("/profile") || req.nextUrl.pathname.startsWith("/my-numbers")) {
          return !!token
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/my-numbers/:path*"],
}
