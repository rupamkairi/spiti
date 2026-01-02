import Button from "@/components/editors/Buttons";
import { useAuthActions } from "@convex-dev/auth/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/auth/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <SignInForm />
    </div>
  );
}

function SignInForm() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full max-w-sm">
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold mb-6">
            Welcome Back
          </h2>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setError(null);
              const formData = new FormData(e.target as HTMLFormElement);
              formData.set("flow", "signIn");
              void signIn("password", formData)
                .then(() => {
                  void navigate({ to: "/" });
                })
                .catch((error) => {
                  setError(
                    error.message ?? "Something went wrong. Please try again.",
                  );
                  setLoading(false);
                });
            }}
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                className="input input-bordered w-full"
                type="email"
                name="email"
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                className="input input-bordered w-full"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>
            <Button
              className="btn btn-primary w-full mt-4"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Sign in"
              )}
            </Button>

            {error && (
              <div className="alert alert-error text-sm mt-4">
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
