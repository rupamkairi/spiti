import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <p>Hello "/"!</p>
      <User />
    </div>
  );
}

function User() {
  const user = useQuery(api.functions.user.currentUser);
  return <div>{user?.email}</div>;
}
