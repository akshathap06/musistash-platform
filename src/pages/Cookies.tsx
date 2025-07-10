import React from 'react';
import { Cookie, Settings, Shield, Eye } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Cookies = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216] text-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Cookie className="h-12 w-12 text-orange-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 text-transparent bg-clip-text">
                Cookie Policy
              </h1>
            </div>
            <p className="text-lg text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <section className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Settings className="h-6 w-6 mr-2 text-orange-400" />
                What are Cookies?
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our platform.
              </p>
            </section>

            <section className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">Essential Cookies</h3>
                  <p className="text-gray-300">
                    These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas of the website.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-2">Performance Cookies</h3>
                  <p className="text-gray-300">
                    These cookies collect information about how visitors use our website, such as which pages are most popular and if users get error messages.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-2">Functionality Cookies</h3>
                  <p className="text-gray-300">
                    These cookies remember choices you make to improve your experience, such as your username, language, or region.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-yellow-400 mb-2">Analytics Cookies</h3>
                  <p className="text-gray-300">
                    We use analytics cookies to understand how users interact with our platform, helping us improve our services and user experience.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4">Third-Party Cookies</h2>
              <p className="text-gray-300 mb-4">
                We may use third-party services that set cookies on your device. These include:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Google Analytics - for website analytics and performance monitoring</li>
                <li>Spotify API - for music data and artist information</li>
                <li>Authentication providers - for secure login functionality</li>
                <li>Payment processors - for secure transaction processing</li>
              </ul>
            </section>

            <section className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Eye className="h-6 w-6 mr-2 text-blue-400" />
                Managing Your Cookie Preferences
              </h2>
              <p className="text-gray-300 mb-4">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Use your browser settings to block or delete cookies</li>
                <li>Set your browser to notify you when cookies are being sent</li>
                <li>Use our cookie preference center (when available)</li>
                <li>Opt out of third-party analytics cookies through their respective services</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Please note that disabling certain cookies may affect the functionality of our website.
              </p>
            </section>

            <section className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4">Cookie Retention</h2>
              <p className="text-gray-300">
                Different cookies have different retention periods:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</li>
                <li><strong>Analytics Cookies:</strong> Typically retained for 24 months</li>
                <li><strong>Preference Cookies:</strong> Retained for up to 12 months</li>
              </ul>
            </section>

            <section className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-gray-300">
                If you have any questions about our use of cookies, please contact us at:
              </p>
              <div className="mt-4 text-blue-400">
                <p>Email: privacy@musistash.com</p>
                <p>Address: MusiStash, Inc.</p>
              </div>
            </section>

            <section className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4">Updates to This Policy</h2>
              <p className="text-gray-300">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cookies; 