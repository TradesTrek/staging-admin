/** @format */
import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { userService } from "../../services";
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

export default function QuizModuleCreator({ addUserCloseModal }) {
  useEffect(() => {
    fetchLearningModuleGroups();
  }, []);

  const [moduleName, setModuleName] = useState("");
  const [content, setContent] = useState("");
  const [group, setGroup] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correctOption: null,
  });
  const [showCorrectOption, setShowCorrectOption] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [cutoffPercentage, setCutoffPercentage] = useState(0);
  const [learningModuleGroups, setLearningModuleGroups] = useState([]);

  const handleModuleNameChange = (e) => setModuleName(e.target.value);

  const setStringifiedContent = (content) => setContent(content);

  const handleQuestionTextChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, text: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });

    // Check if all options are filled
    if (newOptions.every((option) => option.trim() !== "")) {
      setShowCorrectOption(true);
    } else {
      setShowCorrectOption(false);
    }
  };

  const handleCorrectOptionChange = (value) => {
    setCurrentQuestion({ ...currentQuestion, correctOption: parseInt(value) });
  };

  const fetchLearningModuleGroups = async () => {
    try {
      const response = await learningService.getLearningModuleGroups();
      setLearningModuleGroups(response);
    } catch (error) {}
  };

  const addQuestion = () => {
    if (
      currentQuestion.text &&
      currentQuestion.options.every((option) => option.trim() !== "") &&
      currentQuestion.correctOption !== null
    ) {
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion({
        text: "",
        options: ["", "", "", ""],
        correctOption: null,
      });
      setShowCorrectOption(false);
      toast.success("Question added successfully!");
    } else {
      toast.error("Please fill in all fields for the question.");
    }
  };

  const saveModule = () => {
    if (moduleName && content && questions.length > 0) {
      setModalOpen(true);
    } else {
      toast.error(
        "Please fill in all required fields and add at least one question."
      );
    }
  };

  const handleKeyDown = (event) => {
    // Allow only numbers, backspace, delete, arrows, and decimal point
    if (
      !/[0-9]/.test(event.key) && // Allow numbers
      event.key !== 'Backspace' && // Allow Backspace
      event.key !== 'Delete' &&    // Allow Delete
      event.key !== 'ArrowLeft' && // Allow left arrow
      event.key !== 'ArrowRight'
    ) {
      event.preventDefault(); // Prevent any other key from being pressed
    }
  };

  const closeForm = () => {
    setModuleName("");
    setContent("");
    setStringifiedContent("");
    setQuestions([]);
    setCutoffPercentage(0);
    addUserCloseModal(false);
  };
  const handleSaveModule = async () => {
    try {
      // Here you would typically send the data to your backend
      const moduleData = {
        name: moduleName,
        content,
        questions,
        cutoffPercentage,
        group,
      };

      await learningService.AddQuizModule(moduleData);
      // Reset form
      setModuleName("");
      setContent("");
      setStringifiedContent("");
      setQuestions([]);
      setCutoffPercentage(0);

      toast.success("Added Module successfully");
      addUserCloseModal(true);
    } catch (error) {
      toast.error("Failed to save");
    }
  };

  return (
    <div className="quiz-module-creator">
      <ToastContainer position="top-center" />
      <span style={{ cursor: "pointer" }} onClick={closeForm}>
        X
      </span>
      <Card shadow="sm" p="lg" style={{ overflow: "scroll" }}>
        <Text size="xl" weight={700} mb="md">
          Create Quiz Module
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
            type="create"
            data=""
            setStringifiedContent={setStringifiedContent}
          />
        </div>

        <Card
          shadow="sm"
          mt="lg"
          p="md"
          style={{
            height: "200px",
            border: "1px solid black",
            overflow: "scroll",
          }}
        >
          <Text weight={500} mb="md">
            Add Question
          </Text>
          <TextInput
            label="Question Text"
            value={currentQuestion.text}
            onChange={handleQuestionTextChange}
            required
            mb="sm"
          />

          {currentQuestion.options.map((option, index) => (
            <TextInput
              key={index}
              label={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
              mb="xs"
            />
          ))}

          {showCorrectOption && (
            <Select
              label="Correct Option"
              value={currentQuestion.correctOption?.toString()}
              onChange={handleCorrectOptionChange}
              data={[
                { value: "0", label: "Option 1" },
                { value: "1", label: "Option 2" },
                { value: "2", label: "Option 3" },
                { value: "3", label: "Option 4" },
              ]}
              required
              mb="md"
            />
          )}

          <Button
            style={{ background: "#1d82f5" }}
            onClick={addQuestion}
            disabled={
              !showCorrectOption || currentQuestion.correctOption === null
            }
          >
            Add Question
          </Button>
        </Card>

        <Text weight={500} mt="lg" mb="xs">
          Added Questions:
        </Text>
        {questions.map((q, index) => (
          <Card key={index} shadow="sm" mb="sm" p="sm">
            <Text weight={500}>{q.text}</Text>
            {q.options.map((option, optIndex) => (
              <Text
                key={optIndex}
                color={optIndex === q.correctOption ? "green" : "inherit"}
              >
                {optIndex + 1}. {option}
              </Text>
            ))}
          </Card>
        ))}

        <Select
          label="Attach to learning group"
          value={group}
          onChange={setGroup}
          data={learningModuleGroups.map((e) => ({
            value: e._id,
            label: e.name,
          }))}
          required
          mb="md"
        />

        <Button
          disabled={!group}
          style={{ background: "#1d82f5" }}
          onClick={saveModule}
          mt="lg"
          fullWidth
        >
          Create Module
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
          onChange={(value) => {
            const w  =  String(value).replace(/[^0-9.]/g, '')
            console.log(value, w);
            setCutoffPercentage(Number(w))
           
          }}
          onKeyDown={handleKeyDown}
          clampBehavior="strict"
          min={0}
          max={100}
        />
        <Button
          style={{ background: "#1d82f5" }}
          onClick={handleSaveModule}
          mt="md"
          fullWidth
        >
          Save Module
        </Button>
      </Modal>
    </div>
  );
}
