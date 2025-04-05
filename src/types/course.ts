export interface Course {
  _id: string;
  course_category: string;
  course_title: string;
  no_of_Sessions: number;
  course_duration: string;
  course_description: string;
  course_image: string;
  curriculum: CurriculumItem[];
  prices: Price[];
  meta: {
    views: number;
  };
}

export interface CurriculumItem {
  weekTitle: string;
  weekDescription: string;
  topics: string[];
  resources: any[];
  _id: string;
}

export interface Price {
  currency: string;
  individual: number;
  batch: number;
  min_batch_size: number;
  max_batch_size: number;
  early_bird_discount: number;
  group_discount: number;
  is_active: boolean;
  _id: string;
} 