import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Disc3, BookCopy, Music2, CalendarClock, ArrowDown } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import styles from './ArtistFeud.module.css';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

// Frank Ocean Timeline
const frankOceanTimeline: TimelineEvent[] = [
  {
    year: "2009",
    title: "Joins Odd Future",
    description: "Frank Ocean joins the hip-hop collective Odd Future and begins collaborating with other members."
  },
  {
    year: "2009",
    title: "Signs with Def Jam",
    description: "Meets Tricky Stewart and signs a record deal with Def Jam Recordings."
  },
  {
    year: "2011",
    title: "Nostalgia, Ultra Mixtape",
    description: "Independently releases Nostalgia, Ultra without label support, gaining underground attention."
  },
  {
    year: "2012",
    title: "Channel Orange",
    description: "Releases Channel Orange after demanding $1M advance and creative control. Album debuts at #2 on Billboard."
  },
  {
    year: "2016",
    title: "Endless Release",
    description: "Releases Endless as a visual album through Def Jam to fulfill contract obligations."
  },
  {
    year: "2016",
    title: "Blonde Release",
    description: "Independently releases Blonde one day after Endless, retaining ownership and most profits."
  }
];

// Dr. Dre Timeline
const drDreTimeline: TimelineEvent[] = [
  {
    year: "1988",
    title: "Straight Outta Compton",
    description: "N.W.A. releases groundbreaking album Straight Outta Compton through Ruthless Records."
  },
  {
    year: "1991",
    title: "Leaves Ruthless Records",
    description: "Dr. Dre leaves Ruthless Records over financial disputes with Eazy-E and Jerry Heller."
  },
  {
    year: "1992",
    title: "Founds Death Row",
    description: "Partners with Suge Knight to found Death Row Records and gain creative control."
  },
  {
    year: "1992",
    title: "The Chronic",
    description: "Releases his solo debut album The Chronic, redefining West Coast hip-hop."
  },
  {
    year: "1996",
    title: "Leaves Death Row",
    description: "Departs from Death Row Records due to tensions with Suge Knight and the volatile environment."
  },
  {
    year: "1996",
    title: "Founds Aftermath",
    description: "Establishes Aftermath Entertainment, gaining full control over his art and business."
  }
];

// Prince Timeline
const princeTimeline: TimelineEvent[] = [
  {
    year: "1978",
    title: "Signs with Warner Bros.",
    description: "At 18 years old, Prince signs with Warner Bros. and releases his debut album For You."
  },
  {
    year: "1982-1984",
    title: "Commercial Peak",
    description: "Releases 1999 and Purple Rain, establishing himself as a global icon."
  },
  {
    year: "1993",
    title: "Name Change",
    description: "Changes his name to an unpronounceable symbol in protest of Warner Bros.' control."
  },
  {
    year: "1993",
    title: "Public Protest",
    description: "Appears in public with 'slave' written on his face to criticize the music industry."
  },
  {
    year: "1996",
    title: "Contract Fulfilled",
    description: "After rapidly releasing albums to meet contractual obligations, Prince parts ways with Warner Bros."
  },
  {
    year: "1996",
    title: "NPG Records",
    description: "Founds his own independent label, NPG Records, gaining full ownership of his work."
  }
];

const TimelineComponent = ({ events }: { events: TimelineEvent[] }) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles['animate-in']);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(`.${styles['timeline-item']}`).forEach((item) => {
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-6 relative mt-8 mb-12 before:absolute before:inset-0 before:ml-5 before:w-0.5 before:-translate-x-1/2 before:bg-blue-500/20 before:content-[''] md:before:mx-auto md:before:translate-x-0">
      {events.map((event, index) => (
        <div 
          key={index} 
          className={`${styles['timeline-item']} relative flex items-start md:flex-row-reverse mb-8 transition-all duration-500 ease-out`}
          style={{ transitionDelay: `${index * 150}ms` }}
        >
          <div className="md:flex flex-1 bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-lg md:ml-12 p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="flex flex-col">
              <span className="text-blue-400 font-semibold mb-2 text-lg group-hover:text-blue-300 transition-colors">{event.title}</span>
              <p className="text-gray-300 group-hover:text-white transition-colors">{event.description}</p>
            </div>
          </div>
          <div className="absolute left-0 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-blue-400 border border-blue-500/50 md:relative md:left-auto md:mr-12 group-hover:bg-blue-500/20 transition-all duration-300">
            <CalendarClock className="h-5 w-5" />
            <span className="absolute text-xs font-mono font-semibold text-blue-400">{event.year}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const ArtistFeud = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f1216] text-white">
      <Navbar />
      
      <div className="container max-w-7xl mx-auto px-4 py-16 flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-700 p-12 mb-16">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>

          <div className="relative z-10">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
              Historic Artist vs. Label Feuds
            </h1>
            <p className="text-gray-300 text-xl mb-8 max-w-4xl leading-relaxed">
              The music industry has seen numerous battles between artists and record labels over creative freedom,
              financial compensation, and ownership rights. Here are some of the most notable cases.
            </p>

            {/* Scroll Indicator */}
            <div className="flex items-center gap-2 text-blue-400/60 hover:text-blue-300 transition-colors cursor-pointer group">
              <span className="font-mono text-sm">SCROLL_TO_EXPLORE</span>
              <ArrowDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </div>
          </div>
        </div>

        <NavigationMenu className="mb-12">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-gray-900/70 text-white hover:bg-gray-800 hover:text-blue-400 transition-colors">
                Jump to a Feud
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] bg-gray-900/95 backdrop-blur-sm border border-gray-700">
                  <NavigationMenuLink asChild>
                    <a href="#frank-ocean" className="flex items-center gap-2 p-3 hover:bg-gray-800 rounded-md group transition-colors">
                      <Music2 className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-medium text-white group-hover:text-blue-400 transition-colors">Frank Ocean vs. Def Jam</div>
                        <div className="text-sm text-gray-400">A journey to artistic freedom</div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <a href="#dr-dre" className="flex items-center gap-2 p-3 hover:bg-gray-800 rounded-md group transition-colors">
                      <Disc3 className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-medium text-white group-hover:text-blue-400 transition-colors">Dr. Dre vs. Death Row Records</div>
                        <div className="text-sm text-gray-400">Fighting for fair pay and creative control</div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <a href="#prince" className="flex items-center gap-2 p-3 hover:bg-gray-800 rounded-md group transition-colors">
                      <BookCopy className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-medium text-white group-hover:text-blue-400 transition-colors">Prince vs. Warner Bros.</div>
                        <div className="text-sm text-gray-400">A battle for artistic ownership</div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="space-y-32">
          <Card id="frank-ocean" className="scroll-mt-20 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 bg-gray-900/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl flex items-center gap-3 text-white">
                <Music2 className="h-7 w-7 text-blue-400" /> Frank Ocean vs. Def Jam
              </CardTitle>
              <CardDescription className="text-lg text-gray-400">A Journey to Artistic Freedom</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-gray-300">
                  Frank Ocean, like many talented artists, had a deep passion for music but lacked the resources to make it big in the industry. 
                  In 2009, he joined the music collective Odd Future, which introduced him to the hip-hop scene and played a key role in launching 
                  his early career.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  Through this group, Frank released notable early tracks like "Analog 2," a duet with Tyler, the Creator, 
                  and "Widow," a reflective piece about losing himself in the vocal booth.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  Later that year, Frank met Grammy-winning producer and songwriter Tricky Stewart, who had already helped craft global hits 
                  like Beyoncé's "Single Ladies," Rihanna's "Umbrella," and Justin Bieber's "Baby." Collaborating with Stewart opened doors 
                  for Frank, landing him songwriting credits with major artists such as Brandy, John Legend, and Beyoncé.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  During this time, Frank signed a record deal with Def Jam Recordings, a major label under Universal Music Group. However, 
                  what seemed like a breakthrough quickly turned sour. Frank became disillusioned with the label, citing a complete lack of 
                  relationship beyond the paperwork. He said, "Outside of the contract and the paperwork, there was no relationship." 
                  Stewart later admitted that signing with Def Jam was a mistake, as the label failed to recognize and support Frank's unique vision.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  By 2011, determined to take back control of his career, Frank turned to the DIY ethos he had learned from Odd Future. 
                  He independently released Nostalgia, Ultra, a mixtape that became an underground sensation—without any backing or promotion 
                  from Def Jam. Seeing its success, the label rushed to capitalize on the momentum, releasing two singles from the mixtape: 
                  "Novacane" and "Swim Good."
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  Now with the label's renewed interest, Frank leveraged his position. He demanded a $1 million advance and full creative 
                  control over his debut album. The result was Channel Orange, written in just three weeks. The album debuted at No. 2 on 
                  the Billboard charts and earned Frank a Grammy Award, cementing his place as one of music's most compelling voices.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  After Channel Orange, Frank went quiet—teasing fans with hints of new music, but releasing nothing substantial for years. 
                  Then, in the early morning hours of August 1, 2016, something unexpected happened. A live stream appeared on his website, 
                  showing Frank silently woodworking over the course of 140 hours. Behind the scenes, instrumental music played—an abstract 
                  prelude to what would become his Endless album.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  The stream ended with a link to Apple Music, where Endless was officially released. But there was a twist.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  Frank later revealed that Endless was part of a long game—an artistic smokescreen to fulfill his contract with Def Jam. 
                  By releasing Endless through the label, he met his obligations. The very next day, he independently released the real project: 
                  Blonde, exclusively through Apple Music.
                </p>
              </div>
              
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 my-10">
                <h4 className="font-semibold mb-4 text-xl text-white">The Financial Impact</h4>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-lg text-gray-300">Album</TableHead>
                      <TableHead className="text-lg text-gray-300">Released Through</TableHead>
                      <TableHead className="text-right text-lg text-gray-300">Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-gray-700">
                      <TableCell className="font-medium text-white">Endless</TableCell>
                      <TableCell className="text-gray-300">Def Jam</TableCell>
                      <TableCell className="text-right text-gray-300">$0 (Contract Fulfillment)</TableCell>
                    </TableRow>
                    <TableRow className="border-gray-700">
                      <TableCell className="font-medium text-white">Blonde</TableCell>
                      <TableCell className="text-gray-300">Independent</TableCell>
                      <TableCell className="text-right text-blue-400">$1M+ (First Week)</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <TimelineComponent events={frankOceanTimeline} />
            </CardContent>
          </Card>

          <Card id="dr-dre" className="scroll-mt-20 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 bg-gray-900/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl flex items-center gap-3 text-white">
                <Disc3 className="h-7 w-7 text-blue-400" /> Dr. Dre vs. Death Row Records
              </CardTitle>
              <CardDescription className="text-lg text-gray-400">Fighting for Fair Pay and Creative Control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-gray-300">
                  Before Dr. Dre became one of the most influential producers in music history, he faced serious financial disputes that 
                  shaped his outlook on ownership and artistry. The roots of this tension trace back to Ruthless Records, the label behind 
                  N.W.A.'s groundbreaking 1988 album Straight Outta Compton.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  Despite the album's massive commercial success—it became the first rap album to go platinum—members of N.W.A., including 
                  Dr. Dre, saw little of the financial rewards. Most profits flowed to Ruthless Records, co-owned by Eazy-E and their manager 
                  Jerry Heller. As sales soared, the group realized they were being underpaid, sparking frustration and tension.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  Determined to break free, Dr. Dre and fellow N.W.A. member The D.O.C. partnered with Suge Knight, who allegedly used 
                  intimidation tactics to secure Dre's release from his Ruthless contract. This move paved the way for the birth of Death 
                  Row Records, a label co-founded by Dre and Knight.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  At Death Row, Dre finally found both financial recognition and creative freedom. His debut solo album The Chronic was a 
                  massive success, redefining West Coast hip-hop and solidifying his legacy. But as the label rose, new tensions emerged—this 
                  time between Dre and Suge Knight.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  Knight, known for his aggressive management style, began exerting tight control over the label and its artists. The same 
                  desire for autonomy that drove Dre away from Ruthless Records resurfaced at Death Row. Despite the label's success, 
                  the environment became increasingly volatile.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  In 1996, Dre made the bold decision to leave Death Row—walking away from millions—to form Aftermath Entertainment. 
                  This move finally gave him full control over his art and business, establishing a foundation for his future success 
                  as both an artist and entrepreneur.
                </p>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 my-10">
                <h4 className="font-semibold mb-4 text-xl text-white">The Impact</h4>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-lg text-gray-300">Era</TableHead>
                      <TableHead className="text-lg text-gray-300">Label</TableHead>
                      <TableHead className="text-right text-lg text-gray-300">Outcome</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-gray-700">
                      <TableCell className="font-medium text-white">1986-1991</TableCell>
                      <TableCell className="text-gray-300">Ruthless Records</TableCell>
                      <TableCell className="text-right text-gray-300">Limited Financial Returns</TableCell>
                    </TableRow>
                    <TableRow className="border-gray-700">
                      <TableCell className="font-medium text-white">1992-1996</TableCell>
                      <TableCell className="text-gray-300">Death Row</TableCell>
                      <TableCell className="text-right text-blue-400">The Chronic's Success</TableCell>
                    </TableRow>
                    <TableRow className="border-gray-700">
                      <TableCell className="font-medium text-white">1996-Present</TableCell>
                      <TableCell className="text-gray-300">Aftermath</TableCell>
                      <TableCell className="text-right text-blue-400">Full Creative Control</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <TimelineComponent events={drDreTimeline} />
            </CardContent>
          </Card>

          <Card id="prince" className="scroll-mt-20 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 bg-gray-900/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl flex items-center gap-3 text-white">
                <BookCopy className="h-7 w-7 text-blue-400" /> Prince vs. Warner Bros.
              </CardTitle>
              <CardDescription className="text-lg text-gray-400">A Battle for Artistic Ownership</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-gray-300">
                  At just 18 years old, Prince signed his first major record deal with Warner Bros. Records—a dream come true for a young 
                  artist who had already begun writing, producing, and performing his own music. His debut album For You dropped in 1978, 
                  showcasing the brilliance of an artist destined to reshape pop and R&B music.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  Throughout the '80s, Prince's career skyrocketed with albums like 1999 and Purple Rain, cementing him as a cultural icon. 
                  But behind the scenes, a storm was brewing. As his creative output exploded, Warner Bros. sought to rein it in. The label 
                  owned the master recordings of his work, giving them control over when and how his music was released.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  Prince, known for his prolific output, wanted to release music at his own pace—free from commercial schedules. The clash 
                  reached its peak in 1993, when Prince made a dramatic statement by changing his name to an unpronounceable symbol, 
                  often referred to as "The Artist Formerly Known as Prince."
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  Around the same time, he began appearing in public with the word "slave" written on his face—a powerful critique of the 
                  music industry's control over artists and their work. This bold protest sparked widespread discussion about artists' rights 
                  and the power dynamics within the music industry.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  To fulfill his Warner Bros. contract, Prince rapidly released albums from his vault of unreleased material. In 1996, 
                  after delivering the required number of albums, he finally parted ways with the label that had both launched and 
                  constrained his career.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  Free from Warner Bros., Prince founded his own independent label, NPG Records. This move gave him complete control over 
                  his artistic output and the rights to his new music. He could now release albums, singles, and even entire collections 
                  whenever he wanted, without corporate oversight.
                </p>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 my-10">
                <h4 className="font-semibold mb-4 text-xl text-white">The Revolution</h4>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-lg text-gray-300">Period</TableHead>
                      <TableHead className="text-lg text-gray-300">Status</TableHead>
                      <TableHead className="text-right text-lg text-gray-300">Control Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-gray-700">
                      <TableCell className="font-medium text-white">1978-1993</TableCell>
                      <TableCell className="text-gray-300">Warner Bros. Era</TableCell>
                      <TableCell className="text-right text-gray-300">Limited</TableCell>
                    </TableRow>
                    <TableRow className="border-gray-700">
                      <TableCell className="font-medium text-white">1993-1996</TableCell>
                      <TableCell className="text-gray-300">Symbol Era</TableCell>
                      <TableCell className="text-right text-gray-300">Contested</TableCell>
                    </TableRow>
                    <TableRow className="border-gray-700">
                      <TableCell className="font-medium text-white">1996-2016</TableCell>
                      <TableCell className="text-gray-300">Independent</TableCell>
                      <TableCell className="text-right text-blue-400">Complete</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <TimelineComponent events={princeTimeline} />
            </CardContent>
          </Card>
        </div>

        {/* Improved transition with content fade-in */}
        <div className="relative mt-16">
          <div className="absolute inset-0 pointer-events-none">
            <div className="h-32 bg-gradient-to-b from-[#0f1216]/0 to-[#0f1216] opacity-90"></div>
          </div>
          
          {/* Additional content that fades in */}
          <div className="container max-w-7xl mx-auto px-4 py-8">
            <div className={`text-center space-y-4 ${styles['animate-fade-in']}`}>
              <h3 className="text-2xl font-bold text-white/90">Explore More Stories</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Discover how artists throughout history have fought for creative freedom and fair compensation.
                Their struggles have shaped the modern music industry.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer className="bg-[#0f1216] relative z-10" />
    </div>
  );
};

export default ArtistFeud;
