"use client"

import { useState, FormEvent } from "react"
import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input, Textarea, Select } from "@/components/ui/form"
import { useToast } from "@/components/ui/toast"
import { Mail, Send } from "lucide-react"

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const { addToast } = useToast()

  function validate(data: { name: string; email: string; message: string }) {
    const errors: Record<string, string> = {}
    if (!data.name.trim()) errors.name = "Name is required"
    if (!data.email.trim()) errors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Please enter a valid email"
    if (!data.message.trim()) errors.message = "Message is required"
    else if (data.message.trim().length < 10) errors.message = "Message must be at least 10 characters"
    return errors
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    }

    const errors = validate(data)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (res.ok) {
        addToast(json.message || "Message sent successfully!", "success")
        form.reset()
      } else {
        addToast(json.error || "Something went wrong. Please try again.", "error")
      }
    } catch {
      addToast("Network error. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Section className="pt-0">
      <Container>
        <div className="max-w-xl mx-auto">
          <Badge variant="default" className="mb-4">Contact</Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-6">Get in touch</h1>
          <p className="text-muted mb-8">Have a suggestion, want to submit a tool for review, or just want to say hi? We&apos;d love to hear from you.</p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                name="name"
                label="Name"
                placeholder="Your name"
                autoComplete="name"
                required
                error={fieldErrors.name}
              />
              <Input
                name="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                error={fieldErrors.email}
              />
            </div>
            <Select
              name="subject"
              label="Subject"
              placeholder="Select a subject"
              options={[
                { value: "general", label: "General inquiry" },
                { value: "suggest-tool", label: "Suggest a tool for review" },
                { value: "partnership", label: "Partnership opportunity" },
                { value: "press", label: "Press & media" },
              ]}
            />
            <Textarea
              name="message"
              label="Message"
              placeholder="How can we help you?"
              required
              error={fieldErrors.message}
            />
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">Sending...</span>
              ) : (
                <span className="flex items-center gap-2"><Send size={16} /> Send message</span>
              )}
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  )
}
