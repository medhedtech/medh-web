"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildAdvancedComponent, typography } from "@/utils/designSystem";
import { Video } from "lucide-react";

const PlayRecordingPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  return (
    <motion.div
      className="p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={buildAdvancedComponent.headerCard()}>
        <h1 className={typography.h1}>Play Recording</h1>
        <p className={typography.lead}>
          This is where the recording of the demo session will be played.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recording Details</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
            <Video className="mx-auto h-24 w-24 text-gray-400" />
            <p className="mt-4 text-lg font-semibold">Video Player Interface</p>
            <p className="mt-2 text-sm text-gray-500">
                Session ID: {sessionId ? sessionId : "Not specified"}
            </p>
            <p className="mt-4 text-sm text-gray-500">
                (A video player would be implemented here)
            </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PlayRecordingPage;
