import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronRight, CheckCircle } from "lucide-react";

const questions = [
  {
    question: "What do you want to do with your floors?",
    options: ["Install new flooring", "Refinish existing hardwood", "Not sure yet"],
  },
  {
    question: "What type of flooring do you currently have?",
    options: ["Hardwood floors", "Carpet", "Vinyl / Laminate", "Not sure"],
  },
  {
    question: "Which area needs work?",
    options: ["Living room / main area", "Bedrooms", "Entire home", "Stairs"],
  },
  {
    question: "Approximate size of the project",
    options: ["Under 500 sq ft", "500–1,000 sq ft", "1,000–2,000 sq ft", "2,000+ sq ft"],
  },
  {
    question: "What result are you looking for?",
    options: ["Restore existing floors", "Change color / modern look", "Install new flooring", "Increase home value before selling"],
  },
  {
    question: "When would you like to start?",
    options: ["As soon as possible", "Within 1–2 months", "Just researching options"],
  },
  {
    question: "Estimated investment range",
    options: ["Under $5,000", "$5,000 – $10,000", "$10,000+", "Not sure yet"],
  },
];

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  const progress = step <= questions.length ? ((step) / (questions.length + 1)) * 100 : 100;

  const selectAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = answer;
    setAnswers(newAnswers);
    setTimeout(() => setStep(step + 1), 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const score = Math.floor(Math.random() * 4) + 5; // 5-8

  if (submitted) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container mx-auto max-w-xl text-center">
            <div className="elevated-card p-10">
              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-display font-bold text-gold">{score}/10</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Your Floor Score</h2>
              <p className="text-gold font-semibold mb-4">Recommendation: Professional refinishing</p>
              <p className="text-sm text-muted-foreground mb-8">Thanks! Based on your answers, we'll prepare personalized recommendations for your flooring project.</p>
              <div className="space-y-3 text-left mb-8">
                {["Recommended flooring solution", "Estimated investment range", "Suggested timeline"].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-gold" /> {t}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic">No pressure. No sales tactics. Just expert guidance.</p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding">
        <div className="container mx-auto max-w-xl">
          {step === 0 && (
            <div className="text-center mb-10">
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Is Your Floor Helping or Hurting Your <span className="gold-gradient-text">Home's Value?</span>
              </h1>
              <p className="text-muted-foreground mb-8">In less than 30 seconds, discover the best solution for your floors.</p>
              <Button variant="gold" size="xl" onClick={() => setStep(1)}>
                Start My Floor Assessment <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          {step >= 1 && step <= questions.length && (
            <div>
              {/* Progress */}
              <div className="w-full h-2 bg-secondary rounded-full mb-8">
                <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mb-2">Question {step} of {questions.length}</p>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">{questions[step - 1].question}</h2>
              <div className="space-y-3">
                {questions[step - 1].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => selectAnswer(opt)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                      answers[step] === opt
                        ? "border-gold bg-gold/10 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-gold/50 hover:text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step > questions.length && !submitted && (
            <div>
              <div className="w-full h-2 bg-secondary rounded-full mb-8">
                <div className="h-full bg-gold rounded-full" style={{ width: "95%" }} />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Almost done!</h2>
              <p className="text-sm text-muted-foreground mb-6">Where should we send your personalized floor recommendations?</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Name" required value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} className="w-full h-11 px-4 rounded-lg bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                <input type="email" placeholder="Email" required value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} className="w-full h-11 px-4 rounded-lg bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                <input type="tel" placeholder="Phone (optional)" value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} className="w-full h-11 px-4 rounded-lg bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                <Button variant="gold" size="xl" className="w-full" type="submit">
                  Get My Floor Recommendations
                </Button>
                <p className="text-xs text-center text-muted-foreground">No pressure, no sales calls. We'll send personalized recommendations.</p>
              </form>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
