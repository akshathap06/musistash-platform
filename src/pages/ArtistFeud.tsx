
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Disc3, BookCopy, Music2, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ArtistFeud = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container max-w-7xl mx-auto px-4 py-10 flex-1">
        <h1 className="text-4xl font-bold mb-2">Historic Artist vs. Label Feuds</h1>
        <p className="text-muted-foreground text-lg mb-8">
          The music industry has seen numerous battles between artists and record labels over creative freedom,
          financial compensation, and ownership rights. Here are some of the most notable cases.
        </p>

        <NavigationMenu className="mb-8">
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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          <div className="md:col-span-8 space-y-8">
            <Card id="frank-ocean" className="scroll-mt-20 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Music2 className="h-6 w-6 text-primary" /> Frank Ocean vs. Def Jam
                </CardTitle>
                <CardDescription>A Journey to Artistic Freedom</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Frank Ocean, like many talented artists, had a deep passion for music but lacked the resources to make it big in the industry. 
                  In 2009, he joined the music collective Odd Future, which introduced him to the hip-hop scene and played a key role in launching 
                  his early career. Through this group, Frank released notable early tracks like "Analog 2," a duet with Tyler, the Creator, 
                  and "Widow," a reflective piece about losing himself in the vocal booth.
                </p>
                <p>
                  Later that year, Frank met Grammy-winning producer and songwriter Tricky Stewart, who had already helped craft global hits 
                  like Beyoncé's "Single Ladies," Rihanna's "Umbrella," and Justin Bieber's "Baby." Collaborating with Stewart opened doors 
                  for Frank, landing him songwriting credits with major artists such as Brandy, John Legend, and Beyoncé.
                </p>
                <p>
                  During this time, Frank signed a record deal with Def Jam Recordings, a major label under Universal Music Group. However, 
                  what seemed like a breakthrough quickly turned sour. Frank became disillusioned with the label, citing a complete lack of 
                  relationship beyond the paperwork. He said, "Outside of the contract and the paperwork, there was no relationship." 
                  Stewart later admitted that signing with Def Jam was a mistake, as the label failed to recognize and support Frank's unique vision.
                </p>
                <p>
                  By 2011, determined to take back control of his career, Frank turned to the DIY ethos he had learned from Odd Future. 
                  He independently released Nostalgia, Ultra, a mixtape that became an underground sensation—without any backing or promotion 
                  from Def Jam. Seeing its success, the label rushed to capitalize on the momentum, releasing two singles from the mixtape: 
                  "Novacane" and "Swim Good."
                </p>
                <p>
                  Now with the label's renewed interest, Frank leveraged his position. He demanded a $1 million advance and full creative 
                  control over his debut album. The result was Channel Orange, written in just three weeks. The album debuted at No. 2 on 
                  the Billboard charts and earned Frank a Grammy Award, cementing his place as one of music's most compelling voices.
                </p>
                <p>
                  After Channel Orange, Frank went quiet—teasing fans with hints of new music, but releasing nothing substantial for years. 
                  Then, in the early morning hours of August 1, 2016, something unexpected happened. A live stream appeared on his website, 
                  showing Frank silently woodworking over the course of 140 hours. Behind the scenes, instrumental music played—an abstract 
                  prelude to what would become his Endless album.
                </p>
                <p>
                  The stream ended with a link to Apple Music, where Endless was officially released. But there was a twist.
                </p>
                <p>
                  Frank later revealed that Endless was part of a long game—an artistic smokescreen to fulfill his contract with Def Jam. 
                  By releasing Endless through the label, he met his obligations. The very next day, he independently released the real project: 
                  Blonde, exclusively through Apple Music.
                </p>
                
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <h4 className="font-semibold mb-3">The Financial Impact</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Album</TableHead>
                        <TableHead>Released Through</TableHead>
                        <TableHead className="text-right">Earnings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Endless</TableCell>
                        <TableCell>Def Jam</TableCell>
                        <TableCell className="text-right">$157,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Blonde</TableCell>
                        <TableCell>Independent (Apple Music)</TableCell>
                        <TableCell className="text-right">$2,000,000+</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <p>
                  Through ingenuity, patience, and a commitment to creative control, Frank Ocean turned what could have been a cautionary 
                  tale into a masterclass in artistic independence. His battle with Def Jam reshaped how artists think about ownership, 
                  contracts, and freedom in the music industry.
                </p>
              </CardContent>
            </Card>

            <Card id="dr-dre" className="scroll-mt-20 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Disc3 className="h-6 w-6 text-primary" /> Dr. Dre vs. Death Row Records
                </CardTitle>
                <CardDescription>Fighting for Fair Pay and Creative Control</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Before Dr. Dre became one of the most influential producers in music history, he faced serious financial disputes that 
                  shaped his outlook on ownership and artistry. The roots of this tension trace back to Ruthless Records, the label behind 
                  N.W.A.'s groundbreaking 1988 album Straight Outta Compton.
                </p>
                <p>
                  Despite the album's massive commercial success—it became the first rap album to go platinum—members of N.W.A., including 
                  Dr. Dre, saw little of the financial rewards. Most profits flowed to Ruthless Records, co-owned by Eazy-E and their manager 
                  Jerry Heller. As sales soared, the group realized they were being underpaid, sparking frustration and tension, especially 
                  as they learned more about the fine print of their contracts.
                </p>
                <p>
                  Determined to break free, Dr. Dre and fellow N.W.A. member The D.O.C. partnered with Suge Knight, who allegedly used 
                  intimidation tactics to secure Dre's release from his Ruthless contract. This move paved the way for the birth of Death 
                  Row Records, a label co-founded by Dre and Knight.
                </p>
                <p>
                  At Death Row, Dre finally found both financial recognition and creative freedom. His debut solo album The Chronic was a 
                  massive success, redefining West Coast hip-hop and solidifying his legacy. But as the label rose, new tensions emerged—this 
                  time between Dre and Suge Knight. Knight, known for his aggressive management style, began exerting tight control over the 
                  label and its artists.
                </p>
                <p>
                  Ironically, the same desire for autonomy that drove Dre away from Ruthless Records resurfaced at Death Row. Despite the 
                  label's early success, the environment became increasingly volatile. In the end, Dre once again chose independence, walking 
                  away from Death Row—leaving behind millions—to form Aftermath Entertainment, a move that gave him full control over his art 
                  and business.
                </p>
                <p>
                  Dr. Dre's journey through Ruthless and Death Row underscores a recurring theme in music: talented artists fighting to maintain 
                  ownership, control, and fair compensation in an industry often stacked against them.
                </p>
              </CardContent>
            </Card>

            <Card id="prince" className="scroll-mt-20 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BookCopy className="h-6 w-6 text-primary" /> Prince vs. Warner Bros.
                </CardTitle>
                <CardDescription>A Battle for Artistic Ownership</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  At just 18 years old, Prince signed his first major record deal with Warner Bros. Records—a dream come true for a young 
                  artist who had already begun writing, producing, and performing his own music. His debut album For You dropped in 1978, 
                  showcasing the brilliance of an artist destined to reshape pop and R&B music.
                </p>
                <p>
                  Throughout the '80s, Prince's career skyrocketed with albums like 1999 and Purple Rain, cementing him as a cultural icon. 
                  But behind the scenes, a storm was brewing. As his creative output exploded, Warner Bros. sought to rein it in. The label 
                  owned the master recordings of his work, giving them control over when and how his music was released. Prince, on the other 
                  hand, wanted to release music at his own prolific pace—free from commercial schedules.
                </p>
                <p>
                  The clash reached its peak in the early '90s. Prince began to protest in bold and unconventional ways. In 1993, he changed 
                  his name to an unpronounceable symbol—often referred to as "The Artist Formerly Known as Prince." Around the same time, he 
                  started appearing in public with the word "slave" written on his face, a searing critique of the music industry's treatment 
                  of artists and its grip on their work.
                </p>
                <p>
                  To escape his Warner Bros. contract, Prince rapidly released albums such as Come and The Black Album, pulling from his vault 
                  of unreleased songs to meet the label's demands. In 1996, after delivering the agreed-upon number of albums, Prince officially 
                  parted ways with Warner Bros.
                </p>
                <p>
                  Now free, he founded his own independent label, NPG Records, and began releasing music on his own terms. This new chapter gave 
                  him full ownership of his art and marked a turning point in how artists viewed creative rights and independence.
                </p>
                <p>
                  Prince's battle with Warner Bros. became one of the most iconic standoffs in music history. It helped reshape industry norms 
                  around artist rights and inspired countless musicians to fight for control over their work—long before terms like "owning your 
                  masters" became common in the industry dialogue.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-4">
            <div className="sticky top-20">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Key Takeaways</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-semibold">Creative Control:</span> All three artists fought for the freedom to express their artistic vision without label interference.
                    </p>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-semibold">Financial Recognition:</span> Fair compensation was a central issue, with artists often receiving minimal returns despite commercial success.
                    </p>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-semibold">Ownership Rights:</span> The struggle to own master recordings and intellectual property remains a pivotal issue in the music industry.
                    </p>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-semibold">Independence:</span> Each artist eventually found ways to gain more control by establishing their own ventures or labels.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-xl">Why This Matters</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    These historic feuds helped reshape the music industry and paved the way for today's artists to have more control over their careers.
                    At MusiStash, we believe in fair partnerships that respect artistic vision while helping creators access the resources they need to succeed.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ArtistFeud;
