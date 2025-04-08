"use client";

import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";

const AuthButton = () => {
  const { userId } = useAuth();

  if (userId) {
    return (
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-9 w-9",
          },
        }}
      />
    );
  }

  return (
    <div className="flex gap-4 items-center">
      <SignInButton mode="modal">
        <Button variant="outline">ログイン</Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button variant="default">新規登録</Button>
      </SignUpButton>
    </div>
  );
};

export default AuthButton;
