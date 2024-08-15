import React, {useContext, useEffect, useRef, useState} from 'react';
import ChatBlock from "./ChatBlock";
import ModelSelect from "./ModelSelect";
import {OpenAIModel} from "../models/model";
import {ChatService} from "../service/ChatService";
import {ChatMessage} from "../models/ChatCompletion";
import {useTranslation} from 'react-i18next';
import Tooltip from "./Tooltip";
import {Conversation} from "../service/ConversationService";
import {OPENAI_DEFAULT_SYSTEM_PROMPT} from "../config";
import {DEFAULT_INSTRUCTIONS} from "../constants/appConstants";
import {UserContext} from '../UserContext';
import {InformationCircleIcon} from "@heroicons/react/24/outline";
import {NotificationService} from '../service/NotificationService';

interface Props {
  chatBlocks: ChatMessage[];
  onChatScroll: (isAtBottom: boolean) => void;
  allowAutoScroll: boolean;
  model: string | null;
  onModelChange: (value: string | null) => void;
  conversation: Conversation | null;
  loading: boolean;
}

const Chat: React.FC<Props> = ({
                                 chatBlocks, onChatScroll, allowAutoScroll, model,
                                 onModelChange, conversation, loading
                               }) => {
  const {userSettings, setUserSettings} = useContext(UserContext);
  const {t} = useTranslation();
  const [models, setModels] = useState<OpenAIModel[]>([]);
  const chatDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ChatService.getModels()
        .then(models => {
          setModels(models);
        })
        .catch(err => {
          NotificationService.handleUnexpectedError(err, 'Failed to get list of models');
        });

  }, []);

  useEffect(() => {
    if (chatDivRef.current && allowAutoScroll) {
      chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
    }
  }, [chatBlocks]);

  useEffect(() => {
    const chatContainer = chatDivRef.current;
    if (chatContainer) {
      const isAtBottom =
          chatContainer.scrollHeight - chatContainer.scrollTop ===
          chatContainer.clientHeight;

      // Initially hide the button if chat is at the bottom
      onChatScroll(isAtBottom);
    }
  }, []);

  const findModelById = (id: string | null): OpenAIModel | undefined => {
    return models.find(model => model.id === id);
  };

  const formatContextWindow = (context_window: number | undefined) => {
    if (context_window) {
      return Math.round(context_window / 1000) + 'k';
    }
    return '?k';
  }

  const handleScroll = () => {
    if (chatDivRef.current) {
      const scrollThreshold = 20;
      const isAtBottom =
          chatDivRef.current.scrollHeight -
          chatDivRef.current.scrollTop <=
          chatDivRef.current.clientHeight + scrollThreshold;

      // Notify parent component about the auto-scroll status
      onChatScroll(isAtBottom);

      // Disable auto-scroll if the user scrolls up
      if (!isAtBottom) {
        onChatScroll(false);
      }
    }
  };

  // return (
  //     <div id={'chat-container'} ref={chatDivRef} className="relative chat-container flex-1 overflow-auto" onScroll={handleScroll}>
  //       <div  id={'chat-container1'}  className="relative chat-container1 flex flex-col items-center text-sm dark:bg-gray-900">
     
  //         {chatBlocks.map((block, index) => (
  //             <ChatBlock key={`chat-block-${block.id}`}
  //                        block={block}
  //                        loading={index === chatBlocks.length - 1 && loading}
  //                        isLastBlock={index === chatBlocks.length - 1}/>
  //         ))}
  //         <div className="w-full h-24 flex-shrink-0"></div>
  //       </div>
  //     </div>
  // );

  return (

<div id={'chat-container'} ref={chatDivRef} className="relative chat-container flex-1 overflow-auto" onScroll={handleScroll}>
{/* Prompt Messages Container - Modify the height according to your need */}
<div className="flex h-[97vh] w-full flex-col">
  {/* Prompt Messages */}
  <div
    className="flex-1 overflow-y-auto rounded-xl bg-gray-200 p-4 text-sm leading-6 text-slate-900 dark:bg-gray-800 dark:text-slate-300 sm:text-base sm:leading-7"
  >
    <div className="flex flex-row px-2 py-4 sm:px-4">
      <img
        className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
        src="https://dummyimage.com/256x256/363536/ffffff&text=U"
      />

      <div className="flex max-w-3xl items-center">
        <p>Explain quantum computing in simple terms</p>
      </div>
    </div>
    <div className="mb-2 flex w-full flex-row justify-end gap-x-2 text-slate-500">
      <button className="hover:text-blue-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3"
          ></path>
        </svg>
      </button>
      <button className="hover:text-blue-600" type="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3"
          ></path>
        </svg>
      </button>
      <button className="hover:text-blue-600" type="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"
          ></path>
          <path
            d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"
          ></path>
        </svg>
      </button>
    </div>
    <div
      className="mb-4 flex rounded-xl bg-gray-50 px-2 py-6 dark:bg-gray-900 sm:px-4"
    >
      <img
        className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
        src="https://dummyimage.com/256x256/354ea1/ffffff&text=G"
      />

      <div className="flex max-w-3xl items-center rounded-xl">
        <p>
          Certainly! Quantum computing is a new type of computing that relies on
          the principles of quantum physics. Traditional computers, like the one
          you might be using right now, use bits to store and process
          information. These bits can represent either a 0 or a 1. In contrast,
          quantum computers use quantum bits, or qubits.<br /><br />
          Unlike bits, qubits can represent not only a 0 or a 1 but also a
          superposition of both states simultaneously. This means that a qubit
          can be in multiple states at once, which allows quantum computers to
          perform certain calculations much faster and more efficiently
        </p>
      </div>
    </div>
    <div className="flex px-2 py-4 sm:px-4">
      <img
        className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
        src="https://dummyimage.com/256x256/363536/ffffff&text=U"
      />

      <div className="flex max-w-3xl items-center">
        <p>What are three great applications of quantum computing?</p>
      </div>
    </div>
    <div className="mb-2 flex w-full flex-row justify-end gap-x-2 text-slate-500">
      <button className="hover:text-blue-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3"
          ></path>
        </svg>
      </button>
      <button className="hover:text-blue-600" type="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3"
          ></path>
        </svg>
      </button>
      <button className="hover:text-blue-600" type="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"
          ></path>
          <path
            d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"
          ></path>
        </svg>
      </button>
    </div>
    <div
      className="mb-4 flex rounded-xl bg-gray-50 px-2 py-6 dark:bg-gray-900 sm:px-4"
    >
      <img
        className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
        src="https://dummyimage.com/256x256/354ea1/ffffff&text=G"
      />

      <div className="flex max-w-3xl items-center rounded-xl">
        <p>
          Three great applications of quantum computing are: Optimization of
          complex problems, Drug Discovery and Cryptography.
        </p>
      </div>
    </div>
  </div>
  {/* Prompt suggestions */}
  {/* <div
    className="mt-4 flex w-full space-x-2  overflow-x-auto whitespace-nowrap text-xs text-slate-600 dark:text-slate-300 sm:text-sm"
  >
    <button
      className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
    >
      Regenerate response
    </button>
    <button
      className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
    >
      Use prompt suggestions
    </button>
    <button
      className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
    >
      Toggle web search
    </button>
    <button
      className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
    >
      Select a tone
    </button>
    <button
      className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
    >
      Improve
    </button>
    <button
      className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
    >
      Make longer
    </button>
    <button
      className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
    >
      Explain in simple words
    </button>
    <button
      className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
    >
      Summarize in three lines
    </button>
    <button
      className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
    >
      Translate content
    </button>
  </div> */}
  {/* Prompt message input */}
  {/* <form className="mt-2">
    <label htmlFor="chat-input" className="sr-only">Enter your prompt</label>
    <div className="relative">
      <button
        type="button"
        className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600"
      >
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z"
          ></path>
          <path d="M5 10a7 7 0 0 0 14 0"></path>
          <path d="M8 21l8 0"></path>
          <path d="M12 17l0 4"></path>
        </svg>
        <span className="sr-only">Use voice input</span>
      </button>
      <textarea
        id="chat-input"
        className="block w-full resize-none rounded-xl border-none bg-gray-200 p-4 pl-10 pr-20 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-blue-500 sm:text-base"
        placeholder="Enter your prompt"
        rows="1"
        required
      ></textarea>
      <button
        type="submit"
        className="absolute bottom-2 right-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:text-base"
      >
        Send <span className="sr-only">Send message</span>
      </button>
    </div>
  </form> */}
</div>
    </div>
  )
};

export default Chat;
