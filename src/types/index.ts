export interface DashboardStats {
  totalCO2: number;
  todayCO2: number;
  weekCO2: number;
  monthCO2: number;
  reductionPercent: number;
  activitiesCount: number;
  currentStreak: number;
  xp: number;
  level: number;
}

export interface CategoryBreakdown {
  category: string;
  label: string;
  co2: number;
  percentage: number;
  color: string;
  icon: string;
}

export interface TrendDataPoint {
  date: string;
  co2: number;
  label: string;
}

export interface HeatmapDay {
  date: string;
  co2: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ActivityItem {
  id: string;
  category: string;
  subCategory: string;
  value: number;
  unit: string;
  co2Amount: number;
  date: string;
  notes?: string | null;
}

export interface GoalItem {
  id: string;
  title: string;
  targetCO2: number;
  currentCO2: number;
  startDate: string;
  endDate: string;
  status: string;
  progress: number;
}

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earned: boolean;
  earnedAt?: string;
}

export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  category: string;
  targetValue: number;
  targetUnit: string;
  xpReward: number;
  startDate: string;
  endDate: string;
  isDaily: boolean;
  progress: number;
  status: string;
  participantCount: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  image?: string | null;
  xp: number;
  level: number;
  totalCO2Saved: number;
}

export interface CommunityPostItem {
  id: string;
  userId: string;
  userName: string;
  userImage?: string | null;
  title: string;
  content: string;
  type: string;
  imageUrl?: string | null;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  userId: string;
  userName: string;
  userImage?: string | null;
  content: string;
  createdAt: string;
}

export interface AIInsight {
  id: string;
  type: "tip" | "alert" | "recommendation" | "prediction";
  title: string;
  content: string;
  category?: string;
  impact?: string;
  icon: string;
}

export interface WeeklyReport {
  period: string;
  totalCO2: number;
  previousTotalCO2: number;
  changePercent: number;
  topCategory: string;
  achievements: string[];
  recommendations: string[];
  score: number; // 0-100
}
