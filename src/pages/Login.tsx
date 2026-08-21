import {useState, type FormEvent} from "react";
import axios from "axios";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../context/auth-context.ts";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const {login} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            const account = await login(email, password);
            const requestedPath = (location.state as {from?: string} | null)?.from;
            navigate(requestedPath ?? (account.role === "ROLE_ADMIN" ? "/admin" : "/"), {replace: true});
        } catch (requestError: unknown) {
            if (axios.isAxiosError<Record<string, string>>(requestError)) {
                const data = requestError.response?.data;
                setError(data?.message ?? data?.email ?? data?.password ?? "Login failed");
            } else {
                setError("Login failed");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto my-4 sm:my-10 bg-white p-4 sm:p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Login</h1>
                <button
                    type="button"
                    aria-label="Show demo admin credentials"
                    className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold hover:bg-amber-600"
                    onClick={() => setShowInfo(true)}
                >
                    ?
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-amber-500 text-white py-2 px-4 rounded hover:bg-amber-600 font-semibold transition duration-200 disabled:opacity-60"
                >
                    {submitting ? "Logging in..." : "Login"}
                </button>
            </form>

            <p className="mt-4 text-sm text-center text-gray-600">
                No account yet?{" "}
                <Link className="text-blue-600 underline" to="/register">
                    Register
                </Link>
            </p>

            {showInfo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="demo-admin-title">
                    <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
                        <h2 id="demo-admin-title" className="text-xl font-semibold mb-3">Demo admin account</h2>
                        <p><strong>Email:</strong> admin@admin.com</p>
                        <p><strong>Password:</strong> password123</p>
                        <p className="mt-3 text-sm text-gray-600">This public demo is reset every day.</p>
                        <button
                            type="button"
                            className="mt-5 w-full rounded bg-amber-500 px-4 py-2 font-semibold text-white hover:bg-amber-600"
                            onClick={() => setShowInfo(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
