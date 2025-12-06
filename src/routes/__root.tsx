import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <div className="navbar bg-base-100 border-b">
        <div className="container mx-auto flex justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Spiti</span>
          </div>
          <div className="flex items-center">
            <SignOutButton />
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4">
        <Outlet />
      </div>
    </React.Fragment>
  );
}

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  return (
    <>
      {isAuthenticated && (
        <button className="btn btn-primary" onClick={() => void signOut()}>
          Sign out
        </button>
      )}
    </>
  );
}
