import React, { Fragment, useEffect, useState } from "react";
import DashboardHeader from "../../components/header/DashboardHeader";
import SideBar from "../../components/side-bar/SideBar";
import Head from "next/head";
import { gameService } from "../../services/game.service";
import FormSpinner from "../../components/Spinners/FormSpinner";
import { toast, ToastContainer } from "react-toastify";

export default function StockRule() {

    const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState({
    title: '',
    content: '',
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctOption: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModuleChange = (e) => {
    setCurrentModule({ ...currentModule, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addQuestion = () => {
    setCurrentModule({
      ...currentModule,
      questions: [...currentModule.questions, currentQuestion]
    });
    setCurrentQuestion({
      text: '',
      options: ['', '', '', ''],
      correctOption: 0
    });
  };

  const saveModule = () => {
    if (isEditing) {
      const updatedModules = [...modules];
      updatedModules[editingIndex] = currentModule;
      setModules(updatedModules);
      setIsEditing(false);
      setEditingIndex(null);
    } else {
      setModules([...modules, currentModule]);
    }
    setCurrentModule({ title: '', content: '', questions: [] });
    setIsModalOpen(false);
  };

  const editModule = (index) => {
    setCurrentModule(modules[index]);
    setIsEditing(true);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      <Head>
        <title>News Rule</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <SideBar />
        <div className="dashboard sideBarOpen">
          <DashboardHeader />
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <div className="contentWrapper">
            <div className="dashboard_content">
            <h1 className="dashboard__title">Learning module</h1>

            
            <div className="p-4">
      <Button onClick={() => setIsModalOpen(true)} className="mb-4">
        Create New Module
      </Button>

      <Modal
        opened={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditing(false);
          setCurrentModule({ title: '', content: '', questions: [] });
        }}
        title={isEditing ? "Edit Module" : "Create New Module"}
        size="lg"
      >
        <div className="space-y-4">
          <TextInput
            label="Module Title"
            name="title"
            value={currentModule.title}
            onChange={handleModuleChange}
          />
          <Textarea
            label="Module Content"
            name="content"
            value={currentModule.content}
            onChange={handleModuleChange}
            minRows={3}
          />
          <Card shadow="sm" p="lg">
            <Text weight={500}>Add Question</Text>
            <TextInput
              label="Question Text"
              name="text"
              value={currentQuestion.text}
              onChange={handleQuestionChange}
              className="mt-2"
            />
            {currentQuestion.options.map((option, index) => (
              <TextInput
                key={index}
                label={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="mt-2"
              />
            ))}
            <Select
              label="Correct Option"
              value={currentQuestion.correctOption.toString()}
              onChange={(value) => setCurrentQuestion({ ...currentQuestion, correctOption: parseInt(value) })}
              data={[
                { value: '0', label: 'Option 1' },
                { value: '1', label: 'Option 2' },
                { value: '2', label: 'Option 3' },
                { value: '3', label: 'Option 4' },
              ]}
              className="mt-2"
            />
            <Button onClick={addQuestion} className="mt-2">Add Question</Button>
          </Card>
          <Button onClick={saveModule}>
            {isEditing ? 'Update Module' : 'Save Module'}
          </Button>
        </div>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module, index) => (
          <Card key={index} shadow="sm" p="lg">
            <Text weight={500}>{module.title}</Text>
            <Text size="sm" color="dimmed" className="mt-2">
              {module.content.substring(0, 100)}...
            </Text>
            <Text size="sm" className="mt-2">
              Questions: {module.questions.length}
            </Text>
            <Button onClick={() => editModule(index)} className="mt-2">
              Edit
            </Button>
          </Card>
        ))}
      </div>
    </div>



            </div>
          </div>
        </div>
      </>
    </>
  );
}