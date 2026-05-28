"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, AlertCircle } from "lucide-react";

function validate(name: string, email: string, password: string) {
    const errors: { name?: string; email?: string; password?: string } = {};

    if (!name.trim()) errors.name = "Full name is required.";

    if (!email.trim()) {
        errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Enter a valid email address.";
    }

    if (!password) {
        errors.password = "Password is required.";
    } else if (password.length < 8) {
        errors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(password)) {
        errors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
        errors.password = "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(password)) {
        errors.password = "Password must contain at least one number.";
    } else if (!/[^A-Za-z0-9]/.test(password)) {
        errors.password = "Password must contain at least one special character.";
    }

    return errors;
}

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [fieldErrors, setFieldErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
    }>({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = validate(name, email, password);
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setFieldErrors({});
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            // ✅ RESOLVED CONFLICT HERE (correct priority order)
            const errorMessage =
                data.message ||
                data.error ||
                "Something went wrong. Please try again.";

            if (!res.ok) {
                console.error("Registration failed:", {
                    status: res.status,
                    data,
                });
                throw new Error(errorMessage);
            }

            router.push("/login?registered=true");
        } catch (err: any) {
            console.error("Registration request failed:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fieldClass = (hasError: boolean) =>
        `w-full mt-1 bg-[var(--color-neon-bg)] border rounded-xl py-3 px-4 focus:ring-2 focus:ring-[var(--color-neon-primary)] outline-none ${
            hasError
                ? "border-red-500"
                : "border-[var(--color-neon-border)]"
        }`;

    return (
        <main className="flex-1 flex flex-col items-center justify-center min-h-screen p-6 relative z-10">
            <div className="glow-bg" style={{ top: "10%" }}></div>

            <div className="w-full max-w-md glass-card p-10 flex flex-col items-center text-center relative z-10 shadow-2xl">
                <Link
                    href="/"
                    className="text-[var(--color-neon-primary)] font-bold text-2xl mb-8 tracking-widest uppercase flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <Image
                        src="/vuralogo.png"
                        alt="Vura Logo"
                        width={32}
                        height={32}
                        className="rounded-lg object-contain"
                    />
                    Vura
                </Link>

                <h1 className="text-3xl font-extrabold mb-2 text-white">
                    Create Account
                </h1>

                <p className="text-[var(--color-neon-muted)] mb-8 text-sm">
                    Register a new Vura account to start generating.
                </p>

                {error && (
                    <div className="w-full mb-6 p-4 rounded-xl bg-red-900/20 border border-red-500/50 flex items-start text-red-200">
                        <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5 text-red-400" />
                        <p className="text-sm text-left">{error}</p>
                    </div>
                )}

                <form
                    onSubmit={handleRegister}
                    className="w-full flex flex-col gap-4"
                    noValidate
                >
                    <div className="text-left">
                        <label className="text-xs text-[var(--color-neon-muted)] ml-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setFieldErrors((p) => ({
                                    ...p,
                                    name: undefined,
                                }));
                            }}
                            className={fieldClass(!!fieldErrors.name)}
                            placeholder="Your Name"
                        />
                        {fieldErrors.name && (
                            <p className="text-xs text-red-400 mt-1 ml-1">
                                {fieldErrors.name}
                            </p>
                        )}
                    </div>

                    <div className="text-left">
                        <label className="text-xs text-[var(--color-neon-muted)] ml-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setFieldErrors((p) => ({
                                    ...p,
                                    email: undefined,
                                }));
                            }}
                            className={fieldClass(!!fieldErrors.email)}
                            placeholder="name@example.com"
                        />
                        {fieldErrors.email && (
                            <p className="text-xs text-red-400 mt-1 ml-1">
                                {fieldErrors.email}
                            </p>
                        )}
                    </div>

                    <div className="text-left">
                        <label className="text-xs text-[var(--color-neon-muted)] ml-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setFieldErrors((p) => ({
                                    ...p,
                                    password: undefined,
                                }));
                            }}
                            className={fieldClass(!!fieldErrors.password)}
                            placeholder="••••••••"
                        />
                        {fieldErrors.password ? (
                            <p className="text-xs text-red-400 mt-1 ml-1">
                                {fieldErrors.password}
                            </p>
                        ) : (
                            <p className="text-xs text-[var(--color-neon-muted)] mt-1 ml-1">
                                Min 8 chars, uppercase, lowercase, number &
                                special character.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-4 mt-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-black" />
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>

                <div className="mt-8 text-sm text-[var(--color-neon-muted)]">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-[var(--color-neon-primary)] hover:underline"
                    >
                        Log in
                    </Link>
                </div>
            </div>
        </main>
    );
}