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
    logo: "https://carpinchodev.com/_ipx/q_80/logo.svg",
    link: "https://carpinchodev.com/",
    company: "Carpincho Dev",
    period: "May 2024 - Present",
    description:
      "Develop secure API endpoints and reactive frontend applications using modern web technologies and security best practices.",
  },
  {
    title: "Programming Freelancer",
    logo: "https://cheyennevc.com/wp-content/uploads/2024/10/Scale.jpg",
    link: "https://scale.com/",
    company: "Scale AI",
    period: "Feb 2024 - May 2024",
    description:
      "Evaluated AI-generated code for security, functionality, and best practices while providing structured feedback for model optimization.",
  },
  {
    title: "IoT Founder",
    company: "Dash Home",
    logo: "/LogoDashhome.png",
    period: "Jul 2022 - Aug 2025",
    link: "https://dashhome.com.ar/",
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

const studies = {
  title: "Studies",
  data: [
    {
      title: "Information Systems Engineering",
      institution: "Catholic University of Argentina",
      logo: "https://uca.edu.ar/assets/img/UCA-Logo-3.png",
      link: "https://uca.edu.ar/",
      period: "Jan 2021 - Dec 2026",
      skills: [
        "Python Computing",
        "Web Development",
        "Communication Networks",
        "Structured Programming",
        "Business Administration",
        "Object Oriented Programming",
        "Statistics",
        "Software Engineering",
        "Advanced Physics",
        "Advanced Calculus",
        "Algebra",
        "Software Design",
        "Numeric Methods",
        "Internet Protocols",
        "Discrete Mathematics",
        "Data Structures",
        "Operating Systems",
        "Algorithms & Computer Logic",
        "Relational Databases",
        "Mobile Applications",
        "Artificial Intelligence",
        "Models & Simulations",
        "Parallel Programming & Clusters",
        "Mathematical Programming",
        "Introduction to Quantum Computing",
      ],
    },
    {
      title: "Data Engineering",
      institution: "AWS Academy",
      logo: "https://images.credly.com/size/160x160/images/8a28a66c-151d-4f2d-b021-ca7d3e146437/blob",
      link: "https://www.credly.com/badges/6f5b95f1-edfd-459e-8eb2-8926712377a5/public_url",
      period: "Jan 2025 - June 2025",
      skills: [
        "Data Pipelines",
        "Data Engineering",
        "Data Security",
        "Data Governance",
        "S3",
        "Athena",
        "Cloud 9",
        "IAM",
        "Cloud Formation",
        "Glue",
        "Redshift",
        "EC2",
        "EMR",
        "Kinesis",
        "Cloud Watch",
        "Step Functions",
      ],
    },
    {
      title: "Introduction to Cybersecurity",
      institution: "Cisco Networking Academy",
      logo: "https://images.credly.com/size/160x160/images/af8c6b4e-fc31-47c4-8dcb-eb7a2065dc5b/I2CS__1_.png",
      link: "https://www.credly.com/badges/7025bcd5-6587-4a77-97fc-b2ae2f510792/public_url",
      period: "Aug 2025",
      skills: [
        "Network Vulnerabilities",
        "Cybersecurity",
        "Threat Detection",
        "Privacy And Data Confidentiality",
        "Cyber Best Practices",
      ],
    },
    {
      title: "Networking Basics",
      institution: "Cisco Networking Academy",
      logo: "https://images.credly.com/size/160x160/images/5bdd6a39-3e03-4444-9510-ecff80c9ce79/image.png",
      link: "https://www.credly.com/badges/a242c658-0b98-4c01-a9f3-4394f9bf74bb/public_url",
      period: "Aug 2025",
      skills: [
        "IPv4 Addresses",
        "Application Layer Services",
        "Network Media",
        "Wireless Access",
        "Protocols Standards",
        "Network Types",
      ],
    },
    {
      title: "Networking Devices and Configuration",
      institution: "Cisco Networking Academy",
      logo: "https://images.credly.com/size/160x160/images/88316fe8-5651-4e61-a6be-5be1558f049e/image.png",
      link: "https://www.credly.com/badges/091cdb83-135c-4075-bad0-88a03c6dbf98/public_url",
      period: "Aug 2025",
      skills: [
        "Ethernet Operates",
        "Cisco IOS",
        "Binary Systems",
        "Transport Layer Protocols",
        "DHCP",
        "Network Layer Protocols",
        "Cisco Devices",
        "DNS",
        "ARP",
        "Virtualization and Cloud Services",
        "IPv4 Subnetting",
        "Hierarchical Network Design",
      ],
    },
    {
      title: "Endpoint Security",
      institution: "Cisco Networking Academy",
      logo: "https://images.credly.com/size/160x160/images/0ca5f542-fb5e-4a22-9b7a-c1a1ce4c3db7/EndpointSecurity.png",
      link: "https://www.credly.com/badges/edfe0a25-91a6-4995-900e-b886409c7f2a/public_url",
      period: "Sep 2025",
      skills: [
        "Application Security",
        "Antimalware Protection",
        "Common Cyber Threats",
        "Defending Systems And Devices",
        "Host-based Intrusion Prevention",
        "IP/TCP/UDP Vulnerabilities",
        "Linux Basics",
        "Mitigating Common Network Attacks",
        "Network Security Infrastructure",
        "Securing WLANs",
        "System And Endpoint Protection",
        "Windows Security",
        "Wireless And Mobile Device Attacks",
      ],
    },
  ],
};

const hero = {
  title: "Software Engineer & Security Enthusiast",
  description: `I specialize in full-stack software development, secure application
              architecture, and cybersecurity best practices.
              Passionate about building robust digital solutions using modern
              development patterns while implementing comprehensive security
              measures throughout the software development lifecycle `,
};

/*const recentPosts = [
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
*/

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

          {/* Jobs */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Experience
            </h2>
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <Card
                  key={index}
                  className={`hover:shadow-lg transition-shadow ${job.link ? "cursor-pointer" : ""}`}
                  onClick={() =>
                    job.link ? window.open(job.link, "_blank") : null
                  }
                >
                  <CardHeader>
                    <div className="flex items-start">
                      <img src={job.logo} alt={job.title} className="w-8 h-8" />
                      <div className="ml-3">
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription className="text-base">
                          {job.company}
                        </CardDescription>
                      </div>
                      <Badge className="ml-auto" variant="outline">
                        {job.period}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{job.description}</p>
                  </CardContent>
                </Card>
              ))}
              <div
                data-iframe-width="150"
                data-iframe-height="270"
                data-share-badge-id="edfe0a25-91a6-4995-900e-b886409c7f2a"
                data-share-badge-host="https://www.credly.com"
              ></div>
            </div>
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

          {/* Education */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              {studies.title}
            </h2>
            <div className="space-y-4">
              {studies.data.map((degree, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg hover:cursor-pointer transition-shadow"
                  onClick={() => window.open(degree.link, "_blank")}
                >
                  <CardHeader>
                    <div className="flex items-start">
                      <div className="w-12 h-12">
                        <img src={degree.logo} alt="Logo" />
                      </div>
                      <CardTitle className="text-lg flex-row ml-2">
                        <div className="text-foreground">{degree.title}</div>
                        <div className="text-muted-foreground">
                          {degree.institution}
                        </div>
                      </CardTitle>
                      <CardDescription className="text-base ml-auto">
                        {degree.period}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {degree.skills.map((skill) => (
                      <Badge className="m-1" variant="outline">
                        {skill}
                      </Badge>
                    ))}
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
