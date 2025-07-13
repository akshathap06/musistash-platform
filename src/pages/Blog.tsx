import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Music Investment: How AI is Changing the Game",
      excerpt: "Discover how artificial intelligence is revolutionizing the way we identify and invest in musical talent.",
      author: "Akshat Thapliyal",
      date: "2024-01-15",
      category: "Technology",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Breaking Down Barriers: Democratizing Music Investment",
      excerpt: "Learn how MusiStash is making music investment accessible to everyone, not just industry insiders.",
      author: "MusiStash Team",
      date: "2024-01-10",
      category: "Industry",
      readTime: "4 min read"
    },
    {
      id: 3,
      title: "Artist Spotlight: Success Stories from Our Platform",
      excerpt: "Meet the artists who have successfully funded their projects through MusiStash and what they've achieved.",
      author: "Sarah Johnson",
      date: "2024-01-05",
      category: "Artists",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216]">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Musi<span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">$tash</span> Blog
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Insights, updates, and stories from the world of music investment and AI-driven talent discovery.
            </p>
          </div>

          {/* Featured Post */}
          <div className="mb-16">
            <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border border-gray-700/50 backdrop-blur-sm overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="aspect-video md:aspect-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <BookOpen className="h-24 w-24 text-blue-400" />
                </div>
                <div className="p-8">
                  <Badge className="mb-4 bg-blue-600">Featured</Badge>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    The Future of Music Investment: How AI is Changing the Game
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Discover how artificial intelligence is revolutionizing the way we identify and invest in musical talent. From predictive analytics to market analysis, AI is transforming the music industry.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Akshat Thapliyal
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      January 15, 2024
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-gray-400">{post.readTime}</span>
                  </div>
                  <CardTitle className="text-xl text-white line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Link to="/contact">
                    <Button variant="outline" className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                      Read Article
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border border-gray-700/50 backdrop-blur-sm p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter to get the latest insights on music investment, AI technology, and artist success stories delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Subscribe
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog; 