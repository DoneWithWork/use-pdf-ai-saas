import Footer from "@/components/mis/Footer";
import LandingNav from "@/components/navbars/LandingNav";
import Link from "next/link";
import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="w-full h-full">
      <LandingNav />
      <div className="max-w-[1000px] mx-auto">
        <h1 className="title text-center">Privacy Policy</h1>
        <div className="my-4">
          <p>Effective Date: 25/12/2024</p>
          <p>Last Updated: 25/12/2024</p>
        </div>
        <div className="space-y-3 px-3">
          <p className="font-semibold">
            1. Introduction Welcome to PDF AI (&quot;we,&quot; &quot;our,&quot;
            or &quot;us&quot;).
          </p>
          <p>
            We are committed to safeguarding your privacy and ensuring the
            security of your personal information. This Privacy Policy outlines
            how we collect, use, disclose, and protect your data when you use
            our services.
          </p>
          <p className="font-semibold">2. Information We Collect</p>
          <p>
            Personal Information: When you create an account or subscribe to our
            services, we may collect personal details such as your name, email
            address, payment information, and contact preferences.
          </p>
          <p className="font-semibold">3. How We Use Your Information </p>
          <p>
            Service Provision: To process and analyze your uploaded documents,
            generate AI-driven responses, and provide the functionalities of our
            platform. Account Management: To manage your account, process
            payments, and communicate with you about your subscription and
            service updates. Service Improvement: To understand how users
            interact with our services, allowing us to enhance user experience,
            develop new features, and improve performance. Compliance and Legal
            Obligations: To comply with legal requirements, enforce our terms of
            service, and protect against fraudulent or illegal activities.
          </p>
          <p className="font-semibold">4. Data Sharing and Disclosure</p>
          <p>
            We do not sell your personal information. We may share your data
            with: Service Providers: Trusted third-party vendors who assist in
            operating our services, such as payment processors, hosting
            providers, and customer support platforms. Legal Authorities: When
            required by law or in response to valid legal processes, we may
            disclose your information to law enforcement or other governmental
            authorities. Business Transfers: In the event of a merger,
            acquisition, or sale of assets, your information may be transferred
            as part of the business transaction.
          </p>
          <p className="font-semibold"> 5. Data Security</p>
          <p>
            We implement robust security measures to protect your information
            from unauthorized access, alteration, disclosure, or destruction.
            However, no method of transmission over the internet or electronic
            storage is completely secure, and we cannot guarantee absolute
            security.
          </p>
          <p className="font-semibold">6. Data Retention </p>
          <p>
            Uploaded Documents: We retain your uploaded documents only as long
            as necessary to provide our services or as required by law. Personal
            Information: Your personal data is retained for the duration of your
            account&apos;s existence and as needed to comply with legal
            obligations or resolve disputes.
          </p>
          <p className="font-semibold">7. Your Rights and Choices</p>
          <p>
            Depending on your jurisdiction, you may have the following rights
            regarding your personal information: Access and Correction: Request
            access to your data and correct any inaccuracies. Deletion: Request
            the deletion of your personal information, subject to certain legal
            exceptions. Data Portability: Obtain a copy of your data in a
            structured, commonly used format. Consent Withdrawal: Withdraw
            consent where processing is based on consent, without affecting the
            lawfulness of processing based on consent before its withdrawal. To
            exercise these rights, please contact us at{" "}
            <span>usepdfai@gmail.com</span>.
          </p>
          <p className="font-semibold">8. Children&apos;s Privacy</p>
          <p>
            Our services are not directed at individuals under the age of 13. We
            do not knowingly collect personal information from children under
            13. If we become aware that a child under 13 has provided us with
            personal data, we will take steps to delete such information
            promptly.
          </p>
          <p className="font-semibold">9. International Data Transfers</p>
          <p>
            Your information may be transferred to and processed in countries
            other than your own. We ensure that appropriate safeguards are in
            place to protect your data in accordance with this Privacy Policy
            and applicable laws.
          </p>
          <p className="font-semibold">10. Changes to This Privacy Policy</p>
          <p>
            We may update this Privacy Policy to reflect changes in our
            practices or for legal, technical, or regulatory reasons. We will
            notify you of any significant changes by posting the new policy on
            our website and updating the effective date. Your continued use of
            our services after such changes constitutes your acceptance of the
            revised policy.
          </p>
          <p className="font-semibold">11. Contact Us</p>
          <p>
            If you have any questions or concerns about this Privacy Policy or
            our data practices, please contact us at: <br />
            <span>
              Email:{" "}
              <Link
                className="font-semibold"
                href={`mailto:usepdfai@gmail.com`}
              >
                usepdfai@gmail.com
              </Link>
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
