import { useAuthActions } from "@convex-dev/auth/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/auth/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SignInForm />
    </div>
  );
}

function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="max-w-md mx-auto">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">{flow === "signIn" ? "Sign in" : "Sign up"}</h2>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            setError(error.message);
          });
        }}
      >
        <input
          className="input input-bordered w-full"
          type="email"
          name="email"
          placeholder="Email"
        />
        <input
          className="input input-bordered w-full"
          type="password"
          name="password"
          placeholder="Password"
        />
        <button className="btn btn-primary w-full" type="submit">
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </button>
        <div className="flex flex-row gap-2 justify-center">
          <span>
            {flow === "signIn"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>
          <span
            className="link link-primary cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </span>
        </div>
        {error && (
          <div className="alert alert-error">
            <p className="text-xs">Error signing in: {error}</p>
          </div>
        )}
      </form>
        </div>
      </div>
    </div>
  );
}
