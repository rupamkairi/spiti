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
      <div>
        <SignOutButton />
      </div>

      <Outlet />
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
