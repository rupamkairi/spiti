import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Home</h1>
      <User />
      <div className="flex gap-2">
        <Link to="/folders" className="btn btn-outline">
          Folders
        </Link>
        <Link to="/items" className="btn btn-outline">
          Items
        </Link>
      </div>
    </div>
  );
}

function User() {
  const user = useQuery(api.functions.user.currentUser);
  return (
    <div className="alert alert-info">
      <span>{user?.email}</span>
    </div>
  );
}
