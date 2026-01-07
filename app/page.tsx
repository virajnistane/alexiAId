/**
 * Home Page
 *
 * Landing page for the Emotion Translator application.
 * Helps alexithymic individuals understand and express emotions with AI support.
 *
 * Sections:
 * - Hero: Main value proposition and CTAs
 * - Features: 3-step process explanation
 * - Common Emotions: Examples of emotional experiences and physical sensations
 * - CTA: Final call to action
 * - Footer: Attribution and links
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROUTES, MBTI_TYPES, MBTI_TYPE_DETAILS, type MBTIType } from "@/lib/constants";
import { AppConfig } from "@/lib/config";

/** Home page component with interactive MBTI type selection */
export default function Home() {
  const [selectedType, setSelectedType] = useState<MBTIType | null>(null);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <MBTITypesSection onSelectType={setSelectedType} />
      <CTASection />
      <Footer />
      <PersonalityTypeDialog type={selectedType} onClose={() => setSelectedType(null)} />
    </div>
  );
}

// =============================================================================
// Hero Section
// =============================================================================

function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-1.5 text-sm font-medium text-purple-400">
          <span className="mr-2">💜</span>
          AI-Powered Emotional Understanding for Alexithymia
        </div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {AppConfig.app.name}
          </span>
        </h1>

        <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
          Understand and express your emotions with confidence. Our AI helps alexithymic individuals
          identify, translate, and communicate their feelings in everyday situations.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href={ROUTES.TEST}>
            <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
              Start Emotion Assessment
            </Button>
          </Link>
          <Link href={ROUTES.COACH}>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30"
            >
              Talk to Your Coach
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">Personalized support in understanding your emotional world 💭</p>
      </div>
    </section>
  );
}

// =============================================================================
// Features Section
// =============================================================================

function FeaturesSection() {
  const features = [
    {
      step: "1️⃣",
      title: "Describe Situations",
      description: "Share your experiences and physical sensations with our understanding AI.",
      bgColor: "bg-purple-500/20",
    },
    {
      step: "2️⃣",
      title: "Identify Emotions",
      description: "Learn what emotions you might be experiencing based on your body signals and context.",
      bgColor: "bg-cyan-500/20",
    },
    {
      step: "3️⃣",
      title: "Practice Expression",
      description: "Get coached on how to articulate and communicate your feelings to others.",
      bgColor: "bg-emerald-500/20",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">How It Works</h2>
          <p className="text-muted-foreground">
            A simple 3-step process to understand and express your emotions
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.step} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  step,
  title,
  description,
  bgColor,
}: {
  step: string;
  title: string;
  description: string;
  bgColor: string;
}) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${bgColor}`}>
          <span className="text-xl">{step}</span>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

// =============================================================================
// Common Emotion Scenarios Section
// =============================================================================

function MBTITypesSection({ onSelectType }: { onSelectType: (type: MBTIType) => void }) {
  const emotionScenarios = [
    { emoji: "😰", title: "Anxiety", description: "Tight chest, racing thoughts", color: "hover:border-yellow-500/60 hover:bg-yellow-500/10" },
    { emoji: "😔", title: "Sadness", description: "Heavy feeling, low energy", color: "hover:border-blue-500/60 hover:bg-blue-500/10" },
    { emoji: "😤", title: "Anger", description: "Heat, tension, frustration", color: "hover:border-red-500/60 hover:bg-red-500/10" },
    { emoji: "😊", title: "Joy", description: "Lightness, warmth, energy", color: "hover:border-green-500/60 hover:bg-green-500/10" },
    { emoji: "😨", title: "Fear", description: "Rapid heartbeat, cold sweat", color: "hover:border-purple-500/60 hover:bg-purple-500/10" },
    { emoji: "🤔", title: "Confusion", description: "Uncertainty, mental fog", color: "hover:border-gray-500/60 hover:bg-gray-500/10" },
    { emoji: "😮", title: "Surprise", description: "Sudden alertness, wide eyes", color: "hover:border-orange-500/60 hover:bg-orange-500/10" },
    { emoji: "😌", title: "Calm", description: "Relaxed, steady breathing", color: "hover:border-purple-500/60 hover:bg-purple-500/10" },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
            Common Emotional Experiences
          </h2>
          <p className="text-muted-foreground">
            Learn to recognize emotions through physical sensations and body signals
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {emotionScenarios.map((scenario) => (
            <div
              key={scenario.title}
              className={`rounded-lg border border-border bg-card p-4 text-center transition-all ${scenario.color} hover:shadow-lg cursor-default`}
            >
              <div className="text-3xl mb-2">{scenario.emoji}</div>
              <div className="text-base font-semibold text-foreground mb-1">{scenario.title}</div>
              <div className="text-xs text-muted-foreground">{scenario.description}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-8 text-sm">
          Our AI helps you connect these physical sensations with their emotional meanings
        </p>
      </div>
    </section>
  );
}

// =============================================================================
// CTA Section
// =============================================================================

function CTASection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 p-10 text-center shadow-2xl shadow-purple-500/20">
        <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
          Ready to Understand Your Emotions? 💜
        </h2>
        <p className="mb-6 text-purple-100">
          Begin your journey to emotional awareness and expression with AI-powered support
        </p>
        <Link href={ROUTES.TEST}>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-purple-700 hover:bg-purple-50 font-semibold"
          >
            Start Your Journey ✨
          </Button>
        </Link>
      </div>
    </section>
  );
}

// =============================================================================
// Footer
// =============================================================================

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p className="mb-2 text-sm">
          Built with{" "}
          <a
            href="https://www.toughtongueai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 hover:underline"
          >
            ToughTongue AI
          </a>
        </p>
        <p className="text-xs">
          <a
            href="https://docs.toughtongueai.com/developer/starters/nextjs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400"
          >
            Template Documentation
          </a>
        </p>
      </div>
    </footer>
  );
}

// =============================================================================
// Personality Type Dialog
// =============================================================================

function PersonalityTypeDialog({ type, onClose }: { type: MBTIType | null; onClose: () => void }) {
  if (!type) return null;

  const details = MBTI_TYPE_DETAILS[type];

  return (
    <Dialog open={type !== null} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-5xl">{details.character}</span>
            <div>
              <DialogTitle className="text-2xl text-foreground">
                {type} - {details.name}
              </DialogTitle>
              <p className="text-purple-400 font-semibold">{details.nickname}</p>
            </div>
          </div>
          <DialogDescription className="text-base text-muted-foreground leading-relaxed">
            {details.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <TraitsList traits={details.traits} />
          <StrengthsList strengths={details.strengths} />
          <DialogCTA />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TraitsList({ traits }: { traits: string[] }) {
  return (
    <div>
      <h4 className="font-semibold text-foreground mb-2">Key Traits</h4>
      <div className="flex flex-wrap gap-2">
        {traits.map((trait) => (
          <span key={trait} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
            {trait}
          </span>
        ))}
      </div>
    </div>
  );
}

function StrengthsList({ strengths }: { strengths: string[] }) {
  return (
    <div>
      <h4 className="font-semibold text-foreground mb-2">Strengths</h4>
      <ul className="space-y-1">
        {strengths.map((strength) => (
          <li key={strength} className="flex items-center text-muted-foreground">
            <span className="mr-2 text-green-400">✓</span>
            {strength}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DialogCTA() {
  return (
    <div className="pt-4 border-t border-border">
      <p className="text-sm text-muted-foreground mb-3">Want to better understand your emotions?</p>
      <Link href={ROUTES.TEST}>
        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          Start Emotion Assessment
        </Button>
      </Link>
    </div>
  );
}
