import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import Tiptap from "./TipTapRichText.js";
import {
  TextInput,
  Button,
  Card,
  Text,
  Select,
  Modal,
  NumberInput,
} from "@mantine/core";
import { learningService } from "../../services/learning.service";

export default function QuizModuleEditor({ editFormData, closeEditForm }) {
  const [moduleName, setModuleName] = useState(editFormData.name || "");
  const [content, setContent] = useState(editFormData.content || "");
  const [questions, setQuestions] = useState(editFormData.questions || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [cutoffPercentage, setCutoffPercentage] = useState(
    editFormData.cutoffPercentage || 0
  );

  // New state for adding questions
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correctOption: null,
  });

  useEffect(() => {
    if (editFormData) {
      setModuleName(editFormData.name);
      setContent(editFormData.content);
      setQuestions(editFormData.questions);
      setCutoffPercentage(editFormData.cutoffPercentage);
    }
  }, [editFormData]);

  const handleModuleNameChange = (e) => setModuleName(e.target.value);

  const setStringifiedContent = (content) => setContent(content);

  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    toast.success("Question deleted successfully!");
  };

  // New handlers for adding questions and options
  const handleNewQuestionChange = (e) => {
    setNewQuestion({ ...newQuestion, text: e.target.value });
  };

  const handleNewOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const handleNewCorrectOptionChange = (value) => {
    setNewQuestion({ ...newQuestion, correctOption: parseInt(value) });
  };

  const addNewQuestion = () => {
    if (
      newQuestion.text &&
      newQuestion.options.some((opt) => opt.trim() !== "") &&
      newQuestion.correctOption !== null
    ) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion({
        text: "",
        options: ["", "", "", ""],
        correctOption: null,
      });
      toast.success("New question added successfully!");
    } else {
      toast.error(
        "Please fill in the question, at least one option, and select a correct option."
      );
    }
  };

  const saveModule = () => {
    if (moduleName && content && questions.length > 0) {
      setModalOpen(true);
    } else {
      toast.error(
        "Please ensure all required fields are filled and at least one question remains."
      );
    }
  };

  const handleSaveModule = async () => {
    try {
      const moduleData = {
        name: moduleName,
        content,
        questions,
        cutoffPercentage,
      };

      await learningService.UpdateQuizModule(editFormData._id, moduleData);
      toast.success("Module updated successfully!");
      closeEditForm();
    } catch (error) {
      toast.error("Failed to update the module");
    }
  };

  return (
    <div className="quiz-module-editor">
      <ToastContainer position="top-center" />
      <span style={{ cursor: "pointer" }} onClick={closeEditForm}>
        X
      </span>
      <Card shadow="sm" p="lg" style={{ maxHeight: "80vh", overflow: "auto" }}>
        <Text size="xl" weight={700} mb="md">
          Edit Quiz Module
        </Text>

        <TextInput
          label="Module Name"
          value={moduleName}
          onChange={handleModuleNameChange}
          required
          mb="md"
        />

        <Text weight={500} mb="xs">
          Content
        </Text>
        <div
          style={{
            background: "linear-gradient(45deg, #e6f7ff, #bae7ff)",
            padding: "10px",
          }}
        >
          <Tiptap
            type="edit"
            data={content}
            setStringifiedContent={setStringifiedContent}
          />
        </div>

        <Card shadow="sm" mt="lg" p="md" style={{ border: "1px solid #ccc" }}>
          <Text weight={500} mb="md">
            Add New Question
          </Text>
          <TextInput
            label="Question Text"
            value={newQuestion.text}
            onChange={handleNewQuestionChange}
            required
            mb="sm"
          />
          {newQuestion.options.map((option, index) => (
            <TextInput
              key={index}
              label={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleNewOptionChange(index, e.target.value)}
              mb="xs"
            />
          ))}
          <Select
            label="Correct Option"
            value={newQuestion.correctOption?.toString()}
            onChange={handleNewCorrectOptionChange}
            data={newQuestion.options.map((_, index) => ({
              value: index.toString(),
              label: `Option ${index + 1}`,
            }))}
            mb="md"
          />
          <Button onClick={addNewQuestion} style={{ background: "#1d82f5" }}>
            Add Question
          </Button>
        </Card>

        <Text weight={500} mt="lg" mb="xs">
          Existing Questions:
        </Text>
        {questions.map((q, qIndex) => (
          <Card key={qIndex} shadow="sm" mb="sm" p="sm">
            <Text weight={500}>{q.text}</Text>
            {q.options.map((option, optIndex) => (
              <div
                key={optIndex}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <Text
                  color={optIndex === q.correctOption ? "green" : "inherit"}
                  style={{ flexGrow: 1 }}
                >
                  {optIndex + 1}. {option}
                </Text>
              </div>
            ))}

            <Button
              onClick={() => deleteQuestion(qIndex)}
              size="xs"
              style={{ background: "red" }}
            >
              Delete Question
            </Button>
          </Card>
        ))}

        <Button
          style={{ background: "#1d82f5" }}
          onClick={saveModule}
          mt="lg"
          fullWidth
        >
          Update Module
        </Button>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Set Cutoff Percentage"
      >
        <NumberInput
          label="Cutoff Percentage"
          value={cutoffPercentage}
          onChange={(value) => setCutoffPercentage(value)}
          min={0}
          max={100}
          required
        />
        <Button
          style={{ background: "#1d82f5" }}
          onClick={handleSaveModule}
          mt="md"
          fullWidth
        >
          Save Changes
        </Button>
      </Modal>
    </div>
  );
}
