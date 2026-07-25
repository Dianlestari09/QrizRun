import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const { url, cookies, redirect } = context;

  // Redirect old /admin route to login
  if (url.pathname.startsWith("/admin")) {
    return redirect("/mlebuodewe/login");
  }

  // Protect /mlebuodewe/admin routes
  if (url.pathname.startsWith("/mlebuodewe/admin")) {
    const session = cookies.get("admin_session")?.value;
    
    // If not authenticated, redirect to login
    if (session !== "authenticated") {
      return redirect("/mlebuodewe/login");
    }
  }

  // Continue to the next handler
  return next();
});
