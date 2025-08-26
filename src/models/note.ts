export interface Note {
  id: string;
  title: string;
  content: string; // en Markdown
  createdAt: Date;
  updatedAt: Date;
}
