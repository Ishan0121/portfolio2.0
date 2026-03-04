import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

export function SocialLinks() {
  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" asChild className="w-full justify-start glass">
        <a href={`mailto:${siteConfig.socials.email}`}>
          <Mail className="mr-2 h-4 w-4" />
          {siteConfig.socials.email}
        </a>
      </Button>
      <Button variant="outline" asChild className="w-full justify-start glass">
        <a href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer">
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </a>
      </Button>
      <Button variant="outline" asChild className="w-full justify-start glass">
        <a href={siteConfig.socials.linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </a>
      </Button>
      <Button variant="outline" asChild className="w-full justify-start glass">
        <a href={siteConfig.socials.twitter} target="_blank" rel="noopener noreferrer">
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </a>
      </Button>
    </div>
  );
}