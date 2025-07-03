"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildAdvancedComponent, typography } from "@/utils/designSystem";
import { Video, Tv2 } from "lucide-react";

const DemoLivePage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  return (
    <motion.div
      className="p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={buildAdvancedComponent.headerCard()}>
        <h1 className={typography.h1}>Live Demo Session</h1>
        <p className={typography.lead}>
          This is where the live video session for the demo class will take place.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
            <Tv2 className="mx-auto h-24 w-24 text-gray-400" />
            <p className="mt-4 text-lg font-semibold">Live Video Call Interface</p>
            <p className="mt-2 text-sm text-gray-500">
                Session ID: {sessionId ? sessionId : "Not specified"}
            </p>
            <p className="mt-4 text-sm text-gray-500">
                (Zoom integration or other video service would be implemented here)
            </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DemoLivePage;
