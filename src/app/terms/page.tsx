"use client";

import React from "react";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-emerald-600">🏡 Farm Home Life</span>
              </Link>
            </div>
            <nav className="flex space-x-4">
              <Link href="/" className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Home
              </Link>
              <Link href="/features" className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Pricing
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
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

      {/* Terms of Service Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">TERMS AND CONDITIONS</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: June 03, 2025</p>

        <section className="mb-8">
          <p className="text-gray-700 mb-4">
            Our Terms and Conditions (hereinafter, &quot;T&C&quot;) constitute a legally binding agreement between Farm Home Life (hereinafter, &quot;Us&quot;, &quot;We&quot; or &quot;Our&quot;) and you (hereinafter, &quot;User,&quot; &quot;Users,&quot; &quot;your,&quot; or &quot;yours&quot;). Your use of our App shall be governed by the following T&C.
          </p>
          <p className="text-gray-700 mb-4">
            If you are a child under 13 years old (or such greater age required in your country or territory for you to be authorized to register for and use our App without parental approval), you are allowed to use our App only after your parent or guardian has red and accepted these T&C for you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Registration</h2>
          <p className="text-gray-700 mb-4">
            You agree to provide accurate information regarding your phone number, email address and any other additional information, whilst registering for our App. Should any of your details change, you shall immediately adjourn your data and notify us via email at support@farmhomelife.com. You agree to receive for security reasons text messages and phone calls (from us or our third-party providers) with codes to register for our App.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Age</h2>
          <p className="text-gray-700 mb-4">
            You must be at least 13 years old to register for and use our App (or such greater age required in your country or territory for you to be authorized to register for and use our App without parental approval) and having red these T&C with your parent or guardian. In addition to being of the minimum required age to use our App under applicable law, if you are not old enough to have authority to agree to our T&C in your country or territory, your parent or guardian must agree to our T&C on your behalf. Please ask your parent or guardian to read these T&C with you. In any case we reserve ourselves the right to suspend and cancel your account unilaterally and without notice if we have a reasonable doubt that you do not have the legal minimum age to use our App.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Devices and Software</h2>
          <p className="text-gray-700 mb-4">
            You may need to provide certain devices, software, and data connections to use our App, which we otherwise do not supply. In order to use our App, you consent to manually or automatically download and install updates to our App You also consent to our sending you notifications via our App from time to time, as necessary to keep our App functional for you.
          </p>
          <p className="text-gray-700 mb-4">
            You may purchase products from our App and/or subscribe to a subscription plan. Our App may offers subscription plans, in-App purchases and promotions.
          </p>
          <p className="text-gray-700 mb-4">
            The subscription plan types, names and prices may change occasionally. For all subscription plans, payment occurs on a pre-pay basis. The amount you are to pay and the length of your subscription will depend on the subscription plan you choose.
          </p>
          <p className="text-gray-700 mb-4">
            We reserve the sole right to change pricing without notice or cause and you are required to keep checking the link above.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Use</h2>
          <p className="text-gray-700 mb-4">
            You agree to only use our App under the following conditions:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>
              you may only use our App for your own personal, non-commercial purposes – if you are a company or another business entity whatsoever you are in any case requested to state so, even if you plan to use our App for non-commercial purposes;
            </li>
            <li>
              you may upload data, text, information, screen names, graphics, photos, profiles, audio and video clips, links (hereinafter, the "Content") on our App;
            </li>
            <li>
              you may only use our App in good faith, and in compliance with Applicable laws.
            </li>
          </ul>
          <p className="text-gray-700 mb-4">
            You agree not to, and you shall not permit others to:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>
              license, sell, rent, lease, transfer, assign, distribute, transmit, host, outsource, disclose or otherwise commercially exploit our App or make our App available to any third parties;
            </li>
            <li>
              copy or use our App for any purpose other than your own personal, non-commercial purposes;
            </li>
            <li>
              copy or use our App to facilitate any criminal activity, including but not limited to hacking;
            </li>
            <li>
              modify, make derivative works of, disassemble, decrypt, translate, reverse compile or reverse engineer any part of our App;
            </li>
            <li>
              abuse, harass, threaten, impersonate or intimidate other Users of our App;
            </li>
            <li>
              post nude, partially nude, sexually suggestive photos, or otherwise any other illegal and/or discriminatory Content on our App;
            </li>
            <li>
              use our App for any illegal or unauthorized purpose. International Users agree to comply with all local laws regarding online conduct and acceptable content;
            </li>
            <li>
              violate any laws in your and our jurisdiction (including but not limited to copyright laws) in the use of our App;
            </li>
            <li>
              transmit any worms or viruses or otherwise any code of a destructive nature on our App.
            </li>
          </ul>
          <p className="text-gray-700 mb-4">
            You are the solely responsible for any activity that occurs under your account and for keeping your password secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy</h2>
          <p className="text-gray-700 mb-4">
            All material and services available and/or provided by our App, its affiliates, employees, licensors or other commercial partners including, but not limited to: our logo, visual designs or other materials and components are the property of our App or other parties that have licensed their material or provided services to us. Such material and services are duly protected by registered and unregistered copyright, trademarks, trade secrets, design and such other intellectual property laws as may be applicable in your country, and may not be duplicated under any circumstances, or used other than for your personal non-commercial use, or otherwise than described in these Terms and Conditions or our Privacy Policy.
          </p>
          <p className="text-gray-700 mb-4">
            We care about data privacy and security. Please review our <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700">Privacy Policy</Link>. By using our App, you agree to be bound by our Privacy Policy, which is incorporated into these T&C. Please be advised the Site is hosted in the United States. If you access the Site from the USA, Canada, EU, Asia, or any other region of the world with laws or other requirements governing personal data collection, use, or disclosure that differ from applicable laws in United States, then through your continued use of the Site, you are transferring your data to United States, and you expressly consent to have your data transferred to and processed in United States. If you do not agree with such transfer of data, you should immediately refrain from using our App and notify us in order to delete your data. Further, we do not knowingly accept, request, or solicit information from children or knowingly market to children. We only collect information from children after obtaining prior consent from their parents or guardians and reserve ourselves the right to suspend or delete your account if we suspect such consent is not authentic. Therefore, in accordance with the U.S. Children&apos;s Online Privacy Protection Act and EU GDPR Reg. 679/2016 recitals 38 and 58, if we receive actual knowledge that anyone under the age of 13 has provided personal information to us without the requisite and verifiable parental consent, we will delete that information from the App as quickly as is reasonably practical.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Limitation of liability</h2>
          <p className="text-gray-700 mb-4 uppercase">
            WE WILL NOT BE LIABLE TO YOU FOR ANY LOST PROFITS OR CONSEQUENTIAL, SPECIAL, PUNITIVE, INDIRECT, OR INCIDENTAL DAMAGES RELATING TO, ARISING OUT OF, OR IN ANY WAY IN CONNECTION WITH OUR TERMS, US, OR OUR APP, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR AGGREGATE LIABILITY RELATING TO, ARISING OUT OF, OR IN ANY WAY IN CONNECTION WITH OUR TERMS, US, OR OUR SERVICES WILL NOT EXCEED THE GREATER OF ONE HUNDRED DOLLARS ($100) AND 100% OF THE PRICE PAID, IF APPLICABLE. THE FOREGOING DISCLAIMER OF CERTAIN DAMAGES AND LIMITATION OF LIABILITY WILL APPLY TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW. THE LAWS OF SOME STATES OR JURISDICTIONS MAY NOT ALLOW THE DISCRETIONARY EXCLUSION OR LIMITATION OF CERTAIN DAMAGES, SO SOME OR ALL OF THE EXCLUSIONS AND LIMITATIONS SET FORTH ABOVE MAY NOT APPLY TO YOU. NOTWITHSTANDING ANYTHING TO THE CONTRARY IN OUR TERMS, IN SUCH CASES, THE LIABILITY OF FARM HOME LIFE WILL BE LIMITED TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Indemnification</h2>
          <p className="text-gray-700 mb-4">
            You agree to defend, indemnify, and hold harmless Farm Home Life from and against all liabilities, damages, losses, and expenses of any kind (including reasonable legal fees and costs) relating to, arising out of, or in any way in connection with any of the following: (a) your access to or use of our Services, including information provided in connection therewith; (b) your breach or alleged breach of our Terms; or (c) any misrepresentation made by you.
          </p>
          <p className="text-gray-700 mb-4">
            You will cooperate as fully as required by us in the defense or settlement of any claim.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dispute resolution</h2>
          <p className="text-gray-700 mb-4">
            In compliance with the EU-US Privacy Shield Principles and the Swiss-US Privacy Shield Principles, we commit to resolve complaints about your privacy and our collection or use of your personal information. European Union, United Kingdom, or Swiss individuals with inquiries or complaints regarding this terms of service should contact us by email at support@farmhomelife.com or by any other available method available in the CONTACT US section.
          </p>
          <p className="text-gray-700 mb-4">
            Farm Home Life has further committed to refer unresolved privacy complaints under the EU-US Privacy Shield Principles and the Swiss-US Privacy Shield Principles to an independent dispute resolution mechanism, the BBB EU PRIVACY SHIELD, operated by BBB National Programs. If you do not receive timely acknowledgment of your complaint, or if your complaint is not satisfactorily addressed, please visit <a href="https://bbbprograms.org/privacy-shield-complaints/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">https://bbbprograms.org/privacy-shield-complaints/</a> for more information and to file a complaint. This service is provided at no cost to you. Please do not submit GDPR complaints to BBB EU Privacy Shield.
          </p>
          <p className="text-gray-700 mb-4">
            If your EU-US Privacy Shield complaint cannot be resolved through these described channels, under certain conditions, you may invoke binding arbitration for some residual claims not resolved by other redress mechanisms. To learn more, please view the Privacy Shield Annex 1 at <a href="https://www.privacyshield.gov/article?id=ANNEX-I-introduction" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">https://www.privacyshield.gov/article?id=ANNEX-I-introduction</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Disclaimer: Warranty</h2>
          <p className="text-gray-700 mb-4">
            To the extent permitted under Applicable laws, you acknowledge that we provide the App "as-is" without any warranty of any kind, express or implied, and to the maximum extent permitted by Applicable law. We disclaim all warranties, whether express, implied, or statutory, including but not limited to, warranties of merchantability, fitness for a particular purpose, title, quiet enjoyment, accuracy, and non-infringement. We do not guarantee any specific results from the use of our App. We make no warranty that the App shall be uninterrupted, free of viruses, or other harmful code, timely, secure or error or bug free.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Amendments</h2>
          <p className="text-gray-700 mb-4">
            We reserve the sole right to amend, repeal, modify, replace, terminate or make changes to this T&C, and the App without notice, from time to time. If we make material changes to this T&C, or the App, we shall – if possible - notify you by sending you an e-mail at your primary email address or in any other way convenient for us., as mentioned in your account details. Any changes to this T&C, or App, shall be effective immediately for new users of our App; otherwise these changes shall be effective upon the earliest of thirty (30) calendar days following our dispatch of an e-mail notice to you; if you do not want to agree to such changes, you shall refrain from using the App and delete your account unless otherwise provided in the aforementioned notice. You are responsible at all times for updating your Account to provide to us your most current e-mail address. If the last e-mail address that you have provided to us is not valid, or for any reason is not capable of delivering the notice described above, our dispatch of the e-mail containing such notice shall nonetheless constitute effective notice of the changes. Continued use of the App following notice of such changes shall indicate your acknowledgement of, and T&C to be bound by, such changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Severability and Disclaimers</h2>
          <p className="text-gray-700 mb-4">
            Neither the rights nor the obligations arising under this T&C are assignable by you, and any such attempted assignment or transfer shall be void and without effect. We reserve the right to freely assign this T&C.
          </p>
          <p className="text-gray-700 mb-4">
            The United Nations Convention on Contracts for the International Sale of Goods shall not apply to this T&C. Any notice to you may be provided by email to the address you have registered with us. We shall have no responsibility to provide maintenance or support services with respect to the App.
          </p>
          <p className="text-gray-700 mb-4">
            If any provision of this T&C is unenforceable, such provision shall be interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions shall continue in full force and effect.
          </p>
          <p className="text-gray-700 mb-4">
            All waivers by us shall be effective only if in writing, there included this T&C. Any waiver or failure by Farm Home Life to enforce any provision of this T&C on one occasion shall not be deemed a waiver of any other provision or of such provision on any other occasion.
          </p>
          <p className="text-gray-700 mb-4">
            You acknowledge that the App contains valuable trade secrets, trademarks, copyrights, proprietary information and other intellectual properties of Farm Home Life , that any actual or threatened breach of any section of this T&C that may constitute irreparable harm to Farm Home Life shall be liable to any and every damages, including but not limited to, incidental damages, consequential damages, nominal damages, liquidated damages, punitive damages, monetary or any special kind of damages permitted by applicable laws, as an appropriate remedy for such breach. This T&C and the Terms constitute the final, complete, and exclusive agreement between the parties regarding the App and supersede all prior or contemporaneous agreements, understandings, and communication, whether written or oral.
          </p>
          <p className="text-gray-700 mb-4">
            If any provision of these T&C is unenforceable, such provision shall be interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions shall continue in full force and effect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">CONTACT US</h2>
          <p className="text-gray-700 mb-4">
            For any questions or queries regarding this Terms and Conditions, please feel free to contact us:
          </p>
          <p className="text-gray-700 font-medium">
            support@farmhomelife.com
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-white">🏡 Farm Home Life</span>
              </Link>
              <p className="mt-4 text-gray-400 text-sm">
                The complete management solution for modern farmers.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/features" className="text-base text-gray-300 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-base text-gray-300 hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/#testimonials" className="text-base text-gray-300 hover:text-white">
                    Testimonials
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/help" className="text-base text-gray-300 hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-base text-gray-300 hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/pricing#faq" className="text-base text-gray-300 hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/privacy" className="text-base text-gray-300 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-base text-gray-300 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} Farm Home Life. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
