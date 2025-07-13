import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FileText, Shield, Cookie, Lock, Scale, Eye } from 'lucide-react';

const Legal = () => {
  const legalDocuments = [
    {
      icon: FileText,
      title: "Terms of Service",
      description: "Our terms and conditions for using the MusiStash platform",
      link: "/terms",
      updated: "January 2024"
    },
    {
      icon: Shield,
      title: "Privacy Policy",
      description: "How we collect, use, and protect your personal information",
      link: "/privacy",
      updated: "January 2024"
    },
    {
      icon: Cookie,
      title: "Cookie Policy",
      description: "Information about cookies and tracking technologies we use",
      link: "/cookies",
      updated: "January 2024"
    },
    {
      icon: Lock,
      title: "Security",
      description: "Our security measures and data protection practices",
      link: "/security",
      updated: "January 2024"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216]">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Scale className="h-12 w-12 text-blue-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Legal <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Information</span>
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Important legal documents and policies that govern your use of the MusiStash platform.
            </p>
          </div>

          {/* Legal Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {legalDocuments.map((doc, index) => (
              <Card key={index} className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <doc.icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-xl text-white">{doc.title}</CardTitle>
                  </div>
                  <p className="text-gray-300">{doc.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Last updated: {doc.updated}</span>
                    <Link to={doc.link}>
                      <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                        Read Document
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Information */}
          <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm mb-16">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Legal Compliance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="p-4 bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Data Protection</h3>
                <p className="text-gray-300">We comply with GDPR, CCPA, and other privacy regulations</p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Scale className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Financial Compliance</h3>
                <p className="text-gray-300">Adherence to financial regulations and investment laws</p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Transparency</h3>
                <p className="text-gray-300">Clear and transparent policies for all users</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Questions About Our Legal Policies?</h2>
            <p className="text-xl text-gray-400 mb-8">
              If you have any questions about our legal documents or need clarification, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
                  Contact Legal Team
                </Button>
              </Link>
              <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10 px-8 py-6 text-lg">
                <a href="mailto:legal@musistash.com">legal@musistash.com</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Legal; 