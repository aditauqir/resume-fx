"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion-web";

export function Legal() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-16 lg:pl-[calc(6rem+25px)] lg:pr-24">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="privacy-policy">
          <AccordionTrigger className="font-[family-name:var(--font-google-sans)] text-base text-slate-900">
            Privacy Policy
          </AccordionTrigger>
          <AccordionContent className="font-light font-[family-name:var(--font-raleway)] text-slate-600">
            <div className="space-y-4">
              <p>
                <strong>What We Collect</strong>
                <br />
                We collect your email and password at sign-up, and the resume content you provide
                (text only — no uploaded files or code). This is used solely to generate an
                improved resume for you.
              </p>
              <p>
                <strong>How It&apos;s Used</strong>
                <br />
                Your resume content is processed by AI to produce a refined output. Account
                credentials are stored securely. We do not sell, share, or use your data for
                advertising.
              </p>
              <p>
                <strong>Storage</strong>
                <br />
                Some information is stored on our servers to maintain your account and resume
                history. We take reasonable steps to keep it secure.
              </p>
              <p>
                <strong>Your Rights</strong>
                <br />
                You can delete your account at any time — this removes your data immediately. To
                request a copy of your data or raise a concern, open a support ticket.
              </p>
              <p className="text-xs text-slate-500">
                Last updated March 2026. This policy may be updated occasionally — continued use of
                the app constitutes acceptance.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="terms-conditions">
          <AccordionTrigger className="font-[family-name:var(--font-google-sans)] text-base text-slate-900">
            Terms and Conditions
          </AccordionTrigger>
          <AccordionContent className="font-light font-[family-name:var(--font-raleway)] text-slate-600">
            <div className="space-y-4">
              <p>
                By creating an account or using this app, you agree to these terms. You must be at
                least 13 years old to use this app. You are responsible for keeping your login
                credentials secure and accountable for all activity under your account. This app
                helps you build and improve your resume using AI — you agree not to misuse the
                service, including attempting to reverse-engineer, spam, or exploit it in any way.
              </p>
              <p>
                You own your resume content. By submitting it, you grant us a limited license to
                process it solely for generating your resume output — we don&apos;t claim ownership
                of your data. This service is provided as-is; we don&apos;t guarantee that
                AI-generated content will result in employment outcomes. We may update these terms
                at any time, and continued use means you accept them. Questions? Reach us via a
                support ticket.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="legal" className="border-b-0">
          <AccordionTrigger className="font-[family-name:var(--font-google-sans)] text-base text-slate-900">
            Legal & Contact
          </AccordionTrigger>
          <AccordionContent className="font-light font-[family-name:var(--font-raleway)] text-slate-600">
            <div className="space-y-4">
              <p>
                <strong>General & Support</strong>
                <br />
                For anything product-related — bugs, feature requests, feedback, or just to say hi
                — open a support ticket. Having trouble with your account or resume output? Open a
                support ticket from your dashboard with a description of the issue. We aim to reply
                within a couple of days.
              </p>
              <p>
                <strong>Privacy & Data Requests</strong>
                <br />
                To request a copy of your data or have your account and information permanently
                deleted, open a support ticket with the subject line &quot;Privacy Request&quot;.
                We&apos;ll handle it promptly.
              </p>
              <p>
                <strong>Legal Matters</strong>
                <br />
                For legal inquiries, formal complaints, or copyright concerns, open a support ticket
                with the subject line &quot;Legal&quot; and we&apos;ll prioritize your message.
              </p>
              <p>
                <strong>Open Source</strong>
                <br />
                This project is open source. You can view the source code, report issues, or
                contribute on{" "}
                <a
                  href="https://github.com/aditauqir/fix-my-resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-900 underline hover:text-slate-700"
                >
                  GitHub
                </a>
                .
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
