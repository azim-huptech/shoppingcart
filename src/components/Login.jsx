import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import { loginUser, clearAuthError } from "../features/auth/authSlice";
import { switchCartOwner } from "../features/Shopcart/cartSlice";
import { check, record, policies, formatRetry } from "../utils/rateLimit";
import MathCaptcha, { Honeypot } from "./MathCaptcha";

const SHOW_CAPTCHA_AFTER = 2; // show captcha after N failed attempts in-window

const schema = Yup.object().shape({
  email: Yup.string().trim().max(160).email("Enter a valid email").required("Email is required"),
  password: Yup.string().min(1).max(128).required("Password is required"),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, error } = useSelector((s) => s.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(() => {
    try {
      const raw = localStorage.getItem("login_fail_count");
      return raw ? parseInt(raw, 10) || 0 : 0;
    } catch { return 0; }
  });
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [captchaError, setCaptchaError] = useState("");
  const [rateError, setRateError] = useState("");

  useEffect(() => { dispatch(clearAuthError()); }, [dispatch]);

  useEffect(() => {
    if (user) {
      const redirect = location.state?.from || "/";
      navigate(redirect, { replace: true });
    }
  }, [user, navigate, location.state]);

  const needsCaptcha = failedAttempts >= SHOW_CAPTCHA_AFTER;

  const handleSubmit = async (values, { setSubmitting }) => {
    setRateError("");
    setCaptchaError("");

    // Honeypot — bots fill this field; humans never do.
    if (values.website) {
      setRateError("Request rejected.");
      setSubmitting(false);
      return;
    }

    const limit = check("login", policies.login);
    if (!limit.allowed) {
      setRateError(`Too many login attempts. Try again in ${formatRetry(limit.retryIn)}.`);
      setSubmitting(false);
      return;
    }

    if (needsCaptcha && !captchaValid) {
      setCaptchaError("Please solve the challenge.");
      setSubmitting(false);
      return;
    }

    const result = await dispatch(loginUser({ email: values.email, password: values.password }));
    record("login", policies.login);

    if (loginUser.fulfilled.match(result)) {
      try { localStorage.removeItem("login_fail_count"); } catch { /* ignore */ }
      setFailedAttempts(0);
      dispatch(switchCartOwner({ userId: result.payload.id, mergeGuest: true }));
    } else {
      const next = failedAttempts + 1;
      setFailedAttempts(next);
      try { localStorage.setItem("login_fail_count", String(next)); } catch { /* ignore */ }
      setCaptchaValue("");
    }
    setSubmitting(false);
  };

  const inputClass = (hasError) =>
    `w-full px-3.5 py-2.5 rounded-full border text-sm text-ink-900 placeholder:text-ink-400 bg-white focus:outline-none transition ${
      hasError ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-ink-200 focus:border-ink-900 focus:ring-2 focus:ring-ink-100"
    }`;

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 w-full">
      <div className="bg-ink-50 rounded-[32px] rounded-tr-[80px] border border-ink-200 p-8 sm:p-10 shadow-sm">
        <div className="mb-6 text-center">
          <span className="inline-flex p-2.5 bg-ink-900 text-ink-50 rounded-full mb-4">
            <LogIn className="w-5 h-5" />
          </span>
          <h2 className="font-display text-3xl text-ink-900">Welcome back</h2>
          <p className="text-ink-500 text-sm mt-1">Log in to pick up where you left off.</p>
        </div>

        {(error || rateError) && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{rateError || error}</span>
          </div>
        )}

        <Formik
          initialValues={{ email: "", password: "", website: "" }}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              <Honeypot name="website" />

              <div>
                <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5" htmlFor="email">Email</label>
                <div className="relative">
                  <Field id="email" name="email" type="email" placeholder="you@example.com" className={`pl-10 ${inputClass(errors.email && touched.email)}`} />
                  <Mail className="w-4 h-4 text-ink-400 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5" htmlFor="password">Password</label>
                <div className="relative">
                  <Field id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Your password" className={`pl-10 pr-10 ${inputClass(errors.password && touched.password)}`} />
                  <Lock className="w-4 h-4 text-ink-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <button type="button" tabIndex={-1} onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-3 text-ink-400 hover:text-ink-700">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {needsCaptcha && (
                <MathCaptcha
                  name="login-captcha"
                  value={captchaValue}
                  onChange={setCaptchaValue}
                  onValidChange={setCaptchaValid}
                  error={captchaError}
                />
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 py-3 px-4 bg-ink-900 hover:bg-ink-700 disabled:   text-ink-50 font-medium rounded-full transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Signing you in..." : (<><span>Log in</span><ArrowRight className="w-4 h-4" /></>)}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center text-xs text-ink-500">
          New here?{" "}
          <Link to="/signup" className="font-medium text-ink-900 hover:underline">Create an account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
