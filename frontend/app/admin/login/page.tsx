'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { isLoggedIn, setToken } from '@/lib/auth';
import { validateLogin } from '@/lib/validators';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoggedIn()) {
            router.replace('/admin/blogs');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateLogin(form.username, form.password);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setSubmitError('');
            return;
        }

        setSubmitError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/login', form);
            const accessToken = res.data?.access_token ?? res.data?.accessToken ?? res.data?.token;

            if (!accessToken) {
                throw new Error('ไม่พบ access token จากระบบ');
            }

            setToken(accessToken);
            router.replace('/admin/blogs');
            router.refresh();
        } catch (err: any) {
            setSubmitError(err.response?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">

            {/* ─── Left Panel ─── */}
            <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 flex-col justify-end p-16 relative overflow-hidden">
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />
                {/* Glow */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-400 border border-blue-400/30 px-4 py-2 rounded-sm mb-8">
                        Admin Portal
                    </span>
                    <h1 className="text-5xl font-bold text-white leading-tight mb-4">
                        Blog<br />
                        <span className="text-blue-400">Management</span>
                    </h1>
                    <p className="text-slate-400 text-base leading-relaxed font-light max-w-sm">
                        ระบบจัดการบทความและความคิดเห็น<br />
                        เข้าสู่ระบบเพื่อเริ่มใช้งาน
                    </p>
                </div>
            </div>

            {/* ─── Right Panel ─── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8 py-12 relative">
                {/* Left border accent */}
                <div className="hidden lg:block absolute left-0 top-0 w-0.5 h-full bg-linear-to-b from-transparent via-blue-500 to-transparent" />

                <div className="w-full max-w-sm">

                    {/* Header */}
                    <div className="mb-10">
                        <span className="text-xs font-semibold tracking-widest uppercase text-blue-600 block mb-3">
                            Secure Access
                        </span>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">
                            เข้าสู่ระบบ
                        </h2>
                        <p className="text-slate-400 text-sm font-light">
                            กรุณากรอกข้อมูลผู้ดูแลระบบ
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} noValidate className="space-y-5">

                        {/* Error */}
                        {submitError && (
                            <div className="bg-red-50 border border-red-200 border-l-4 border-l-red-500 px-4 py-3 rounded text-sm text-red-700">
                                {submitError}
                            </div>
                        )}

                        {/* Username */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-medium text-slate-600">
                                ชื่อผู้ใช้
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="กรอกชื่อผู้ใช้"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                onBlur={() => setErrors(validateLogin(form.username, form.password))}
                                autoComplete="username"
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
                            />
                            {errors.username && <p className="text-xs text-red-600">{errors.username}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-600">
                                รหัสผ่าน
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="กรอกรหัสผ่าน"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                onBlur={() => setErrors(validateLogin(form.username, form.password))}
                                autoComplete="current-password"
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
                            />
                            {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 flex items-center justify-center gap-2 mt-2"
                        >
                            {loading && (
                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            )}
                            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-10 pt-6 border-t border-slate-100 text-center text-xs text-slate-400 tracking-wide">
                        Blog Management System · Admin Only
                    </div>

                </div>
            </div>

        </div>
    );
}