import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  Briefcase, 
  TrendingUp, 
  ShieldAlert, 
  Layers, 
  Clock, 
  Code2,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { LEARNING_TOPICS } from '../engine/learningContent';
import { LearningTopic } from '../engine/types';
import { CodeViewer } from '../components/code/CodeViewer';
import { C_SOURCE_REGISTRY } from '../engine/cSourceRegistry';

export const LearningView: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('quick-sort');
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(0);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');

  const topic: LearningTopic =
    LEARNING_TOPICS.find((t) => t.id === selectedTopicId) || LEARNING_TOPICS[0];

  const filteredTopics = LEARNING_TOPICS.filter((t) => {
    if (filterDifficulty === 'All') return true;
    return t.difficulty === filterDifficulty;
  });

  const codeMeta = C_SOURCE_REGISTRY[topic.id] || C_SOURCE_REGISTRY['quick-sort'];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Educational Curriculum
            </span>
            <span className="text-xs text-slate-400 font-mono">Computer Science Laboratory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Comprehensive Learning Syllabus & Interview Guide
          </h1>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl glass-panel text-xs">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterDifficulty === diff
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Topic Selector Sidebar + Content Body */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Topic List (1 column) */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
            Available Modules ({filteredTopics.length})
          </span>
          <div className="space-y-1.5">
            {filteredTopics.map((t) => {
              const isSelected = t.id === selectedTopicId;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopicId(t.id)}
                  className={`w-full flex flex-col p-3 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900/80 border-slate-800/80 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                      {t.name}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      t.difficulty === 'Beginner' ? 'bg-sky-500/20 text-sky-400' :
                      t.difficulty === 'Intermediate' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {t.difficulty}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 line-clamp-1">{t.category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Topic Detailed Content (3 columns) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Hero Overview Card */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl glass-panel shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {topic.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">• {topic.difficulty} Level</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">{topic.name}</h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">{topic.introduction}</p>

            {/* Time & Space Complexity Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Best Case</span>
                <span className="text-xs font-bold font-mono text-emerald-400">{topic.timeComplexity.best}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Average Case</span>
                <span className="text-xs font-bold font-mono text-amber-400">{topic.timeComplexity.average}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Worst Case</span>
                <span className="text-xs font-bold font-mono text-rose-400">{topic.timeComplexity.worst}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Space Complexity</span>
                <span className="text-xs font-bold font-mono text-sky-400">{topic.spaceComplexity}</span>
              </div>
            </div>
          </div>

          {/* Working Principle & Step-by-Step */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl glass-panel shadow-xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Working Principle & Theoretical Intuition</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">{topic.workingPrinciple}</p>

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
              Step-by-Step Algorithm Walkthrough
            </h4>
            <div className="space-y-2">
              {topic.stepByStepExplanation.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-950/50 rounded-xl border border-slate-800/70 text-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-World Industry Applications */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl glass-panel shadow-xl">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-sky-400" />
              <span>Real-World Engineering Applications</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {topic.realWorldApplications.map((app, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  <span className="text-emerald-400 font-bold font-mono mr-1.5">•</span>
                  {app}
                </div>
              ))}
            </div>
          </div>

          {/* Advantages & Disadvantages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl glass-panel">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4" /> Core Advantages
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {topic.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl glass-panel">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono flex items-center gap-1.5 mb-2">
                <ShieldAlert className="w-4 h-4" /> Trade-Offs & Disadvantages
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {topic.disadvantages.map((dis, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{dis}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Technical Interview Questions (Google, Meta, Amazon) */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl glass-panel shadow-xl">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>Common Technical Interview Questions</span>
            </h3>
            <div className="space-y-3">
              {topic.interviewQuestions.map((q, idx) => {
                const isExpanded = expandedQuestionIdx === idx;
                return (
                  <div key={idx} className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                    <button
                      onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                          {q.company}
                        </span>
                        <span className="text-xs font-bold text-slate-200">{q.question}</span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-slate-800/60 text-xs space-y-2 mt-2">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[11px]">
                          <strong>Hint:</strong> {q.hint}
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed">
                          <strong className="text-emerald-400 block mb-1">Standard Solution Approach:</strong>
                          {q.solutionExplanation}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* C Code Implementation */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
              Complete Production C11 Implementation
            </h3>
            <CodeViewer codeMetadata={codeMeta} height="360px" />
          </div>
        </div>
      </div>
    </div>
  );
};
