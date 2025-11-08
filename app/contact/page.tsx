"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "@/components/contact-form";
import { SocialLinks } from "@/components/social-links";
import { childVariants, containerVariants } from "@/lib/utils";
import FloatingSplineBot from "@/components/FloatingSplineBot";

export default function ContactPage() {


  return (
    <>
      {/* <FloatingSplineBot splineScene="./spline/genkub.splinecode"/> */}
      <div className="h-16" />
      <motion.section
        className="container py-12 sm:py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={childVariants}>
          <SectionHeading
            title="Get in Touch"
            description="Have a question or want to work together? Feel free to reach out!"
          />
        </motion.div>
        <motion.div
          className="mx-auto max-w-2xl grid gap-8 md:grid-cols-2 glass p-7 rounded-md"
          variants={childVariants}
        >
          <motion.div variants={childVariants}>
            <h3 className="text-lg font-semibold mb-4">Send a Message</h3>
            <ContactForm />
          </motion.div>
          <motion.div variants={childVariants}>
            <h3 className="text-lg font-semibold mb-4">Connect With Me</h3>
            <SocialLinks />
          </motion.div>
        </motion.div>
      </motion.section>
    </>
  );
}
