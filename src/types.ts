export type CategoryType = 'Todos' | 'Transferências' | 'Jogos' | 'Resultados' | 'Curiosidades';

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: Exclude<CategoryType, 'Todos'>;
  image: string;
  date: string;
  author: string;
  readTime: string;
  isHighlight: boolean;
  likes: number;
  comments: Comment[];
}
