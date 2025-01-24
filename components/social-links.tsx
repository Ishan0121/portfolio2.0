import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SocialLinks() {
  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" asChild className="w-full justify-start glass">
        <a href="mailto:contact@example.com">
          <Mail className="mr-2 h-4 w-4" />
          contact@example.com
        </a>
      </Button>
      <Button variant="outline" asChild className="w-full justify-start glass">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </a>
      </Button>
      <Button variant="outline" asChild className="w-full justify-start glass">
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <Linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </a>
      </Button>
      <Button variant="outline" asChild className="w-full justify-start glass">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </a>
      </Button>
    </div>
  );
}