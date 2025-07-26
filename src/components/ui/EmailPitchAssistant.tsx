import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Mail, Copy, Send, Sparkles, User, Building, Calendar, MapPin } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: string;
  variables: string[];
}

interface EmailPitchAssistantProps {
  artistProfile?: any;
  initialData?: {
    template?: string;
    venueData?: any;
  };
}

const EmailPitchAssistant: React.FC<EmailPitchAssistantProps> = ({ artistProfile, initialData }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(initialData?.template || '');
  const [emailData, setEmailData] = useState({
    recipientName: '',
    recipientEmail: '',
    venueName: initialData?.venueData?.name || '',
    venueLocation: initialData?.venueData?.location || '',
    proposedDate: '',
    customMessage: ''
  });
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Update email data when initialData changes
  React.useEffect(() => {
    if (initialData?.venueData) {
      setEmailData(prev => ({
        ...prev,
        venueName: initialData.venueData.name || prev.venueName,
        venueLocation: initialData.venueData.location || prev.venueLocation,
        recipientEmail: initialData.venueData.website ? 
          `booking@${new URL(initialData.venueData.website).hostname.replace('www.', '')}` : 
          prev.recipientEmail
      }));
    }
    if (initialData?.template) {
      setSelectedTemplate(initialData.template);
    }
  }, [initialData]);

  // Email templates
  const emailTemplates: EmailTemplate[] = [
    {
      id: 'venue-booking',
      name: 'Venue Booking Request',
      category: 'Venues',
      subject: 'Booking Inquiry for [Venue Name]',
      body: `Dear [Recipient Name],

I hope this email finds you well. My name is [Artist Name], and I'm reaching out regarding a potential booking opportunity at [Venue Name].

I'm a [Genre] artist based in [Location], and I believe my music would be a great fit for your venue. I have experience performing at similar venues and have built a strong local following.

I'm interested in booking a show on [Proposed Date] and would love to discuss the possibility of performing at [Venue Name]. I'm flexible with dates and can work around your schedule.

Here's a bit about my music:
- Genre: [Genre]
- Performance style: [Performance Style]
- Typical audience size: [Audience Size]
- Previous venues: [Previous Venues]

I've attached my press kit and links to my music for your review. You can also check out my social media presence at [Social Media Links].

[Custom Message]

I would appreciate the opportunity to discuss this further. Please let me know if you need any additional information or if you'd like to schedule a call.

Thank you for your time and consideration.

Best regards,
[Artist Name]
[Contact Information]`,
      variables: ['Recipient Name', 'Venue Name', 'Proposed Date', 'Custom Message']
    },
    {
      id: 'promoter-outreach',
      name: 'Promoter Outreach',
      category: 'Promoters',
      subject: 'Collaboration Opportunity - [Artist Name]',
      body: `Hi [Recipient Name],

I hope you're doing well! I'm [Artist Name], a [Genre] artist, and I'm reaching out because I believe there's potential for a great collaboration.

I've been following your work in the [City/Region] music scene and really admire what you've been building. Your events and the artists you work with align perfectly with my musical direction.

Here's what I bring to the table:
- Unique [Genre] sound that stands out in the current scene
- Strong social media presence with [Follower Count] engaged followers
- Experience performing at venues like [Previous Venues]
- Professional press kit and promotional materials
- Flexible availability for shows and events

[Custom Message]

I'd love to discuss potential opportunities to work together. Whether it's a one-off show, festival appearance, or ongoing partnership, I'm open to exploring all possibilities.

You can check out my music at [Music Links] and my social media at [Social Media Links].

Would you be interested in scheduling a call to discuss this further?

Best regards,
[Artist Name]
[Contact Information]`,
      variables: ['Recipient Name', 'Custom Message']
    },
    {
      id: 'festival-application',
      name: 'Festival Application',
      category: 'Festivals',
      subject: 'Festival Application - [Artist Name]',
      body: `Dear [Recipient Name],

I hope this email finds you well. I'm [Artist Name], a [Genre] artist, and I'm excited to submit my application for [Festival Name].

I believe my music would be a perfect addition to your festival lineup. My unique blend of [Genre Description] has been resonating with audiences across [Regions], and I've been building momentum with each performance.

Here's what makes my performance special:
- Distinctive sound that combines [Musical Elements]
- High-energy live shows that engage audiences
- Professional stage presence and technical requirements
- Strong social media following and fan engagement
- Experience performing at festivals and large venues

[Custom Message]

I've attached my press kit, which includes:
- High-quality photos and bio
- Links to recent performances
- Technical rider
- Social media metrics
- Press coverage and reviews

You can also check out my latest music at [Music Links] and my live performance videos at [Video Links].

I'm available for the festival dates and can be flexible with scheduling. I'm also open to performing at multiple stages or events throughout the festival.

Thank you for considering my application. I look forward to the possibility of being part of [Festival Name].

Best regards,
[Artist Name]
[Contact Information]`,
      variables: ['Recipient Name', 'Festival Name', 'Custom Message']
    },
    {
      id: 'press-outreach',
      name: 'Press & Media Outreach',
      category: 'Media',
      subject: 'Press Release: [Artist Name] - [New Release/Event]',
      body: `Dear [Recipient Name],

I hope this email finds you well. I'm reaching out to share some exciting news about my latest [Release/Event] that I believe would be of interest to your readers.

I'm [Artist Name], a [Genre] artist who has been making waves in the [Scene/Region] music community. My latest [Album/Single/Event] "[Title]" represents a significant evolution in my sound and has been receiving strong early feedback.

Key highlights:
- [Release/Event] Title: "[Title]"
- Release Date: [Date]
- Genre: [Genre]
- Notable collaborations: [Collaborations]
- Unique selling points: [Unique Points]

[Custom Message]

The [Release/Event] has already garnered attention from [Previous Press Coverage] and is available for streaming on [Platforms].

I would love to arrange an interview, provide exclusive content, or discuss potential coverage opportunities. I'm available for phone interviews, in-person meetings, or can provide additional materials as needed.

You can preview the [Release/Event] at [Preview Link] and find my full press kit at [Press Kit Link].

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
[Artist Name]
[Contact Information]`,
      variables: ['Recipient Name', 'Custom Message']
    }
  ];

  const generateEmail = () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const template = emailTemplates.find(t => t.id === selectedTemplate);
      if (!template) return;

      let emailBody = template.body;
      
      // Replace variables with actual data
      emailBody = emailBody.replace(/\[Recipient Name\]/g, emailData.recipientName || '[Recipient Name]');
      emailBody = emailBody.replace(/\[Venue Name\]/g, emailData.venueName || '[Venue Name]');
      emailBody = emailBody.replace(/\[Proposed Date\]/g, emailData.proposedDate || '[Proposed Date]');
      emailBody = emailBody.replace(/\[Custom Message\]/g, emailData.customMessage || '');
      
      // Add artist profile data if available
      if (artistProfile) {
        emailBody = emailBody.replace(/\[Artist Name\]/g, artistProfile.name || '[Artist Name]');
        emailBody = emailBody.replace(/\[Location\]/g, artistProfile.location || '[Location]');
        emailBody = emailBody.replace(/\[Genre\]/g, artistProfile.genre || '[Genre]');
      }

      setGeneratedEmail(emailBody);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
  };

  const sendEmail = () => {
    const subject = emailTemplates.find(t => t.id === selectedTemplate)?.subject || 'Email from MusiStash';
    const mailtoLink = `mailto:${emailData.recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(generatedEmail)}`;
    window.open(mailtoLink);
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card className="bg-[#0f1216] border border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {emailTemplates.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-colors ${
                  selectedTemplate === template.id 
                    ? 'bg-purple-600/20 border-purple-500' 
                    : 'bg-[#181c24] border-gray-700 hover:border-purple-500'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-purple-400" />
                    <Badge variant="outline" className="text-xs text-purple-400 border-purple-400">
                      {template.category}
                    </Badge>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{template.name}</h3>
                  <p className="text-gray-400 text-xs">{template.subject}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Form */}
      {selectedTemplate && (
        <Card className="bg-[#0f1216] border border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Email Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipientName" className="text-gray-300">Recipient Name</Label>
                <Input
                  id="recipientName"
                  value={emailData.recipientName}
                  onChange={(e) => setEmailData({ ...emailData, recipientName: e.target.value })}
                  className="bg-[#181c24] border-gray-700 text-white"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="recipientEmail" className="text-gray-300">Recipient Email</Label>
                <Input
                  id="recipientEmail"
                  value={emailData.recipientEmail}
                  onChange={(e) => setEmailData({ ...emailData, recipientEmail: e.target.value })}
                  className="bg-[#181c24] border-gray-700 text-white"
                  placeholder="john@venue.com"
                />
              </div>
              <div>
                <Label htmlFor="venueName" className="text-gray-300">Venue/Company Name</Label>
                <Input
                  id="venueName"
                  value={emailData.venueName}
                  onChange={(e) => setEmailData({ ...emailData, venueName: e.target.value })}
                  className="bg-[#181c24] border-gray-700 text-white"
                  placeholder="The Grand Hall"
                />
              </div>
              <div>
                <Label htmlFor="proposedDate" className="text-gray-300">Proposed Date</Label>
                <Input
                  id="proposedDate"
                  value={emailData.proposedDate}
                  onChange={(e) => setEmailData({ ...emailData, proposedDate: e.target.value })}
                  className="bg-[#181c24] border-gray-700 text-white"
                  placeholder="March 15, 2024"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="customMessage" className="text-gray-300">Custom Message (Optional)</Label>
                <Textarea
                  id="customMessage"
                  value={emailData.customMessage}
                  onChange={(e) => setEmailData({ ...emailData, customMessage: e.target.value })}
                  className="bg-[#181c24] border-gray-700 text-white"
                  placeholder="Add any personal touches or specific details..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                onClick={generateEmail}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Email
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Email */}
      {generatedEmail && (
        <Card className="bg-[#0f1216] border border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Generated Email</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={sendEmail}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-[#181c24] border border-gray-700 rounded-lg p-4">
              <pre className="text-white text-sm whitespace-pre-wrap font-sans">
                {generatedEmail}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailPitchAssistant; 