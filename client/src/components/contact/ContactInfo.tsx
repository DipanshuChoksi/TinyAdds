"use client";

import { useForm } from "react-hook-form";
import { submitContact } from "@/lib/contactApi";
import { useToast } from "@/components/ui/UiProvider";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const IMG = "https://html.aqlova.com/listbnb-prv/listbnb/assets/img/contact";

export default function ContactInfo() {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContact({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || undefined,
        subject: data.subject.trim(),
        message: data.message.trim(),
      });

      toast.success("Thank you! Your message has been sent successfully.");
      reset();
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to send your message. Please try again later.";
      toast.error(errorMsg);
    }
  };

  return (
    <section className="lb-section">
      <div className="container">
        <div className="row align-items-center g-lg-5 g-4">
          {/* Contact Images */}
          <div className="col-lg-6 order-lg-2">
            <div className="lb-contact-media">
              <span className="lb-blob lb-blob-1" aria-hidden="true"></span>
              <span className="lb-blob lb-blob-2" aria-hidden="true"></span>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="lb-contact-img lb-contact-img-1"
                src={`${IMG}/thumb-1.png`}
                alt="Contact TinyAdds"
                loading="lazy"
              />

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="lb-contact-img lb-contact-img-2"
                src={`${IMG}/thumb-2.png`}
                alt="Get in touch with TinyAdds"
                loading="lazy"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-6 order-lg-1">
            <span className="lb-badge">Contact Us</span>

            <h2 className="lb-h2-left">
              We&apos;re happy to discuss your project &amp; answer your questions.
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="lb-contact-form" noValidate>
              <div className="row g-3">
                {/* Name */}
                <div className="col-12 col-md-6">
                  <label htmlFor="f-name" className="lb-form-label">
                    Full Name <span>*</span>
                  </label>
                  <input
                    id="f-name"
                    type="text"
                    className={`form-control lb-form-control ${errors.name ? "is-invalid" : ""}`}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                    {...register("name", {
                      required: "Full name is required",
                      maxLength: {
                        value: 100,
                        message: "Name cannot exceed 100 characters",
                      },
                    })}
                  />
                  {errors.name && (
                    <div className="invalid-feedback d-block">{errors.name.message}</div>
                  )}
                </div>

                {/* Email */}
                <div className="col-12 col-md-6">
                  <label htmlFor="f-mail" className="lb-form-label">
                    Email Address <span>*</span>
                  </label>
                  <input
                    id="f-mail"
                    type="email"
                    className={`form-control lb-form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="Enter your email address"
                    disabled={isSubmitting}
                    {...register("email", {
                      required: "Email address is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                      maxLength: {
                        value: 150,
                        message: "Email cannot exceed 150 characters",
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-block">{errors.email.message}</div>
                  )}
                </div>

                {/* Phone */}
                <div className="col-12 col-md-6">
                  <label htmlFor="f-phone" className="lb-form-label">
                    Phone Number
                  </label>
                  <input
                    id="f-phone"
                    type="tel"
                    className={`form-control lb-form-control ${errors.phone ? "is-invalid" : ""}`}
                    placeholder="10-digit number"
                    disabled={isSubmitting}
                    {...register("phone", {
                      maxLength: {
                        value: 10,
                        message: "Phone number cannot exceed 10 characters",
                      },
                    })}
                  />
                  {errors.phone && (
                    <div className="invalid-feedback d-block">{errors.phone.message}</div>
                  )}
                </div>

                {/* Subject */}
                <div className="col-12 col-md-6">
                  <label htmlFor="f-subject" className="lb-form-label">
                    Subject <span>*</span>
                  </label>
                  <input
                    id="f-subject"
                    type="text"
                    className={`form-control lb-form-control ${errors.subject ? "is-invalid" : ""}`}
                    placeholder="Subject of inquiry"
                    disabled={isSubmitting}
                    {...register("subject", {
                      required: "Subject is required",
                      maxLength: {
                        value: 200,
                        message: "Subject cannot exceed 200 characters",
                      },
                    })}
                  />
                  {errors.subject && (
                    <div className="invalid-feedback d-block">{errors.subject.message}</div>
                  )}
                </div>

                {/* Message */}
                <div className="col-12">
                  <label htmlFor="f-msg" className="lb-form-label">
                    Your Message <span>*</span>
                  </label>
                  <textarea
                    id="f-msg"
                    rows={5}
                    className={`form-control lb-form-control lb-form-textarea ${errors.message ? "is-invalid" : ""}`}
                    placeholder="Write your message here..."
                    disabled={isSubmitting}
                    {...register("message", {
                      required: "Message is required",
                      maxLength: {
                        value: 5000,
                        message: "Message cannot exceed 5000 characters",
                      },
                    })}
                  />
                  {errors.message && (
                    <div className="invalid-feedback d-block">{errors.message.message}</div>
                  )}
                </div>

                {/* Submit button */}
                <div className="col-12">
                  <button
                    type="submit"
                    className="lb-contact-submit d-inline-flex align-items-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <i className="bi bi-arrow-right"></i>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
