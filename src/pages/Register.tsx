import {useState, type FormEvent} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../context/auth-context.ts";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const {register} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setSubmitting(true);
        setError("");
        try {
            await register(email, password);
            navigate("/", {replace: true});
        } catch (requestError: unknown) {
            if (axios.isAxiosError<Record<string, string>>(requestError)) {
                const data = requestError.response?.data;
                setError(data?.message ?? data?.email ?? data?.password ?? "Registration failed");
            } else {
                setError("Registration failed");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto my-4 sm:my-10 bg-white p-4 sm:p-6 rounded-xl shadow-md">
            <h1 className="text-2xl font-semibold mb-6 text-center">Register</h1>

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
                        minLength={8}
                        maxLength={72}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                    <input
                        type="password"
                        minLength={8}
                        maxLength={72}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        autoComplete="new-password"
                        required
                    />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-amber-500 text-white py-2 px-4 rounded hover:bg-amber-600 font-semibold transition duration-200 disabled:opacity-60"
                >
                    {submitting ? "Creating account..." : "Register"}
                </button>
            </form>

            <p className="mt-4 text-sm text-center text-gray-600">
                Already registered?{" "}
                <Link className="text-blue-600 underline" to="/login">
                    Login
                </Link>
            </p>
        </div>
    );
}

export default Register;
