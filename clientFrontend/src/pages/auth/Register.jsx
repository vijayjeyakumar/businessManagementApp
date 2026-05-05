import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
// import axiosInstance from '../../api/axiosInstance'
import toast from "react-hot-toast";

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        businessName: "",
        GSTIN: "",
        industry: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        toast.success("Registration successfull. Please Login to continue");
        navigate(ROUTES.LOGIN);
        setLoading(false);
    };

    const inputClass =
        "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
    const labelClass =
        "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-10 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-2xl p-10">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                        Create Account
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">
                        Register your business to get started
                    </p>
                </div>

                {/* Inline Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Row 1 — Name + Business Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Business Name</label>
                            <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                placeholder="Your Shop / Company"
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Row 2 — Email + Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 99999 99999"
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Row 3 — GSTIN + Industry */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                GSTIN{" "}
                                <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <input
                                type="text"
                                name="GSTIN"
                                value={formData.GSTIN}
                                onChange={handleChange}
                                placeholder="22AAAAA0000A1Z5"
                                maxLength={15}
                                className={`${inputClass} uppercase`}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Industry</label>
                            <select
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            >
                                <option value="">Select your industry</option>
                                <option value="grocery">Grocery</option>
                                <option value="retail">Retail</option>
                                <option value="pharmacy">Pharmacy</option>
                                <option value="electronics">Electronics</option>
                                <option value="restaurant">Restaurant</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 4 — Password + Confirm Password */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 rounded-lg transition duration-200 text-base"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>

                    {/* Sign in link */}
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate(ROUTES.LOGIN)}
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Sign in
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
