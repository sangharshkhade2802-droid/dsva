export type NavSection = 
  | 'dashboard'
  | 'data_structures'
  | 'algorithms'
  | 'sorting'
  | 'searching'
  | 'graph'
  | 'complexity'
  | 'playground'
  | 'learning'
  | 'about';

export type AlgorithmCategory = 
  | 'Linear Data Structures'
  | 'Non-Linear Data Structures'
  | 'Hash-Based Structures'
  | 'Sorting Algorithms'
  | 'Searching Algorithms'
  | 'Graph Algorithms'
  | 'Tree Algorithms'
  | 'Advanced Algorithms';

export interface ExecutionStep {
  step: number;
  action: string;
  line: number;
  description: string;
  indices: number[];
  array: number[];
  aux?: any;
}

export interface ExecutionTrace {
  algorithm: string;
  category: string;
  status: 'running' | 'completed' | 'error';
  comparisons: number;
  swaps: number;
  operations: number;
  execution_time_us: number;
  steps: ExecutionStep[];
}

export interface AlgorithmMetric {
  name: string;
  n: number;
  time_us: number;
  comparisons: number;
  swaps: number;
  operations: number;
  time_complexity: string;
  space_complexity: string;
}

export interface ComparisonResult {
  comparison: string;
  metrics: AlgorithmMetric[];
}

export interface InterviewQuestion {
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  company: string;
  hint: string;
  solutionExplanation: string;
}

export interface LearningTopic {
  id: string;
  name: string;
  category: AlgorithmCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tagline: string;
  introduction: string;
  realWorldApplications: string[];
  workingPrinciple: string;
  stepByStepExplanation: string[];
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  advantages: string[];
  disadvantages: string[];
  interviewQuestions: InterviewQuestion[];
  cSourceCode: string;
}

export interface GraphNode {
  id: number;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdgeModel {
  u: number;
  v: number;
  weight: number;
  isDirected?: boolean;
}
