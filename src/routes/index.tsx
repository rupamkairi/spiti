import { createFileRoute, Link } from "@tanstack/react-router";
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
      <Link to="/folders" className="btn btn-link">
        Folders
      </Link>
      <Link to="/items" className="btn btn-link">
        Items
      </Link>
    </div>
  );
}

function User() {
  const user = useQuery(api.functions.user.currentUser);
  return <div>{user?.email}</div>;
}
