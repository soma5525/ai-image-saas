export type GenerateImageState = {
  imageUrl?: string;
  error?: string;
  status: "idle" | "success" | "error";
  keyword?: string;
};

export type RemoveBackgroundState = {
  imageUrl?: string;
  error?: string;
  status: "idle" | "success" | "error";
};

export type StripeState = {
  status: "idle" | "success" | "error";
  error: string;
  redirectUrl?: string;
};
