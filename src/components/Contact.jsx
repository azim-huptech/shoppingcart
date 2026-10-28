import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { check, record, policies, formatRetry } from "../utils/rateLimit";
import MathCaptcha, { Honeypot } from "./MathCaptcha";

const schema = Yup.object().shape({
  name: Yup.string().trim().min(2, "At least 2 characters").max(60, "Max 60 characters").required("Name is required"),
  email: Yup.string().trim().max(160).email("Enter a valid email").required("Email is required"),
  subject: Yup.string().trim().min(3, "At least 3 characters").max(120, "Max 120 characters").required("Subject is required"),
  message: Yup.string().trim().min(10, "At least 10 characters").max(1000, "Max 1000 characters").required("Message is required"),
});

function Contact() {
  const [success, setSuccess] = useState(false);
  const [rateError, setRateError] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [captchaError, setCaptchaError] = useState("");

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setRateError("");
    setCaptchaError("");

    if (values.website) {
      setRateError("Request rejected.");
      setSubmitting(false);
      return;
    }

    const limit = check("contact", policies.contact);
    if (!limit.allowed) {
      setRateError(`You've reached the hourly limit. Try again in ${formatRetry(limit.retryIn)}.`);
      setSubmitting(false);
      return;
    }

    if (!captchaValid) {
      setCaptchaError("Please solve the challenge.");
      setSubmitting(false);
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem("contact_messages") || "[]");
      existing.push({
        id: Date.now().toString(),
        name: values.name, email: values.email, subject: values.subject, message: values.message,
        sentAt: new Date().toISOString(),
      });
      localStorage.setItem("contact_messages", JSON.stringify(existing));
      record("contact", policies.contact);
      setSuccess(true);
      resetForm();
      setCaptchaValue("");
      setTimeout(() => setSuccess(false), 6000);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full px-3.5 py-2.5 rounded-2xl border text-sm text-ink-900 placeholder:text-ink-400 bg-white focus:outline-none transition ${
      hasError ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-ink-200 focus:border-ink-900 focus:ring-2 focus:ring-ink-100"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-[11px] uppercase tracking-[0.3em] text-ink-500 mb-3">Contact</div>
        <h1 className="font-display text-4xl sm:text-5xl text-ink-900 leading-[1.05]">
          We'd love to <span className="italic text-accent-500">hear</span> from you.
        </h1>
        <p className="mt-4 text-ink-600 text-base">
          Questions, feedback, or partnership ideas — drop us a note and we'll get back to you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="bg-ink-50 border border-ink-200 rounded-[32px] rounded-tr-[80px] p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-ink-900 text-ink-50 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-ink-900">Email</div>
              <div className="text-sm text-ink-500">hello@objet.studio</div>
            </div>
          </div>
          <div className="bg-ink-50 border border-ink-200 rounded-[32px] p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-ink-900 text-ink-50 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-ink-900">Phone</div>
              <div className="text-sm text-ink-500">+91 00000 00000</div>
            </div>
          </div>
          <div className="bg-ink-50 border border-ink-200 rounded-[32px] rounded-bl-[80px] p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-ink-900 text-ink-50 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-ink-900">Studio</div>
              <div className="text-sm text-ink-500">Ahmedabad, Gujarat, India</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-ink-50 border border-ink-200 rounded-[48px] p-6 sm:p-10 shadow-sm">
          {success && (
            <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Thanks — your message has been saved and we'll reply soon.</span>
            </div>
          )}
          {rateError && (
            <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{rateError}</span>
            </div>
          )}
          <Formik
            initialValues={{ name: "", email: "", subject: "", message: "", website: "" }}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4">
                <Honeypot name="website" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5" htmlFor="name">Name</label>
                    <Field id="name" name="name" maxLength={60} placeholder="Jane Doe" className={inputClass(errors.name && touched.name)} />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5" htmlFor="email">Email</label>
                    <Field id="email" name="email" type="email" maxLength={160} placeholder="jane@example.com" className={inputClass(errors.email && touched.email)} />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5" htmlFor="subject">Subject</label>
                  <Field id="subject" name="subject" maxLength={120} placeholder="How can we help?" className={inputClass(errors.subject && touched.subject)} />
                  <ErrorMessage name="subject" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5" htmlFor="message">Message</label>
                  <Field as="textarea" id="message" name="message" rows={5} maxLength={1000} placeholder="Tell us more..." className={inputClass(errors.message && touched.message)} />
                  <ErrorMessage name="message" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <MathCaptcha
                  name="contact-captcha"
                  value={captchaValue}
                  onChange={setCaptchaValue}
                  onValidChange={setCaptchaValid}
                  error={captchaError}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-ink-900 hover:bg-ink-700 disabled:   text-ink-50 font-medium text-sm transition"
                >
                  {isSubmitting ? "Sending..." : (<><Send className="w-4 h-4" /> Send message</>)}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Contact;
