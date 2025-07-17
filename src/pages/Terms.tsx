import React from 'react';
import { FileText, Shield, Users, AlertCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216] text-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 text-blue-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                Terms of Service
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
                  <Shield className="h-6 w-6 text-blue-400 mr-2" />
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  By accessing and using the Musi$tash platform ("Service"), you accept and agree to be bound by the terms and 
                  provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Users className="h-6 w-6 text-purple-400 mr-2" />
                  2. Use License
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Permission is granted to temporarily download one copy of the materials on Musi$tash's website for personal, 
                  non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                  <li>attempt to decompile or reverse engineer any software contained on Musi$tash's website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  To access certain features of the Service, you may be required to create an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>provide accurate, complete, and current information</li>
                  <li>maintain the security of your password and account</li>
                  <li>notify us immediately of any unauthorized use of your account</li>
                  <li>be responsible for all activities that occur under your account</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">4. Investment Terms</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Musi$tash facilitates investment opportunities in musical projects. By participating in investments through our platform:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>You acknowledge that all investments carry risk and may result in loss</li>
                  <li>You confirm that you meet any applicable investor qualification requirements</li>
                  <li>You understand that investment returns are not guaranteed</li>
                  <li>You agree to comply with all applicable securities laws and regulations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">5. Artist Obligations</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Artists using our platform to raise funds agree to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>provide accurate information about their projects and funding needs</li>
                  <li>use funds raised for the stated purposes</li>
                  <li>maintain regular communication with investors</li>
                  <li>comply with all applicable laws regarding fundraising and securities</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">6. Prohibited Uses</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You may not use our Service:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>for any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>to infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>to submit false or misleading information</li>
                  <li>to upload or transmit viruses or any other type of malicious code</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <AlertCircle className="h-6 w-6 text-yellow-400 mr-2" />
                  7. Disclaimer
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  The materials on Musi$tash's website are provided on an 'as is' basis. Musi$tash makes no warranties, expressed or implied, 
                  and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of 
                  merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">8. Limitations</h2>
                <p className="text-gray-300 leading-relaxed">
                  In no event shall Musi$tash or its suppliers be liable for any damages (including, without limitation, damages for loss of data 
                  or profit, or due to business interruption) arising out of the use or inability to use the materials on Musi$tash's website, 
                  even if Musi$tash or a Musi$tash authorized representative has been notified orally or in writing of the possibility of such damage. 
                  Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or 
                  incidental damages, these limitations may not apply to you.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">9. Accuracy of Materials</h2>
                <p className="text-gray-300 leading-relaxed">
                  The materials appearing on Musi$tash's website could include technical, typographical, or photographic errors. Musi$tash does not 
                  warrant that any of the materials on its website are accurate, complete, or current. Musi$tash may make changes to the materials 
                  contained on its website at any time without notice. However, Musi$tash does not make any commitment to update the materials.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">10. Links</h2>
                <p className="text-gray-300 leading-relaxed">
                  Musi$tash has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. 
                  The inclusion of any link does not imply endorsement by Musi$tash of the site. Use of any such linked website is at the user's own risk.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">11. Modifications</h2>
                <p className="text-gray-300 leading-relaxed">
                  Musi$tash may revise these terms of service for its website at any time without notice. By using this website, you are agreeing 
                  to be bound by the then current version of these terms of service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law</h2>
                <p className="text-gray-300 leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably 
                  submit to the exclusive jurisdiction of the courts in that State or location.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">13. Contact Information</h2>
                <p className="text-gray-300 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <p className="text-blue-400 font-semibold">Musi$tash</p>
                  <p className="text-gray-300">Email: contact@musistash.com</p>
                  <p className="text-gray-300">Website: https://musistash.com</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms; 