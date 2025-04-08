import PageContainer from "@/components/dashboard/page-container";
import PageHeader from "@/components/dashboard/page-header";
import React from "react";
import SubscriptionSettingsForm from "./subscription-settings-form";
import ProfileSection from "@/components/dashboard/settings/profile-section";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const dbUser = await prisma?.user.findUnique({
    where: {
      clerkId: user?.id,
    },
    include: {
      subscription: true,
    },
  });

  if (!dbUser) {
    throw new Error("ユーザーが見つかりませんでした。");
  }

  return (
    <PageContainer>
      <PageHeader
        title="設定"
        description="アカウントの確認とサブスクリプションの設定を管理します。"
      />
      <div className="max-w-2xl">
        <ProfileSection
          email={user.emailAddresses[0].emailAddress}
          subscriptionStatus={dbUser.subscriptionStatus}
          subscriptionRenewalDate={dbUser.subscription?.stripeCurrentPeriodEnd}
        />
      </div>

      <div className="max-w-2xl">
        <SubscriptionSettingsForm user={dbUser} />
      </div>
    </PageContainer>
  );
};

export default SettingsPage;
