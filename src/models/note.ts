export interface Note {
  id: string;
  title: string;
  content: string; // en Markdown
  userId: string
  createdAt: Date;
  updatedAt: Date;
}
