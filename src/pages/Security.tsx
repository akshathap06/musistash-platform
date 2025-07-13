import React from 'react';
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Server } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Security = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216] text-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-green-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">
                Security
              </h1>
            </div>
            <p className="text-lg text-gray-400">
              Your security is our top priority. Learn about our comprehensive security measures.
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <section className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Lock className="h-6 w-6 mr-2 text-green-400" />
                Data Protection
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your personal information and financial data.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>End-to-end encryption for all sensitive data transmission</li>
                <li>Advanced encryption algorithms (AES-256) for data at rest</li>
                <li>Regular security audits and penetration testing</li>
                <li>Secure data centers with 24/7 monitoring</li>
              </ul>
            </section>

            <section className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-blue-400" />
                Authentication & Access Control
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">Multi-Factor Authentication</h3>
                  <p className="text-gray-300">
                    We use Google OAuth and other secure authentication methods to ensure only authorized users can access accounts.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-2">Role-Based Access</h3>
                  <p className="text-gray-300">
                    Different user roles (artists, investors, developers) have appropriate access levels to protect sensitive information.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-2">Session Management</h3>
                  <p className="text-gray-300">
                    Secure session handling with automatic timeouts and token refresh mechanisms.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Server className="h-6 w-6 mr-2 text-yellow-400" />
                Infrastructure Security
              </h2>
              <p className="text-gray-300 mb-4">
                Our platform is built on secure, scalable infrastructure:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Cloud-based architecture with automatic scaling and failover</li>
                <li>Regular security updates and patch management</li>
                <li>Network firewalls and intrusion detection systems</li>
                <li>DDoS protection and traffic monitoring</li>
                <li>Automated backups with encryption</li>
              </ul>
            </section>

            <section className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Eye className="h-6 w-6 mr-2 text-purple-400" />
                Privacy & Compliance
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">Data Minimization</h3>
                  <p className="text-gray-300">
                    We collect only the data necessary to provide our services and delete it when no longer needed.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-2">Regulatory Compliance</h3>
                  <p className="text-gray-300">
                    We comply with relevant data protection regulations including GDPR, CCPA, and financial industry standards.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-2">Third-Party Security</h3>
                  <p className="text-gray-300">
                    All third-party integrations undergo security assessments and must meet our security standards.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-red-400" />
                Incident Response
              </h2>
              <p className="text-gray-300 mb-4">
                In the unlikely event of a security incident, we have comprehensive response procedures:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>24/7 security monitoring and alerting systems</li>
                <li>Rapid incident response team activation</li>
                <li>Immediate containment and assessment procedures</li>
                <li>User notification within 72 hours if personal data is affected</li>
                <li>Cooperation with law enforcement and regulatory authorities</li>
                <li>Post-incident analysis and security improvements</li>
              </ul>
            </section>

            <section className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4">Financial Security</h2>
              <p className="text-gray-300 mb-4">
                Protecting your financial information is crucial to our platform:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>PCI DSS compliance for payment processing</li>
                <li>Secure payment gateways with tokenization</li>
                <li>Real-time fraud detection and prevention</li>
                <li>Encrypted storage of financial data</li>
                <li>Regular financial audits and compliance checks</li>
              </ul>
            </section>

            <section className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4">Your Role in Security</h2>
              <p className="text-gray-300 mb-4">
                You can help keep your account secure by:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Using strong, unique passwords</li>
                <li>Enabling two-factor authentication when available</li>
                <li>Keeping your contact information up to date</li>
                <li>Reporting suspicious activity immediately</li>
                <li>Logging out of shared or public devices</li>
                <li>Keeping your browser and devices updated</li>
              </ul>
            </section>

            <section className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4">Security Certifications</h2>
              <p className="text-gray-300 mb-4">
                Our security practices are verified by industry-standard certifications:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>SOC 2 Type II compliance</li>
                <li>ISO 27001 certification (in progress)</li>
                <li>PCI DSS Level 1 compliance</li>
                <li>Regular third-party security assessments</li>
              </ul>
            </section>

            <section className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4">Report Security Issues</h2>
              <p className="text-gray-300 mb-4">
                If you discover a security vulnerability or have security concerns, please contact us immediately:
              </p>
              <div className="text-blue-400 space-y-2">
                <p>Security Team: security@musistash.com</p>
                <p>Emergency Hotline: Available 24/7</p>
                <p>Bug Bounty Program: Coming soon</p>
              </div>
              <p className="text-gray-300 mt-4">
                We take all security reports seriously and will respond within 24 hours.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Security; 