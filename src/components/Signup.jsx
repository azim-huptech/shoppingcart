import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { signupUser, clearAuthError } from '../features/auth/authSlice';
import { switchCartOwner } from '../features/Shopcart/cartSlice';
import { check, record, policies, formatRetry } from "../utils/rateLimit";
import MathCaptcha, { Honeypot } from './MathCaptcha';

const schema = Yup.object().shape({
  firstName: Yup.string().trim()
    .min(2, 'First name must be at least 2 characters').max(30, 'Max 30 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Letters only')
    .required('First name is required'),
  lastName: Yup.string().trim()
    .min(2, 'Last name must be at least 2 characters').max(30, 'Max 30 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Letters only')
    .required('Last name is required'),
  email: Yup.string().trim().max(160)
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'At least 8 characters')
    .max(128, 'Max 128 characters')
    .matches(/[A-Z]/, 'Needs an uppercase letter')
    .matches(/[a-z]/, 'Needs a lowercase letter')
    .matches(/[0-9]/, 'Needs a number')
    .matches(/[^A-Za-z0-9]/, 'Needs a symbol')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Please confirm your password'),
  agreeTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms')
    .required('You must accept the terms'),
});

function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, error } = useSelector((s) => s.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [captchaError, setCaptchaError] = useState("");
  const [rateError, setRateError] = useState("");

  useEffect(() => { dispatch(clearAuthError()); }, [dispatch]);

  useEffect(() => {
    if (user) {
      const redirect = location.state?.from || '/';
      navigate(redirect, { replace: true });
    }
  }, [user, navigate, location.state]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setRateError("");
    setCaptchaError("");

    if (values.website) {
      setRateError("Request rejected.");
      setSubmitting(false);
      return;
    }

    const limit = check("signup", policies.signup);
    if (!limit.allowed) {
      setRateError(`Too many signups from this browser. Try again in ${formatRetry(limit.retryIn)}.`);
      setSubmitting(false);
      return;
    }

    if (!captchaValid) {
      setCaptchaError("Please solve the challenge.");
      setSubmitting(false);
      return;
    }

    const result = await dispatch(signupUser(values));
    record("signup", policies.signup);

    if (signupUser.fulfilled.match(result)) {
      dispatch(switchCartOwner({ userId: result.payload.id, mergeGuest: true }));
    } else {
      setCaptchaValue("");
    }
    setSubmitting(false);
  };

  const inputClass = (hasError) =>
    `w-full px-3.5 py-2.5 rounded-full border text-sm text-ink-900 placeholder:text-ink-400 bg-white focus:outline-none transition ${
      hasError ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-ink-200 focus:border-ink-900 focus:ring-2 focus:ring-ink-100'
    }`;

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 w-full">
      <div className="bg-ink-50 rounded-[32px] rounded-bl-[80px] border border-ink-200 p-8 sm:p-10 shadow-sm">
        <div className="mb-6 text-center">
          <span className="inline-flex p-2.5 bg-ink-900 text-ink-50 rounded-full mb-4">
            <User className="w-5 h-5" />
          </span>
          <h2 className="font-display text-3xl text-ink-900">Create your account</h2>
          <p className="text-ink-500 text-sm mt-1">Join Objet and keep your bag across visits.</p>
        </div>

        {(error || rateError) && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{rateError || error}</span>
          </div>
        )}

        <Formik
          initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', agreeTerms: false, website: '' }}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              <Honeypot name="website" />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5" htmlFor="firstName">First Name</label>
                  <Field id="firstName" name="firstName" placeholder="John" maxLength={30} className={inputClass(errors.firstName && touched.firstName)} />
                  <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5" htmlFor="lastName">Last Name</label>
                  <Field id="lastName" name="lastName" placeholder="Doe" maxLength={30} className={inputClass(errors.lastName && touched.lastName)} />
                  <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5" htmlFor="email">Email</label>
                <div className="relative">
                  <Field id="email" name="email" type="email" placeholder="john.doe@example.com" maxLength={160} className={`pl-10 ${inputClass(errors.email && touched.email)}`} />
                  <Mail className="w-4 h-4 text-ink-400 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5" htmlFor="password">Password</label>
                <div className="relative">
                  <Field id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="8+ chars, mix of case, number & symbol" maxLength={128} className={`pl-10 pr-10 ${inputClass(errors.password && touched.password)}`} />
                  <Lock className="w-4 h-4 text-ink-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <button type="button" tabIndex={-1} onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-3 text-ink-400 hover:text-ink-700">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5" htmlFor="confirmPassword">Confirm Password</label>
                <div className="relative">
                  <Field id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter password" maxLength={128} className={`pl-10 pr-10 ${inputClass(errors.confirmPassword && touched.confirmPassword)}`} />
                  <Lock className="w-4 h-4 text-ink-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <button type="button" tabIndex={-1} onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3.5 top-3 text-ink-400 hover:text-ink-700">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <MathCaptcha
                name="signup-captcha"
                value={captchaValue}
                onChange={setCaptchaValue}
                onValidChange={setCaptchaValid}
                error={captchaError}
              />

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <Field type="checkbox" name="agreeTerms" className="mt-0.5 h-4 w-4 rounded border-ink-300 text-ink-900 focus:ring-ink-900" />
                  <span className="text-xs text-ink-600 leading-tight">
                    I agree to the <span className="text-ink-900 font-medium underline">Terms</span> and <span className="text-ink-900 font-medium underline">Privacy Policy</span>.
                  </span>
                </label>
                <ErrorMessage name="agreeTerms" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 py-3 px-4 bg-ink-900 hover:bg-ink-700 disabled:   text-ink-50 font-medium rounded-full transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Creating account...' : (<><span>Create account</span><ArrowRight className="w-4 h-4" /></>)}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center text-xs text-ink-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-ink-900 hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
