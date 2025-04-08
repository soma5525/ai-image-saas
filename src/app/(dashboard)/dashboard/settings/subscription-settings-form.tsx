"use client";

import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";

interface SettingsProps {
  user: User;
}

const SubscriptionSettingsForm = ({ user }: SettingsProps) => {
  const router = useRouter();
  const handleManageSubscription = async () => {
    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
      });

      const data = await response.json();
      router.push(data.url);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="grid gap-4 p-4 border-2 rounded-lg">
      <div className="grid gap-2">
        {user?.subscriptionStatus !== "FREE" ? (
          <>
            <p className="text-sm text-muted-foreground">
              現在のサブスクリプションを管理します
            </p>
            <Button onClick={handleManageSubscription}>
              サブスクリプション管理
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              まだサブスクリプションに変更されていません
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionSettingsForm;
