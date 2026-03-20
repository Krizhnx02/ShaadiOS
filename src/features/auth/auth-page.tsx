"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@heroui/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormValues = z.infer<typeof schema>;

export function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const toggleMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setError(null);
    setSuccess(null);
    reset();
  };

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (mode === "signup") {
      const { error: signUpError } = await signUp(values.email, values.password);
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess("Account created! Check your email for verification, or sign in if email confirmation is disabled.");
        setMode("login");
        reset();
      }
    } else {
      const { error: signInError } = await signIn(values.email, values.password);
      if (signInError) {
        setError(signInError.message);
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <Heart size={32} className="text-accent-emerald" fill="currentColor" />
            <span className="text-2xl font-bold tracking-tight">
              Shaadi<span className="text-accent-gold">OS</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {mode === "login"
              ? "Welcome back! Sign in to your wedding dashboard."
              : "Create an account to start planning your dream wedding."}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold">
            {mode === "login" ? "Sign In" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                )}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Password</Label>
              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 6 characters"
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                <p className="text-xs text-emerald-700">{success}</p>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full bg-accent-emerald font-semibold text-white"
              startContent={!isSubmitting && (mode === "login" ? <LogIn size={16} /> : <UserPlus size={16} />)}
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-5 border-t border-border pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="font-semibold text-accent-emerald hover:underline"
              >
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          Plan your shaadi, the smart way.
        </p>
      </div>
    </div>
  );
}
