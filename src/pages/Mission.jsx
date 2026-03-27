import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Mission() {
  return (
    <div className="pt-20 sm:pt-24">
      {/* Hero */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-inter text-xs tracking-[0.3em] text-primary uppercase mb-4"
        >
          Our Mission
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6"
        >
          Was America Founded on Christian Values?
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3 }}
          className="w-24 h-0.5 bg-primary mx-auto mb-8"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-inter text-muted-foreground leading-relaxed text-base sm:text-lg max-w-3xl mx-auto"
        >
          The historical record speaks clearly. From the Declaration of Independence
          to the personal writings of our Founding Fathers, the evidence is overwhelming
          that America was built upon the foundation of biblical Christian principles.
        </motion.p>
      </section>

      {/* Content Blocks */}
      <section className="pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-16">
        <ContentBlock
          index={0}
          label="The Declaration"
          title="Endowed by Their Creator"
          text={`"We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty, and the pursuit of Happiness... And for the support of this Declaration, with a firm reliance on the protection of divine Providence, we mutually pledge to each other our Lives, our Fortunes and our sacred Honor."`}
          commentary="The very document that birthed our nation invokes the Creator and divine Providence — acknowledging that our rights come not from government, but from God."
        />

        <ContentBlock
          index={1}
          label="George Washington"
          title="First President"
          text={`"You do well to wish to learn our arts and ways of life, and above all, the religion of Jesus Christ. These will make you a greater and happier people than you are."`}
          commentary="The Father of our Nation openly promoted the Christian faith as the path to greatness and happiness."
        />

        <ContentBlock
          index={2}
          label="John Adams"
          title="Second President"
          text={`"The general principles on which the fathers achieved independence were the general principles of Christianity. I will avow that I then believed, and now believe, that those general principles of Christianity are as eternal and immutable as the existence and the attributes of God."`}
          commentary="Adams declared without hesitation that Christianity's principles were the very foundation upon which American independence was won."
        />

        <ContentBlock
          index={3}
          label="John Adams"
          title="On Scripture"
          text={`"I have examined all religions, and the result is that the Bible is the best book in the world."`}
          commentary="After studying all the world's religions, America's second president concluded that the Bible stands supreme."
        />

        <ContentBlock
          index={4}
          label="John Quincy Adams"
          title="Sixth President"
          text={`"In the chain of human events, the birthday of our nation is indissolubly linked to the birthday of the Savior. The Declaration of Independence laid the cornerstone of human government upon the first precepts of Christianity."`}
          commentary="The sixth president drew a direct, unbreakable line from the birth of Christ to the birth of America."
        />

        <ContentBlock
          index={5}
          label="Benjamin Franklin"
          title="Founding Father, Scientist & Diplomat"
          text={`"As to Jesus of Nazareth, my opinion of whom you particularly desire, I think the system of morals and His religion as He left them to us, are the best the world ever saw or is likely to see."`}
          commentary="Even Franklin, often regarded as the least traditionally religious of the Founders, praised the unmatched moral system of Jesus Christ."
        />
      </section>

      {/* Conclusion */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-foreground mb-6">
            Beyond Any Doubt
          </h2>
          <p className="font-inter text-muted-foreground leading-relaxed text-base mb-4">
            These quotes from just a few of our founding fathers leave no doubt that our
            great nation was founded and built upon biblical Christian principles and values.
          </p>
          <p className="font-inter text-xs text-muted-foreground/60 mb-8">
            Source:{" "}
            <a
              href="https://www.lwf.org/questions-and-answers/was-america-founded-on-christian-values"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/60 hover:text-primary underline"
            >
              Love Worth Finding Ministries
            </a>
          </p>
          <Link
            to="/quotes"
            className="inline-flex items-center gap-2 font-cinzel tracking-wider text-sm px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Explore All Quotes <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

function ContentBlock({ index, label, title, text, commentary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: 0.1, duration: 0.6 }}
      className="border-l-2 border-primary/30 pl-6 sm:pl-8"
    >
      <p className="font-inter text-xs tracking-[0.25em] text-primary uppercase mb-2">
        {label}
      </p>
      <h3 className="font-cinzel text-xl sm:text-2xl font-semibold text-foreground mb-4">
        {title}
      </h3>
      <blockquote className="font-inter text-foreground/80 text-sm sm:text-base italic leading-relaxed mb-4">
        {text}
      </blockquote>
      <p className="font-inter text-sm text-muted-foreground leading-relaxed">
        {commentary}
      </p>
    </motion.div>
  );
}