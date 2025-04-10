"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getResponseById } from "@/lib/storage";
import {
  ArrowLeft,
  Copy,
  Check,
  Building,
  Heart,
  FileText,
  CheckCircle2,
  Rocket,
  Linkedin,
  ZapIcon,
} from "lucide-react";

const ResponseSection = ({
  icon,
  title,
  content,
  gradientFrom = "from-purple-500",
  gradientTo = "to-blue-500",
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  gradientFrom?: string;
  gradientTo?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='mb-8 bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 shadow-lg'>
      <div
        className={`flex items-center gap-3 p-4 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white`}
      >
        <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
          {icon}
        </div>
        <h2 className='text-xl font-semibold'>{title}</h2>
      </div>

      <div className='p-5 text-neutral-300 leading-relaxed whitespace-pre-wrap'>
        {content}
      </div>

      <div className='flex justify-end p-3 border-t border-neutral-700 bg-neutral-900/50'>
        <Button
          variant='outline'
          size='sm'
          onClick={copyToClipboard}
          className={`gap-2 transition-all ${
            copied
              ? "bg-green-900/20 text-green-400 border-green-800"
              : "bg-neutral-900 text-neutral-300 border-neutral-700 hover:bg-neutral-800"
          }`}
        >
          {copied ? (
            <>
              <Check className='w-4 h-4' />
              Copied!
            </>
          ) : (
            <>
              <Copy className='w-4 h-4' />
              Copy
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default function ResponsePage() {
  const params = useParams();
  const router = useRouter();
  const [responseData, setResponseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      const data = getResponseById(id);

      if (data) {
        setResponseData(data);
      } else {
        router.push("/history");
      }

      setLoading(false);
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4 text-neutral-300'>
          <div className='w-12 h-12 rounded-full border-4 border-t-purple-500 border-neutral-700 animate-spin'></div>
          <p className='text-lg font-medium'>Loading your responses...</p>
        </div>
      </div>
    );
  }

  if (!responseData) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 flex items-center justify-center'>
        <div className='bg-neutral-800 p-8 rounded-xl shadow-xl border border-neutral-700 max-w-md text-center'>
          <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center'>
            <Check className='w-8 h-8 text-red-400' />
          </div>
          <h2 className='text-2xl font-bold text-white mb-2'>
            Response Not Found
          </h2>
          <p className='text-neutral-400 mb-6'>
            We couldn't find the application responses you're looking for.
          </p>
          <Link href='/history'>
            <Button className='w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'>
              Go to History
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = responseData.date
    ? new Date(responseData.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown date";

  return (
    <main className='min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 text-white px-4 py-10'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='bg-neutral-800 rounded-xl shadow-xl border border-neutral-700 overflow-hidden mb-8'>
          <div className='p-6 border-b border-neutral-700 bg-neutral-800/50'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4'>
              <div className='flex items-center gap-3'>
                <Link href='/history'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex items-center gap-2 bg-neutral-900 border-neutral-700 hover:bg-neutral-800 text-white'
                  >
                    <ArrowLeft className='w-4 h-4' />
                    Back to History
                  </Button>
                </Link>
                <p className='text-neutral-400 text-sm'>{formattedDate}</p>
              </div>
              <Link href='/'>
                <Button
                  className='bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
                  size='sm'
                >
                  Create New Application
                </Button>
              </Link>
            </div>

            <div className='flex flex-col md:flex-row justify-between items-start gap-4'>
              <div>
                <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500'>
                  {responseData.jobTitle}
                </h1>
                <div className='flex items-center gap-2 mt-2'>
                  <Building className='w-4 h-4 text-neutral-400' />
                  <p className='text-lg text-neutral-400'>
                    {responseData.company}
                  </p>
                </div>
              </div>

              <div className='py-2 px-4 bg-purple-500/10 rounded-lg border border-purple-500/20'>
                <p className='text-sm text-neutral-300 font-medium'>
                  AI-generated responses ready to use
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Answers */}
        <section>
          <ResponseSection
            icon={<Heart className='w-4 h-4' />}
            title='What interests you about working for this company?'
            content={responseData.data.interestInCompany}
            gradientFrom='from-pink-500'
            gradientTo='to-red-500'
          />

          <ResponseSection
            icon={<FileText className='w-4 h-4' />}
            title='Cover Letter'
            content={responseData.data.coverLetter}
            gradientFrom='from-blue-500'
            gradientTo='to-cyan-500'
          />

          <ResponseSection
            icon={<CheckCircle2 className='w-4 h-4' />}
            title='Why are you a good fit?'
            content={responseData.data.whyFit}
            gradientFrom='from-green-500'
            gradientTo='to-emerald-500'
          />

          <ResponseSection
            icon={<Rocket className='w-4 h-4' />}
            title='What value will you bring?'
            content={responseData.data.valueAdd}
            gradientFrom='from-orange-500'
            gradientTo='to-amber-500'
          />

          <ResponseSection
            icon={<Linkedin className='w-4 h-4' />}
            title='LinkedIn Summary Message'
            content={responseData.data.linkedinSummary}
            gradientFrom='from-blue-600'
            gradientTo='to-indigo-600'
          />

          <ResponseSection
            icon={<ZapIcon className='w-4 h-4' />}
            title='Quick Form Answer'
            content={responseData.data.shortAnswer}
            gradientFrom='from-violet-500'
            gradientTo='to-purple-500'
          />
        </section>

        {/* Footer */}
        <div className='text-center text-neutral-500 text-sm mt-10 mb-6'>
          <p>AI Application Assistant © 2025</p>
        </div>
      </div>
    </main>
  );
}
