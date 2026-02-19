import Link from "next/link";
import { Card } from "@/components/Card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="py-16 px-8 max-w-[1200px] mx-auto">
        <section className="text-center mb-24 py-16">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Master Any Subject with <span className="text-gradient">AI Precision</span>
          </h1>
          <p className="text-xl opacity-80 max-w-2xl mx-auto mb-10">
            Stop stressing over notes. StudyBoost AI transforms your study materials into powerful flashcards, summaries, and exam prep in seconds.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="btn-primary px-10 py-4 text-lg">Start Boosting for Free</button>
            <Card as="button" className="px-10 py-4 text-lg rounded-xl hover:bg-[var(--card-border)]/50 transition-colors" hoverEffect={false}>
              View Demo
            </Card>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="flex flex-col items-center text-center p-8">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-2xl font-bold mb-2">AI Flashcards</h3>
            <p className="opacity-70">Turn any topic or text into active-recall flashcards automatically.</p>
          </Card>
          <Card className="flex flex-col items-center text-center p-8">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-2">Smart Summary</h3>
            <p className="opacity-70">Condense long lectures and textbooks into high-impact study summaries.</p>
          </Card>
          <Card className="flex flex-col items-center text-center p-8">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold mb-2">Exam Engine</h3>
            <p className="opacity-70">Generate realistic exam questions based on your specific curriculum.</p>
          </Card>
        </div>

        <section className="mt-32 text-center">
          <h2 className="text-4xl font-bold mb-12">Why Students <span className="text-gradient">Love Us</span></h2>
          <Card className="max-w-3xl mx-auto p-10">
            <p className="text-xl italic mb-4 opacity-90">
              &quot;StudyBoost AI saved me hours of prep time. The summaries are spot on and the flashcards helped me ace my finals!&quot;
            </p>
            <p className="font-bold text-[var(--primary)] text-lg">- Sarah K., University Student</p>
          </Card>
        </section>
      </div>
    </div>
  );
}
