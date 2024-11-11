"use client";

import SettingsModal from "@/components/modal/settingModal";
import { useEffect, useState } from "react";
import CoverImageModal from "@/components/modal/coverImageModal";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <SettingsModal />
      <CoverImageModal />
    </>
  );
}
