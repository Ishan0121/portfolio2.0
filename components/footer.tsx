import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t px-10">
      <div className="container py-5 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className=" text-center">
            <h3 className="text-lg font-semibold mb-4">Portfolio</h3>
            <p className="text-muted-foreground">
              Crafting digital experiences with passion and precision.
            </p>
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="flex gap-4 justify-center">
              <Link
                href="/"
                className="block hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="/portfolio"
                className="block hover:text-primary transition-colors"
              >
                Portfolio
              </Link>
              <Link
                href="/skills"
                className="block hover:text-primary transition-colors"
              >
                Skills
              </Link>
              <Link
                href="/contact"
                className="block hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className=" text-center">
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4 justify-center">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Portfolio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
