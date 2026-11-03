import { type FormEvent, useState } from "react"
import { MALDET_URL } from "@/data/navigation"
import ActionButton from "@/components/ui/ActionButton"
import FormInput from "@/components/contact/FormInput"

export type FormField = "name" | "email" | "subject" | "message"

export default function ContactForm() {
  const initialValues = { name: "", email: "", subject: "", message: "" }
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({})
  const [submitted, setSubmitted] = useState(false)

  const validateField = (field: FormField, value: string) => {
    if (!value.trim()) return "This field is required."
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Enter a valid email address."
    }
    if (field === "message" && value.trim().length < 10) {
      return "Please provide at least 10 characters."
    }
    return ""
  }

  const updateField = (field: FormField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setSubmitted(false)
    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: validateField(field, value),
      }))
    }
  }

  const blurField = (field: FormField) => {
    setErrors((current) => ({
      ...current,
      [field]: validateField(field, values[field]),
    }))
  }

  const submitForm = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = Object.keys(values).reduce(
      (result, field) => {
        const key = field as FormField
        const message = validateField(key, values[key])
        if (message) result[key] = message
        return result
      },
      {} as Partial<Record<FormField, string>>,
    )
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) setSubmitted(true)
  }

  return (
    <form className="inquiry-form" onSubmit={submitForm} noValidate>
      <div className="form-row">
        <FormInput
          id="name"
          label="Name"
          value={values.name}
          error={errors.name}
          placeholder="Your name"
          onChange={(value) => updateField("name", value)}
          onBlur={() => blurField("name")}
        />
        <FormInput
          id="email"
          label="Email"
          value={values.email}
          error={errors.email}
          placeholder="name@example.com"
          type="email"
          onChange={(value) => updateField("email", value)}
          onBlur={() => blurField("email")}
        />
      </div>
      <FormInput
        id="subject"
        label="Subject"
        value={values.subject}
        error={errors.subject}
        placeholder="Feedback, collaboration, or repository inquiry"
        onChange={(value) => updateField("subject", value)}
        onBlur={() => blurField("subject")}
      />
      <div className="form-field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={values.message}
          placeholder="Write your message or question for the MalDet team..."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          onChange={(event) => updateField("message", event.target.value)}
          onBlur={() => blurField("message")}
        />
        {errors.message && (
          <span className="field-error" id="message-error" role="alert">
            {errors.message}
          </span>
        )}
      </div>
      <div className="form-footer">
        <ActionButton type="submit">Send Inquiry</ActionButton>
        <p>Demonstration contact form · Or visit the live MalDet platform directly.</p>
      </div>
      {submitted && (
        <div className="form-feedback" role="status">
          <span aria-hidden="true">✓</span>
          <p>
            Thank you! Your inquiry has been validated. You can also test our
            scanner directly at{" "}
            <a href={MALDET_URL} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, textDecoration: "underline" }}>
              {MALDET_URL}
            </a>
            .
          </p>
        </div>
      )}
    </form>
  )
}
