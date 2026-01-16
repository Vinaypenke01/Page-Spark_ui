import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, UserPlus, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { registerSchema, type RegisterFormData, getPasswordStrength } from "@/utils/validation";
import { ApiRequestError } from "@/services/api";

const AdminRegister = () => {
    const navigate = useNavigate();
    const { register: registerUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [registerError, setRegisterError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password");
    const passwordStrength = password ? getPasswordStrength(password) : null;

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setRegisterError("");

        try {
            await registerUser({
                username: data.username,
                name: data.name,
                email: data.email,
                password: data.password,
            });

            // Redirect to dashboard after successful registration
            navigate("/admin", { replace: true });
        } catch (error) {
            if (error instanceof ApiRequestError) {
                setRegisterError(error.message);
            } else {
                setRegisterError("An unexpected error occurred. Please try again.");
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
                        <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
                        <p className="text-muted-foreground mt-1">
                            Sign up for admin access
                        </p>
                    </div>

                    {/* Registration Error */}
                    {registerError && (
                        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive">
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <span className="text-sm">{registerError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Username */}
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="johndoe"
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

                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                {...register("name")}
                                className={errors.name ? "border-destructive" : ""}
                                aria-invalid={errors.name ? "true" : "false"}
                                aria-describedby={errors.name ? "name-error" : undefined}
                            />
                            {errors.name && (
                                <div
                                    id="name-error"
                                    className="flex items-center gap-2 text-sm text-destructive"
                                    role="alert"
                                >
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.name.message}
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@pagegen.app"
                                {...register("email")}
                                className={errors.email ? "border-destructive" : ""}
                                aria-invalid={errors.email ? "true" : "false"}
                                aria-describedby={errors.email ? "email-error" : undefined}
                            />
                            {errors.email && (
                                <div
                                    id="email-error"
                                    className="flex items-center gap-2 text-sm text-destructive"
                                    role="alert"
                                >
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.email.message}
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                                className={errors.password ? "border-destructive" : ""}
                                aria-invalid={errors.password ? "true" : "false"}
                                aria-describedby={errors.password ? "password-error password-strength" : "password-strength"}
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
                            {/* Password Strength Indicator */}
                            {passwordStrength && password && (
                                <div id="password-strength" className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${passwordStrength.label === 'weak' ? 'bg-destructive w-1/4' :
                                                    passwordStrength.label === 'fair' ? 'bg-yellow-500 w-2/4' :
                                                        passwordStrength.label === 'good' ? 'bg-blue-500 w-3/4' :
                                                            'bg-green-500 w-full'
                                                    }`}
                                            />
                                        </div>
                                        <span className={`text-xs font-medium ${passwordStrength.label === 'weak' ? 'text-destructive' :
                                            passwordStrength.label === 'fair' ? 'text-yellow-600' :
                                                passwordStrength.label === 'good' ? 'text-blue-600' :
                                                    'text-green-600'
                                            }`}>
                                            {passwordStrength.label.charAt(0).toUpperCase() + passwordStrength.label.slice(1)}
                                        </span>
                                    </div>
                                    {passwordStrength.feedback.length > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            {passwordStrength.feedback.join(', ')}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                {...register("confirmPassword")}
                                className={errors.confirmPassword ? "border-destructive" : ""}
                                aria-invalid={errors.confirmPassword ? "true" : "false"}
                                aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                            />
                            {errors.confirmPassword && (
                                <div
                                    id="confirm-password-error"
                                    className="flex items-center gap-2 text-sm text-destructive"
                                    role="alert"
                                >
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.confirmPassword.message}
                                </div>
                            )}
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
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-5 w-5" />
                                    Create Account
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <Link to="/admin/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                            Sign In
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

export default AdminRegister;
