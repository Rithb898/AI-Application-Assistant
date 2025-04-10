import { Check, Clipboard } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const Box = ({
  children,
  textToCopy,
}: {
  children: React.ReactNode;
  textToCopy: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative rounded-xl p-5 border border-gray-200 dark:border-gray-700 backdrop-blur-md bg-white/70 dark:bg-white/5 shadow-md">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Clipboard className="w-4 h-4 text-gray-500" />
        )}
      </button>
      <p className="text-gray-900 dark:text-gray-100 text-sm whitespace-pre-wrap leading-relaxed">
        {children}
      </p>
    </div>
  );
};

export default Box;
