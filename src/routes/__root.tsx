import * as React from "react";
import {
  Outlet,
  createRootRoute,
  useLocation,
  useNavigate,
  Link,
} from "@tanstack/react-router";
import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";
import Button from "@/components/editors/Buttons";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    const isAuthPage = location.pathname.startsWith("/auth");

    if (!isAuthenticated && !isAuthPage) {
      void navigate({ to: "/auth" });
    }
    if (isAuthenticated && isAuthPage) {
      void navigate({ to: "/" });
    }
  }, [isLoading, isAuthenticated, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const isAuthPage = location.pathname.startsWith("/auth");

  return (
    <React.Fragment>
      {!isAuthPage && (
        <div className="navbar py-0 bg-base-100 border-b">
          <div className="container mx-auto flex p-4 justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xl">
                <Welcome />
              </span>
            </div>
            <div className="flex items-center">
              <SignOutButton />
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto p-4">
        <Outlet />
      </div>
    </React.Fragment>
  );
}

function Welcome() {
  const user = useQuery(api.functions.user.currentUser);

  if (!user) return "Spiti";
  return <h1>Welcome {user?.name} to Spiti!</h1>;
}

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  return (
    <>
      {isAuthenticated && (
        <Button className="btn btn-primary" onClick={() => void signOut()}>
          Sign out
        </Button>
      )}
    </>
  );
}
