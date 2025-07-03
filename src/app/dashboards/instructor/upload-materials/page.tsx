"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { instructorApi, CourseMaterialUpload } from "@/apis/instructor.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAdvancedComponent, typography, buildComponent } from "@/utils/designSystem";
import {
  AlertCircle,
  UploadCloud,
  FileText,
  Video,
  BookOpen,
  Send,
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const UploadMaterialsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [materialType, setMaterialType] = useState<CourseMaterialUpload['material_type'] | ''>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedFile || !title || !description || !courseId || !materialType) {
      showToast.error("Please fill in all fields and select a file.");
      setLoading(false);
      return;
    }

    try {
      const materialData: CourseMaterialUpload = {
        course_id: courseId,
        material_type: materialType as CourseMaterialUpload['material_type'],
        title,
        description,
      };
      const formData = instructorApi.createCourseMaterialFormData(selectedFile, materialData);
      
      await instructorApi.uploadCourseMaterials(formData);
      showToast.success("Course material uploaded successfully!");
      // Clear form
      setSelectedFile(null);
      setTitle("");
      setDescription("");
      setCourseId("");
      setMaterialType("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      showToast.error("Failed to upload course material.");
    } finally {
      setLoading(false);
    }
  }, [selectedFile, title, description, courseId, materialType]);

  return (
    <motion.div
      className="p-4 md:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={buildAdvancedComponent.headerCard()}>
        <h1 className={typography.h1}>Upload Course Materials</h1>
        <p className={typography.lead}>
          Upload various types of materials for your courses.
        </p>
      </div>

      <motion.div variants={itemVariants}>
        <Card className={buildComponent.card('elegant')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UploadCloud className="mr-2 h-5 w-5" /> Upload Material
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <Label htmlFor="courseId">Course ID</Label>
                <Input
                  id="courseId"
                  type="text"
                  placeholder="e.g., MEDH101"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="title">Material Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Introduction to React"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the material..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="materialType">Material Type</Label>
                <Select
                  value={materialType}
                  onValueChange={(value: CourseMaterialUpload['material_type']) => setMaterialType(value)}
                  disabled={loading}
                >
                  <SelectTrigger id="materialType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presentation">
                      <div className="flex items-center">
                        <Video className="mr-2 h-4 w-4" /> Presentation
                      </div>
                    </SelectItem>
                    <SelectItem value="document">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" /> Document
                      </div>
                    </SelectItem>
                    <SelectItem value="resource">
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4" /> Resource
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                {selectedFile && (
                  <p className="text-sm text-gray-500 mt-2">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Uploading..." : <><Send className="mr-2 h-4 w-4" /> Upload Material</>}
              </Button>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default UploadMaterialsPage;
