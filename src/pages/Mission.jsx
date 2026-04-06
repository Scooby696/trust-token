import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Star, Users } from "lucide-react";

const MISSION_PILLARS = [
  {
    icon: Zap,
    title: "High-Yield Staking",
    text: "Up to 25% APY staking on Solana — secure, reliable, and user-friendly.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Verified USA Directory",
    text: "Premier directory of Made in USA creators, providers, and businesses — each community-rated.",
    color: "text-blue-300",
    bg: "bg-blue-900/30",
  },
  {
    icon: Star,
    title: "American Innovation",
    text: "Championing domestic products, services, and talent in the crypto space.",
    color: "text-red-400",
    bg: "bg-red-900/30",
  },
  {
    icon: Users,
    title: "Accountable DeFi",
    text: "True decentralization includes accountability — the trusted gateway where crypto meets real American value.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

export default function Mission() {
  return (
    <div className="pt-20 sm:pt-24">

      {/* TRUST TOKEN Mission Statement */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/50 via-background to-primary/5 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-white/80" />
          <div className="flex-1 bg-blue-700" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <p className="font-inter text-xs tracking-[0.35em] text-primary uppercase mb-3">
              powered by TRUST TOKEN
            </p>
            <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              MISSION STATEMENT
            </h1>
            <div className="w-32 h-0.5 bg-primary mx-auto mb-6" />
            <p className="font-cinzel text-xl sm:text-2xl text-primary tracking-wider font-semibold mb-8">
              MADE IN USA DIGITAL
            </p>
            <p className="font-inter text-base sm:text-lg text-white/75 max-w-3xl mx-auto leading-relaxed">
              MADE IN USA DIGITAL, powered by TRUST TOKEN, exists to rebuild trust in cryptocurrency and the broader digital economy by creating a <strong className="text-white">transparent, secure, and fully verifiable</strong> staking and rewards platform on Solana.
            </p>
          </motion.div>

          {/* Commitment statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card/60 border border-primary/20 rounded-2xl p-6 sm:p-8 mb-12 text-center"
          >
            <p className="font-inter text-sm sm:text-base text-muted-foreground leading-relaxed">
              We are committed to <strong className="text-foreground">promoting trust through innovation and integrity.</strong> By combining high-yield staking rewards with a verified ecosystem of American-made goods, services, and creators, TRUST TOKEN bridges the gap between <span className="text-primary font-semibold">decentralized finance</span> and <span className="text-primary font-semibold">real-world accountability.</span>
            </p>
          </motion.div>

          {/* Four pillars */}
          <div className="grid sm:grid-cols-2 gap-5 mb-14">
            {MISSION_PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 bg-card border border-border/40 rounded-xl p-5 hover:border-primary/30 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl ${p.bg} flex items-center justify-center shrink-0`}>
                  <p.icon className={`w-5 h-5 ${p.color}`} />
                </div>
                <div>
                  <h3 className="font-cinzel font-semibold text-foreground text-sm mb-1">{p.title}</h3>
                  <p className="font-inter text-xs text-muted-foreground leading-relaxed">{p.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Closing statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-block bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-2xl px-6 sm:px-10 py-8 max-w-3xl">
              <p className="font-cinzel text-lg sm:text-xl font-bold text-foreground mb-4">
                True Decentralization Includes Accountability.
              </p>
              <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-6">
                We are building the trusted gateway where crypto meets real American value — empowering users to <strong className="text-foreground">earn, verify, and support</strong> what is proudly Made in the USA.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="inline-flex items-center gap-2 font-cinzel tracking-wider text-sm px-6 py-3 bg-primary/20 text-primary/60 border border-primary/20 rounded-lg cursor-not-allowed select-none">
                  Stake TRUST · Coming Soon
                </div>
                <Link
                  to="/digital"
                  className="inline-flex items-center gap-2 font-cinzel tracking-wider text-sm px-6 py-3 border border-border text-muted-foreground rounded-lg hover:border-primary/40 hover:text-primary transition-colors"
                >
                  Digital Directory <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Original Christian Values section */}
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