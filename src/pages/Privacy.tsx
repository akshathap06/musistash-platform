import React from 'react';
import { Shield, Eye, Lock, Database, UserCheck, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216] text-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-green-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">
                Privacy Policy
              </h1>
            </div>
            <p className="text-lg text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 md:p-12 border border-gray-700/50 backdrop-blur-sm">
            <div className="prose prose-invert max-w-none">
              
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Eye className="h-6 w-6 text-green-400 mr-2" />
                  1. Information We Collect
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We collect information you provide directly to us, such as when you create an account, make an investment, 
                  or contact us for support. This may include:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Personal identification information (name, email address, phone number)</li>
                  <li>Financial information for investment purposes</li>
                  <li>Profile information and preferences</li>
                  <li>Communications with us</li>
                  <li>Technical information about your device and usage</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Database className="h-6 w-6 text-blue-400 mr-2" />
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, and security alerts</li>
                  <li>Respond to comments, questions, and customer service requests</li>
                  <li>Communicate about products, services, and promotional offers</li>
                  <li>Monitor and analyze usage patterns and trends</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing and Disclosure</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li><strong>With your consent:</strong> We may share information with third parties when you give us consent to do so</li>
                  <li><strong>Service providers:</strong> We may share information with vendors and service providers who perform services on our behalf</li>
                  <li><strong>Legal requirements:</strong> We may disclose information if required by law or in response to legal process</li>
                  <li><strong>Business transfers:</strong> Information may be transferred in connection with any merger, acquisition, or sale of assets</li>
                  <li><strong>Protection of rights:</strong> We may disclose information to protect our rights, property, or safety</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Lock className="h-6 w-6 text-purple-400 mr-2" />
                  4. Data Security
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, 
                  disclosure, alteration, and destruction. These measures include:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Regular security assessments and monitoring</li>
                  <li>Access controls and authentication measures</li>
                  <li>Employee training on data protection</li>
                  <li>Compliance with industry security standards</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">5. Data Retention</h2>
                <p className="text-gray-300 leading-relaxed">
                  We retain your information for as long as your account is active or as needed to provide you services. 
                  We may also retain and use your information as necessary to comply with our legal obligations, resolve disputes, 
                  and enforce our agreements. When we no longer need your information, we will dispose of it securely.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <UserCheck className="h-6 w-6 text-green-400 mr-2" />
                  6. Your Rights and Choices
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li><strong>Access:</strong> You can request access to your personal information</li>
                  <li><strong>Correction:</strong> You can request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> You can request deletion of your personal information</li>
                  <li><strong>Portability:</strong> You can request a copy of your information in a structured format</li>
                  <li><strong>Opt-out:</strong> You can opt out of certain communications and data processing</li>
                  <li><strong>Account settings:</strong> You can update your account information and preferences</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking Technologies</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to collect and use personal information about you. 
                  This includes:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Essential cookies for site functionality</li>
                  <li>Analytics cookies to understand site usage</li>
                  <li>Preference cookies to remember your settings</li>
                  <li>Marketing cookies for targeted advertising</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  You can control cookies through your browser settings, but disabling certain cookies may limit site functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">8. Third-Party Links and Services</h2>
                <p className="text-gray-300 leading-relaxed">
                  Our service may contain links to third-party websites, applications, or services that are not owned or controlled by us. 
                  We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies 
                  of any third-party services before providing your information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">9. International Data Transfers</h2>
                <p className="text-gray-300 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. These countries may have different 
                  data protection laws. When we transfer your information, we take steps to ensure it receives an adequate level of protection.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">10. Children's Privacy</h2>
                <p className="text-gray-300 leading-relaxed">
                  Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from 
                  children under 13. If you are a parent or guardian and believe your child has provided us with personal information, 
                  please contact us so we can delete such information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-400 mr-2" />
                  11. Changes to This Privacy Policy
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy 
                  on this page and updating the "Last updated" date. We encourage you to review this privacy policy periodically for any changes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">12. California Privacy Rights</h2>
                <p className="text-gray-300 leading-relaxed">
                  If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including 
                  the right to know what personal information we collect, use, and share, the right to delete personal information, 
                  and the right to opt out of the sale of personal information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">13. Contact Us</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <p className="text-green-400 font-semibold">Musi$tash Privacy Team</p>
                  <p className="text-gray-300">Email: contact@musistash.com</p>
                  <p className="text-gray-300">Website: https://musistash.com</p>
                  <p className="text-gray-300 mt-2">
                    For privacy-related inquiries, please include "Privacy Policy" in your subject line.
                  </p>
                </div>
              </section>

              <div className="mt-8 p-6 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg border border-green-700/30">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <Shield className="h-5 w-5 text-green-400 mr-2" />
                  Your Privacy Matters
                </h3>
                <p className="text-gray-300">
                  At Musi$tash, we are committed to protecting your privacy and being transparent about how we handle your data. 
                  We believe that privacy is a fundamental right, and we design our products and services with privacy in mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy; 