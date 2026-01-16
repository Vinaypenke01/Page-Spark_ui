import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, type LoginFormData } from "@/utils/validation";
import { ApiRequestError } from "@/services/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError("");

    try {
      // Ensure all required fields are present
      await login({
        username: data.username,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      // Redirect to the page they tried to access, or dashboard
      const from = (location.state as any)?.from?.pathname || "/admin";
      navigate(from, { replace: true });
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setLoginError(error.message);
      } else {
        setLoginError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg overflow-hidden">
                <img src="/logo.png" alt="Page Spark Logo" className="h-full w-full object-cover" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
            <p className="text-muted-foreground mt-1">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Login Error */}
          {loginError && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email/Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Email or Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin@pagegen.app or username"
                {...register("username")}
                className={errors.username ? "border-destructive" : ""}
                aria-invalid={errors.username ? "true" : "false"}
                aria-describedby={errors.username ? "username-error" : undefined}
              />
              {errors.username && (
                <div
                  id="username-error"
                  className="flex items-center gap-2 text-sm text-destructive"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.username.message}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                  onClick={() => alert("Password reset functionality coming soon!")}
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && (
                <div
                  id="password-error"
                  className="flex items-center gap-2 text-sm text-destructive"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                {...register("rememberMe")}
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm font-normal cursor-pointer"
              >
                Remember me for 30 days
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/admin/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
              create account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/" className="hover:text-foreground transition-colors">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
