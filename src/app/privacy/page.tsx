"use client";

import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-emerald-600">
                  🏡 Farm Home Life
                </span>
              </Link>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/features"
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link
                href="/signin"
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors duration-200"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Privacy Policy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          PRIVACY POLICY
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last Updated: June 03, 2025
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            INTRODUCTION
          </h2>
          <p className="text-gray-700 mb-4">
            Farm Home Life (&quot;our&quot; &quot;we&quot; or &quot;us&quot;)
            respect the privacy and are committed to protect the personal
            information of our Users (&quot;user,&quot; &quot;you,&quot;
            your&quot; or &quot;yours&quot;) when you visit or use Farm Home
            Life (the &quot;App&quot;). We provide our App and Services
            (hereinafter collectively, either &quot;App&quot; or
            &quot;Services&quot;) to you as under the following privacy policy
            (the &quot;Policy&quot;).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Personal Information We Collect
          </h2>
          <p className="text-gray-700 mb-4">
            In order to keep the App functional, we must process information
            about you to operate, improve, modify, customize, support and market
            our services.
          </p>
          <p className="text-gray-700 mb-4">
            The type of information that we collect depends on how you use our
            App and Services. We require certain information to deliver to you,
            our services, and without this, we will not be able to provide such
            services to you. Our Services have optional features, which, if used
            by you, require us to collect additional information to provide such
            features. You will be notified of such collection, as appropriate.
            If you choose not to provide the information needed to use a
            feature, you will be unable to use the feature. Please carefully
            read the following to understand what information we may collect:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>
              When you use the App or register to the App, we may ask you to
              provide certain information, including Email, Name, Phone,
              Password or Personal number. We will also collect or otherwise ask
              you to provide additional information that you provide us, such as
              your profile details, pictures and/or any other texts, images,
              videos or information that you may upload on the App and/or
              provide to the App.
            </li>
            <li>
              Your financial information when you make purchases on the App. We
              collect financial information when you make a purchase on the
              Stripe or other payment providers.
            </li>
            <li>
              We also collect information while you access, browse, view or
              otherwise use the App. In other words, when you access the App we
              are aware of your usage of the App, and gather, collect and record
              the information relating to such usage, including geo-location
              information, IP address, device and connection information,
              browser information and web-log information, phone book and
              contacts, and all communications recorded by Users through the
              App. We use that information to enhance user experience,
              personalize your browsing experience as well as monitor the App
              for preventing fraud and inappropriate content or behavior. We
              collect texts, information, pictures, videos and/or any data that
              you may upload on the app. We also collect supplemental
              information obtained from third parties such as demographic and
              navigation data, if applicable. We combine your personal
              information with information we collect automatically or obtain
              from other companies and use it to improve and personalize our
              services, content and advertising and/or to prevent fraud.
            </li>
          </ul>
          <p className="text-gray-700">
            All of the preceding is collected, as permitted by applicable laws
            relevant to your jurisdiction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            How Do We Collect Personal Information?
          </h2>
          <p className="text-gray-700 mb-4">
            Information provided by you. You directly provide us with most of
            the information we collect. You do this by filling out the
            registration details on the App, linking accounts of other social
            networks to your Farm Home Life account, completing application
            forms, as well as by posting and sharing additional information
            voluntarily.
          </p>
          <p className="text-gray-700 mb-4">
            Information we collect when you use the App. We collect technical
            information indirectly and automatically through our systems. This
            information includes logging your operating system, software
            configuration, Internet Protocol (IP) address and use of cookies
            (cookies are small files sent from us to your computer and sometimes
            back). Cookies ultimately help us improve your navigation and ease
            of use of our App.
          </p>
          <p className="text-gray-700 mb-4">
            Should you require additional information about how we may use
            Cookies to improve the services we provide, please visit our Cookie
            Policy.
          </p>
          <p className="text-gray-700 mb-4">
            Information we collect from other sources. We may receive
            information from third party vendors and/or other commercially
            available sources, such as:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>
              Third party vendors who provide us data to supplement the
              information we collect about you, in accordance with applicable
              laws. For example, we receive information from advertising and
              marketing partners in order to manage and measure our campaigns as
              well as from enrichment service providers to enhance, modify and
              personalize your experience of the App.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            How We Use Collected Personal Information?
          </h2>
          <p className="text-gray-700 mb-4">
            All processing of your personal information will always be justified
            by a &quot;lawful ground&quot; for processing, where relevant under
            applicable laws. In the majority of cases, processing will be
            justified on the basis that:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>
              you, or in the case you are below the age of 16 or the age of
              legal adulthood if different in your country, your parent or
              guardian has provided consent for us to use your personal
              information for a specific purpose;
            </li>
            <li>
              the use of your personal information is necessary to perform a
              contract or take reasonable steps to enter into a contract with
              you (e.g. to provide you with agreements or services which you
              have purchased);
            </li>
            <li>
              the processing is necessary to comply with a relevant legal
              obligation or regulatory obligation that you and/or we have (e.g.
              fraud prevention); or
            </li>
            <li>
              the processing is necessary to support our legitimate interests as
              a business (e.g. to improve our services to you), subject to your
              interests and fundamental rights and provided it is conducted at
              all times in a way that is proportionate.
            </li>
          </ul>
          <p className="text-gray-700 mb-4">
            We will use your personal information for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>To create user accounts.</li>
            <li>To manage user orders.</li>
            <li>To contact user.</li>
            <li>To provide support.</li>
            <li>To post testimonials.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            How Long Do We Retain Your Personal Information?
          </h2>
          <p className="text-gray-700 mb-4">
            We retain personal information only for as long as is required to
            fulfil the purpose for which it was collected and unless otherwise
            stated for a period of: as long as the user has an account with us.
            Please note that some circumstances, we will retain your personal
            information for longer periods of time. We will retain personal
            information for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>
              as long as it is necessary and relevant for our operations, e.g.
              as long as is necessary to provide services, etc.; and
            </li>
            <li>
              in relation to personal information to comply with applicable
              laws, prevent fraud, troubleshoot problems, assist with any
              investigation, enforce our App terms and take other actions as
              permitted by law.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Children under the legal Age of adulthood
          </h2>
          <p className="text-gray-700 mb-4">
            Our services are not directed to children under the age of thirteen,
            or any as such age relevant to Applicable Laws in your jurisdiction,
            and we do not knowingly collect personal information from children
            under the age of thirteen, or sixteen, through our Services. We
            encourage parents and legal guardians to help enforce our Privacy
            Notice by instructing children under the age of thirteen not to
            download or use our online services.
          </p>
          <p className="text-gray-700 mb-4">
            Should we learn we have collected or received personal information
            from a child under 13 or any such age relevant to Applicable Laws in
            your jurisdiction, we shall delete that personal information
            immediately and if we shall have a reasonable doubt that the consent
            given is not truthful regarding the age of the user, we reserve
            ourselves the right to immediately suspend the access to the App
            giving notice of the reasons. If you believe we might have any
            information from or about a child under 13 or 16, or if you are a
            parent or guardian concerned that we may have collected information
            of your child, please contact us immediately at
            support@farmhomelife.com.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            CONTACT US
          </h2>
          <p className="text-gray-700 mb-4">
            For any questions or queries regarding this Privacy Policy, please
            feel free to contact us:
          </p>
          <p className="text-gray-700 font-medium">support@farmhomelife.com</p>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-white">
                  🏡 Farm Home Life
                </span>
              </Link>
              <p className="mt-4 text-gray-400 text-sm">
                The complete management solution for modern farmers.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Product
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    href="/features"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#testimonials"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Testimonials
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    href="/help"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing#faq"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    href="/privacy"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} Farm Home Life. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
