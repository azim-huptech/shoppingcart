import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowRight, LogOut, ShieldCheck } from 'lucide-react';
import Navbar from './Navbar';

const signupValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(30, 'First name cannot exceed 30 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Only letters are allowed in name')
    .required('First name is required'),
  lastName: Yup.string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(30, 'Last name cannot exceed 30 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Only letters are allowed in name')
    .required('Last name is required'),
  email: Yup.string()
    .trim()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Za-z]/, 'Password must contain at least one letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Please confirm your password'),
  agreeTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and privacy policy')
    .required('You must accept the terms and privacy policy')
});

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('current_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    setCurrentUser(null);
    setSuccessMessage('');
    window.dispatchEvent(new Event('authChange'));
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const userData = {
      id: Date.now().toString(),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      registeredAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Store in localStorage
    try {
      localStorage.setItem('current_user', JSON.stringify(userData));
      
      const existingList = JSON.parse(localStorage.getItem('all_registered_users') || '[]');
      const filtered = existingList.filter(u => u.email !== userData.email);
      filtered.push(userData);
      localStorage.setItem('all_registered_users', JSON.stringify(filtered));

      setCurrentUser(userData);
      setSuccessMessage(`Account created successfully! Welcome aboard, ${userData.firstName}.`);
      window.dispatchEvent(new Event('authChange'));
      resetForm();
    } catch (err) {
      console.error("Storage error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {currentUser ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center transition-all animate-fade-in">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Active User Profile</h2>
              <p className="text-slate-500 text-sm mt-1">Your details are saved locally on this browser.</p>

              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-left space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Name:</span>
                  <span className="font-semibold text-slate-800">{currentUser.firstName} {currentUser.lastName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-semibold text-slate-800">{currentUser.email}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Registered:</span>
                  <span className="font-medium text-slate-600">{currentUser.registeredAt}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center gap-1.5 text-xs text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Validated with Formik & Yup schema</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition shadow-sm hover:shadow"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-medium rounded-xl transition text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out / Sign Up with Another Email</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10 transition-all">
              <div className="mb-6 text-center">
                <span className="inline-block p-2 bg-indigo-50 text-indigo-600 rounded-xl mb-3">
                  <User className="w-6 h-6" />
                </span>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Fill in your details to start shopping with full checkout capability.
                </p>
              </div>

              {successMessage && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              <Formik
                initialValues={{
                  firstName: '',
                  lastName: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  agreeTerms: false
                }}
                validationSchema={signupValidationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="firstName">
                          First Name
                        </label>
                        <div className="relative">
                          <Field
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="John"
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none transition ${
                              errors.firstName && touched.firstName
                                ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                                : 'border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-100'
                            }`}
                          />
                        </div>
                        <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs mt-1 flex items-center gap-1" />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="lastName">
                          Last Name
                        </label>
                        <Field
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Doe"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none transition ${
                            errors.lastName && touched.lastName
                              ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                              : 'border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-100'
                          }`}
                        />
                        <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs mt-1 flex items-center gap-1" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="email">
                        Email Address
                      </label>
                      <div className="relative">
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john.doe@example.com"
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none transition ${
                            errors.email && touched.email
                              ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                              : 'border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-100'
                          }`}
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      </div>
                      <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1 flex items-center gap-1" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="password">
                        Password
                      </label>
                      <div className="relative">
                        <Field
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min 6 chars (letters & numbers)"
                          className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none transition ${
                            errors.password && touched.password
                              ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                              : 'border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-100'
                          }`}
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1 flex items-center gap-1" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="confirmPassword">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Field
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Re-enter password"
                          className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none transition ${
                            errors.confirmPassword && touched.confirmPassword
                              ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                              : 'border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-100'
                          }`}
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1 flex items-center gap-1" />
                    </div>

                    <div className="pt-1">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <Field
                          type="checkbox"
                          name="agreeTerms"
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                        <span className="text-xs text-slate-600 leading-tight">
                          I agree to the <span className="text-slate-900 font-medium underline">Terms of Service</span> and <span className="text-slate-900 font-medium underline">Privacy Policy</span>.
                        </span>
                      </label>
                      <ErrorMessage name="agreeTerms" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-3 py-3 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium rounded-xl transition duration-150 shadow-sm flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>Saving...</span>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </Form>
                )}
              </Formik>

              <div className="mt-6 text-center text-xs text-slate-500">
                Already registered?{' '}
                <Link to="/" className="font-semibold text-slate-900 hover:underline">
                  Browse store catalog
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Signup;
