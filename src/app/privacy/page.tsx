import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | PromptGallery",
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
      <p className="text-muted-foreground mb-4">
        When you use PromptGallery, we collect information you provide directly, such as your account
        information (name, email, profile picture) when you sign in with Google. We also collect content
        you create, including prompts, images, and comments.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
      <p className="text-muted-foreground mb-4">
        We use the information we collect to provide, maintain, and improve our services, to communicate
        with you, and to protect PromptGallery and our users. We do not sell your personal information
        to third parties.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">3. Cookies and Tracking</h2>
      <p className="text-muted-foreground mb-4">
        We use cookies and similar technologies to maintain your session, remember your preferences, and
        understand how you use our service. We may use third-party analytics tools to help us understand
        usage patterns.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">4. Third-Party Services</h2>
      <p className="text-muted-foreground mb-4">
        We use Google for authentication and may use Google AdSense to display advertisements. These
        services have their own privacy policies governing their use of your information. We encourage
        you to review their privacy policies.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">5. Data Security</h2>
      <p className="text-muted-foreground mb-4">
        We implement appropriate technical and organizational measures to protect your personal information
        against unauthorized access, alteration, disclosure, or destruction.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">6. Your Rights</h2>
      <p className="text-muted-foreground mb-4">
        You have the right to access, correct, or delete your personal information. You can manage your
        account settings or contact us to exercise these rights.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">7. Contact Us</h2>
      <p className="text-muted-foreground mb-4">
        If you have any questions about this Privacy Policy, please contact us at privacy@promptgallery.ai.
      </p>
    </div>
  )
}
