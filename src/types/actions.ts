export type GenerateImageState = {
  imageUrl?: string;
  error?: string;
  status: "idle" | "success" | "error";
  keyword?: string;
  details?: string;
};

export type RemoveBackgroundState = {
  imageUrl?: string;
  error?: string;
  status: "idle" | "success" | "error";
  details?: string;
};

export type StripeState = {
  status: "idle" | "success" | "error";
  error: string;
  redirectUrl?: string;
};
