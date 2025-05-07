
export interface League {
  id: string;
  name: string;
  description?: string;
  leaders?: string[];
  email?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  meetingSchedule?: string;
  createdAt?: Date;
  fullDescription?: string;
  specialty?: string;
  activities?: string[];
  aboutUs?: string;
  mission?: string;
  logoUrl?: string;
}
