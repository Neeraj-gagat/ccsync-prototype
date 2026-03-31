export interface Task {
  id: number;
  description: string;
  project: string;
  tags: string[];
  status: string;
  uuid: string;
  urgency: number;
  priority: string;
  due: string;
  start: string;
  end: string;
  entry: string;
  wait: string;
  modified: string;
  depends: string[];
  rtype: string;
  recur: string;
  annotations: Annotation[];
  email: string;
}
export interface Annotation {
  entry: string;
  description: string;
}