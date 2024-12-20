import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default async function middleware(req: Request) {
  return withAuth(req);
}
export const config = {
  matcher: ["/dashboard/:path*"],
};
