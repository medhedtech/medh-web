import { Delete, Plus, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import Preloader from "@/components/shared/others/Preloader";

const CurriculumModal = ({ onClose, curriculum, setCurriculum }) => {
//   const [weeks, setWeeks] = useState([{ title: "", description: "" }]);
  const [loading, setLoading] = useState(false);

  const handleAddWeek = () => {
    setCurriculum([...curriculum, { weekTitle: "", weekDescription: "" }]);
  };

  const handleDeleteWeek = (index) => {
    const updatedWeeks = curriculum.filter((_, i) => i !== index);
    setCurriculum(updatedWeeks);
  };

  const handleChange = (index, field, value) => {
    const updatedWeeks = [...curriculum];
    updatedWeeks[index][field] = value;
    setCurriculum(updatedWeeks);
  };

  const handleProceed = () => {
    console.log("Proceeding with curriculum:", curriculum);
    setLoading(true);
    setCurriculum(curriculum)
    // Handle submission logic here, e.g., API call
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1000);
  };

  const canProceed =
    curriculum.length > 0 &&
    curriculum.every(
      (week) => week.weekTitle.trim() !== "" && week.weekDescription.trim() !== ""
    );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-h-[600px] max-w-lg flex flex-col">
          {loading ? (
            <div className="min-h-[300px] overflow-hidden flex items-center justify-center">
              <Preloader />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Add Curriculum</h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {curriculum && curriculum.map((week, index) => (
                  <div key={index} className="mb-4 border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Week {index + 1}</h4>
                      <button
                        onClick={() => handleDeleteWeek(index)}
                        className="text-red-500 hover:text-red-600 text-sm"
                      >
                        <Trash2 className="w-5"/>
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Week Title"
                      value={week.weekTitle}
                      onChange={(e) =>
                        handleChange(index, "weekTitle", e.target.value)
                      }
                      className="w-full p-2 mb-2 border border-gray-300 rounded-md"
                    />
                    <textarea
                      placeholder="Week Description"
                      value={week.weekDescription}
                      onChange={(e) =>
                        handleChange(index, "weekDescription", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                ))}
                <button
                  onClick={handleAddWeek}
                  className="flex gap-1 items-center justify-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-xs"
                >
                  <Plus className="w-4"/>
                  <span>Add Week</span>
                </button>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    onClick={handleProceed}
                    disabled={!canProceed}
                    className={`px-4 py-2 rounded-md text-white ${
                      canProceed
                        ? "bg-[#3B82F6] hover:bg-[#2b6dd6]"
                        : "bg-gray-300 cursor-not-allowed"
                    } transition-colors`}
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurriculumModal;
