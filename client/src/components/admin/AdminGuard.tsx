"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import http from "@/lib/http";

interface Props {
  children: ReactNode;
}

interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isAdmin?: boolean;
}

interface LoginResponse {
  isAdmin?: boolean;
}

interface LoginFormValues {
  email: string;
  password: string;
}

export default function AdminGuard({ children }: Props) {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    let active = true;

    http
      .get<UserProfile>("/auth/me")
      .then(({ data }) => {
        if (!active) return;
        if (data?.isAdmin) {
          setAuthorized(true);
        }
      })
      .catch(() => {
        // Not logged in or session invalid; stay on login form
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const onSubmit = async (values: LoginFormValues) => {
    setServerError("");
    try {
      const response = await http.post<LoginResponse>("/auth/admin/login", {
        email: values.email.trim(),
        password: values.password,
      });

      if (response.data?.isAdmin) {
        setAuthorized(true);
      } else {
        setServerError("Access denied: This account does not have admin privileges.");
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axErr = err as { response?: { data?: { error?: { message?: string } } } };
        setServerError(axErr.response?.data?.error?.message || "Invalid credentials.");
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Failed to login. Please try again.");
      }
    }
  };

  if (checking) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="spinner-border text-primary me-2" role="status" />
        <span className="text-secondary fw-medium">Verifying session...</span>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3 py-5">
        <div className="card shadow border-0 p-4 p-md-5" style={{ maxWidth: "440px", width: "100%" }}>
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{ width: "64px", height: "64px", backgroundColor: "#fff" }}
            >
              <Image
                src="/logo.png"
                alt="TinyAdds"
                width={56}
                height={56}
                className="object-fit-contain"
                priority
              />
            </div>
            <h3 className="fw-bold mb-1">Admin Portal</h3>
            <p className="text-muted small mb-0">Enter your credentials to access the admin dashboard</p>
          </div>

          {serverError && (
            <div className="alert alert-danger py-2 px-3 small d-flex align-items-center mb-3" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2 flex-shrink-0"></i>
              <div>{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary" htmlFor="admin-email">
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="admin@tinyadds.com"
                autoComplete="email"
                disabled={isSubmitting}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email.message}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary" htmlFor="admin-password">
                Password
              </label>
              <div className="position-relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  className={`form-control pe-5 ${errors.password ? "is-invalid" : ""}`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent text-secondary px-3"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} aria-hidden="true" />
                </button>
              </div>
              {errors.password && (
                <div className="invalid-feedback">{errors.password.message}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Authenticating...
                </>
              ) : (
                "Sign In to Admin Panel"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
