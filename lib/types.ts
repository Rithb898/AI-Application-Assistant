export type GeneratedContentType = {
  applicationMaterials: {
    interestInCompany: string;
    whyFit: string;
    valueAdd: string;
    coverLetter: string;
    linkedinSummary: string;
    shortAnswer: string;
  };
  interviewPrep: {
    questions: string[];
  };
};

export type HistoryItemType = {
  id: string;
  company: string;
  jobTitle: string;
  date: string;
  data: GeneratedContentType;
  resume: object;
};

export type regenerateDataType = {
  field: keyof GeneratedContentType["applicationMaterials"];
  data: HistoryItemType;
};
