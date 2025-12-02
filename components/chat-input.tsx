"use client";

import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export default function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  return (
    <div className="p-4 border-t border-gray-800 bg-[#0d1117]">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            className="w-full bg-[#161b22] border border-gray-700 text-gray-100 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-500"
            placeholder="پیامی بنویسید..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute left-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
        <div className="text-center mt-2">
          <p className="text-xs text-gray-500">
            هوش مصنوعی ممکن است اشتباه کند. لطفاً اطلاعات مهم را بررسی کنید.
          </p>
        </div>
      </div>
    </div>
  );
}
