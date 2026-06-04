import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | PromptGallery",
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
      <p className="text-muted-foreground mb-4">
        By accessing or using PromptGallery, you agree to be bound by these Terms of Service. If you
        do not agree to these terms, please do not use our service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">2. User Content</h2>
      <p className="text-muted-foreground mb-4">
        You retain ownership of the content you post on PromptGallery. By posting content, you grant
        us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content
        on our platform.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">3. Acceptable Use</h2>
      <p className="text-muted-foreground mb-4">
        You agree not to use PromptGallery to post content that is illegal, harmful, threatening, abusive,
        harassing, defamatory, or otherwise objectionable. You must not attempt to gain unauthorized access
        to our systems or other users&apos; accounts.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
      <p className="text-muted-foreground mb-4">
        The prompts shared on PromptGallery are contributed by our community. While we encourage sharing,
        users are responsible for ensuring they have the right to share the content they post. Respect
        the intellectual property rights of others.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">5. Disclaimer of Warranties</h2>
      <p className="text-muted-foreground mb-4">
        PromptGallery is provided &quot;as is&quot; without warranties of any kind, either express or implied.
        We do not guarantee that the service will be uninterrupted, secure, or error-free.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
      <p className="text-muted-foreground mb-4">
        To the fullest extent permitted by law, PromptGallery shall not be liable for any indirect,
        incidental, special, consequential, or punitive damages arising out of or relating to your use
        of our service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">7. Changes to Terms</h2>
      <p className="text-muted-foreground mb-4">
        We reserve the right to modify these terms at any time. We will notify users of significant
        changes. Your continued use of PromptGallery after changes constitutes acceptance of the
        updated terms.
      </p>
    </div>
  )
}
