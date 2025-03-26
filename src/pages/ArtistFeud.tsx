import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Disc3, BookCopy, Music2, CalendarClock } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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

const TimelineComponent = ({ events }: { events: TimelineEvent[] }) => (
  <div className="space-y-6 relative mt-8 mb-12 before:absolute before:inset-0 before:ml-5 before:w-0.5 before:-translate-x-1/2 before:bg-primary/20 before:content-[''] md:before:mx-auto md:before:translate-x-0">
    {events.map((event, index) => (
      <div key={index} className="relative flex items-start md:flex-row-reverse mb-8">
        <div className="md:flex flex-1 bg-card rounded-lg shadow-sm md:ml-12 p-6 border border-primary/10 border-l-4 md:border-l md:border-r-4 border-primary">
          <div className="flex flex-col">
            <span className="text-primary font-semibold mb-2 text-lg">{event.title}</span>
            <p className="text-muted-foreground">{event.description}</p>
          </div>
        </div>
        <div className="absolute left-0 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary md:relative md:left-auto md:mr-12">
          <CalendarClock className="h-5 w-5" />
          <span className="absolute text-xs font-semibold">{event.year}</span>
        </div>
      </div>
    ))}
  </div>
);

const ArtistFeud = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container max-w-7xl mx-auto px-4 py-16 flex-1">
        <h1 className="text-5xl font-bold mb-4">Historic Artist vs. Label Feuds</h1>
        <p className="text-muted-foreground text-xl mb-12 max-w-4xl">
          The music industry has seen numerous battles between artists and record labels over creative freedom,
          financial compensation, and ownership rights. Here are some of the most notable cases.
        </p>

        <NavigationMenu className="mb-12">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Jump to a Feud</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                  <NavigationMenuLink asChild>
                    <a href="#frank-ocean" className="flex items-center gap-2 p-2 hover:bg-secondary rounded-md">
                      <Music2 className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Frank Ocean vs. Def Jam</div>
                        <div className="text-sm text-muted-foreground">A journey to artistic freedom</div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <a href="#dr-dre" className="flex items-center gap-2 p-2 hover:bg-secondary rounded-md">
                      <Disc3 className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Dr. Dre vs. Death Row Records</div>
                        <div className="text-sm text-muted-foreground">Fighting for fair pay and creative control</div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <a href="#prince" className="flex items-center gap-2 p-2 hover:bg-secondary rounded-md">
                      <BookCopy className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Prince vs. Warner Bros.</div>
                        <div className="text-sm text-muted-foreground">A battle for artistic ownership</div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="space-y-20">
          <Card id="frank-ocean" className="scroll-mt-20 border-primary/20 max-w-4xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl flex items-center gap-3">
                <Music2 className="h-7 w-7 text-primary" /> Frank Ocean vs. Def Jam
              </CardTitle>
              <CardDescription className="text-lg">A Journey to Artistic Freedom</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg leading-relaxed">
                Frank Ocean, like many talented artists, had a deep passion for music but lacked the resources to make it big in the industry. 
                In 2009, he joined the music collective Odd Future, which introduced him to the hip-hop scene and played a key role in launching 
                his early career. Through this group, Frank released notable early tracks like "Analog 2," a duet with Tyler, the Creator, 
                and "Widow," a reflective piece about losing himself in the vocal booth.
              </p>
              <p className="text-lg leading-relaxed">
                Later that year, Frank met Grammy-winning producer and songwriter Tricky Stewart, who had already helped craft global hits 
                like Beyoncé's "Single Ladies," Rihanna's "Umbrella," and Justin Bieber's "Baby." Collaborating with Stewart opened doors 
                for Frank, landing him songwriting credits with major artists such as Brandy, John Legend, and Beyoncé.
              </p>
              <p className="text-lg leading-relaxed">
                During this time, Frank signed a record deal with Def Jam Recordings, a major label under Universal Music Group. However, 
                what seemed like a breakthrough quickly turned sour. Frank became disillusioned with the label, citing a complete lack of 
                relationship beyond the paperwork. He said, "Outside of the contract and the paperwork, there was no relationship." 
                Stewart later admitted that signing with Def Jam was a mistake, as the label failed to recognize and support Frank's unique vision.
              </p>
              <p className="text-lg leading-relaxed">
                By 2011, determined to take back control of his career, Frank turned to the DIY ethos he had learned from Odd Future. 
                He independently released Nostalgia, Ultra, a mixtape that became an underground sensation—without any backing or promotion 
                from Def Jam. Seeing its success, the label rushed to capitalize on the momentum, releasing two singles from the mixtape: 
                "Novacane" and "Swim Good."
              </p>
              <p className="text-lg leading-relaxed">
                Now with the label's renewed interest, Frank leveraged his position. He demanded a $1 million advance and full creative 
                control over his debut album. The result was Channel Orange, written in just three weeks. The album debuted at No. 2 on 
                the Billboard charts and earned Frank a Grammy Award, cementing his place as one of music's most compelling voices.
              </p>
              <p className="text-lg leading-relaxed">
                After Channel Orange, Frank went quiet—teasing fans with hints of new music, but releasing nothing substantial for years. 
                Then, in the early morning hours of August 1, 2016, something unexpected happened. A live stream appeared on his website, 
                showing Frank silently woodworking over the course of 140 hours. Behind the scenes, instrumental music played—an abstract 
                prelude to what would become his Endless album.
              </p>
              <p className="text-lg leading-relaxed">
                The stream ended with a link to Apple Music, where Endless was officially released. But there was a twist.
              </p>
              <p className="text-lg leading-relaxed">
                Frank later revealed that Endless was part of a long game—an artistic smokescreen to fulfill his contract with Def Jam. 
                By releasing Endless through the label, he met his obligations. The very next day, he independently released the real project: 
                Blonde, exclusively through Apple Music.
              </p>
              
              <div className="bg-primary/5 p-6 rounded-lg border border-primary/10 my-10">
                <h4 className="font-semibold mb-4 text-xl">The Financial Impact</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-lg">Album</TableHead>
                      <TableHead className="text-lg">Released Through</TableHead>
                      <TableHead className="text-right text-lg">Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-base">Endless</TableCell>
                      <TableCell className="text-base">Def Jam</TableCell>
                      <TableCell className="text-right text-base">$157,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-base">Blonde</TableCell>
                      <TableCell className="text-base">Independent (Apple Music)</TableCell>
                      <TableCell className="text-right text-base">$2,000,000+</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <p className="text-lg leading-relaxed">
                Through ingenuity, patience, and a commitment to creative control, Frank Ocean turned what could have been a cautionary 
                tale into a masterclass in artistic independence. His battle with Def Jam reshaped how artists think about ownership, 
                contracts, and freedom in the music industry.
              </p>
              
              <h3 className="text-2xl font-semibold mt-12 mb-6">Timeline of Events</h3>
              <TimelineComponent events={frankOceanTimeline} />
            </CardContent>
          </Card>

          <Card id="dr-dre" className="scroll-mt-20 border-primary/20 max-w-4xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl flex items-center gap-3">
                <Disc3 className="h-7 w-7 text-primary" /> Dr. Dre vs. Death Row Records
              </CardTitle>
              <CardDescription className="text-lg">Fighting for Fair Pay and Creative Control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg leading-relaxed">
                Before Dr. Dre became one of the most influential producers in music history, he faced serious financial disputes that 
                shaped his outlook on ownership and artistry. The roots of this tension trace back to Ruthless Records, the label behind 
                N.W.A.'s groundbreaking 1988 album Straight Outta Compton.
              </p>
              <p className="text-lg leading-relaxed">
                Despite the album's massive commercial success—it became the first rap album to go platinum—members of N.W.A., including 
                Dr. Dre, saw little of the financial rewards. Most profits flowed to Ruthless Records, co-owned by Eazy-E and their manager 
                Jerry Heller. As sales soared, the group realized they were being underpaid, sparking frustration and tension, especially 
                as they learned more about the fine print of their contracts.
              </p>
              <p className="text-lg leading-relaxed">
                Determined to break free, Dr. Dre and fellow N.W.A. member The D.O.C. partnered with Suge Knight, who allegedly used 
                intimidation tactics to secure Dre's release from his Ruthless contract. This move paved the way for the birth of Death 
                Row Records, a label co-founded by Dre and Knight.
              </p>
              <p className="text-lg leading-relaxed">
                At Death Row, Dre finally found both financial recognition and creative freedom. His debut solo album The Chronic was a 
                massive success, redefining West Coast hip-hop and solidifying his legacy. But as the label rose, new tensions emerged—this 
                time between Dre and Suge Knight. Knight, known for his aggressive management style, began exerting tight control over the 
                label and its artists.
              </p>
              <p className="text-lg leading-relaxed">
                Ironically, the same desire for autonomy that drove Dre away from Ruthless Records resurfaced at Death Row. Despite the 
                label's early success, the environment became increasingly volatile. In the end, Dre once again chose independence, walking 
                away from Death Row—leaving behind millions—to form Aftermath Entertainment, a move that gave him full control over his art 
                and business.
              </p>
              <p className="text-lg leading-relaxed">
                Dr. Dre's journey through Ruthless and Death Row underscores a recurring theme in music: talented artists fighting to maintain 
                ownership, control, and fair compensation in an industry often stacked against them.
              </p>
              
              <h3 className="text-2xl font-semibold mt-12 mb-6">Timeline of Events</h3>
              <TimelineComponent events={drDreTimeline} />
            </CardContent>
          </Card>

          <Card id="prince" className="scroll-mt-20 border-primary/20 max-w-4xl mb-16">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl flex items-center gap-3">
                <BookCopy className="h-7 w-7 text-primary" /> Prince vs. Warner Bros.
              </CardTitle>
              <CardDescription className="text-lg">A Battle for Artistic Ownership</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg leading-relaxed">
                At just 18 years old, Prince signed his first major record deal with Warner Bros. Records—a dream come true for a young 
                artist who had already begun writing, producing, and performing his own music. His debut album For You dropped in 1978, 
                showcasing the brilliance of an artist destined to reshape pop and R&B music.
              </p>
              <p className="text-lg leading-relaxed">
                Throughout the '80s, Prince's career skyrocketed with albums like 1999 and Purple Rain, cementing him as a cultural icon. 
                But behind the scenes, a storm was brewing. As his creative output exploded, Warner Bros. sought to rein it in. The label 
                owned the master recordings of his work, giving them control over when and how his music was released. Prince, on the other 
                hand, wanted to release music at his own prolific pace—free from commercial schedules.
              </p>
              <p className="text-lg leading-relaxed">
                The clash reached its peak in the early '90s. Prince began to protest in bold and unconventional ways. In the middle of 1993, he changed 
                his name to an unpronounceable symbol—often referred to as "The Artist Formerly Known as Prince." Around the same time, he 
                started appearing in public with the word "slave" written on his face, a searing critique of the music industry's treatment 
                of artists and its grip on their work.
              </p>
              <p className="text-lg leading-relaxed">
                To escape his Warner Bros. contract, Prince rapidly released albums such as Come and The Black Album, pulling from his vault 
                of unreleased songs to meet the label's demands. In 1996, after delivering the agreed-upon number of albums, Prince officially 
                parted ways with Warner Bros.
              </p>
              <p className="text-lg leading-relaxed">
                Now free, he founded his own independent label, NPG Records, and began releasing music on his own terms. This new chapter gave 
                him full ownership of his art and marked a turning point in how artists viewed creative rights and independence.
              </p>
              <p className="text-lg leading-relaxed">
                Prince's battle with Warner Bros. became one of the most iconic standoffs in music history. It helped reshape industry norms 
                around artist rights and inspired countless musicians to fight for control over their work—long before terms like "owning your 
                masters" became common in the industry dialogue.
              </p>
              
              <h3 className="text-2xl font-semibold mt-12 mb-6">Timeline of Events</h3>
              <TimelineComponent events={princeTimeline} />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ArtistFeud;
