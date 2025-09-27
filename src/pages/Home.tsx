import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProfessionalBackground from "@/components/Background";

const toolbox = [
  "TypeScript",
  "JavaScript",
  "React",
  "Vue",
  "Tailwind",
  "Node.js",
  "Express",
  "PostgreSQL",
  "Prisma",
  "Python",
  "Golang",
  "C#",
  "Java",
  "Docker",
  "AWS",
  "Linux (Arch btw)",
  "Git",
  "Wireshark",
  "Metasploit",
  "Burp Suite",
  "Nmap",
];

const jobs = [
  {
    title: "Full Stack Developer",
    company: "Carpincho Dev",
    period: "May 2024 - Present",
    description:
      "Develop secure API endpoints and reactive frontend applications using modern web technologies and security best practices.",
  },
  {
    title: "Programming Freelancer",
    company: "Scale AI",
    period: "Feb 2024 - May 2024",
    description:
      "Evaluated AI-generated code for security, functionality, and best practices while providing structured feedback for model optimization.",
  },
  {
    title: "IoT Founder",
    company: "Dash Home",
    period: "Jul 2022 - Aug 2025",
    description:
      "Founded company providing custom home security and automation systems with comprehensive security implementations.",
  },
];

const projects = [
  {
    title: "ProjectFlow",
    description:
      "Task management and collaboration platform based on Jordan Peterson's approach",
    tags: ["React", "Tailwind", "Express", "TypeScript"],
  },
  {
    title: "Eusebius",
    description:
      "Free mobile app for catholics looking to learn latin through reading the bible.",
    tags: ["React-Native", "Expo", "Express"],
  },
  {
    title: "Snoopy",
    description:
      "Domain scanning tool for finding exposed open ports, exposed subdomains and public files.",
    tags: ["Golang", "Networking", "Security"],
  },
  {
    title: "Credentialist",
    description:
      "Proof of concept crendentials manager with client AES encryption and cipher storage on server.",
    tags: ["NextJs", "Encryption", "Security"],
  },
];

const hero = {
  title: "Software Engineer & Security Enthusiast",
  description: `I specialize in full-stack software development, secure application
              architecture, and cybersecurity best practices.
              Passionate about building robust digital solutions using modern
              development patterns while implementing comprehensive security
              measures throughout the software development lifecycle `,
  about: `With over 2 years of experience in software development and
                  cybersecurity, I've worked across web development and IoT
                  security helping organizations build secure digital solutions.
                  Currently pursuing my Bachelor's in Informatics Engineering
                  with an expected graduation in December 2026, I'm just a few
                  courses away from completing my degree. My expertise spans
                  from full-stack application development to implementing
                  comprehensive security measures. I hold certifications in AWS
                  Data Engineering and Cisco Cybersecurity (Introduction to
                  Cybersecurity, Endpoint Security, and Networking), and I'm
                  constantly expanding my knowledge in secure development
                  practices and emerging technologies.`,
};

const recentPosts = [
  {
    title: "Understanding Zero-Day Vulnerabilities",
    excerpt:
      "A deep dive into how zero-day exploits work and how to defend against them.",
    date: "2024-01-15",
    tags: ["Security", "Vulnerabilities"],
  },
  {
    title: "Building a Home Security Lab",
    excerpt:
      "Step-by-step guide to setting up your own cybersecurity testing environment.",
    date: "2024-01-10",
    tags: ["Lab Setup", "Learning"],
  },
  {
    title: "The Future of AI in Cybersecurity",
    excerpt:
      "Exploring how artificial intelligence is transforming threat detection.",
    date: "2024-01-05",
    tags: ["AI", "Future Tech"],
  },
];

const contact = {
  title: "Contact Me",
  description:
    "I'm always interested in new opportunities and collaborations. If you have any questions or would like to work together, don't hesitate to reach out.",
};

export default function Home() {
  return (
    <ProfessionalBackground opacity={0.7}>
      {/* Main Content */}
      <main className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Hero Section */}
          <section className="py-12">
            <h1 className="text-4xl font-bold text-foreground mb-4 text-balance text-center">
              {hero.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed text-pretty text-center ">
              {hero.description}
              <span className="inline-block w-[0.6ch] animate-blink">█</span>
            </p>
          </section>

          {/* About Me */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              About Me
            </h2>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="px-6">
                <p className="text-muted-foreground leading-relaxed">
                  {hero.about}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Toolbox */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Toolbox
            </h2>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {toolbox.map((tool) => (
                    <Badge key={tool} variant="secondary" className="text-sm">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Jobs */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Experience
            </h2>
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription className="text-base">
                          {job.company}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{job.period}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{job.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Featured Projects
            </h2>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent>
                {projects.map((project, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1 flex justify-center">
                      <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow w-[270px] h-[250px] flex-shrink-0"
                      >
                        <CardHeader>
                          <CardTitle className="text-lg text-balance">
                            {project.title}
                          </CardTitle>
                          <CardDescription className="text-pretty">
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="max-sm:left-1" />
              <CarouselNext className="max-sm:right-1" />
            </Carousel>
          </section>

          {/* Recent Blog Posts 
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Recent Posts
            </h2>
            <div className="space-y-4">
              {recentPosts.map((post, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 text-balance">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-pretty">
                          {post.excerpt}
                        </CardDescription>
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>
          */}

          {/* Get in Touch */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              {contact.title}
            </h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {contact.description}
                </p>
                <div className="flex gap-4">
                  <Button asChild>
                    <a href="mailto:papa.santiago321@gmail.com">Send Email</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a
                      href="https://www.linkedin.com/in/santiago-papa-353171194/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Connect on LinkedIn
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </ProfessionalBackground>
  );
}
